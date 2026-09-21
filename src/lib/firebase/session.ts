import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "./admin";

const COOKIE_NAME = "ruqi_al_jamal_session";
const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000;
const MAX_SIGN_IN_AGE_SECONDS = 5 * 60;

function isAllowedAdmin(decoded: { uid: string; admin?: unknown }) {
  const configuredUid = process.env.ADMIN_UID?.trim();
  return decoded.admin === true || Boolean(configuredUid && decoded.uid === configuredUid);
}

export async function createSessionCookie(idToken: string) {
  const auth = getAdminAuth();
  if (!auth) throw new Error("Firebase Admin is not configured");

  const decoded = await auth.verifyIdToken(idToken, true);
  if (!isAllowedAdmin(decoded)) throw new Error("Admin access required");

  const authAge = Math.floor(Date.now() / 1000) - decoded.auth_time;
  if (authAge > MAX_SIGN_IN_AGE_SECONDS) {
    throw new Error("Recent sign-in required");
  }

  return auth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN_MS });
}

export async function verifySessionCookie() {
  const auth = getAdminAuth();
  if (!auth) return null;
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return null;

  try {
    const decoded = await auth.verifySessionCookie(value, true);
    return isAllowedAdmin(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export async function requireAdminPage() {
  const user = await verifySessionCookie();
  if (!user) redirect("/admin/login");
  return user;
}

export async function isAdminRequest() {
  return Boolean(await verifySessionCookie());
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_EXPIRES_IN_MS / 1000);
