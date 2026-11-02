import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  getR2Client,
  getR2PrivateBucket,
  isR2PrivateConfigured
} from "@/lib/r2";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["application/pdf", "pdf"]
]);
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 6;

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { leadId, uploadToken, type, size } = await request.json();
    const extension = allowedTypes.get(String(type));
    const numericSize = Number(size);

    if (
      !leadId ||
      !uploadToken ||
      !extension ||
      !Number.isFinite(numericSize) ||
      numericSize <= 0 ||
      numericSize > MAX_SIZE
    ) {
      return NextResponse.json({ error: "ملف غير مسموح أو أكبر من 10MB" }, { status: 422 });
    }

    const db = getAdminDb();
    const client = getR2Client();
    const bucket = getR2PrivateBucket();
    if (!db || !client || !bucket || !isR2PrivateConfigured()) {
      return NextResponse.json({ error: "رفع الملفات الخاص غير مهيأ بعد" }, { status: 503 });
    }

    const leadRef = db.collection("leads").doc(String(leadId));
    await db.runTransaction(async (transaction) => {
      const lead = await transaction.get(leadRef);
      const data = lead.data();
      const expiresAt = data?.uploadExpiresAt ? new Date(data.uploadExpiresAt).getTime() : 0;
      const reservations = Number(data?.uploadReservations || 0);

      if (
        !lead.exists ||
        data?.uploadTokenHash !== hash(String(uploadToken)) ||
        expiresAt < Date.now() ||
        reservations >= MAX_FILES
      ) {
        throw new Error("INVALID_UPLOAD_TOKEN");
      }

      transaction.update(leadRef, { uploadReservations: reservations + 1 });
    });

    const key = `leads/${leadId}/${randomUUID()}.${extension}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: type
    });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

    return NextResponse.json({ uploadUrl, key });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_UPLOAD_TOKEN") {
      return NextResponse.json({ error: "رابط الرفع منتهي أو غير صالح" }, { status: 403 });
    }
    return NextResponse.json({ error: "تعذر إنشاء رابط الرفع" }, { status: 500 });
  }
}
