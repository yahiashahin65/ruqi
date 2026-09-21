import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { uploadToken, attachments } = await request.json();

  if (!uploadToken || !Array.isArray(attachments) || attachments.length > 6) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 422 });
  }

  const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  const validAttachments = attachments.every((item) => {
    const url = String(item?.url || "");
    const key = String(item?.key || "");
    return Boolean(publicBase && url.startsWith(`${publicBase}/`) && key.startsWith(`leads/${id}/`));
  });
  if (!validAttachments) return NextResponse.json({ error: "مرفقات غير صالحة" }, { status: 422 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Firebase غير مهيأ" }, { status: 503 });

  const ref = db.collection("leads").doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.uploadTokenHash !== hash(uploadToken)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  await ref.update({
    attachments: attachments.map((item) => ({
      url: String(item.url),
      key: String(item.key || ""),
      alt: String(item.alt || "")
    })),
    uploadTokenHash: null
  });

  return NextResponse.json({ ok: true });
}
