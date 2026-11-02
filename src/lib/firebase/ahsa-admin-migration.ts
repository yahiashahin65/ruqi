import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { FieldValue, type Firestore, type DocumentData } from "firebase-admin/firestore";
import { createPlan, type CollectionName } from "../../../scripts/lib/rebrand-plan";

type Target = { path: string; version: number | null };
type MigrationStatus = "running" | "completed" | "restoring" | "restored" | "needs_review";
type MigrationRun = {
  projectId: string;
  ownerUid: string;
  status: MigrationStatus;
  createdAt: string;
  targets: Target[];
  cursor: number;
  restoreCursor: number;
  total: number;
};

const RUNS = "adminMigrations";
const LIMIT = 8; // Multiple small requests work on Vercel Hobby and on mobile.

function assertPath(path: string): { collection: CollectionName; id: string } {
  if (path === "settings/public") return { collection: "settings", id: "public" };
  const match = /^(projects|services|articles)\/([^/]+)$/.exec(path);
  if (!match) throw new Error("Invalid target document path");
  return { collection: match[1] as CollectionName, id: match[2] };
}

function backupId(path: string): string {
  return createHash("sha256").update(path).digest("hex");
}

function runRef(db: Firestore, runId: string) {
  if (!/^[a-f0-9-]{36}$/.test(runId)) throw new Error("Invalid migration id");
  return db.collection(RUNS).doc(runId);
}

export async function previewMigration(db: Firestore) {
  const names = ["projects", "services", "articles"] as const;
  const snapshots = await Promise.all(names.map((name) => db.collection(name).get()));
  const settings = await db.doc("settings/public").get();
  const documents = snapshots.flatMap((snapshot, index) =>
    snapshot.docs.map((doc) => ({ path: doc.ref.path, version: doc.updateTime?.toMillis() ?? null,
      collection: names[index] as CollectionName, id: doc.id, data: doc.data() }))
  );
  documents.push({ path: "settings/public", version: settings.updateTime?.toMillis() ?? null,
    collection: "settings", id: "public", data: settings.data() || {} });

  const pending = documents.map((doc) => ({ ...doc, plan: createPlan(doc.collection, doc.id, doc.data) }))
    .filter((item) => item.plan.fields.length > 0).sort((a, b) => a.path.localeCompare(b.path));
  if (pending.length > 1500) throw new Error("Too many documents for one migration; split into smaller runs");

  const targets: Target[] = pending.map((item) => ({ path: item.path, version: item.version }));
  const hash = createHash("sha256").update(JSON.stringify(pending.map((p) => ({
    path: p.path, version: p.version, changes: p.plan.changes
  })))).digest("hex");
  return {
    hash, targets,
    total: targets.length,
    counts: Object.fromEntries((["projects", "services", "articles", "settings"] as const)
      .map((name) => [name, pending.filter((p) => p.collection === name).length])),
    warningsCount: pending.reduce((n, p) => n + p.plan.warnings.length, 0),
    samples: pending.slice(0, 25).map((p) => ({
      path: p.path, fields: p.plan.fields,
      oldCity: p.collection === "projects" ? String(p.data.city || "غير محددة") : undefined,
      warnings: p.plan.warnings
    }))
  };
}

export async function latestMigration(db: Firestore) {
  const snap = await db.collection(RUNS).orderBy("createdAt", "desc").limit(10).get();
  const candidate = snap.docs.find((doc) => ["running", "restoring", "needs_review"].includes(doc.data().status)) || snap.docs[0];
  if (!candidate) return null;
  const data = candidate.data() as MigrationRun;
  return { runId: candidate.id, status: data.status, cursor: data.cursor, restoreCursor: data.restoreCursor || 0,
    total: data.total, createdAt: data.createdAt };
}

export async function startMigration(db: Firestore, ownerUid: string, hash: string) {
  const unfinished = await latestMigration(db);
  if (unfinished && ["running", "restoring", "needs_review"].includes(unfinished.status))
    throw new Error("هناك عملية سابقة لم تنتهِ. أكملها أو استرجعها أولا.");
  const preview = await previewMigration(db);
  if (hash !== preview.hash) throw new Error("البيانات تغيرت منذ المعاينة. أعد المعاينة قبل التطبيق.");
  const id = randomUUID();
  const projectId = process.env.FIREBASE_PROJECT_ID || "";
  await db.collection(RUNS).doc(id).create({
    projectId, ownerUid, status: "running", createdAt: new Date().toISOString(),
    targets: preview.targets, total: preview.total, cursor: 0, restoreCursor: 0
  } satisfies MigrationRun);
  return { runId: id, total: preview.total };
}

