import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getPublicSettings } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const settings = await getPublicSettings();
  return <AdminShell title="إعدادات الموقع"><SettingsForm initial={settings} /></AdminShell>;
}
