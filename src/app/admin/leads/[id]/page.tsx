import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone,
  MessageCircle,
  Paperclip
} from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { DeleteButton } from "@/components/admin/DeleteButton";

import { getAdminLead } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";
import { getPrivateR2DownloadUrl } from "@/lib/r2";

export default async function AdminLeadDetailsPage({
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const lead = await getAdminLead(id);

  if (!lead) {
    notFound();
  }

  const attachments = await Promise.all(
    (lead.attachments || []).map(async (attachment) => ({
      ...attachment,
      downloadUrl:
        await getPrivateR2DownloadUrl(
          attachment.key
        )
    }))
  );

  const whatsapp = lead.phone.replace(/\D/g, "");

  return (
    <AdminShell title="تفاصيل الطلب">
      <div className="lead-detail-actions">
        <Link
          className="button"
          href="/admin/leads"
        >
          العودة للطلبات
        </Link>

        <a
          className="button button--solid"
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={17} />
          واتساب
        </a>

        <a
          className="button"
          href={`tel:${lead.phone}`}
        >
          <Phone size={17} />
          اتصال
        </a>

        {lead.id && (
          <DeleteButton
            endpoint={`/api/admin/leads/${lead.id}`}
            returnTo="/admin/leads"
            label="حذف الطلب"
            confirmMessage={`هل تريد حذف طلب «${lead.name}» ومرفقاته نهائيا؟`}
          />
        )}
      </div>

      <div className="lead-detail-grid">
        <section className="lead-detail-card">
          <p className="eyebrow">
            بيانات العميل
          </p>

          <h2>{lead.name}</h2>

          <a href={`tel:${lead.phone}`}>
            {lead.phone}
          </a>
        </section>

        <section className="lead-detail-card">
          <p className="eyebrow">
            حالة الطلب
          </p>

          {lead.id && (
            <LeadStatusSelect
              id={lead.id}
              initial={lead.status || "new"}
            />
          )}

          {lead.createdAt && (
            <small>
              استلم في{" "}
              {new Intl.DateTimeFormat(
                "ar-SA",
                {
                  dateStyle: "long"
                }
              ).format(
                new Date(lead.createdAt)
              )}
            </small>
          )}
        </section>

        <section className="lead-detail-card lead-detail-card--wide">
          <p className="eyebrow">
            تفاصيل المشروع
          </p>

          <div className="lead-facts">
            <div>
              <span>نوع المشروع</span>
              <strong>
                {lead.projectType}
              </strong>
            </div>

            <div>
              <span>الخدمة المطلوبة</span>
              <strong>
                {lead.serviceNeed}
              </strong>
            </div>

            {lead.area && (
              <div>
                <span>
                  المساحة التقريبية
                </span>

                <strong>
                  {lead.area} م²
                </strong>
              </div>
            )}
          </div>

          {lead.notes && (
            <div className="lead-notes">
              <span>
                ملاحظات العميل
              </span>

              <p>{lead.notes}</p>
            </div>
          )}
        </section>

        <section className="lead-detail-card lead-detail-card--wide">
          <p className="eyebrow">
            المرفقات
          </p>

          {attachments.length ? (
            <div className="lead-attachments">
              {attachments.map(
                (attachment, index) =>
                  attachment.downloadUrl ? (
                    <a
                      key={attachment.key}
                      href={
                        attachment.downloadUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Paperclip size={16} />

                      {attachment.name ||
                        `ملف ${index + 1}`}
                    </a>
                  ) : null
              )}
            </div>
          ) : (
            <p>لا توجد مرفقات.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