async function loadRun(db: Firestore, id: string): Promise<MigrationRun> {
  const snap = await runRef(db, id).get();
  if (!snap.exists) throw new Error("عملية التحديث غير موجودة");
  const run = snap.data() as MigrationRun;
  if (run.projectId !== process.env.FIREBASE_PROJECT_ID) throw new Error("Firebase project mismatch");
  return run;
}

export async function applyMigrationStep(db: Firestore, id: string) {
  const run = await loadRun(db, id);
  if (run.status !== "running") throw new Error("عملية التحديث ليست نشطة");
  const start = run.cursor;
  const end = Math.min(run.total, start + LIMIT);
  for (const item of run.targets.slice(start, end)) {
    const ref = db.doc(item.path);
    const backupRef = runRef(db, id).collection("snapshots").doc(backupId(item.path));
    try {
      await db.runTransaction(async (transaction) => {
        const original = await transaction.get(ref);
        const backup = await transaction.get(backupRef);
        if (backup.exists) return; // Safe retry after dropped mobile connection.
        if ((original.updateTime?.toMillis() ?? null) !== item.version) {
          throw new Error(`تم تعديل ${item.path} بعد المعاينة؛ تم إيقاف العملية لحماية بياناتك.`);
        }
        const { collection, id: docId } = assertPath(item.path);
        const plan = createPlan(collection, docId, original.data() || {});
        if (!plan.fields.length) return;
        transaction.create(backupRef, {
          path: item.path, existed: original.exists, before: original.data() || {},
          fields: plan.fields, after: plan.changes, createdAt: new Date().toISOString()
        });
        transaction.set(ref, { ...plan.changes, updatedAt: new Date().toISOString() }, { merge: true });
      });
    } catch (e) {
      await runRef(db, id).update({ status: "needs_review", cursor: start });
      throw e;
    }
  }
  const finished = end === run.total;
  await runRef(db, id).update({ cursor: end, status: finished ? "completed" : "running" });
  return { cursor: end, total: run.total, finished };
}

export async function beginRestore(db: Firestore, id: string) {
  const run = await loadRun(db, id);
  if (!(["completed", "running", "needs_review"] as string[]).includes(run.status))
    throw new Error("العملية غير قابلة للاسترجاع في حالتها الحالية");
  await runRef(db, id).update({ status: "restoring", restoreCursor: 0 });
  return { runId: id, total: run.total };
}

export async function restoreMigrationStep(db: Firestore, id: string) {
  const run = await loadRun(db, id);
  if (run.status !== "restoring") throw new Error("الاسترجاع غير نشط");
  const start = run.restoreCursor;
  const end = Math.min(run.total, start + LIMIT);
  const batch = [...run.targets].reverse().slice(start, end);
  for (const target of batch) {
    const backupRef = runRef(db, id).collection("snapshots").doc(backupId(target.path));
    const ref = db.doc(target.path);
    await db.runTransaction(async (transaction) => {
      const backup = await transaction.get(backupRef);
      if (!backup.exists || backup.get("restoredAt")) return;
      const live = await transaction.get(ref);
      const { existed, before, fields, after } = backup.data() as {
        existed: boolean; before: DocumentData; fields: string[]; after: DocumentData;
      };
      // Never overwrite edits made after the migration.
      for (const field of fields) {
        if (!isDeepStrictEqual(live.get(field), after[field]))
          throw new Error(`تغير الحقل ${field} في ${target.path} بعد الترحيل. الاسترجاع متوقف لحمايته.`);
      }
      if (!existed) {
        transaction.delete(ref);
      } else {
        const restored: Record<string, unknown> = {};
        for (const field of [...fields, "updatedAt"]) {
          restored[field] = Object.prototype.hasOwnProperty.call(before, field) ? before[field] : FieldValue.delete();
        }
        transaction.update(ref, restored);
      }
      transaction.update(backupRef, { restoredAt: new Date().toISOString() });
    });
  }
  const finished = end === run.total;
  await runRef(db, id).update({ restoreCursor: end, status: finished ? "restored" : "restoring" });
  return { cursor: end, total: run.total, finished };
}
