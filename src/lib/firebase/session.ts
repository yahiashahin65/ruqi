import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "./admin";

const COOKIE_NAME = "ruqi_al_jamal_session";

export async function createSessionCookie(idToken: string) {
  const auth = getAdminAuth();
  if (!auth) throw new Error("Firebase Admin is not configured");

  const decoded = await auth.verifyIdToken(idToken, true);
  if (decoded.admin !== true) throw new Error("Admin claim required");

  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  return auth.createSessionCookie(idToken, { expiresIn });
}

export async function verifySessionCookie() {
  const auth = getAdminAuth();
  if (!auth) return null;
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return null;

  try {
    const decoded = await auth.verifySessionCookie(value, true);
    return decoded.admin === true ? decoded : null;
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
