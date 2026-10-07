import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function normalizePrivateKey(value?: string) {
  if (!value) return "";
  let normalized = value.trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }
  return normalized.replace(/\\n/g, "\n");
}

function getFirebasePrivateKey() {
  const directKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (directKey) return directKey;

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
    process.env.FIREBASE_PROJECT_ID?.trim() &&
    process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
    getFirebasePrivateKey()
  );
}

function getAdminApp() {
  if (!isFirebaseAdminConfigured()) return null;
  if (getApps().length) return getApps()[0];

  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getFirebasePrivateKey()
      })
    });
  } catch (error) {
    console.error("[server-auth-init]", error instanceof Error ? error.message : "init failed");
    return null;
  }
}

export function getAdminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminDb() {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}
