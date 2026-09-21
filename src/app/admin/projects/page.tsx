import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminProjects } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";
import { PROJECT_TYPES } from "@/lib/constants";

export default async function AdminProjectsPage() {
  await requireAdminPage();
  const projects = await getAdminProjects();

  return (
    <AdminShell title="المشاريع">
      <div className="admin-list-actions"><Link className="button button--solid" href="/admin/projects/new">إضافة مشروع</Link></div>
      <table className="admin-table">
        <thead><tr><th>المشروع</th><th>النوع</th><th>الحالة</th><th>مميز</th><th></th></tr></thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td data-label="المشروع"><strong>{project.title}</strong></td>
              <td data-label="النوع">{PROJECT_TYPES[project.type]}</td>
              <td data-label="الحالة"><span className="status">{project.status === "published" ? "منشور" : "مسودة"}</span></td>
              <td data-label="مميز">{project.featured ? "نعم" : "—"}</td>
              <td data-label=""><Link className="admin-row-link" href={`/admin/projects/${project.id}/edit`}>تعديل</Link></td>
            </tr>
          ))}
          {!projects.length && <tr><td colSpan={5}>لا توجد مشاريع حتى الآن.</td></tr>}
        </tbody>
      </table>
    </AdminShell>
  );
}
