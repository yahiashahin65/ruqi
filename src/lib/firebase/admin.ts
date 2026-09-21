import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function normalizePrivateKey(value?: string) {
  if (!value) return "";

  let normalized = value.trim();

  // Vercel may receive the value with surrounding quotes when copied from JSON.
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }

  return normalized.replace(/\\n/g, "\n");
}

function getFirebasePrivateKey() {
  // Preferred for Vercel/mobile setup: paste the JSON private_key directly.
  const directKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (directKey) return directKey;

  // Backwards-compatible fallback for older deployments that used Base64.
  const base64 = process.env.FIREBASE_PRIVATE_KEY_BASE64?.trim();
  if (!base64) return "";

  try {
    return normalizePrivateKey(Buffer.from(base64, "base64").toString("utf8"));
  } catch {
    return "";
  }
}

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    getFirebasePrivateKey()
  );
}

function getAdminApp() {
  if (!isFirebaseAdminConfigured()) return null;
  if (getApps().length) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getFirebasePrivateKey()
    })
  });
}

export function getAdminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminDb() {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}
