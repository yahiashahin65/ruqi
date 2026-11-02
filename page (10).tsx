import Link from "next/link";
import { revalidatePath, revalidateTag } from "next/cache";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminProjects } from "@/lib/firebase/data";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest, requireAdminPage } from "@/lib/firebase/session";
import { PROJECT_TYPES } from "@/lib/constants";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  type?: string;
}>;

function normalize(value: string | undefined) {
  return (value || "").trim().toLocaleLowerCase("ar");
}

async function changeProjectStatus(formData: FormData) {
  "use server";

  if (!(await isAdminRequest())) {
    throw new Error("غير مصرح");
  }

  const id = String(formData.get("id") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!id || !["published", "draft"].includes(status)) {
    return;
  }

  const db = getAdminDb();

  if (!db) {
    throw new Error("تعذر تحديث المشروع حاليا");
  }

  await db.collection("projects").doc(id).set(
    {
      status,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  revalidateTag("projects", "max");
  revalidatePath("/admin/projects");
}

async function changeProjectFeatured(formData: FormData) {
  "use server";

  if (!(await isAdminRequest())) {
    throw new Error("غير مصرح");
  }

  const id = String(formData.get("id") || "").trim();
  const featured = String(formData.get("featured") || "") === "true";

  if (!id) {
    return;
  }

  const db = getAdminDb();

  if (!db) {
    throw new Error("تعذر تحديث المشروع حاليا");
  }

  await db.collection("projects").doc(id).set(
    {
      featured,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  revalidateTag("projects", "max");
  revalidatePath("/admin/projects");
}

export default async function AdminProjectsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const projects = await getAdminProjects();

  const q = normalize(params.q);
  const status = params.status || "all";
  const type = params.type || "all";

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !q ||
      [project.title, project.excerpt, PROJECT_TYPES[project.type]].some(
        (value) => normalize(value).includes(q)
      );

    const matchesStatus =
      status === "all" || project.status === status;

    const matchesType =
      type === "all" || project.type === type;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AdminShell title="المشاريع">
      <div className="admin-list-header">
        <form className="admin-toolbar" method="get">
          <div className="admin-toolbar__search">
            <label htmlFor="projects-search">بحث</label>

            <input
              id="projects-search"
              name="q"
              type="search"
              defaultValue={params.q || ""}
              placeholder="ابحث باسم المشروع أو النوع"
            />
          </div>

          <div className="admin-toolbar__filter">
            <label htmlFor="projects-status">الحالة</label>

            <select
              id="projects-status"
              name="status"
              defaultValue={status}
            >
              <option value="all">كل الحالات</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
            </select>
          </div>

          <div className="admin-toolbar__filter">
            <label htmlFor="projects-type">النوع</label>

            <select
              id="projects-type"
              name="type"
              defaultValue={type}
            >
              <option value="all">كل الأنواع</option>

              {Object.entries(PROJECT_TYPES).map(([key, label]) => (
                <option value={key} key={key}>
                  {label}
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
              href="/admin/projects"
            >
              مسح
            </Link>
          </div>
        </form>

        <div className="admin-list-actions">
          <span className="admin-results-count">
            {filteredProjects.length} من {projects.length}
          </span>

          <Link
            className="button button--solid"
            href="/admin/projects/new"
          >
            إضافة مشروع
          </Link>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>المشروع</th>
            <th>النوع</th>
            <th>الحالة</th>
            <th>مميز</th>
            <th>الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredProjects.map((project) => {
            const isPublished = project.status === "published";
            const isFeatured = Boolean(project.featured);

            return (
              <tr key={project.id}>
                <td data-label="المشروع">
                  <strong>{project.title}</strong>
                </td>

                <td data-label="النوع">
                  {PROJECT_TYPES[project.type]}
                </td>

                <td data-label="الحالة">
                  <div className="admin-row-actions">
                    <span className="status">
                      {isPublished ? "منشور" : "مسودة"}
                    </span>

                    <form action={changeProjectStatus}>
                      <input
                        type="hidden"
                        name="id"
                        value={project.id}
                      />

                      <input
                        type="hidden"
                        name="status"
                        value={
                          isPublished
                            ? "draft"
                            : "published"
                        }
                      />

                      <button
                        className="admin-row-link"
                        type="submit"
                      >
                        {isPublished
                          ? "تحويل لمسودة"
                          : "نشر الآن"}
                      </button>
                    </form>
                  </div>
                </td>

                <td data-label="مميز">
                  <form action={changeProjectFeatured}>
                    <input
                      type="hidden"
                      name="id"
                      value={project.id}
                    />

                    <input
                      type="hidden"
                      name="featured"
                      value={String(!isFeatured)}
                    />

                    <button
                      className="admin-row-link"
                      type="submit"
                      aria-pressed={isFeatured}
                    >
                      {isFeatured
                        ? "★ مميز — إلغاء"
                        : "☆ تمييز"}
                    </button>
                  </form>
                </td>

                <td data-label="الإجراءات">
                  <div className="admin-row-actions">
                    <Link
                      className="admin-row-link"
                      href={`/admin/projects/${project.id}/edit`}
                    >
                      تعديل
                    </Link>

                    <DeleteButton
                      endpoint={`/api/admin/projects/${project.id}`}
                      returnTo="/admin/projects"
                      label="حذف"
                      confirmMessage={`هل تريد حذف مشروع «${project.title}» نهائيا؟`}
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {!filteredProjects.length && (
            <tr>
              <td colSpan={5}>
                لا توجد مشاريع مطابقة للبحث أو الفلاتر الحالية.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminShell>
  );
}
