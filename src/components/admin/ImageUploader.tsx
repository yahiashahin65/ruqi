"use client";

import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

export type UploadedMedia = { url: string; key: string; alt?: string };

export function ImageUploader({
  value,
  onChange,
  onClear,
  folder = "projects",
  label = "رفع صورة"
}: {
  value?: UploadedMedia | null;
  onChange: (media: UploadedMedia) => void;
  onClear?: () => void;
  folder?: "projects" | "services" | "articles" | "site";
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");

  async function upload(file: File) {
    setState("uploading");
    try {
      const sign = await fetch("/api/admin/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: file.type, size: file.size, folder })
      });
      const data = await sign.json();
      if (!sign.ok) throw new Error(data.error || "تعذر تجهيز الرفع");

      const put = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });
      if (!put.ok) throw new Error("تعذر رفع الملف");

      onChange({ url: data.publicUrl, key: data.key, alt: file.name });
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="field field--media">
      <label>{label}</label>
      {value?.url && (
        <div className="admin-media-preview">
          <img src={value.url} alt={value.alt || label} />
          {onClear && (
            <button type="button" className="admin-media-remove" onClick={onClear} aria-label="حذف الصورة">
              <Trash2 size={16} /> حذف
            </button>
          )}
        </div>
      )}
      <label className="admin-upload-control">
        <ImagePlus size={18} />
        <span>{value?.url ? "تغيير الصورة" : "اختيار صورة"}</span>
        <input
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])}
        />
      </label>
      {state === "uploading" && <small>جاري رفع الصورة...</small>}
      {state === "error" && <small className="field-error">تعذر رفع الصورة. حاول مرة أخرى.</small>}
    </div>
  );
}
