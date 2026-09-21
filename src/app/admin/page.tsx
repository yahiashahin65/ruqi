import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminLeads, getAdminProjects } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

export default async function AdminDashboardPage() {
  await requireAdminPage();
  const [projects, leads] = await Promise.all([getAdminProjects(), getAdminLeads()]);
  const newLeads = leads.filter((lead) => (lead.status || "new") === "new").length;
  const won = leads.filter((lead) => lead.status === "won").length;

  return (
    <AdminShell title="لوحة التحكم">
      <div className="admin-cards">
        <div className="admin-card"><span>المشاريع</span><strong>{projects.length}</strong></div>
        <div className="admin-card"><span>المنشور</span><strong>{projects.filter(p=>p.status==="published").length}</strong></div>
        <div className="admin-card"><span>طلبات جديدة</span><strong>{newLeads}</strong></div>
        <div className="admin-card"><span>تم التعاقد</span><strong>{won}</strong></div>
      </div>
      <div className="admin-top" style={{marginTop:20}}>
        <h2 style={{margin:0,fontSize:20}}>أحدث الطلبات</h2>
        <Link className="button" href="/admin/leads">كل الطلبات</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>الاسم</th><th>المشروع</th><th>المدينة</th><th>الحالة</th><th>التاريخ</th></tr></thead>
        <tbody>
          {leads.slice(0,8).map((lead)=>(
            <tr key={lead.id}>
              <td>{lead.name}<br/><small>{lead.phone}</small></td>
              <td>{lead.projectType}<br/><small>{lead.serviceNeed}</small></td>
              <td>{lead.city}{lead.district?` · ${lead.district}`:""}</td>
              <td><span className="status">{LEAD_STATUS_LABELS[lead.status || "new"]}</span></td>
              <td>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("ar-SA") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
