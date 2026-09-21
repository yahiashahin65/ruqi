"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

const blank: Omit<Project, "id"> = {
  title: "",
  slug: "",
  subtitle: "",
  type: "residential",
  style: "",
  city: "المدينة المنورة",
  district: "",
  year: new Date().getFullYear(),
  area: undefined,
  duration: "",
  scope: "",
  excerpt: "",
  story: "",
  cover: { url: "", alt: "" },
  gallery: [],
  before: undefined,
  after: undefined,
  services: [],
  featured: false,
  status: "draft",
  order: 10,
  seoTitle: "",
  seoDescription: ""
};

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Project, "id">>(project ? {
    title:project.title, slug:project.slug, subtitle:project.subtitle, type:project.type, style:project.style,
    city:project.city, district:project.district, year:project.year, area:project.area, duration:project.duration,
    scope:project.scope, excerpt:project.excerpt, story:project.story, cover:project.cover, gallery:project.gallery,
    before:project.before, after:project.after, services:project.services, featured:project.featured, status:project.status, order:project.order,
    seoTitle:project.seoTitle, seoDescription:project.seoDescription
  } : blank);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage("");
    const url = project ? `/api/admin/projects/${project.id}` : "/api/admin/projects";
    const method = project ? "PATCH" : "POST";
    const response = await fetch(url, {
      method,
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        ...form,
        area: form.area || undefined,
        year: form.year || undefined,
        gallery: form.gallery,
        services: form.services
      })
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "تعذر الحفظ");
    else {
      setMessage("تم الحفظ");
      router.push("/admin/projects");
      router.refresh();
    }
    setSaving(false);
  }

  async function addGallery(file: UploadedMedia) {
    setForm((prev) => ({ ...prev, gallery:[...prev.gallery, file] }));
  }

  return (
    <form className="admin-form" onSubmit={save}>
      <div className="admin-form__grid">
        <div className="field"><label>اسم المشروع</label><input value={form.title} onChange={(e)=>set("title",e.target.value)} required /></div>
        <div className="field"><label>Slug إنجليزي</label><input value={form.slug} onChange={(e)=>set("slug",e.target.value.toLowerCase().replace(/\s+/g,"-"))} required /></div>
        <div className="field field--full"><label>العنوان الفرعي</label><input value={form.subtitle || ""} onChange={(e)=>set("subtitle",e.target.value)} /></div>
        <div className="field">
          <label>النوع</label>
          <select value={form.type} onChange={(e)=>set("type",e.target.value)}>
            <option value="residential">سكني</option><option value="commercial">تجاري</option><option value="hospitality">ضيافة</option><option value="office">مكاتب</option><option value="renovation">تجديد</option>
          </select>
        </div>
        <div className="field"><label>الأسلوب</label><input value={form.style || ""} onChange={(e)=>set("style",e.target.value)} /></div>
        <div className="field"><label>المدينة</label><input value={form.city} onChange={(e)=>set("city",e.target.value)} /></div>
        <div className="field"><label>الحي</label><input value={form.district || ""} onChange={(e)=>set("district",e.target.value)} /></div>
        <div className="field"><label>السنة</label><input type="number" value={form.year || ""} onChange={(e)=>set("year", Number(e.target.value) || undefined)} /></div>
        <div className="field"><label>المساحة م²</label><input type="number" value={form.area || ""} onChange={(e)=>set("area", Number(e.target.value) || undefined)} /></div>
        <div className="field"><label>مدة التنفيذ</label><input value={form.duration || ""} onChange={(e)=>set("duration",e.target.value)} /></div>
        <div className="field"><label>نطاق العمل</label><input value={form.scope || ""} onChange={(e)=>set("scope",e.target.value)} /></div>
        <div className="field field--full"><label>وصف مختصر</label><textarea value={form.excerpt} onChange={(e)=>set("excerpt",e.target.value)} required /></div>
        <div className="field field--full"><label>قصة المشروع</label><textarea value={form.story} onChange={(e)=>set("story",e.target.value)} required /></div>
        <ImageUploader label="الصورة الرئيسية" value={form.cover as UploadedMedia} onChange={(media)=>set("cover",media)} folder={`projects/${form.slug || "draft"}/cover`} />
        <ImageUploader label="صورة قبل - اختياري" value={form.before as UploadedMedia | undefined} onChange={(media)=>set("before",media)} folder={`projects/${form.slug || "draft"}/before-after`} />
        <ImageUploader label="صورة بعد - اختياري" value={form.after as UploadedMedia | undefined} onChange={(media)=>set("after",media)} folder={`projects/${form.slug || "draft"}/before-after`} />
        <ImageUploader label="إضافة صورة للجاليري" onChange={addGallery} folder={`projects/${form.slug || "draft"}/gallery`} />
        <div className="field field--full"><label>روابط صور الجاليري الحالية</label><textarea value={form.gallery.map((g)=>g.url).join("\n")} onChange={(e)=>set("gallery",e.target.value.split("\n").filter(Boolean).map((url)=>({url,alt:form.title})))} /></div>
        <div className="field"><label>الترتيب</label><input type="number" value={form.order} onChange={(e)=>set("order",Number(e.target.value))} /></div>
        <div className="field"><label>الحالة</label><select value={form.status} onChange={(e)=>set("status",e.target.value)}><option value="draft">مسودة</option><option value="published">منشور</option></select></div>
        <div className="field field--full"><label>Slugs الخدمات المرتبطة - افصل بفاصلة</label><input value={form.services.join(", ")} onChange={(e)=>set("services",e.target.value.split(",").map(v=>v.trim()).filter(Boolean))} placeholder="interior-design, fit-out" /></div>
        <label className="field"><span>مشروع مميز</span><input type="checkbox" checked={form.featured} onChange={(e)=>set("featured",e.target.checked)} /></label>
        <div className="field field--full"><label>SEO Title</label><input value={form.seoTitle || ""} onChange={(e)=>set("seoTitle",e.target.value)} /></div>
        <div className="field field--full"><label>SEO Description</label><textarea value={form.seoDescription || ""} onChange={(e)=>set("seoDescription",e.target.value)} /></div>
      </div>
      {message && <div className="notice">{message}</div>}
      <button className="button button--solid" style={{marginTop:22}} disabled={saving || !form.cover.url}>
        {saving ? "جاري الحفظ..." : "حفظ المشروع"}
      </button>
    </form>
  );
}
