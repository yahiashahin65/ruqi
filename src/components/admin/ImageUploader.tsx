"use client";

import { useState } from "react";

export type UploadedMedia = { url: string; key: string; alt?: string };

export function ImageUploader({
  value,
  onChange,
  folder = "projects",
  label = "رفع صورة"
}: {
  value?: UploadedMedia | null;
  onChange: (media: UploadedMedia) => void;
  folder?: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle"|"uploading"|"error">("idle");

  async function upload(file: File) {
    setState("uploading");
    try {
      const sign = await fetch("/api/admin/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name:file.name, type:file.type, size:file.size, folder })
      });
      const data = await sign.json();
      if (!sign.ok) throw new Error(data.error || "Upload error");
      const put = await fetch(data.uploadUrl, { method:"PUT", headers:{ "Content-Type":file.type }, body:file });
      if (!put.ok) throw new Error("Upload failed");
      onChange({ url:data.publicUrl, key:data.key, alt:file.name });
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e)=>e.target.files?.[0] && upload(e.target.files[0])} />
      {state === "uploading" && <small>جاري الرفع...</small>}
      {state === "error" && <small>فشل الرفع. راجع إعداد R2.</small>}
      {value?.url && <small style={{wordBreak:"break-all"}}>{value.url}</small>}
    </div>
  );
}
