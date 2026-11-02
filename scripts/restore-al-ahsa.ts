/** Restores only documents changed by migrate-to-al-ahsa.ts from a local backup.
 * This is an explicit, destructive operation: verify project ID and backup first.
 */
import { loadEnvConfig } from "@next/env";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAdminDb } from "../src/lib/firebase/admin";
import { decodeFirestore } from "./lib/firestore-serialization";
loadEnvConfig(process.cwd());
const backupPath = process.argv.find((arg) => arg.startsWith("--file="))?.slice(7);
const confirm = process.argv.find((arg) => arg.startsWith("--confirm-project="))?.split("=")[1];
async function run() {
  if (!backupPath || !confirm) throw new Error("Usage: npm run restore:al-ahsa -- --file=backups/pre-ahsa-XXXX.json --confirm-project=YOUR_PROJECT_ID");
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin credentials missing");
  const data = JSON.parse(readFileSync(resolve(backupPath), "utf8")) as {
    version: number; projectId: string;
    documents: Array<{ path: string; existed: boolean; data: unknown }>;
  };
  if (data.version !== 1 || confirm !== data.projectId || process.env.FIREBASE_PROJECT_ID !== confirm) throw new Error("Backup/project mismatch; no writes made.");
  for (const doc of data.documents) {
    if (!/^(projects\/[^/]+|services\/[^/]+|articles\/[^/]+|settings\/public)$/.test(doc.path)) throw new Error(`Unsafe document path: ${doc.path}`);
  }
  for (const doc of data.documents) {
    if (doc.existed) await db.doc(doc.path).set(decodeFirestore(doc.data, db) as Record<string, unknown>);
    else await db.doc(doc.path).delete();
  }
  console.log(`Restored ${data.documents.length} documents for ${confirm}. Audit the public pages again.`);
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
