"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/types";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

const blank: Omit<Service, "id"> = {
  title: "",
  slug: "",
  eyebrow: "",
  excerpt: "",
  body: "",
  deliverables: [],
  image: { url: "", alt: "" },
  order: 10,
  status: "draft",
  seoTitle: "",
  seoDescription: ""
};

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Service, "id">>(service ? {
    title: service.title,
    slug: service.slug,
    eyebrow: service.eyebrow,
    excerpt: service.excerpt,
    body: service.body,
    deliverables: service.deliverables,
    image: service.image,
    order: service.order,
    status: service.status,
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription
  } : blank);
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);
  const set=(key:keyof typeof form,value:any)=>setForm(prev=>({...prev,[key]:value}));

  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMessage("");
    const r=await fetch(service?`/api/admin/services/${service.id}`:"/api/admin/services",{
      method:service?"PATCH":"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(form)
    });
    const data=await r.json();
    if(!r.ok) setMessage(data.error||"تعذر الحفظ");
    else { router.push("/admin/services"); router.refresh(); }
    setSaving(false);
  }

  return <form className="admin-form" onSubmit={save}>
    <div className="admin-form__grid">
      <div className="field"><label>اسم الخدمة</label><input value={form.title} onChange={e=>set("title",e.target.value)} required/></div>
      <div className="field"><label>Slug</label><input value={form.slug} onChange={e=>set("slug",e.target.value.toLowerCase().replace(/\s+/g,"-"))} required/></div>
      <div className="field field--full"><label>Eyebrow</label><input value={form.eyebrow} onChange={e=>set("eyebrow",e.target.value)} required/></div>
      <div className="field field--full"><label>وصف مختصر</label><textarea value={form.excerpt} onChange={e=>set("excerpt",e.target.value)} required/></div>
      <div className="field field--full"><label>تفاصيل الخدمة</label><textarea value={form.body} onChange={e=>set("body",e.target.value)} required/></div>
      <div className="field field--full"><label>المخرجات - كل سطر عنصر</label><textarea value={form.deliverables.join("\n")} onChange={e=>set("deliverables",e.target.value.split("\n").map(v=>v.trim()).filter(Boolean))}/></div>
      <ImageUploader label="صورة الخدمة" value={form.image as UploadedMedia} onChange={media=>set("image",media)} folder={`services/${form.slug||"draft"}`}/>
      <div className="field"><label>الترتيب</label><input type="number" value={form.order} onChange={e=>set("order",Number(e.target.value))}/></div>
      <div className="field"><label>الحالة</label><select value={form.status} onChange={e=>set("status",e.target.value)}><option value="draft">مسودة</option><option value="published">منشور</option></select></div>
      <div className="field field--full"><label>SEO Title</label><input value={form.seoTitle||""} onChange={e=>set("seoTitle",e.target.value)}/></div>
      <div className="field field--full"><label>SEO Description</label><textarea value={form.seoDescription||""} onChange={e=>set("seoDescription",e.target.value)}/></div>
    </div>
    {message&&<div className="notice">{message}</div>}
    <button className="button button--solid" style={{marginTop:20}} disabled={saving||!form.image.url}>{saving?"جاري الحفظ...":"حفظ الخدمة"}</button>
  </form>;
}
