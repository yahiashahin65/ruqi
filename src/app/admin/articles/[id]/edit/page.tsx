import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminArticle } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) notFound();

  return (
    <AdminShell title={`تعديل: ${article.title}`}>
      <div className="admin-record-actions"><DeleteButton endpoint={`/api/admin/articles/${article.id}`} returnTo="/admin/articles" label="حذف المقال" /></div>
      <ArticleForm article={article} />
    </AdminShell>
  );
}
