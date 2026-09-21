import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAdminDb } from "@/lib/firebase/admin";
import { getR2Client, isR2Configured } from "@/lib/r2";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX = 10 * 1024 * 1024;

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-90);
}

export async function POST(request: NextRequest) {
  try {
    const { leadId, uploadToken, name, type, size } = await request.json();
    if (!leadId || !uploadToken || !name || !allowed.has(type) || Number(size) > MAX) {
      return NextResponse.json({ error: "ملف غير مسموح أو أكبر من 10MB" }, { status: 422 });
    }

    const db = getAdminDb();
    const client = getR2Client();
    if (!db || !client || !isR2Configured()) {
      return NextResponse.json({ error: "رفع الملفات غير مهيأ بعد" }, { status: 503 });
    }

    const lead = await db.collection("leads").doc(leadId).get();
    if (!lead.exists || lead.data()?.uploadTokenHash !== hash(uploadToken)) {
      return NextResponse.json({ error: "رابط رفع غير صالح" }, { status: 403 });
    }

    const key = `leads/${leadId}/${randomUUID()}-${safeName(name)}`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: type
    });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
    const publicUrl = `${process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch {
    return NextResponse.json({ error: "تعذر إنشاء رابط الرفع" }, { status: 500 });
  }
}
