import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminLeads, getAdminProjects } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

export default async function AdminDashboardPage() {
  await requireAdminPage();
  const [projects, leads] = await Promise.all([getAdminProjects(), getAdminLeads()]);
  const newLeads = leads.filter((lead) => (lead.status || "new") === "new").length;
  const followUp = leads.filter((lead) => ["contacted", "site_visit", "quotation"].includes(lead.status || "new")).length;
  const won = leads.filter((lead) => lead.status === "won").length;
  const published = projects.filter((project) => project.status === "published").length;

  return (
    <AdminShell title="لوحة التحكم">
      <div className="admin-cards">
        <div className="admin-card"><span>طلبات جديدة</span><strong>{newLeads}</strong></div>
        <div className="admin-card"><span>قيد المتابعة</span><strong>{followUp}</strong></div>
        <div className="admin-card"><span>تم التعاقد</span><strong>{won}</strong></div>
        <div className="admin-card"><span>مشاريع منشورة</span><strong>{published}</strong></div>
      </div>

      <div className="admin-shortcuts">
        <Link className="button button--solid" href="/admin/projects/new">إضافة مشروع</Link>
        <Link className="button" href="/admin/leads">عرض الطلبات الجديدة</Link>
      </div>

      <div className="admin-top admin-section-top">
        <h2>أحدث الطلبات</h2>
        <Link className="text-link" href="/admin/leads">كل الطلبات</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>العميل</th><th>الطلب</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead>
        <tbody>
          {leads.slice(0, 8).map((lead) => (
            <tr key={lead.id}>
              <td data-label="العميل"><strong>{lead.name}</strong><br /><small>{lead.phone}</small></td>
              <td data-label="الطلب">{lead.projectType}<br /><small>{lead.serviceNeed}</small></td>
              <td data-label="الحالة"><span className="status">{LEAD_STATUS_LABELS[lead.status || "new"]}</span></td>
              <td data-label="التاريخ">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("ar-SA") : "—"}</td>
              <td data-label=""><Link className="admin-row-link" href={`/admin/leads/${lead.id}`}>عرض</Link></td>
            </tr>
          ))}
          {!leads.length && <tr><td colSpan={5}>لا توجد طلبات حتى الآن.</td></tr>}
        </tbody>
      </table>
    </AdminShell>
  );
}
