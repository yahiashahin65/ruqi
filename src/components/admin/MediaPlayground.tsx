"use client";

import { useState } from "react";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

export function MediaPlayground() {
  const [media,setMedia]=useState<UploadedMedia|null>(null);
  return <div className="admin-form">
    <p>اختبر رفع الصور مباشرة من المتصفح إلى Cloudflare R2. الملف لا يمر عبر Vercel.</p>
    <ImageUploader value={media} onChange={setMedia} folder="media-library" label="اختر صورة" />
    {media?.url && <div className="notice" style={{marginTop:18}}>
      <strong>Public URL</strong><br/><a href={media.url} target="_blank" rel="noreferrer">{media.url}</a>
    </div>}
  </div>;
}
