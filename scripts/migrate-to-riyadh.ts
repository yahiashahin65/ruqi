import { loadEnvConfig } from "@next/env";
import { isDeepStrictEqual } from "node:util";
import type { DocumentData } from "firebase-admin/firestore";

import { DEFAULT_SETTINGS } from "../src/lib/constants";
import { getAdminDb } from "../src/lib/firebase/admin";

loadEnvConfig(process.cwd());

const APPLY = process.argv.includes("--apply");
const COLLECTIONS = ["projects", "services", "articles"] as const;

const TEXT_REPLACEMENTS: Array<[string, string]> = [
  ["رُقِيّ الجمال", "ديكور لاين الرياض"],
  ["رقي الجمال", "ديكور لاين الرياض"],
  ["RUQI AL JAMAL", "DECOR LINE RIYADH"],
  ["Ruqi Al Jamal", "Decor Line Riyadh"],
  ["المدينة المنورة", "الرياض"],
  ["Al Madinah", "Riyadh"],
  ["Madinah", "Riyadh"],
  ["0533654669", "0502354855"],
  ["966533654669", "966502354855"]
];

const SKIP_RECURSIVE_KEYS = new Set([
  "slug",
  "previousSlugs",
  "url",
  "key"
]);

function rewriteText(value: string) {
  return TEXT_REPLACEMENTS.reduce(
    (result, [from, to]) => result.split(from).join(to),
    value
  );
}

function rewriteSlug(value: string) {
  return value
    .replace(/al[-_ ]?madinah/gi, "riyadh")
    .replace(/madinah/gi, "riyadh")
    .replace(/المدينة[-_ ]المنورة/g, "الرياض")
    .replace(/المدينة-المنورة/g, "الرياض");
}

function rewriteValue(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    if (key && SKIP_RECURSIVE_KEYS.has(key)) return value;
    return rewriteText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => rewriteValue(item));
  }

  if (value && typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);

    // Keep Firestore Timestamp/GeoPoint/DocumentReference and Date values intact.
    if (prototype !== Object.prototype && prototype !== null) {
      return value;
    }

    const source = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(source).map(([childKey, childValue]) => [
        childKey,
        rewriteValue(childValue, childKey)
      ])
    );
  }

  return value;
}

function changed(a: unknown, b: unknown) {
  return !isDeepStrictEqual(a, b);
}

async function prepareCollection(
  collectionName: (typeof COLLECTIONS)[number]
) {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured. Check .env.local");

  const snapshot = await db.collection(collectionName).get();
  const prepared: Array<{
    id: string;
    before: DocumentData;
    after: DocumentData;
  }> = [];

  const proposedSlugs = new Map<string, string>();

  for (const doc of snapshot.docs) {
    const before = doc.data();
    const currentSlug = typeof before.slug === "string" ? before.slug : "";
    const nextSlug = currentSlug ? rewriteSlug(currentSlug) : currentSlug;

    if (nextSlug) {
      const owner = proposedSlugs.get(nextSlug);
      if (owner && owner !== doc.id) {
        throw new Error(
          `Slug collision in ${collectionName}: "${nextSlug}" would belong to both ${owner} and ${doc.id}`
        );
      }
      proposedSlugs.set(nextSlug, doc.id);
    }

    const rewritten = rewriteValue(before) as DocumentData;
    const previousSlugs = Array.isArray(before.previousSlugs)
      ? before.previousSlugs.filter((item): item is string => typeof item === "string")
      : [];

    const candidate: DocumentData = {
      ...rewritten,
      ...(nextSlug ? { slug: nextSlug } : {}),
      ...(currentSlug && nextSlug && currentSlug !== nextSlug
        ? { previousSlugs: Array.from(new Set([...previousSlugs, currentSlug])) }
        : previousSlugs.length
          ? { previousSlugs }
          : {})
    };

    if (collectionName === "projects") {
      candidate.city = "الرياض";
    }

    if (changed(before, candidate)) {
      prepared.push({
        id: doc.id,
        before,
        after: {
          ...candidate,
          updatedAt: new Date().toISOString()
        }
      });
    }
  }

  return prepared;
}

async function commitChanges(
  collectionName: (typeof COLLECTIONS)[number],
  changes: Awaited<ReturnType<typeof prepareCollection>>
) {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured. Check .env.local");

  for (let index = 0; index < changes.length; index += 400) {
    const chunk = changes.slice(index, index + 400);
    const batch = db.batch();

    for (const change of chunk) {
      batch.set(
        db.collection(collectionName).doc(change.id),
        change.after,
        { merge: true }
      );
    }

    await batch.commit();
  }
}

async function main() {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured. Check .env.local");

  console.log(APPLY ? "[APPLY] Riyadh migration" : "[DRY RUN] Riyadh migration");

  const allChanges = new Map<string, Awaited<ReturnType<typeof prepareCollection>>>();

  for (const collectionName of COLLECTIONS) {
    const changes = await prepareCollection(collectionName);
    allChanges.set(collectionName, changes);

    console.log(`\n${collectionName}: ${changes.length} document(s) will change`);
    for (const change of changes.slice(0, 20)) {
      const oldSlug = typeof change.before.slug === "string" ? change.before.slug : "";
      const newSlug = typeof change.after.slug === "string" ? change.after.slug : "";
      console.log(
        `- ${change.id}${oldSlug !== newSlug ? ` | slug: ${oldSlug} -> ${newSlug}` : ""}`
      );
    }
    if (changes.length > 20) console.log(`  ...and ${changes.length - 20} more`);
  }

  console.log("\nsettings/public: will be updated to Decor Line Riyadh / Riyadh / new phone");

  if (!APPLY) {
    console.log("\nNo writes were made. Re-run with --apply after reviewing this output.");
    return;
  }

  for (const collectionName of COLLECTIONS) {
    await commitChanges(collectionName, allChanges.get(collectionName) || []);
  }

  await db.collection("settings").doc("public").set(
    {
      brandName: DEFAULT_SETTINGS.brandName,
      brandNameAr: DEFAULT_SETTINGS.brandNameAr,
      tagline: DEFAULT_SETTINGS.tagline,
      city: DEFAULT_SETTINGS.city,
      phone: DEFAULT_SETTINGS.phone,
      whatsapp: DEFAULT_SETTINGS.whatsapp,
      address: DEFAULT_SETTINGS.address,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  console.log("\nMigration applied successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
