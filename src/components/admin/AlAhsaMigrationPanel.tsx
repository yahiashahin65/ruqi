"use client";

import { useCallback, useEffect, useState } from "react";

type Preview = {
  hash: string;
  total: number;
  counts: Record<string, number>;
  warningsCount: number;
  samples: Array<{ path: string; fields: string[]; oldCity?: string; warnings: string[] }>;
};
type Latest = {
  runId: string;
  status: "running" | "completed" | "restoring" | "restored" | "needs_review";
  cursor: number;
  restoreCursor: number;
  total: number;
};
type Info = { projectId: string; preview: Preview; latest: Latest | null };

const actionStyle: React.CSSProperties = {
  background: "#17362d", color: "#fff", border: "0", borderRadius: 6,
  padding: "12px 18px", cursor: "pointer", fontSize: 16
};
const fieldStyle: React.CSSProperties = {
  width: "100%", maxWidth: 420, padding: 12, border: "1px solid #a1a1a1",
  borderRadius: 6, marginTop: 6
};
const cardStyle: React.CSSProperties = {
  padding: 18, background: "#fff", border: "1px solid #ded9d1", borderRadius: 10,
  marginBottom: 18, lineHeight: 1.9
};

async function api<T>(method: "GET" | "POST", body?: object): Promise<T> {
  const response = await fetch("/api/admin/al-ahsa-migration", {
    method, credentials: "same-origin", cache: "no-store",
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {})
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "تعذر تنفيذ العملية");
  return data as T;
}

