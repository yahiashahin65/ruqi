import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { getAdminLeads } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

function normalize(value: string | undefined) {
  return (value || "").trim().toLocaleLowerCase("ar");
}

const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  site_visit: "معاينة",
  quotation: "عرض سعر",
  won: "تم التعاقد",
  lost: "مغلق"
};

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
        lead.serviceType,
        lead.notes
      ].some((value) =>
        normalize(value).includes(q)
      );

    const matchesStatus =
      status === "all" ||
      lead.status === status;

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
              placeholder="ابحث باسم العميل أو رقم الجوال"
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
                STATUS_LABELS
              ).map(([key, label]) => (
                <option
                  key={key}
                  value={key}
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
            {filteredLeads.length} من{" "}
            {leads.length}
          </span>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>العميل</th>
            <th>المشروع</th>
            <th>الخدمة</th>
            <th>الحالة</th>
            <th>التاريخ</th>
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

                <div
                  style={{
                    marginTop: 4,
                    opacity: 0.7,
                    fontSize: 13
                  }}
                >
                  {lead.phone}
                </div>
              </td>

              <td data-label="المشروع">
                {lead.projectType || "—"}
              </td>

              <td data-label="الخدمة">
                {lead.serviceType || "—"}
              </td>

              <td data-label="الحالة">
                <LeadStatusSelect
                  leadId={lead.id}
                  value={lead.status}
                />
              </td>

              <td data-label="التاريخ">
                {lead.createdAt
                  ? new Intl.DateTimeFormat(
                      "ar-SA",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      }
                    ).format(
                      new Date(
                        lead.createdAt
                      )
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

                  {lead.phone && (
                    <a
                      className="admin-row-link"
                      href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      واتساب
                    </a>
                  )}

                  <DeleteButton
                    endpoint={`/api/admin/leads/${lead.id}`}
                    returnTo="/admin/leads"
                    label="حذف"
                    confirmMessage={`هل تريد حذف طلب «${lead.name}» نهائيا؟`}
                  />
                </div>
              </td>
            </tr>
          ))}

          {!filteredLeads.length && (
            <tr>
              <td colSpan={6}>
                لا توجد طلبات مطابقة للبحث أو الفلاتر الحالية.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminShell>
  );
}
