import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminArticles } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function AdminArticlesPage() {
  await requireAdminPage();
  const articles = await getAdminArticles();

  return (
    <AdminShell title="المجلة والمحتوى">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <Link className="button button--solid" href="/admin/articles/new">إضافة مقال</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>المقال</th><th>التصنيف</th><th>النشر</th><th>الحالة</th><th></th></tr></thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td><strong>{article.title}</strong><br /><small>/{article.slug}</small></td>
              <td>{article.category}</td>
              <td>{new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(article.publishedAt))}</td>
              <td><span className="status">{article.status === "published" ? "منشور" : "مسودة"}</span></td>
              <td><Link href={`/admin/articles/${article.id}/edit`}>تعديل</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
