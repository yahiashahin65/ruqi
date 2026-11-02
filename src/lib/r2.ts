import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function hasR2Credentials() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}

export function getR2PublicBucket() {
  return process.env.R2_PUBLIC_BUCKET || process.env.R2_BUCKET || "";
}

export function getR2PrivateBucket() {
  return process.env.R2_PRIVATE_BUCKET || "";
}

export function getR2PublicBaseUrl() {
  return process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";
}

export function isR2PublicConfigured() {
  return Boolean(hasR2Credentials() && getR2PublicBucket() && getR2PublicBaseUrl());
}

export function isR2PrivateConfigured() {
  return Boolean(hasR2Credentials() && getR2PrivateBucket());
}

export function isR2Configured() {
  return isR2PublicConfigured();
}

export function getR2Client() {
  if (!hasR2Credentials()) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
  });
}

export async function getPrivateR2DownloadUrl(key: string | undefined, expiresIn = 300) {
  const client = getR2Client();
  const bucket = getR2PrivateBucket();

  if (!client || !bucket || !key || !key.startsWith("leads/")) return null;

  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn }
  );
}
