import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "سياسة الخصوصية | ديكور لاين الرياض",
  description:
    "سياسة خصوصية موقع ديكور لاين الرياض وبيانات طلبات مشاريع التصميم الداخلي في الرياض.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <main className="page-main">
      <PageHero
        eyebrow="سياسة الخصوصية"
        title={
          <>
            خصوصيتك جزء
            <br />
            من جودة الخدمة.
          </>
        }
        lead="نحافظ على بيانات التواصل والمرفقات التي ترسلها ونستخدمها فقط لخدمة طلبك والتواصل معك."
      />

      <section className="content-page">
        <div className="shell content-grid">
          <p className="eyebrow">
            البيانات
          </p>

          <div className="prose">
            <h2>
              ما الذي نجمعه ولماذا؟
            </h2>

            <p>
              عند إرسال طلب مشروع قد نجمع الاسم ورقم التواصل ونوع المشروع والمساحة التقريبية والملاحظات والملفات التي تختار رفعها. نستخدم هذه البيانات لدراسة الطلب والتواصل بشأن الخدمة وإدارة المشروع المحتمل.
            </p>

            <h3>
              الملفات والصور
            </h3>

            <p>
              المخططات والصور التي ترسلها تحفظ بشكل خاص ولا تنشر للعامة تلقائيا.
            </p>

            <h3>
              التواصل والحذف
            </h3>

            <p>
              يمكنك طلب تصحيح بيانات التواصل أو حذف طلب سابق عبر بيانات التواصل المنشورة في الموقع، ما لم يلزم الاحتفاظ بجزء من البيانات لالتزام نظامي أو تعاقدي.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
