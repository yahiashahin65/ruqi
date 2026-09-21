import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { articleSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/content-utils";

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "راجع بيانات المقال" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "تعذر الحفظ حاليا" }, { status: 503 });

  const ref = db.collection("articles").doc();
  const slug = await uniqueSlug(db, "articles", parsed.data.title);
  const now = new Date().toISOString();

  await ref.set({
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    cover: parsed.data.cover,
    category: parsed.data.category,
    publishedAt: parsed.data.status === "published" ? now : now,
    status: parsed.data.status,
    seoTitle: parsed.data.title,
    seoDescription: parsed.data.excerpt.slice(0, 180),
    createdAt: now,
    updatedAt: now
  });

  revalidateTag("articles", "max");
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
