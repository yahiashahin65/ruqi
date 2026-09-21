import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isAdminRequest } from "@/lib/firebase/session";
import { getR2Client, isR2Configured } from "@/lib/r2";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);
const MAX = 20 * 1024 * 1024;

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-90);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, type, size, folder = "projects" } = await request.json();
  if (!name || !allowed.has(type) || Number(size) > MAX) {
    return NextResponse.json({ error: "الملف غير مسموح" }, { status: 422 });
  }

  const client = getR2Client();
  if (!client || !isR2Configured()) return NextResponse.json({ error: "R2 غير مهيأ" }, { status: 503 });

  const safeFolder = String(folder).replace(/[^a-z0-9/_-]/gi, "").replace(/\.\./g, "");
  const key = `${safeFolder}/${randomUUID()}-${safeName(name)}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: type
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });
  const publicUrl = `${process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "")}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
