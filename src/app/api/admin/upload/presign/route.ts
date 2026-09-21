import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isAdminRequest } from "@/lib/firebase/session";
import {
  getR2Client,
  getR2PublicBaseUrl,
  getR2PublicBucket,
  isR2PublicConfigured
} from "@/lib/r2";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["application/pdf", "pdf"]
]);
const allowedFolders = new Set(["projects", "services", "articles", "site","media-library"]);
const MAX_SIZE = 20 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, size, folder = "projects" } = await request.json();
    const extension = allowedTypes.get(String(type));
    const numericSize = Number(size);

    if (
      !extension ||
      !Number.isFinite(numericSize) ||
      numericSize <= 0 ||
      numericSize > MAX_SIZE ||
      !allowedFolders.has(String(folder))
    ) {
      return NextResponse.json({ error: "الملف غير مسموح" }, { status: 422 });
    }

    const client = getR2Client();
    const bucket = getR2PublicBucket();
    const publicBaseUrl = getR2PublicBaseUrl();
    if (!client || !bucket || !publicBaseUrl || !isR2PublicConfigured()) {
      return NextResponse.json({ error: "R2 Public غير مهيأ" }, { status: 503 });
    }

    const key = `${folder}/${randomUUID()}.${extension}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: type
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
    return NextResponse.json({
      uploadUrl,
      publicUrl: `${publicBaseUrl}/${key}`,
      key
    });
  } catch {
    return NextResponse.json({ error: "تعذر إنشاء رابط الرفع" }, { status: 500 });
  }
}
