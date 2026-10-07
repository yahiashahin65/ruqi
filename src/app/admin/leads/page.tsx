import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { getAdminLeads } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

function normalize(value: string | undefined) {
  return (value || "").trim().toLocaleLowerCase("ar");
}

export default async function AdminLeadsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const leads = await getAdminLeads();

  const q = normalize(params.q);
  const status = params.status || "all";

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !q ||
      [
        lead.name,
        lead.phone,
        lead.projectType,
        lead.serviceNeed,
        lead.notes
      ].some((value) =>
        normalize(value).includes(q)
      );

    const matchesStatus =
      status === "all" ||
      (lead.status || "new") === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminShell title="الطلبات">
      <div className="admin-list-header">
        <form
          className="admin-toolbar"
          method="get"
        >
          <div className="admin-toolbar__search">
            <label htmlFor="leads-search">
              بحث
            </label>

            <input
              id="leads-search"
              name="q"
              type="search"
              defaultValue={params.q || ""}
              placeholder="ابحث باسم العميل أو رقم الجوال أو الخدمة"
            />
          </div>

          <div className="admin-toolbar__filter">
            <label htmlFor="leads-status">
              الحالة
            </label>

            <select
              id="leads-status"
              name="status"
              defaultValue={status}
            >
              <option value="all">
                كل الحالات
              </option>

              {Object.entries(
                LEAD_STATUS_LABELS
              ).map(([key, label]) => (
                <option
                  value={key}
                  key={key}
                >
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
              href="/admin/leads"
            >
              مسح
            </Link>
          </div>
        </form>

        <div className="admin-list-actions">
          <span className="admin-results-count">
            {filteredLeads.length} من {leads.length}
          </span>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>العميل</th>
            <th>نوع المشروع</th>
            <th>الخدمة</th>
            <th>الحالة</th>
            <th>تاريخ الطلب</th>
            <th>الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id}>
              <td data-label="العميل">
                <strong>
                  {lead.name}
                </strong>

                <br />

                <small>
                  {lead.phone}
                </small>
              </td>

              <td data-label="نوع المشروع">
                {lead.projectType || "—"}
              </td>

              <td data-label="الخدمة">
                {lead.serviceNeed || "—"}
              </td>

              <td data-label="الحالة">
                {lead.id ? (
                  <LeadStatusSelect
                    id={lead.id}
                    initial={lead.status || "new"}
                    compact
                  />
                ) : (
                  <span className="status">
                    {
                      LEAD_STATUS_LABELS[
                        lead.status || "new"
                      ]
                    }
                  </span>
                )}
              </td>

              <td data-label="تاريخ الطلب">
                {lead.createdAt
                  ? new Date(
                      lead.createdAt
                    ).toLocaleDateString(
                      "ar-SA"
                    )
                  : "—"}
              </td>

              <td data-label="الإجراءات">
                <div className="admin-row-actions">
                  <Link
                    className="admin-row-link"
                    href={`/admin/leads/${lead.id}`}
                  >
                    عرض
                  </Link>

                  {lead.id && (
                    <DeleteButton
                      endpoint={`/api/admin/leads/${lead.id}`}
                      returnTo="/admin/leads"
                      label="حذف"
                      confirmMessage={`هل تريد حذف طلب «${lead.name}» ومرفقاته نهائيا؟`}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}

          {!filteredLeads.length && (
            <tr>
              <td colSpan={6}>
                لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminShell>
  );
}
