import { AdminShell } from "@/components/admin/AdminShell";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { getAdminLeads } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminLeadsPage() {
  await requireAdminPage();
  const leads = await getAdminLeads();
  return (
    <AdminShell title="طلبات المشاريع">
      <table className="admin-table">
        <thead>
          <tr><th>العميل</th><th>المشروع</th><th>الميزانية / الوقت</th><th>ملاحظات</th><th>مرفقات</th><th>الحالة</th></tr>
        </thead>
        <tbody>
          {leads.map((lead)=>(
            <tr key={lead.id}>
              <td><strong>{lead.name}</strong><br/><a href={`tel:${lead.phone}`}>{lead.phone}</a><br/><small>{lead.email}</small></td>
              <td>{lead.projectType}<br/><small>{lead.serviceNeed}</small><br/><small>{lead.city}{lead.district?` · ${lead.district}`:""}</small></td>
              <td>{lead.budget || "—"}<br/><small>{lead.startTime || "—"} · {lead.area || "—"} م²</small></td>
              <td style={{maxWidth:260}}>{lead.notes || "—"}</td>
              <td>{lead.attachments?.length ? lead.attachments.map((a,i)=><a key={a.url} href={a.url} target="_blank" rel="noreferrer">ملف {i+1}<br/></a>) : "—"}</td>
              <td>{lead.id && <LeadStatusSelect id={lead.id} initial={lead.status || "new"} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
