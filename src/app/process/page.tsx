import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "مراحل التصميم الداخلي والتنفيذ في الرياض",

  description:
    "تعرف على مراحل عمل ديكور لاين الرياض في مشاريع التصميم الداخلي والتنفيذ في الرياض، من فهم الاحتياج والمعاينة والتخطيط حتى المخططات التنفيذية والمتابعة والتسليم.",

  path: "/process"
});

const steps = [
  [
    "01",
    "فهم المشروع والمعاينة",
    "نبدأ بفهم طريقة استخدام المساحة وعدد المستخدمين والخصوصية والأولويات والميزانية، ثم نعاين الموقع عند الحاجة أو نراجع المخططات لتحديد نطاق المشروع بوضوح."
  ],
  [
    "02",
    "تخطيط المساحات",
    "ندرس توزيع الفراغات ومسارات الحركة والأثاث والعلاقات بين المساحات قبل اتخاذ القرارات الجمالية، للوصول إلى تخطيط عملي ومريح."
  ],
  [
    "03",
    "تحديد اتجاه التصميم",
    "نحدد لغة الخامات والألوان والإضاءة والأثاث والهوية البصرية للمشروع، مع مراجعة البدائل حسب الاستخدام والصيانة وطبيعة المكان."
  ],
  [
    "04",
    "تطوير التصميم",
    "نحول الاتجاه المختار إلى تصورات وتفاصيل أوضح تساعد على اتخاذ القرارات، ثم نطور التصميم تدريجيا حتى الوصول إلى الصورة المعتمدة."
  ],
  [
    "05",
    "إعداد المخططات التنفيذية",
    "نجهز مخططات الأرضيات والأسقف والإضاءة والتفاصيل وجداول المواد المطلوبة بما يتناسب مع نطاق المشروع ومرحلة التنفيذ."
  ],
  [
    "06",
    "المتابعة حتى التسليم",
    "نراجع العينات والتفاصيل ونتابع التنسيق مع الأطراف التنفيذية حسب نطاق العمل، بهدف الحفاظ على جودة التنفيذ وقرب النتيجة من التصميم المعتمد."
  ]
];

export default function ProcessPage() {
  return (
    <main className="page-main">

      <PageHero
        eyebrow="طريقة عمل ديكور لاين الرياض"
        title={
          <>
            مراحل التصميم الداخلي
            <br />
            من الفكرة حتى التنفيذ
          </>
        }
        lead="نعمل وفق مراحل واضحة تبدأ بفهم المساحة والاحتياجات، ثم التخطيط والتصميم والتفاصيل التنفيذية، حتى تكون القرارات منظمة من البداية وحتى التسليم."
      />

      <section
        className="section"
        aria-labelledby="process-steps-title"
      >
        <div className="shell">

          <div
            className="section-heading"
            data-reveal
          >
            <p className="eyebrow">
              مراحل المشروع
            </p>

            <h2 id="process-steps-title">
              كيف نعمل على مشروع
              <br />
              التصميم الداخلي؟
            </h2>

            <p className="section-heading__text">
              تختلف تفاصيل كل مشروع حسب المساحة
              ونطاق العمل، لكننا نتبع مسارا واضحا
              يساعد على ترتيب القرارات وتقليل
              التعديلات المتأخرة أثناء التنفيذ.
            </p>
          </div>

          <div className="services-list">

            {steps.map(
              ([number, title, text]) => (
                <article
                  className="service-row"
                  key={number}
                  aria-labelledby={`process-step-${number}`}
                >
                  <span aria-hidden="true">
                    {number}
                  </span>

                  <h3
                    id={`process-step-${number}`}
                  >
                    {title}
                  </h3>

                  <p>
                    {text}
                  </p>

                  <span aria-hidden="true">
                    —
                  </span>
                </article>
              )
            )}

          </div>

        </div>
      </section>

      <section
        className="section-dark section"
        aria-labelledby="process-next-step-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow eyebrow--light">
            الخطوة التالية
          </p>

          <h2 id="process-next-step-title">
            عندك مشروع وتريد
            <br />
            معرفة من أين تبدأ؟
          </h2>

          <div>
            <p
              className="section-heading__text"
              style={{
                color:
                  "rgba(255,255,255,.62)"
              }}
            >
              استعرض خدمات ديكور لاين الرياض لمعرفة
              نطاقات التصميم والتنفيذ المتاحة،
              أو ابدأ بإرسال تفاصيل مشروعك
              والمساحة والمرحلة الحالية.
            </p>

            <Link
              className="text-link text-link--light"
              href="/services"
            >
              استعرض خدماتنا
              <ArrowUpLeft
                size={18}
                aria-hidden="true"
              />
            </Link>

            <Link
              className="text-link text-link--light"
              href="/start-project"
              style={{
                marginTop: 16
              }}
            >
              ابدأ مشروعك
              <ArrowUpLeft
                size={18}
                aria-hidden="true"
              />
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
