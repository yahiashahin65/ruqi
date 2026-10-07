import { loadEnvConfig } from "@next/env";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { getAdminDb, isFirebaseAdminConfigured } from "../src/lib/firebase/admin";
import {
  getR2Client,
  getR2PrivateBucket,
  getR2PublicBucket,
  isR2PrivateConfigured,
  isR2PublicConfigured
} from "../src/lib/r2";

loadEnvConfig(process.cwd());

type Check = { name: string; ok: boolean; detail: string };

async function checkFirebase(): Promise<Check> {
  if (!isFirebaseAdminConfigured()) {
    return { name: "Firebase Admin / Firestore", ok: false, detail: "environment variables missing" };
  }
  try {
    const db = getAdminDb();
    if (!db) throw new Error("Admin app unavailable");
    await db.collection("settings").doc("public").get();
    return { name: "Firebase Admin / Firestore", ok: true, detail: "connected" };
  } catch (error) {
    return {
      name: "Firebase Admin / Firestore",
      ok: false,
      detail: error instanceof Error ? error.message : "connection failed"
    };
  }
}

async function checkBucket(name: string, bucket: string, configured: boolean): Promise<Check> {
  if (!configured || !bucket) {
    return { name, ok: false, detail: "environment variables missing" };
  }
  try {
    const client = getR2Client();
    if (!client) throw new Error("R2 client unavailable");
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return { name, ok: true, detail: `connected to ${bucket}` };
  } catch (error) {
    return {
      name,
      ok: false,
      detail: error instanceof Error ? error.message : "connection failed"
    };
  }
}

async function main() {
  const results = await Promise.all([
    checkFirebase(),
    checkBucket("R2 Public", getR2PublicBucket(), isR2PublicConfigured()),
    checkBucket("R2 Private", getR2PrivateBucket(), isR2PrivateConfigured())
  ]);

  for (const item of results) {
    console.log(`${item.ok ? "✓" : "✗"} ${item.name}: ${item.detail}`);
  }

  if (results.some((item) => !item.ok)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
