import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const { status } = await request.json();
  if (!(status in LEAD_STATUS_LABELS)) return NextResponse.json({ error: "Invalid status" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase غير مهيأ" }, { status: 503 });
  await db.collection("leads").doc(id).update({ status, updatedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
