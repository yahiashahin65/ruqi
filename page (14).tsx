import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";

import {
  getProjects,
  getServices
} from "@/lib/firebase/data";

import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { serviceWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title:
    "تصميم داخلي للفلل والمجالس في الأحساء",

  description:
    "خدمات تصميم داخلي للفلل والمنازل والمجالس والمشاريع التجارية في الأحساء من ديكور لاين الأحساء، من دراسة المساحة والتصميم حتى التجهيز للتنفيذ.",

  path:
    "/al-ahsa-interior-design"
});

export default async function AlAhsaInteriorDesignPage() {
  const [projects, services] =
    await Promise.all([
      getProjects(),
      getServices()
    ]);

  const pageUrl =
    `${SITE_URL}/al-ahsa-interior-design`;

  const pageSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${pageUrl}#webpage`,

    url:
      pageUrl,

    name:
      "تصميم داخلي للفلل والمجالس في الأحساء",

    description:
      "خدمات تصميم داخلي للفلل والمنازل والمجالس والمشاريع التجارية في الأحساء.",

    inLanguage:
      "ar-SA",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`
    },

    about: {
      "@type":
        "Service",

      name:
        "تصميم داخلي للفلل والمجالس في الأحساء",

      provider: {
        "@id":
          `${SITE_URL}/#business`
      },

      areaServed: {
        "@type":
          "City",

        name:
          "الأحساء"
      }
    }
  };

  return (
    <main className="page-main">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              pageSchema
            )
        }}
      />

      <PageHero
        eyebrow="ديكور لاين الأحساء · خدمات الأحساء"
        title={
          <>
            تصميم داخلي للفلل والمجالس
            <br />
            في الأحساء
          </>
        }
        lead="نساعدك على تطوير مساحة تناسب أسلوب حياتك وطبيعة استخدامها، بداية من دراسة الموقع وتوزيع الفراغات وحتى الخامات والإضاءة والتفاصيل القابلة للتنفيذ."
      />

      {/* Local introduction */}
      <section
        className="content-page"
        aria-labelledby="al-ahsa-service-title"
      >
        <div className="shell content-grid">

          <p className="eyebrow">
            خدمة محلية
          </p>

          <div className="prose">

            <h2 id="al-ahsa-service-title">
              تصميم يناسب المكان وطريقة استخدامه
            </h2>

            <p>
              تعمل ديكور لاين الأحساء على مشاريع التصميم الداخلي
              للفلل والمنازل والمجالس ومساحات الضيافة
              والمشاريع التجارية داخل الأحساء.
              يبدأ العمل بفهم احتياجات أصحاب المشروع
              وطبيعة المساحة والحركة داخلها قبل اتخاذ
              القرارات الجمالية.
            </p>

            <p>
              نهتم بتوزيع الفراغات والإضاءة والخامات
              والألوان والتفاصيل التنفيذية بحيث تكون
              النتيجة مناسبة للاستخدام اليومي وقابلة
              للتنفيذ وليست مجرد تصور بصري.
            </p>

            <p>
              وجود المشروع داخل الأحساء يساعد
              على معاينة الموقع عند الحاجة ومراجعة
              التفاصيل والعينات والتنسيق بشكل أوضح
              خلال مراحل المشروع.
            </p>

          </div>
        </div>
      </section>

      {/* Property / project types */}
      <section
        className="section"
        aria-labelledby="al-ahsa-project-types-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow">
            المساحات التي نعمل عليها
          </p>

          <h2 id="al-ahsa-project-types-title">
            تصميم داخلي لمختلف
            <br />
            أنواع المساحات
          </h2>

          <div>
            <p className="section-heading__text">
              نطور حلول التصميم حسب نوع المشروع ومساحته
              واحتياجات المستخدمين، سواء كان المشروع
              سكنيا أو تجاريا.
            </p>

            <ul className="deliverables">
              <li>
                تصميم داخلي للفلل في الأحساء
              </li>

              <li>
                تصميم المجالس وغرف الضيافة
              </li>

              <li>
                تصميم الشقق والمنازل
              </li>

              <li>
                تصميم العيادات والمكاتب
              </li>

              <li>
                تصميم المقاهي والمتاجر
              </li>

              <li>
                تجديد وتطوير المساحات القائمة
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section
          className="section-dark section"
          aria-labelledby="al-ahsa-services-title"
        >
          <div className="shell">

            <div className="section-heading">

              <p className="eyebrow eyebrow--light">
                خدمات ديكور لاين الأحساء
              </p>

              <h2 id="al-ahsa-services-title">
                خدمات تساعدك
                <br />
                من الفكرة إلى التنفيذ
              </h2>

              <div>
                <p
                  className="section-heading__text"
                  style={{
                    color:
                      "rgba(255,255,255,.62)"
                  }}
                >
                  استكشف الخدمات المتاحة واختر
                  المرحلة المناسبة لاحتياجات مشروعك.
                </p>

                {services.map(
                  (service) => (
                    <Link
                      key={service.slug}
                      className="text-link text-link--light"
                      href={`/services/${service.slug}`}
                      style={{
                        display:
                          "flex",

                        marginTop:
                          14
                      }}
                    >
                      {service.title}
                      <ArrowUpLeft
                        size={16}
                      />
                    </Link>
                  )
                )}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* Selected projects */}
      {projects.length > 0 && (
        <section
          className="selected-work"
          aria-labelledby="al-ahsa-projects-title"
        >
          <div className="shell">

            <div className="selected-work__top">

              <div>
                <p className="eyebrow">
                  مشاريع مختارة
                </p>

                <h2 id="al-ahsa-projects-title">
                  نماذج من أعمالنا
                </h2>
              </div>

              <p>
                مشاريع توضح أسلوبنا في التعامل مع
                المساحة وتوزيع الوظائف والخامات
                والإضاءة والتفاصيل التنفيذية.
              </p>

            </div>

            <div className="projects-editorial">
              {projects
                .slice(0, 3)
                .map(
                  (
                    project,
                    index
                  ) => (
                    <ProjectCard
                      key={
                        project.id
                      }
                      project={
                        project
                      }
                      index={
                        index
                      }
                    />
                  )
                )}
            </div>

            <Link
              className="text-link"
              href="/projects"
            >
              استعرض جميع مشاريعنا
              <ArrowUpLeft
                size={18}
              />
            </Link>

          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="section"
        aria-labelledby="al-ahsa-cta-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow">
            لديك مشروع في الأحساء؟
          </p>

          <h2 id="al-ahsa-cta-title">
            فيلا، مجلس، عيادة،
            <br />
            مقهى أو مساحة تجارية؟
          </h2>

          <div>

            <p className="section-heading__text">
              أرسل لنا نوع المشروع والمساحة
              والمرحلة الحالية، وسنتواصل معك
              لمناقشة احتياجات المشروع والخطوة التالية.
            </p>

            <a
              className="button button--solid"
              href={serviceWhatsapp(
                "مشروع تصميم داخلي في الأحساء"
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ابدأ طلب مشروع تصميم داخلي في الأحساء عبر واتساب"
            >
              ابدأ طلب مشروعك
            </a>

          </div>

        </div>
      </section>

    </main>
  );
}
