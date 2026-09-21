"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/types";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

const blank: Omit<Article, "id"> = {
  title:"",
  slug:"",
  excerpt:"",
  content:"",
  cover:{url:"",alt:""},
  category:"دليل المشروع",
  publishedAt:new Date().toISOString().slice(0,10),
  status:"draft",
  seoTitle:"",
  seoDescription:""
};

export function ArticleForm({ article }: { article?: Article }) {
  const router=useRouter();
  const [form,setForm]=useState<Omit<Article,"id">>(article?{
    title:article.title,slug:article.slug,excerpt:article.excerpt,content:article.content,cover:article.cover,
    category:article.category,publishedAt:article.publishedAt,status:article.status,seoTitle:article.seoTitle,seoDescription:article.seoDescription
  }:blank);
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);
  const set=(key:keyof typeof form,value:any)=>setForm(prev=>({...prev,[key]:value}));

  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMessage("");
    const r=await fetch(article?`/api/admin/articles/${article.id}`:"/api/admin/articles",{
      method:article?"PATCH":"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(form)
    });
    const data=await r.json();
    if(!r.ok) setMessage(data.error||"تعذر الحفظ");
    else { router.push("/admin/articles"); router.refresh(); }
    setSaving(false);
  }

  return <form className="admin-form" onSubmit={save}>
    <div className="admin-form__grid">
      <div className="field field--full"><label>عنوان المقال</label><input value={form.title} onChange={e=>set("title",e.target.value)} required/></div>
      <div className="field"><label>Slug</label><input value={form.slug} onChange={e=>set("slug",e.target.value.toLowerCase().replace(/\s+/g,"-"))} required/></div>
      <div className="field"><label>التصنيف</label><input value={form.category} onChange={e=>set("category",e.target.value)} required/></div>
      <div className="field"><label>تاريخ النشر</label><input type="date" value={form.publishedAt.slice(0,10)} onChange={e=>set("publishedAt",e.target.value)}/></div>
      <div className="field"><label>الحالة</label><select value={form.status} onChange={e=>set("status",e.target.value)}><option value="draft">مسودة</option><option value="published">منشور</option></select></div>
      <div className="field field--full"><label>المقدمة</label><textarea value={form.excerpt} onChange={e=>set("excerpt",e.target.value)} required/></div>
      <div className="field field--full"><label>المحتوى - افصل الفقرات بسطر فارغ</label><textarea style={{minHeight:320}} value={form.content} onChange={e=>set("content",e.target.value)} required/></div>
      <ImageUploader label="صورة المقال" value={form.cover as UploadedMedia} onChange={media=>set("cover",media)} folder={`articles/${form.slug||"draft"}`}/>
      <div className="field field--full"><label>SEO Title</label><input value={form.seoTitle||""} onChange={e=>set("seoTitle",e.target.value)}/></div>
      <div className="field field--full"><label>SEO Description</label><textarea value={form.seoDescription||""} onChange={e=>set("seoDescription",e.target.value)}/></div>
    </div>
    {message&&<div className="notice">{message}</div>}
    <button className="button button--solid" style={{marginTop:20}} disabled={saving||!form.cover.url}>{saving?"جاري الحفظ...":"حفظ المقال"}</button>
  </form>;
}
