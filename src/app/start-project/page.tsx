import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { ProjectWizard } from "@/components/ProjectWizard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "ابدأ مشروع تصميم داخلي في الرياض",

  description:
    "ابدأ طلب مشروعك مع ديكور لاين الرياض. أعمالنا وخدماتنا داخل الرياض. أرسل تفاصيل مشروع التصميم الداخلي أو التنفيذ أو التجديد وسنتواصل معك لمناقشة الاحتياج والخطوة التالية.",

  path: "/start-project"
});

export default function StartProjectPage() {
  return (
    <main className="page-main">

      <PageHero
        eyebrow="ابدأ مشروعك مع ديكور لاين الرياض"
        title={
          <>
            ابدأ مشروع تصميم داخلي
            <br />
            في الرياض
          </>
        }
        lead="شاركنا نوع المشروع والمساحة والمرحلة الحالية واحتياجاتك الأساسية، وسنتواصل معك لمناقشة التصميم أو التنفيذ أو التجديد والخطوة المناسبة للبدء."
      />

      <section
        className="section"
        aria-labelledby="project-request-title"
      >
        <div className="shell">

          <div
            className="section-heading"
            data-reveal
          >
            <p className="eyebrow">
              طلب مشروع جديد
            </p>

            <h2 id="project-request-title">
              شاركنا التفاصيل الأساسية
              <br />
              لنفهم مشروعك بشكل أوضح
            </h2>

            <p className="section-heading__text">
              كلما كانت معلومات المشروع أوضح من البداية،
              كان من الأسهل تحديد نطاق العمل والخدمة المناسبة
              والخطوة التالية.
            </p>
          </div>

          <ProjectWizard />

        </div>
      </section>

    </main>
  );
}
