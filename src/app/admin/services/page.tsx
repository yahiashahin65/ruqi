import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminServices } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminServicesPage() {
  await requireAdminPage();
  const services = await getAdminServices();

  return (
    <AdminShell title="الخدمات">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <Link className="button button--solid" href="/admin/services/new">إضافة خدمة</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>الخدمة</th><th>التعريف</th><th>الحالة</th><th>الترتيب</th><th></th></tr></thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td><strong>{service.title}</strong><br /><small>/{service.slug}</small></td>
              <td>{service.eyebrow}</td>
              <td><span className="status">{service.status === "published" ? "منشورة" : "مسودة"}</span></td>
              <td>{service.order}</td>
              <td><Link href={`/admin/services/${service.id}/edit`}>تعديل</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
