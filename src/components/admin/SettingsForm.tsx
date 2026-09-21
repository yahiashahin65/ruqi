"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [form,setForm]=useState(initial);
  const [message,setMessage]=useState("");
  const set=(key:keyof SiteSettings,value:string)=>setForm(prev=>({...prev,[key]:value}));

  async function save(e:React.FormEvent){
    e.preventDefault(); setMessage("");
    const r=await fetch("/api/admin/settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    setMessage(r.ok?"تم حفظ الإعدادات":"تعذر الحفظ");
  }
  return <form className="admin-form" onSubmit={save}>
    <div className="admin-form__grid">
      {([
        ["brandNameAr","الاسم العربي"],["brandName","الاسم الإنجليزي"],["tagline","الوصف"],["city","المدينة"],
        ["phone","الهاتف"],["whatsapp","واتساب"],["email","البريد"],["address","العنوان"],
        ["instagram","Instagram"],["businessHours","ساعات العمل"]
      ] as Array<[keyof SiteSettings,string]>).map(([key,label])=>
        <div className={key==="tagline"||key==="address"?"field field--full":"field"} key={key}>
          <label>{label}</label><input value={form[key] || ""} onChange={e=>set(key,e.target.value)} />
        </div>
      )}
    </div>
    {message&&<div className="notice">{message}</div>}
    <button className="button button--solid" style={{marginTop:20}}>حفظ</button>
  </form>;
}
