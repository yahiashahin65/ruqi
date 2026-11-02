import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function NewArticlePage() {
  await requireAdminPage();
  return <AdminShell title="إضافة مقال"><ArticleForm /></AdminShell>;
}
