import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { demoArticles, demoProjects, demoServices } from "../src/lib/demo-data";
import { DEFAULT_SETTINGS } from "../src/lib/constants";

function app() {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY");
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

async function ensureAdmin() {
  const auth = getAuth(app());
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
  const db = getFirestore(app());
  const batch = db.batch();
  for (const item of items) {
    const { id, ...data } = item;
    batch.set(db.collection(name).doc(id), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
  await batch.commit();
  console.log(`Seeded ${name}: ${items.length}`);
}

async function main() {
  await ensureAdmin();
  await seedCollection("projects", demoProjects);
  await seedCollection("services", demoServices);
  await seedCollection("articles", demoArticles);

  const db = getFirestore(app());
  await db.collection("settings").doc("public").set(DEFAULT_SETTINGS, { merge: true });
  console.log("Public settings seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
