import { AdminShell } from "@/components/admin/AdminShell";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function NewServicePage() {
  await requireAdminPage();
  return <AdminShell title="إضافة خدمة"><ServiceForm /></AdminShell>;
}
