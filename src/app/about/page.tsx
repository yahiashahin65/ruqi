import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { projectWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title:
    "عن ديكور لاين الرياض للتصميم الداخلي والديكور في الرياض",

  description:
    "تعرف على ديكور لاين الرياض للتصميم الداخلي والديكور والتنفيذ في الرياض، ونهجنا في تصميم المساحات السكنية والتجارية بما يجمع بين الجمال والوظيفة وجودة التفاصيل.",

  path: "/about"
});

const aboutUrl = `${SITE_URL}/about`;

const aboutSchema = {
  "@context": "https://schema.org",

  "@type": "AboutPage",

  "@id": `${aboutUrl}#webpage`,

  url: aboutUrl,

  name:
    "عن ديكور لاين الرياض للتصميم الداخلي والديكور في الرياض",

  description:
    "تعرف على ديكور لاين الرياض ونهجها في التصميم الداخلي والديكور والتنفيذ للمشاريع السكنية والتجارية في الرياض.",

  inLanguage: "ar-SA",

  isPartOf: {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`
  },

  about: {
    "@id": `${SITE_URL}/#business`
  }
};

export default function AboutPage() {
  return (
    <main className="page-main">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema)
        }}
      />

      <PageHero
        eyebrow="من نحن"
        title={
          <>
            ديكور لاين الرياض للتصميم الداخلي
            <br />
            والديكور في الرياض
          </>
        }
        lead="نصمم المساحات السكنية والتجارية انطلاقا من احتياجات المستخدم وطبيعة المكان، للوصول إلى تجربة تجمع بين الجمال والراحة والوظيفة وقابلية التنفيذ."
      />

      <section
        className="section"
        aria-labelledby="about-philosophy-title"
      >
        <div className="shell">
          <div
            className="prose"
            data-reveal
            style={{
              maxWidth: "900px"
            }}
          >
            <p className="eyebrow">
              فلسفتنا
            </p>

            <h2 id="about-philosophy-title">
              التصميم الجيد يبدأ من فهم المكان
              قبل اختيار شكله
            </h2>

            <p>
              في ديكور لاين الرياض نرى أن التصميم الداخلي
              الناجح لا يعتمد على المظهر وحده، بل يبدأ
              بفهم المساحة وطريقة استخدامها واحتياجات
              الأشخاص الذين يعيشون أو يعملون فيها.
            </p>

            <p>
              لذلك نوازن بين توزيع الفراغات والإضاءة
              والخامات والألوان والأثاث والتفاصيل
              التنفيذية، حتى تكون النتيجة جميلة بصريا
              وعملية ومريحة في الاستخدام اليومي.
            </p>

            <p>
              نقدم خدمات التصميم الداخلي والديكور
              والتنفيذ والتجديد في الرياض
              للفلل والمنازل والمجالس والعيادات
              والمقاهي والمتاجر والمكاتب والمساحات
              التجارية، مع اختلاف نطاق العمل حسب
              احتياجات كل مشروع.
            </p>

            <div className="service-actions">
              <Link
                className="button button--solid"
                href="/services"
              >
                استعرض خدماتنا
                <ArrowUpLeft
                  size={18}
                  aria-hidden="true"
                />
              </Link>

              <Link
                className="button button--back-service"
                href="/projects"
              >
                شاهد مشاريعنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-dark section"
        aria-labelledby="about-principles-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow eyebrow--light">
            مبادئنا
          </p>

          <h2 id="about-principles-title">
            الوظيفة قبل الاستعراض.
            <br />
            الهوية قبل التقليد.
            <br />
            الجودة حتى آخر تفصيلة.
          </h2>

          <div>
            <p
              className="section-heading__text"
              style={{
                color:
                  "rgba(255,255,255,.62)"
              }}
            >
              نبحث في كل مشروع عن الحل الذي يناسب
              المساحة وأصحابها، مع اهتمام بتوزيع
              الفراغات والخامات والإضاءة وجودة
              التنفيذ، بعيدا عن الحلول المكررة
              أو الاتجاهات المؤقتة.
            </p>
          </div>

        </div>
      </section>

      <section
        className="section"
        aria-labelledby="about-project-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow">
            مشروعك القادم
          </p>

          <h2 id="about-project-title">
            عندك مساحة تحتاج
            <br />
            رؤية أوضح؟
          </h2>

          <div>
            <p className="section-heading__text">
              شاركنا نوع المشروع والمساحة والمرحلة
              الحالية، وسنتواصل معك لفهم الاحتياج
              ومناقشة الخطوة التالية.
            </p>

            <a
              className="button button--solid"
              href={projectWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ناقش مشروعك مع ديكور لاين الرياض عبر واتساب"
            >
              ناقش مشروعك
            </a>
          </div>

        </div>
      </section>

    </main>
  );
}
