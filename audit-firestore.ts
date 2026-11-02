/** Read-only public-CMS audit. No changes to Firebase. */
import { loadEnvConfig } from "@next/env";
import { getAdminDb } from "../src/lib/firebase/admin";
import { createPlan, type CollectionName } from "./lib/rebrand-plan";
loadEnvConfig(process.cwd());
const otherCity = /الرياض|جدة|جده|الدمام|الخبر|مكة|مكه|المدينة المنورة|Riyadh|Jeddah|Medina|Madinah|Makkah|Dammam|Khobar/i;
async function main() {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin not configured; audit cannot inspect live Firestore.");
  const summary = [];
  for (const collection of ["projects", "services", "articles"] as CollectionName[]) {
    const snap = await db.collection(collection).get();
    let pending = 0;
    const locations: Array<{ id: string; city: string; district: string; issue: string }> = [];
    for (const doc of snap.docs) {
      const data = doc.data();
      const plan = createPlan(collection, doc.id, data);
      if (plan.fields.length) pending += 1;
      if (collection === "projects" && (data.city !== "الأحساء" || (typeof data.district === "string" && otherCity.test(data.district)))) {
        locations.push({ id: doc.id, city: data.city || "", district: data.district || "", issue: "City / district must be approved" });
      }
    }
    summary.push({ collection, total: snap.size, documentsNeedingUpdate: pending, locationReview: locations });
  }
  const settings = await db.doc("settings/public").get();
  const result = { firebaseProjectId: process.env.FIREBASE_PROJECT_ID, summary, settingsBrand: settings.data()?.brandNameAr || null };
  console.log(JSON.stringify(result, null, 2));
  if (summary.some((item) => item.documentsNeedingUpdate > 0)) process.exitCode = 2;
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
