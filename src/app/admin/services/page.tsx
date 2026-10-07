import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminServices } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

function normalize(value: string | undefined) {
  return (value || "").trim().toLocaleLowerCase("ar");
}

export default async function AdminServicesPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const services = await getAdminServices();

  const q = normalize(params.q);
  const status = params.status || "all";

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !q ||
      [service.title, service.excerpt, service.body].some((value) =>
        normalize(value).includes(q)
      );

    const matchesStatus =
      status === "all" || service.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminShell title="الخدمات">
      <div className="admin-list-header">
        <form className="admin-toolbar" method="get">
          <div className="admin-toolbar__search">
            <label htmlFor="services-search">
              بحث
            </label>

            <input
              id="services-search"
              name="q"
              type="search"
              defaultValue={params.q || ""}
              placeholder="ابحث باسم الخدمة أو الوصف"
            />
          </div>

          <div className="admin-toolbar__filter">
            <label htmlFor="services-status">
              الحالة
            </label>

            <select
              id="services-status"
              name="status"
              defaultValue={status}
            >
              <option value="all">
                كل الحالات
              </option>

              <option value="published">
                منشورة
              </option>

              <option value="draft">
                مسودة
              </option>
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
              href="/admin/services"
            >
              مسح
            </Link>
          </div>
        </form>

        <div className="admin-list-actions">
          <span className="admin-results-count">
            {filteredServices.length} من {services.length}
          </span>

          <Link
            className="button button--solid"
            href="/admin/services/new"
          >
            إضافة خدمة
          </Link>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>الخدمة</th>
            <th>الوصف المختصر</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredServices.map((service) => (
            <tr key={service.id}>
              <td data-label="الخدمة">
                <strong>{service.title}</strong>
              </td>

              <td data-label="الوصف">
                {service.excerpt}
              </td>

              <td data-label="الحالة">
                <span className="status">
                  {service.status === "published"
                    ? "منشورة"
                    : "مسودة"}
                </span>
              </td>

              <td data-label="الإجراءات">
                <div className="admin-row-actions">
                  <Link
                    className="admin-row-link"
                    href={`/admin/services/${service.id}/edit`}
                  >
                    تعديل
                  </Link>

                  <DeleteButton
                    endpoint={`/api/admin/services/${service.id}`}
                    returnTo="/admin/services"
                    label="حذف"
                    confirmMessage={`هل تريد حذف خدمة «${service.title}» نهائيا؟`}
                  />
                </div>
              </td>
            </tr>
          ))}

          {!filteredServices.length && (
            <tr>
              <td colSpan={4}>
                لا توجد خدمات مطابقة للبحث أو الفلاتر الحالية.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminShell>
  );
}
