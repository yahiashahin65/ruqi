import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 6;

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { uploadToken, attachments } = await request.json();

    if (!uploadToken || !Array.isArray(attachments) || attachments.length > MAX_FILES) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 422 });
    }

    const normalized = attachments.map((item) => ({
      key: String(item?.key || ""),
      name: String(item?.name || "").slice(0, 180),
      contentType: String(item?.contentType || ""),
      size: Number(item?.size || 0)
    }));

    const valid = normalized.every((item) =>
      item.key.startsWith(`leads/${id}/`) &&
      allowedTypes.has(item.contentType) &&
      Number.isFinite(item.size) &&
      item.size > 0 &&
      item.size <= MAX_SIZE
    );
    if (!valid) {
      return NextResponse.json({ error: "مرفقات غير صالحة" }, { status: 422 });
    }

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "Firebase غير مهيأ" }, { status: 503 });

    const ref = db.collection("leads").doc(id);
    const snap = await ref.get();
    const data = snap.data();
    const expiresAt = data?.uploadExpiresAt ? new Date(data.uploadExpiresAt).getTime() : 0;
    if (
      !snap.exists ||
      data?.uploadTokenHash !== hash(String(uploadToken)) ||
      expiresAt < Date.now()
    ) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    await ref.update({
      attachments: normalized,
      uploadTokenHash: null,
      uploadExpiresAt: null,
      uploadReservations: null
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر حفظ المرفقات" }, { status: 500 });
  }
}
