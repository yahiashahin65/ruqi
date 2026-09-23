import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { projectSchema } from "@/lib/validators";
import { nextOrder, uniqueSlug } from "@/lib/content-utils";

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "راجع بيانات المشروع" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "تعذر الحفظ حاليا" }, { status: 503 });

  const ref = db.collection("projects").doc();
  const slug = await uniqueSlug(db, "projects", parsed.data.title);
  const order = parsed.data.order ?? await nextOrder(db, "projects");
  const now = new Date().toISOString();

  const data = {
    title: parsed.data.title,
    slug,
    subtitle: "",
    type: parsed.data.type,
    style: parsed.data.style || "",
    city: "المدينة المنورة",
    district: "",
    year: new Date().getFullYear(),
    ...(parsed.data.area ? { area: parsed.data.area } : {}),
    duration: parsed.data.duration || "",
    scope: "",
    excerpt: parsed.data.excerpt,
    story: parsed.data.story,
    cover: parsed.data.cover,
    gallery: parsed.data.gallery,
    ...(parsed.data.before ? { before: parsed.data.before } : {}),
    ...(parsed.data.after ? { after: parsed.data.after } : {}),
    services: [],
    featured: parsed.data.featured,
    status: parsed.data.status,
    order,
    seoTitle: parsed.data.title,
    seoDescription: parsed.data.excerpt.slice(0, 180),
    createdAt: now,
    updatedAt: now
  };

  await ref.set(data);
  revalidateTag("projects", "max");
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
