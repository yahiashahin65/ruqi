import { AdminShell } from "@/components/admin/AdminShell";
import { MediaPlayground } from "@/components/admin/MediaPlayground";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminMediaPage() {
  await requireAdminPage();
  return <AdminShell title="الوسائط"><MediaPlayground /></AdminShell>;
}
