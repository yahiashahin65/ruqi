import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { articleSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "راجع بيانات المقال" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase غير مهيأ" }, { status: 503 });

  const existing = await db.collection("articles").where("slug", "==", parsed.data.slug).limit(2).get();
  if (existing.docs.some((doc) => doc.id !== id)) return NextResponse.json({ error: "Slug مستخدم بالفعل" }, { status: 409 });

  await db.collection("articles").doc(id).set({ ...parsed.data, updatedAt: new Date().toISOString() }, { merge: true });
  revalidateTag("articles", "max");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase غير مهيأ" }, { status: 503 });
  await db.collection("articles").doc(id).delete();
  revalidateTag("articles", "max");
  return NextResponse.json({ ok: true });
}
