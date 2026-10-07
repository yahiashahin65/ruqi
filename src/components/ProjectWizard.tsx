"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, UploadCloud, X } from "lucide-react";
import { TurnstileBox } from "./TurnstileBox";

type FormState = {
  projectType: string;
  serviceNeed: string;
  area: string;
  name: string;
  phone: string;
  notes: string;
};

const initial: FormState = {
  projectType: "",
  serviceNeed: "",
  area: "",
  name: "",
  phone: "",
  notes: ""
};

const projectTypes = ["فيلا", "شقة", "مجلس", "تجاري", "مكتب", "أخرى"];
const needs = ["تصميم داخلي", "تصميم وتنفيذ", "تنفيذ", "تجديد مساحة قائمة"];

export function ProjectWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canNext = useMemo(
    () => Boolean(form.projectType && form.serviceNeed),
    [form.projectType, form.serviceNeed]
  );

  const canSubmit = Boolean(form.name.trim() && form.phone.trim());

  const onTurnstile = useCallback(
    (token: string) => setTurnstileToken(token),
    []
  );

  async function submit() {
    if (!canSubmit) return;

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          turnstileToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "تعذر إرسال الطلب"
        );
      }

      const attachments: {
        key: string;
        name: string;
        contentType: string;
        size: number;
      }[] = [];

      for (const file of files) {
        const sign = await fetch("/api/leads/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
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

        const uploaded = await fetch(
          signed.uploadUrl,
          {
            method: "PUT",
            headers: {
              "Content-Type": file.type
            },
            body: file
          }
        );

        if (uploaded.ok) {
          attachments.push({
            key: signed.key,
            name: file.name,
            contentType: file.type,
            size: file.size
          });
        }
      }

      if (attachments.length) {
        const finalize = await fetch(
          `/api/leads/${data.id}/attachments`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              uploadToken: data.uploadToken,
              attachments
            })
          }
        );

        if (!finalize.ok) {
          throw new Error(
            "تم استلام الطلب، لكن تعذر حفظ بعض المرفقات. يمكن إرسالها لنا عند التواصل."
          );
        }
      }

      setState("success");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع"
      );
    }
  }

  if (state === "success") {
    return (
      <div className="wizard__step wizard__success">
        <p className="eyebrow">
          تم استلام طلبك
        </p>

        <h2>
          شكرا لك.
        </h2>

        <p className="page-hero__lead">
          سيتواصل معك فريق ديكور لاين الرياض لمراجعة التفاصيل والخطوة التالية.
        </p>

        <div className="notice notice--success">
          <Check size={16} />
          تم إرسال الطلب بنجاح.
        </div>
      </div>
    );
  }

  return (
    <div className="wizard">
      <div
        className="wizard__progress"
        aria-hidden="true"
      >
        <span className="is-active" />
        <span
          className={
            step === 1 ? "is-active" : ""
          }
        />
      </div>

      {step === 0 && (
        <div className="wizard__step">
          <p className="eyebrow">
            الخطوة الأولى
          </p>

          <h2>
            احك لنا عن مشروعك.
          </h2>

          <div className="wizard-block">
            <label className="wizard-label">
              نوع المشروع
            </label>

            <div className="choice-grid">
              {projectTypes.map((item) => (
                <button
                  type="button"
                  className={`choice ${
                    form.projectType === item
                      ? "is-active"
                      : ""
                  }`}
                  key={item}
                  onClick={() =>
                    update(
                      "projectType",
                      item
                    )
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="wizard-block">
            <label className="wizard-label">
              الخدمة المطلوبة
            </label>

            <div className="choice-grid">
              {needs.map((item) => (
                <button
                  type="button"
                  className={`choice ${
                    form.serviceNeed === item
                      ? "is-active"
                      : ""
                  }`}
                  key={item}
                  onClick={() =>
                    update(
                      "serviceNeed",
                      item
                    )
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="field wizard-area-field">
            <label>
              المساحة التقريبية - اختياري
            </label>

            <input
              value={form.area}
              onChange={(e) =>
                update(
                  "area",
                  e.target.value
                )
              }
              placeholder="مثال: 450 م²"
              inputMode="numeric"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="wizard__step">
          <p className="eyebrow">
            الخطوة الثانية
          </p>

          <h2>
            كيف نتواصل معك؟
          </h2>

          <div className="form-grid">
            <div className="field">
              <label>
                الاسم
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  update(
                    "name",
                    e.target.value
                  )
                }
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label>
                رقم الجوال / واتساب
              </label>

              <input
                value={form.phone}
                onChange={(e) =>
                  update(
                    "phone",
                    e.target.value
                  )
                }
                inputMode="tel"
                autoComplete="tel"
                placeholder="05xxxxxxxx"
                required
              />
            </div>

            <div className="field field--full">
              <label>
                ملاحظات - اختياري
              </label>

              <textarea
                value={form.notes}
                onChange={(e) =>
                  update(
                    "notes",
                    e.target.value
                  )
                }
                placeholder="أي تفاصيل تساعدنا على فهم المشروع..."
              />
            </div>
          </div>

          <div className="wizard-upload">
            <label className="choice wizard-upload__picker">
              <UploadCloud size={26} />

              <strong>
                إرفاق صور أو مخطط - اختياري
              </strong>

              <span>
                حتى 6 ملفات، وبحد أقصى 10MB للملف
              </span>

              <input
                type="file"
                hidden
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) =>
                  setFiles(
                    Array.from(
                      e.target.files || []
                    ).slice(0, 6)
                  )
                }
              />
            </label>

            {files.length > 0 && (
              <div className="wizard-files">
                {files.map(
                  (file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                    >
                      <span>
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setFiles(
                            (current) =>
                              current.filter(
                                (_, i) =>
                                  i !== index
                              )
                          )
                        }
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <TurnstileBox
            onToken={onTurnstile}
          />

          {state === "error" && (
            <div className="notice">
              {message}
            </div>
          )}
        </div>
      )}

      <div className="wizard__actions">
        {step === 1 ? (
          <button
            type="button"
            className="button"
            disabled={
              state === "sending"
            }
            onClick={() =>
              setStep(0)
            }
          >
            <ArrowRight size={17} />
            السابق
          </button>
        ) : (
          <span />
        )}

        {step === 0 ? (
          <button
            type="button"
            className="button button--solid"
            disabled={!canNext}
            onClick={() =>
              setStep(1)
            }
          >
            التالي
            <ArrowLeft size={17} />
          </button>
        ) : (
          <button
            type="button"
            className="button button--solid"
            disabled={
              state === "sending" ||
              !canSubmit
            }
            onClick={submit}
          >
            {state === "sending"
              ? "جاري الإرسال..."
              : "إرسال الطلب"}

            <ArrowLeft size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
