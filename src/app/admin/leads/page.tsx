import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminLeads } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

export default async function AdminLeadsPage() {
  await requireAdminPage();
  const leads = await getAdminLeads();

  return (
    <AdminShell title="الطلبات">
      <table className="admin-table">
        <thead><tr><th>العميل</th><th>نوع المشروع</th><th>الخدمة</th><th>الحالة</th><th>تاريخ الطلب</th><th></th></tr></thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td data-label="العميل"><strong>{lead.name}</strong><br /><small>{lead.phone}</small></td>
              <td data-label="نوع المشروع">{lead.projectType}</td>
              <td data-label="الخدمة">{lead.serviceNeed}</td>
              <td data-label="الحالة"><span className="status">{LEAD_STATUS_LABELS[lead.status || "new"]}</span></td>
              <td data-label="تاريخ الطلب">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("ar-SA") : "—"}</td>
              <td data-label=""><Link className="admin-row-link" href={`/admin/leads/${lead.id}`}>عرض التفاصيل</Link></td>
            </tr>
          ))}
          {!leads.length && <tr><td colSpan={6}>لا توجد طلبات حتى الآن.</td></tr>}
        </tbody>
      </table>
    </AdminShell>
  );
}
