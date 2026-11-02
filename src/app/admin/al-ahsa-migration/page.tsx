import { AdminShell } from "@/components/admin/AdminShell";
import { AlAhsaMigrationPanel } from "@/components/admin/AlAhsaMigrationPanel";
import { requireAdminPage } from "@/lib/firebase/session";

export const dynamic = "force-dynamic";

export default async function MigrationPage() {
  await requireAdminPage();
  return (
    <AdminShell title="تحديث بيانات ديكور لاين الأحساء">
      <AlAhsaMigrationPanel />
    </AdminShell>
  );
}
