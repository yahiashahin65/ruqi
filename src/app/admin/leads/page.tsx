import { AdminShell } from "@/components/admin/AdminShell";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { getAdminLeads } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";
import { getPrivateR2DownloadUrl } from "@/lib/r2";

export default async function AdminLeadsPage() {
  await requireAdminPage();
  const leads = await getAdminLeads();

  const rows = await Promise.all(
    leads.map(async (lead) => ({
      ...lead,
      attachmentsWithUrl: await Promise.all(
        (lead.attachments || []).map(async (attachment) => ({
          ...attachment,
          downloadUrl: await getPrivateR2DownloadUrl(attachment.key)
        }))
      )
    }))
  );

  return (
    <AdminShell title="طلبات المشاريع">
      <table className="admin-table">
        <thead>
          <tr><th>العميل</th><th>المشروع</th><th>الميزانية / الوقت</th><th>ملاحظات</th><th>مرفقات</th><th>الحالة</th></tr>
        </thead>
        <tbody>
          {rows.map((lead)=>(
            <tr key={lead.id}>
              <td><strong>{lead.name}</strong><br/><a href={`tel:${lead.phone}`}>{lead.phone}</a><br/><small>{lead.email}</small></td>
              <td>{lead.projectType}<br/><small>{lead.serviceNeed}</small><br/><small>{lead.city}{lead.district?` · ${lead.district}`:""}</small></td>
              <td>{lead.budget || "—"}<br/><small>{lead.startTime || "—"} · {lead.area || "—"} م²</small></td>
              <td style={{maxWidth:260}}>{lead.notes || "—"}</td>
              <td>
                {lead.attachmentsWithUrl.length
                  ? lead.attachmentsWithUrl.map((attachment, i) => attachment.downloadUrl ? (
                      <a key={attachment.key} href={attachment.downloadUrl} target="_blank" rel="noreferrer">
                        {attachment.name || `ملف ${i+1}`}<br/>
                      </a>
                    ) : <span key={attachment.key}>تعذر إنشاء رابط الملف<br/></span>)
                  : "—"}
              </td>
              <td>{lead.id && <LeadStatusSelect id={lead.id} initial={lead.status || "new"} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
