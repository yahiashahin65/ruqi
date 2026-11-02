import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminArticles } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  category?: string;
}>;

function normalize(value: string | undefined) {
  return (value || "").trim().toLocaleLowerCase("ar");
}

export default async function AdminArticlesPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const articles = await getAdminArticles();

  const q = normalize(params.q);
  const status = params.status || "all";
  const category = params.category || "all";

  const categories = Array.from(
    new Set(
      articles
        .map((article) => article.category)
        .filter(Boolean)
    )
  );

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      !q ||
      [
        article.title,
        article.excerpt,
        article.content,
        article.category
      ].some((value) => normalize(value).includes(q));

    const matchesStatus =
      status === "all" || article.status === status;

    const matchesCategory =
      category === "all" || article.category === category;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory
    );
  });

  return (
    <AdminShell title="المجلة">
      <div className="admin-list-header">
        <form className="admin-toolbar" method="get">
          <div className="admin-toolbar__search">
            <label htmlFor="articles-search">
              بحث
            </label>

            <input
              id="articles-search"
              name="q"
              type="search"
              defaultValue={params.q || ""}
              placeholder="ابحث بعنوان المقال أو المحتوى"
            />
          </div>

          <div className="admin-toolbar__filter">
            <label htmlFor="articles-status">
              الحالة
            </label>

            <select
              id="articles-status"
              name="status"
              defaultValue={status}
            >
              <option value="all">
                كل الحالات
              </option>

              <option value="published">
                منشور
              </option>

              <option value="draft">
                مسودة
              </option>
            </select>
          </div>

          <div className="admin-toolbar__filter">
            <label htmlFor="articles-category">
              التصنيف
            </label>

            <select
              id="articles-category"
              name="category"
              defaultValue={category}
            >
              <option value="all">
                كل التصنيفات
              </option>

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-toolbar__buttons">
            <button
              className="button button--solid"
              type="submit"
            >
              تطبيق
            </button>

            <Link
              className="button"
              href="/admin/articles"
            >
              مسح
            </Link>
          </div>
        </form>

        <div className="admin-list-actions">
          <span className="admin-results-count">
            {filteredArticles.length} من {articles.length}
          </span>

          <Link
            className="button button--solid"
            href="/admin/articles/new"
          >
            إضافة مقال
          </Link>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>العنوان</th>
            <th>التصنيف</th>
            <th>الحالة</th>
            <th>تاريخ النشر</th>
            <th>الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredArticles.map((article) => (
            <tr key={article.id}>
              <td data-label="العنوان">
                <strong>{article.title}</strong>
              </td>

              <td data-label="التصنيف">
                {article.category || "—"}
              </td>

              <td data-label="الحالة">
                <span className="status">
                  {article.status === "published"
                    ? "منشور"
                    : "مسودة"}
                </span>
              </td>

              <td data-label="تاريخ النشر">
                {article.publishedAt
                  ? new Intl.DateTimeFormat("ar-SA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    }).format(
                      new Date(article.publishedAt)
                    )
                  : "—"}
              </td>

              <td data-label="الإجراءات">
                <div className="admin-row-actions">
                  <Link
                    className="admin-row-link"
                    href={`/admin/articles/${article.id}/edit`}
                  >
                    تعديل
                  </Link>

                  <DeleteButton
                    endpoint={`/api/admin/articles/${article.id}`}
                    returnTo="/admin/articles"
                    label="حذف"
                    confirmMessage={`هل تريد حذف مقال «${article.title}» نهائيا؟`}
                  />
                </div>
              </td>
            </tr>
          ))}

          {!filteredArticles.length && (
            <tr>
              <td colSpan={5}>
                لا توجد مقالات مطابقة للبحث أو الفلاتر الحالية.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminShell>
  );
}
