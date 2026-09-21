import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { serviceSchema } from "@/lib/validators";
import { nextOrder, uniqueSlug } from "@/lib/content-utils";

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const parsed = serviceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "راجع بيانات الخدمة" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "تعذر الحفظ حاليا" }, { status: 503 });

  const ref = db.collection("services").doc();
  const slug = await uniqueSlug(db, "services", parsed.data.title);
  const order = await nextOrder(db, "services");
  const now = new Date().toISOString();

  await ref.set({
    title: parsed.data.title,
    slug,
    eyebrow: "خدماتنا",
    excerpt: parsed.data.excerpt,
    body: parsed.data.body,
    deliverables: parsed.data.deliverables,
    image: parsed.data.image,
    order,
    status: parsed.data.status,
    seoTitle: parsed.data.title,
    seoDescription: parsed.data.excerpt.slice(0, 180),
    createdAt: now,
    updatedAt: now
  });

  revalidateTag("services", "max");
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
