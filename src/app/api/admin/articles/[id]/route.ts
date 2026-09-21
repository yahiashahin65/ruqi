import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { articleSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await context.params;
  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "راجع بيانات المقال" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "تعذر الحفظ حاليا" }, { status: 503 });

  const ref = db.collection("articles").doc(id);
  const existing = await ref.get();
  const current = existing.data();
  const wasPublished = current?.status === "published";
  const publishedAt = parsed.data.status === "published"
    ? (wasPublished && current?.publishedAt ? current.publishedAt : new Date().toISOString())
    : (current?.publishedAt || new Date().toISOString());

  await ref.set({
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    cover: parsed.data.cover,
    category: parsed.data.category,
    publishedAt,
    status: parsed.data.status,
    seoTitle: parsed.data.title,
    seoDescription: parsed.data.excerpt.slice(0, 180),
    updatedAt: new Date().toISOString()
  }, { merge: true });

  revalidateTag("articles", "max");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await context.params;
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "تعذر الحذف حاليا" }, { status: 503 });
  await db.collection("articles").doc(id).delete();
  revalidateTag("articles", "max");
  return NextResponse.json({ ok: true });
}
