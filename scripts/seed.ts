import { loadEnvConfig } from "@next/env";
import { getAdminAuth, getAdminDb } from "../src/lib/firebase/admin";
import { demoArticles, demoProjects, demoServices } from "../src/lib/demo-data";
import { DEFAULT_SETTINGS } from "../src/lib/constants";

loadEnvConfig(process.cwd());

async function ensureAdmin() {
  const auth = getAdminAuth();
  if (!auth) throw new Error("Firebase Admin is not configured. Check .env.local");

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("ADMIN_EMAIL or ADMIN_PASSWORD missing; skipping admin user.");
    return;
  }

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    user = await auth.createUser({ email, password, emailVerified: true });
  }

  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin ready: ${email}`);
}

async function seedCollection<T extends { id: string }>(name: string, items: T[]) {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore Admin is not configured. Check .env.local");

  const batch = db.batch();
  for (const item of items) {
    const { id, ...data } = item;
    batch.set(
      db.collection(name).doc(id),
      {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  }
  await batch.commit();
  console.log(`Seeded ${name}: ${items.length}`);
}

async function main() {
  await ensureAdmin();
  await seedCollection("projects", demoProjects);
  await seedCollection("services", demoServices);
  await seedCollection("articles", demoArticles);

  const db = getAdminDb();
  if (!db) throw new Error("Firestore Admin is not configured. Check .env.local");
  await db.collection("settings").doc("public").set(DEFAULT_SETTINGS, { merge: true });
  console.log("Public settings seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