export function AlAhsaMigrationPanel() {
  const [info, setInfo] = useState<Info | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [projectId, setProjectId] = useState("");
  const [ack, setAck] = useState(false);
  const [restoreConfirmation, setRestoreConfirmation] = useState("");
  const [progress, setProgress] = useState<{ cursor: number; total: number } | null>(null);

  const load = useCallback(async () => {
    const response = await api<Info>("GET");
    setInfo(response);
    return response;
  }, []);
  useEffect(() => { void load().catch((e) => setError(e.message)); }, [load]);

  async function steps(runId: string, restore: boolean) {
    let result: { cursor: number; total: number; finished: boolean };
    do {
      result = await api("POST", { action: restore ? "restoreStep" : "step", runId });
      setProgress({ cursor: result.cursor, total: result.total });
    } while (!result.finished);
    setNotice(restore ? "اكتمل استرجاع النسخة السابقة." : "اكتمل تحديث قاعدة البيانات إلى الأحساء.");
    await load();
  }

  async function execute(fn: () => Promise<void>) {
    setError(""); setNotice(""); setBusy(true);
    try { await fn(); }
    catch (e) { setError(e instanceof Error ? e.message : "حدث خطأ"); }
    finally { setBusy(false); }
  }

  if (!info && !error) return <p>جارٍ فحص Firebase وحساب التغييرات...</p>;
  const latest = info?.latest;
  const active = latest && ["running", "restoring", "needs_review"].includes(latest.status);

  return (
    <div style={{ maxWidth: 790 }}>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>تحويل محتوى الموقع للأحساء</h2>
        <p>الأداة تعدل المشاريع والخدمات والمجلة وإعدادات الهوية <strong>داخل Firebase نفسها</strong>، مع إبقاء الصور والروابط وأرقام التواصل كما هي.</p>
        <p><strong>الأمان:</strong> المعاينة لا تكتب أي بيانات. وأثناء التطبيق تُنشأ نسخة من كل سجل قبل تعديله داخل مجموعة <code>adminMigrations</code> في Firebase.</p>
        <p style={{ color: "#943a19" }}>تنبيه: تغيير مدينة مشروع منفذ فعليًا خارج الأحساء قد يعطي معلومة غير صحيحة. راجع المدن قبل اعتمادها.</p>
      </div>

      {error && <div role="alert" style={{ ...cardStyle, borderColor: "#b52a2a", color: "#a11b1b" }}>{error}</div>}
      {notice && <div role="status" style={{ ...cardStyle, borderColor: "#16855b" }}>{notice}</div>}

      {latest && (
        <div style={cardStyle}>
          <h3>آخر عملية: {latest.status}</h3>
          <p>{latest.cursor} / {latest.total} سجل تم المرور عليه</p>
          {latest.status === "running" && (
            <button style={actionStyle} disabled={busy} onClick={() => void execute(() => steps(latest.runId, false))}>
              استكمال تحديث قاعدة البيانات
            </button>
          )}
          {latest.status === "restoring" && (
            <button style={actionStyle} disabled={busy} onClick={() => void execute(() => steps(latest.runId, true))}>
              استكمال الاسترجاع
            </button>
          )}
          {["completed", "running", "needs_review"].includes(latest.status) && (
            <div style={{ marginTop: 16 }}>
              <label htmlFor="restore-confirm">لاستعادة الحقول القديمة، اكتب «استرجاع» ثم اضغط الزر:</label>
              <input id="restore-confirm" style={fieldStyle} value={restoreConfirmation}
                onChange={(e) => setRestoreConfirmation(e.target.value)} placeholder="استرجاع" />
              <div style={{ marginTop: 10 }}>
                <button type="button" style={{ ...actionStyle, background: "#8a3429" }}
                  disabled={busy || restoreConfirmation !== "استرجاع"}
                  onClick={() => void execute(async () => {
                    await api("POST", { action: "beginRestore", runId: latest.runId, confirmation: "استرجاع" });
                    await steps(latest.runId, true);
                  })}>استرجاع بيانات ما قبل التعديل</button>
              </div>
            </div>
          )}
        </div>
      )}

      {info && <div style={cardStyle}>
        <h3 style={{ fontSize: 20 }}>معاينة التغييرات</h3>
        <p>مشروع Firebase: <strong dir="ltr">{info.projectId}</strong></p>
        <p><strong>{info.preview.total}</strong> سجل يحتاج تعديل — مشاريع: {info.preview.counts.projects || 0}، خدمات: {info.preview.counts.services || 0}، مجلة: {info.preview.counts.articles || 0}، إعدادات: {info.preview.counts.settings || 0}.</p>
        <p>عدد تنبيهات المراجعة: {info.preview.warningsCount}</p>
        <details><summary style={{ cursor: "pointer" }}>عرض أول 25 سجل وحقول التعديل</summary>
          <div style={{ maxHeight: 360, overflow: "auto" }}>
            {info.preview.samples.map((sample) => <div key={sample.path} style={{ borderTop: "1px solid #eee", padding: 10 }}>
              <strong dir="ltr">{sample.path}</strong>
              {sample.oldCity && <div>المدينة الحالية: {sample.oldCity}</div>}
              <div>الحقول: {sample.fields.join("، ")}</div>
              {sample.warnings.map((warning, i) => <small key={i} style={{ display: "block", color: "#9a3e17" }}>{warning}</small>)}
            </div>)}
          </div>
        </details>
        <button style={{ ...actionStyle, background: "#777", marginTop: 15 }} disabled={busy}
          onClick={() => void execute(async () => { await load(); setNotice("تم تحديث المعاينة."); })}>إعادة فحص البيانات</button>
      </div>}

      {info && info.preview.total > 0 && !active && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: 20 }}>تطبيق التغييرات</h3>
          <p>تأكد من اسم مشروع Firebase ومن صحة مواقع المشاريع، ثم اكتب عبارة التأكيد. التطبيق يحدّث البيانات على دفعات صغيرة تلقائيا.</p>
          <label htmlFor="migration-project">اكتب اسم مشروع Firebase الظاهر أعلاه</label>
          <input id="migration-project" style={fieldStyle} dir="ltr" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          <div style={{ marginTop: 12 }}><label htmlFor="migration-confirm">اكتب: تأكيد الأحساء</label></div>
          <input id="migration-confirm" style={fieldStyle} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          <div style={{ marginTop: 15 }}>
            <label><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> راجعت مواقع المشاريع وأوافق على تحديث حقول المدن والنصوص إلى الأحساء.</label>
          </div>
          <button style={{ ...actionStyle, marginTop: 15 }}
            disabled={busy || confirmation !== "تأكيد الأحساء" || projectId !== info.projectId || !ack}
            onClick={() => void execute(async () => {
              const { runId } = await api<{ runId: string }>("POST", {
                action: "start", hash: info.preview.hash, confirmation, acknowledgeLocations: ack,
                confirmProject: projectId
              });
              await steps(runId, false);
            })}>
            {busy ? "جارٍ التحديث..." : "تطبيق التعديلات على Firebase"}
          </button>
        </div>
      )}
      {progress && <p role="status">التقدم: {progress.cursor} من {progress.total} سجل. لا تغلق الصفحة حتى تظهر رسالة الاكتمال.</p>}
    </div>
  );
}
