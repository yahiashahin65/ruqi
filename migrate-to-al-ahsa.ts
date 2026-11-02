/**
 * Migration workflow: dry-run -> inspect audit -> --apply --confirm-project=ID --approve-project-locations.
 * Localizes projects/services/articles and settings/public to Al Ahsa.
 * Keeps URL slugs and media URLs stable to protect indexed pages.
 * Project location changes require additional explicit confirmation and fact checking.
 * Creates a restorable pre-write backup of every changed document.
 * Does not deploy, update any Google indexing or migrate to a new Firebase project.
 */
import { loadEnvConfig } from "@next/env";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAdminDb } from "../src/lib/firebase/admin";
import { createPlan, type CollectionName } from "./lib/rebrand-plan";
import { encodeFirestore } from "./lib/firestore-serialization";

loadEnvConfig(process.cwd());
const apply = process.argv.includes("--apply");
const confirm = process.argv.find((arg) => arg.startsWith("--confirm-project="))?.split("=")[1];
const previewOnly = process.argv.includes("--preview");
const approveProjectLocations = process.argv.includes("--approve-project-locations");

async function run() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  if (!projectId) throw new Error("FIREBASE_PROJECT_ID missing; no writes made.");
  if (apply && (confirm !== projectId || previewOnly)) {
    throw new Error(`To write, run npm run migrate:al-ahsa -- --apply --confirm-project=${projectId} after reviewing the dry-run.`);
  }
  if (apply && !approveProjectLocations) {
    throw new Error("To relabel project locations, review actual locations, then add --approve-project-locations. No writes made.");
  }
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin credentials missing; no reads or writes made.");

  const collections: CollectionName[] = ["projects", "services", "articles"];
  const docs = await Promise.all(collections.map(async (name) => ({ name, snapshots: (await db.collection(name).get()).docs })));
  const settingsSnapshot = await db.doc("settings/public").get();
  const all = docs.flatMap(({ name, snapshots }) => snapshots.map((doc) => ({
    path: doc.ref.path, collection: name, id: doc.id, before: doc.data(), updateTime: doc.updateTime, plan: createPlan(name, doc.id, doc.data())
  })));
  all.push({
    path: "settings/public", collection: "settings", id: "public", before: settingsSnapshot.data() || {}, updateTime: settingsSnapshot.updateTime,
    plan: createPlan("settings", "public", settingsSnapshot.data() || {})
  });
  const toUpdate = all.filter(({ plan }) => plan.fields.length > 0);
  const warnings = all.flatMap(({ path, plan }) => plan.warnings.map((message) => ({ path, message })));
  const slugDuplicates: string[] = [];
  for (const name of collections) {
    const seen = new Set<string>();
    for (const item of all.filter((d) => d.collection === name)) {
      const slug = typeof item.before.slug === "string" ? item.before.slug : "";
      if (!slug) { warnings.push({ path: item.path, message: "Missing slug" }); continue; }
      if (seen.has(slug)) slugDuplicates.push(`${name}/${slug}`);
      seen.add(slug);
    }
  }
  if (slugDuplicates.length) throw new Error(`Duplicate slugs; migration blocked: ${slugDuplicates.join(", ")}`);

  const report = {
    environment: projectId, mode: apply ? "apply" : "dry-run", timestamp: new Date().toISOString(),
    counts: Object.fromEntries(collections.map((name) => [name, all.filter((item) => item.collection === name).length])),
    modified: toUpdate.map(({ path, plan }) => ({ path, fields: plan.fields, changes: plan.changes, originalSlugPreserved: !plan.fields.includes("slug") })),
    warnings
  };
  const outDir = resolve(process.cwd(), "audit-output");
  mkdirSync(outDir, { recursive: true, mode: 0o700 });
  const reportPath = resolve(outDir, `ahsa-migration-${Date.now()}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2), { mode: 0o600 });
  console.log(`Project: ${projectId}; modified docs: ${toUpdate.length}; warnings: ${warnings.length}`);
  console.log(`Review: ${reportPath}`);
  if (!apply) {
    console.log("DRY RUN: no writes made. All projects/services/articles are included. Verify actual project locations and review the audit output before apply.");
    return;
  }
  const backup = {
    version: 1, projectId, createdAt: new Date().toISOString(),
    documents: toUpdate.map(({ path, before }) => ({ path, existed: path === "settings/public" ? settingsSnapshot.exists : true, data: encodeFirestore(before) }))
  };
  const backupDir = resolve(process.cwd(), "backups");
  mkdirSync(backupDir, { recursive: true, mode: 0o700 });
  const backupPath = resolve(backupDir, `pre-ahsa-${Date.now()}.json`);
  writeFileSync(backupPath, JSON.stringify(backup, null, 2), { mode: 0o600, flag: "wx" });
  console.log(`PRE-WRITE BACKUP SAVED: ${backupPath}`);
  // Sequential writes make conflicts easier to diagnose; only changed fields are set.
  // Never overwrites whole documents or indexed slugs or media URLs.
  for (const { path, plan, updateTime } of toUpdate) {
    const ref = db.doc(path);
    await db.runTransaction(async (transaction) => {
      const fresh = await transaction.get(ref);
      if ((fresh.updateTime?.toMillis() ?? null) !== (updateTime?.toMillis() ?? null)) {
        throw new Error(`Concurrent edit detected at ${path}; stop and re-run dry-run before proceeding. Backup: ${backupPath}`);
      }
      transaction.set(ref, { ...plan.changes, updatedAt: new Date().toISOString() }, { merge: true });
    });
    const after = await db.doc(path).get();
    for (const [field, value] of Object.entries(plan.changes)) {
      if (JSON.stringify(after.get(field)) !== JSON.stringify(value)) {
        throw new Error(`Post-write verification failed at ${path}.${field}. Stop and restore from ${backupPath}`);
      }
    }
  }
  console.log(`SUCCESS: ${toUpdate.length} documents verified after write. Backups and reports are local/private; do not commit them.`);
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
