"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { Service } from "@/lib/types";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

type ServiceEditor = {
  title: string;
  excerpt: string;
  body: string;
  deliverables: string[];
  image?: UploadedMedia;
  status: "draft" | "published";
};

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceEditor>({
    title: service?.title || "",
    excerpt: service?.excerpt || "",
    body: service?.body || "",
    deliverables: service?.deliverables?.length ? service.deliverables : [""],
    image: service?.image as UploadedMedia | undefined,
    status: service?.status || "draft"
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch(service ? `/api/admin/services/${service.id}` : "/api/admin/services", {
      method: service ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        deliverables: form.deliverables.map((item) => item.trim()).filter(Boolean)
      })
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "تعذر حفظ الخدمة");
    else {
      router.push("/admin/services");
      router.refresh();
    }
    setSaving(false);
  }

  function updateDeliverable(index: number, value: string) {
    setForm((prev) => ({ ...prev, deliverables: prev.deliverables.map((item, i) => i === index ? value : item) }));
  }

  return (
    <form className="admin-form" onSubmit={save}>
      <div className="admin-form-section">
        <div className="admin-form-section__head"><span>01</span><div><h2>الخدمة</h2><p>المعلومات التي ستظهر للزائر في صفحة الخدمات.</p></div></div>
        <div className="admin-form__grid">
          <div className="field field--full"><label>اسم الخدمة</label><input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required /></div>
          <div className="field field--full"><label>وصف مختصر</label><textarea value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} required /></div>
          <div className="field field--full"><label>تفاصيل الخدمة</label><textarea className="admin-textarea--large" value={form.body} onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))} required /></div>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section__head"><span>02</span><div><h2>ماذا تشمل الخدمة؟</h2><p>أضف النقاط المهمة فقط، ويمكن ترك هذا الجزء فارغا.</p></div></div>
        <div className="admin-repeat-list">
          {form.deliverables.map((item, index) => (
            <div className="admin-repeat-row" key={index}>
              <input value={item} onChange={(e) => updateDeliverable(index, e.target.value)} placeholder="مثال: مخططات توزيع الأثاث" />
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== index) }))} aria-label="حذف"><Trash2 size={16} /></button>
            </div>
          ))}
          <button type="button" className="button button--ghost admin-add-row" onClick={() => setForm((prev) => ({ ...prev, deliverables: [...prev.deliverables, ""] }))}><Plus size={16} /> إضافة نقطة</button>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section__head"><span>03</span><div><h2>الصورة والنشر</h2><p>اختر صورة واضحة للخدمة وحدد حالتها.</p></div></div>
        <div className="admin-form__grid">
          <ImageUploader label="صورة الخدمة" value={form.image} onChange={(media) => setForm((prev) => ({ ...prev, image: media }))} onClear={() => setForm((prev) => ({ ...prev, image: undefined }))} folder="services" />
          <div className="field"><label>الحالة</label><select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))}><option value="draft">مسودة</option><option value="published">منشورة</option></select></div>
        </div>
      </div>

      {message && <div className="notice">{message}</div>}
      <button className="button button--solid" style={{ marginTop: 20 }} disabled={saving || !form.image?.url}>{saving ? "جاري الحفظ..." : "حفظ الخدمة"}</button>
    </form>
  );
}
