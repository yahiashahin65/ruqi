import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";

export async function PUT(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase غير مهيأ" }, { status: 503 });

  const allowed = ["brandName", "brandNameAr", "tagline", "city", "phone", "whatsapp", "email", "address", "instagram", "businessHours"];
  const clean = Object.fromEntries(Object.entries(body).filter(([key, value]) => allowed.includes(key) && typeof value === "string"));
  await db.collection("settings").doc("public").set(clean, { merge: true });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
