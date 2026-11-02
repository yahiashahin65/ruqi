import type { Firestore } from "firebase-admin/firestore";
import { createSlug } from "./slug";

export async function uniqueSlug(
  db: Firestore,
  collectionName: "projects" | "services" | "articles",
  title: string,
  currentId?: string
) {
  const base = createSlug(title);

  for (let index = 1; index <= 50; index += 1) {
    const candidate = index === 1 ? base : `${base}-${index}`;
    const snapshot = await db.collection(collectionName).where("slug", "==", candidate).limit(2).get();
    const usedByAnother = snapshot.docs.some((doc) => doc.id !== currentId);
    if (!usedByAnother) return candidate;
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function nextOrder(db: Firestore, collectionName: "projects" | "services") {
  const snapshot = await db.collection(collectionName).get();
  const highest = snapshot.docs.reduce((max, doc) => {
    const value = Number(doc.data().order);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return highest + 10;
}
