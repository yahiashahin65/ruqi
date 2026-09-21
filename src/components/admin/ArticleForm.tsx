"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/types";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

const categories = ["نصائح التصميم", "دليل المشروع", "دليل التشطيب", "الخامات", "أفكار وألوان", "مشاريع وتجارب"];

type ArticleEditor = {
  title: string;
  excerpt: string;
  content: string;
  cover?: UploadedMedia;
  category: string;
  status: "draft" | "published";
};

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleEditor>({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    cover: article?.cover as UploadedMedia | undefined,
    category: article?.category || categories[0],
    status: article?.status || "draft"
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch(article ? `/api/admin/articles/${article.id}` : "/api/admin/articles", {
      method: article ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "تعذر حفظ المقال");
    else {
      router.push("/admin/articles");
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form className="admin-form" onSubmit={save}>
      <div className="admin-form-section">
        <div className="admin-form-section__head"><span>01</span><div><h2>بيانات المقال</h2><p>عنوان واضح وتصنيف يساعد القارئ على الوصول للمحتوى المناسب.</p></div></div>
        <div className="admin-form__grid">
          <div className="field field--full"><label>عنوان المقال</label><input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required /></div>
          <div className="field"><label>التصنيف</label><select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div className="field"><label>الحالة</label><select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))}><option value="draft">مسودة</option><option value="published">منشور</option></select></div>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section__head"><span>02</span><div><h2>المحتوى</h2><p>مقدمة قصيرة ثم محتوى المقال. افصل الفقرات بسطر فارغ.</p></div></div>
        <div className="admin-form__grid">
          <div className="field field--full"><label>مقدمة قصيرة</label><textarea value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} required /></div>
          <div className="field field--full"><label>محتوى المقال</label><textarea className="admin-textarea--article" value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} required /></div>
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section__head"><span>03</span><div><h2>صورة الغلاف</h2><p>تستخدم في بطاقة المقال وصفحة المقال ومشاركته.</p></div></div>
        <ImageUploader label="صورة الغلاف" value={form.cover} onChange={(media) => setForm((prev) => ({ ...prev, cover: media }))} onClear={() => setForm((prev) => ({ ...prev, cover: undefined }))} folder="articles" />
      </div>

      {message && <div className="notice">{message}</div>}
      <button className="button button--solid" style={{ marginTop: 20 }} disabled={saving || !form.cover?.url}>{saving ? "جاري الحفظ..." : "حفظ المقال"}</button>
    </form>
  );
}
