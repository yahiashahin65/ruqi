import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function NewProjectPage() {
  await requireAdminPage();
  return <AdminShell title="إضافة مشروع"><ProjectForm /></AdminShell>;
}
