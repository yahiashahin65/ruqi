import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { projectSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "راجع بيانات المشروع" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase غير مهيأ" }, { status: 503 });

  const existing = await db.collection("projects").where("slug", "==", parsed.data.slug).limit(1).get();
  if (!existing.empty) return NextResponse.json({ error: "Slug مستخدم بالفعل" }, { status: 409 });

  const ref = db.collection("projects").doc();
  await ref.set({
    ...parsed.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  revalidateTag("projects", "max");
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
