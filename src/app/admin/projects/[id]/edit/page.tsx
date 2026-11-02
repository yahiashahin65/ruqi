import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminProject } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();
  return (
    <AdminShell title={`تعديل: ${project.title}`}>
      <div className="admin-record-actions"><DeleteButton endpoint={`/api/admin/projects/${project.id}`} returnTo="/admin/projects" label="حذف المشروع" /></div>
      <ProjectForm project={project} />
    </AdminShell>
  );
}
