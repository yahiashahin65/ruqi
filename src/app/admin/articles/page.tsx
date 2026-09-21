import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminArticles } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminArticlesPage() {
  await requireAdminPage();
  const articles = await getAdminArticles();

  return (
    <AdminShell title="المجلة">
      <div className="admin-list-actions"><Link className="button button--solid" href="/admin/articles/new">إضافة مقال</Link></div>
      <table className="admin-table">
        <thead><tr><th>المقال</th><th>التصنيف</th><th>الحالة</th><th>تاريخ النشر</th><th></th></tr></thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td data-label="المقال"><strong>{article.title}</strong></td>
              <td data-label="التصنيف">{article.category}</td>
              <td data-label="الحالة"><span className="status">{article.status === "published" ? "منشور" : "مسودة"}</span></td>
              <td data-label="تاريخ النشر">{article.status === "published" ? new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(article.publishedAt)) : "—"}</td>
              <td data-label=""><Link className="admin-row-link" href={`/admin/articles/${article.id}/edit`}>تعديل</Link></td>
            </tr>
          ))}
          {!articles.length && <tr><td colSpan={5}>لا توجد مقالات حتى الآن.</td></tr>}
        </tbody>
      </table>
    </AdminShell>
  );
}
