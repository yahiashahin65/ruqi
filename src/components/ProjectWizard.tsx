"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, UploadCloud } from "lucide-react";
import { TurnstileBox } from "./TurnstileBox";

type FormState = {
  projectType: string;
  serviceNeed: string;
  area: string;
  city: string;
  district: string;
  budget: string;
  startTime: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const initial: FormState = {
  projectType: "",
  serviceNeed: "",
  area: "",
  city: "المدينة المنورة",
  district: "",
  budget: "",
  startTime: "",
  name: "",
  phone: "",
  email: "",
  notes: ""
};

const projectTypes = ["فيلا", "شقة", "مجلس", "مقهى / مطعم", "عيادة", "متجر", "مكتب", "أخرى"];
const needs = ["تصميم فقط", "تصميم وتنفيذ", "تنفيذ فقط", "تجديد مساحة قائمة"];
const budgets = ["أقل من 100 ألف", "100–250 ألف", "250–500 ألف", "500 ألف–1 مليون", "أكثر من مليون", "أفضل مناقشتها"];
const timings = ["خلال شهر", "1–3 أشهر", "3–6 أشهر", "أكثر من 6 أشهر", "غير محدد"];

export function ProjectWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const total = 5;
  const update = (key: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const canNext = useMemo(() => {
    if (step === 0) return Boolean(form.projectType);
    if (step === 1) return Boolean(form.serviceNeed);
    if (step === 2) return Boolean(form.budget && form.startTime);
    if (step === 3) return Boolean(form.name && form.phone && form.city);
    return true;
  }, [step, form]);

  const onTurnstile = useCallback((token: string) => setTurnstileToken(token), []);

  async function submit() {
    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إرسال الطلب");

      const attachments: { url: string; key: string; alt: string }[] = [];
      for (const file of files) {
        const sign = await fetch("/api/leads/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId: data.id,
            uploadToken: data.uploadToken,
            name: file.name,
            type: file.type,
            size: file.size
          })
        });
        const signed = await sign.json();
        if (!sign.ok) continue;

        const uploaded = await fetch(signed.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file
        });
        if (uploaded.ok) attachments.push({ url: signed.publicUrl, key: signed.key, alt: file.name });
      }

      if (attachments.length) {
        await fetch(`/api/leads/${data.id}/attachments`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploadToken: data.uploadToken, attachments })
        });
      }

      setState("success");
      setStep(4);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    }
  }

  if (state === "success") {
    return (
      <div className="wizard__step">
        <p className="eyebrow">تم الاستلام</p>
        <h2>وصلتنا تفاصيل مشروعك.</h2>
        <p className="page-hero__lead">سنراجع المعلومات والمرفقات ثم نتواصل معك على الرقم المسجل لتحديد الخطوة التالية.</p>
        <div className="notice notice--success"><Check size={16} /> الطلب محفوظ بنجاح.</div>
      </div>
    );
  }

  return (
    <div className="wizard">
      <div className="wizard__progress" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => <span className={i <= step ? "is-active" : ""} key={i} />)}
      </div>

      {step === 0 && (
        <div className="wizard__step">
          <p className="eyebrow">01 · نوع المشروع</p>
          <h2>ما المساحة التي نعمل عليها؟</h2>
          <div className="choice-grid">
            {projectTypes.map((item) => (
              <button className={`choice ${form.projectType === item ? "is-active" : ""}`} key={item} onClick={() => update("projectType", item)}>{item}</button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="wizard__step">
          <p className="eyebrow">02 · نطاق العمل</p>
          <h2>ماذا تحتاج من رقي الجمال؟</h2>
          <div className="choice-grid">
            {needs.map((item) => (
              <button className={`choice ${form.serviceNeed === item ? "is-active" : ""}`} key={item} onClick={() => update("serviceNeed", item)}>{item}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard__step">
          <p className="eyebrow">03 · الميزانية والوقت</p>
          <h2>نحتاج إطارا واقعيا قبل أن نقترح.</h2>
          <div className="form-grid">
            <div className="field">
              <label>الميزانية التقريبية</label>
              <select value={form.budget} onChange={(e) => update("budget", e.target.value)}>
                <option value="">اختر</option>
                {budgets.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="field">
              <label>متى ترغب في البدء؟</label>
              <select value={form.startTime} onChange={(e) => update("startTime", e.target.value)}>
                <option value="">اختر</option>
                {timings.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="field">
              <label>المساحة التقريبية بالمتر</label>
              <input value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="مثال: 450" inputMode="numeric" />
            </div>
            <div className="field">
              <label>الحي</label>
              <input value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="مثال: العريض" />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard__step">
          <p className="eyebrow">04 · التواصل</p>
          <h2>من نتواصل معه بخصوص المشروع؟</h2>
          <div className="form-grid">
            <div className="field">
              <label>الاسم</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="field">
              <label>رقم الجوال / واتساب</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} inputMode="tel" placeholder="+966..." />
            </div>
            <div className="field">
              <label>البريد الإلكتروني - اختياري</label>
              <input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" />
            </div>
            <div className="field">
              <label>المدينة</label>
              <input value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div className="field field--full">
              <label>ملاحظات تساعدنا على فهم المشروع</label>
              <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="حالة الموقع، عدد الغرف، الأولويات، أي تفاصيل مهمة..." />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="wizard__step">
          <p className="eyebrow">05 · المخططات والصور</p>
          <h2>أرسل ما يساعدنا على قراءة المكان.</h2>
          <label className="choice" style={{minHeight:180, alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12}}>
            <UploadCloud size={28} />
            <strong>اختر صورا أو مخططات</strong>
            <span style={{fontSize:11, opacity:.65}}>JPG · PNG · WEBP · PDF — حتى 10MB للملف</span>
            <input
              type="file"
              hidden
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 6))}
            />
          </label>
          {files.length > 0 && <div className="notice">{files.map((file) => file.name).join(" · ")}</div>}
          <div style={{marginTop:20}}><TurnstileBox onToken={onTurnstile} /></div>
          {state === "error" && <div className="notice">{message}</div>}
        </div>
      )}

      <div className="wizard__actions">
        <button className="button" disabled={step === 0 || state === "sending"} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          <ArrowRight size={17} /> السابق
        </button>
        {step < 4 ? (
          <button className="button button--solid" disabled={!canNext} onClick={() => setStep((s) => Math.min(4, s + 1))}>
            التالي <ArrowLeft size={17} />
          </button>
        ) : (
          <button className="button button--solid" disabled={state === "sending"} onClick={submit}>
            {state === "sending" ? "جاري الإرسال..." : "إرسال المشروع"} <ArrowLeft size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
