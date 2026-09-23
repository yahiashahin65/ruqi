import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { serviceSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await context.params;
  const parsed = serviceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "راجع بيانات الخدمة" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "تعذر الحفظ حاليا" }, { status: 503 });

  await db.collection("services").doc(id).set({
  title: parsed.data.title,
  eyebrow: "خدماتنا",
  excerpt: parsed.data.excerpt,
  body: parsed.data.body,
  deliverables: parsed.data.deliverables,
  image: parsed.data.image,
  gallery: parsed.data.gallery || [],
  status: parsed.data.status,
  seoTitle: parsed.data.title,
  seoDescription: parsed.data.excerpt.slice(0, 180),
  updatedAt: new Date().toISOString()
}, { merge: true });

  revalidateTag("services", "max");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await context.params;
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "تعذر الحذف حاليا" }, { status: 503 });
  await db.collection("services").doc(id).delete();
  revalidateTag("services", "max");
  return NextResponse.json({ ok: true });
}
