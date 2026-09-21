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
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}>
        <Link className="button button--solid" href="/admin/projects/new">إضافة مشروع</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>المشروع</th><th>النوع</th><th>الموقع</th><th>الحالة</th><th>مميز</th><th></th></tr></thead>
        <tbody>
          {projects.map((project)=>(
            <tr key={project.id}>
              <td><strong>{project.title}</strong><br/><small>/{project.slug}</small></td>
              <td>{PROJECT_TYPES[project.type]}</td>
              <td>{project.city}{project.district?` · ${project.district}`:""}</td>
              <td><span className="status">{project.status === "published" ? "منشور" : "مسودة"}</span></td>
              <td>{project.featured ? "نعم" : "—"}</td>
              <td><Link href={`/admin/projects/${project.id}/edit`}>تعديل</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
