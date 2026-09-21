import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminServices } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminServicesPage() {
  await requireAdminPage();
  const services = await getAdminServices();

  return (
    <AdminShell title="الخدمات">
      <div className="admin-list-actions"><Link className="button button--solid" href="/admin/services/new">إضافة خدمة</Link></div>
      <table className="admin-table">
        <thead><tr><th>الخدمة</th><th>الوصف المختصر</th><th>الحالة</th><th></th></tr></thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td data-label="الخدمة"><strong>{service.title}</strong></td>
              <td data-label="الوصف">{service.excerpt}</td>
              <td data-label="الحالة"><span className="status">{service.status === "published" ? "منشورة" : "مسودة"}</span></td>
              <td data-label=""><Link className="admin-row-link" href={`/admin/services/${service.id}/edit`}>تعديل</Link></td>
            </tr>
          ))}
          {!services.length && <tr><td colSpan={4}>لا توجد خدمات حتى الآن.</td></tr>}
        </tbody>
      </table>
    </AdminShell>
  );
}
