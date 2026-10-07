import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { ServiceCard } from "@/components/ServiceCard";
import { StudioStatement } from "@/components/StudioStatement";
import { ProcessStrip } from "@/components/ProcessStrip";
import { BeforeAfter } from "@/components/BeforeAfter";

import {
  getProjects,
  getServices
} from "@/lib/firebase/data";

import {
  SITE_URL
} from "@/lib/constants";

import {
  projectImageAlt
} from "@/lib/auto-seo";

/* =========================================
   HOME METADATA
========================================= */

export const metadata: Metadata = {
  title: {
    absolute:
      "ديكور لاين الرياض | تصميم داخلي وديكور في الرياض"
  },

  description:
    "ديكور لاين الرياض للتصميم الداخلي والديكور في الرياض. تصميم وتنفيذ وتجديد الفلل والمنازل والمجالس والمقاهي والعيادات والمساحات التجارية.",

  alternates: {
    canonical:
      SITE_URL
  },

  openGraph: {
    type:
      "website",

    locale:
      "ar_SA",

    url:
      SITE_URL,

    siteName:
      "ديكور لاين الرياض",

    title:
      "ديكور لاين الرياض | تصميم داخلي وديكور في الرياض",

    description:
      "خدمات التصميم الداخلي والديكور والتنفيذ والتجديد في الرياض للمشاريع السكنية والتجارية.",

    images: [
      {
        url:
          `${SITE_URL}/og-cover.png`,

        width:
          1200,

        height:
          630,

        alt:
          "ديكور لاين الرياض للتصميم الداخلي والديكور في الرياض"
      }
    ]
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "ديكور لاين الرياض | تصميم داخلي وديكور في الرياض",

    description:
      "تصميم داخلي وديكور وتنفيذ وتجديد للمشاريع السكنية والتجارية في الرياض.",

    images: [
      `${SITE_URL}/og-cover.png`
    ]
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1
    }
  }
};

/* =========================================
   HOME SCHEMA
========================================= */

const homePageSchema = {
  "@context":
    "https://schema.org",

  "@type":
    "WebPage",

  "@id":
    `${SITE_URL}/#webpage`,

  url:
    SITE_URL,

  name:
    "ديكور لاين الرياض | تصميم داخلي وديكور في الرياض",

  description:
    "ديكور لاين الرياض للتصميم الداخلي والديكور والتنفيذ والتجديد في الرياض.",

  inLanguage:
    "ar-SA",

  isPartOf: {
    "@type":
      "WebSite",

    "@id":
      `${SITE_URL}/#website`,

    url:
      SITE_URL,

    name:
      "ديكور لاين الرياض",

    alternateName:
      "ديكور لاين الرياض"
  },

  about: {
    "@type":
      "ProfessionalService",

    "@id":
      `${SITE_URL}/#business`,

    name:
      "ديكور لاين الرياض",

    alternateName:
      "ديكور لاين الرياض",

    url:
      SITE_URL,

    areaServed: {
      "@type":
        "City",

      name:
        "الرياض"
    }
  }
};

/* =========================================
   HOME PAGE
========================================= */

export default async function HomePage() {
  const [
    projects,
    services
  ] = await Promise.all([
    getProjects(),
    getServices()
  ]);

  const featured =
    projects
      .filter(
        (project) =>
          project.featured
      )
      .slice(
        0,
        23
      );

  const selectedProjects =
    featured.length
      ? featured
      : projects.slice(
          0,
          23
        );

  const caseStudy =
    projects[0];

  return (
    <main>

      {/* =========================
          STRUCTURED DATA
      ========================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              homePageSchema
            )
        }}
      />

      {/* =========================
          HERO
      ========================== */}

      <Hero
        image={
          selectedProjects[0]?.cover ||
          projects[0]?.cover
        }
      />

      {/* =========================
          INTRO
      ========================== */}

      <section
        className="home-intro-band"
        aria-label="ملخص خدمات ديكور لاين الرياض"
      >
        <div className="shell home-intro-band__grid">

          <div data-reveal>
            <span>
              01
            </span>

            <strong>
              سكني
            </strong>

            <p>
              فلل · شقق · مجالس
            </p>
          </div>

          <div data-reveal>
            <span>
              02
            </span>

            <strong>
              تجاري وضيافة
            </strong>

            <p>
              مقاه · عيادات · متاجر
            </p>
          </div>

          <div data-reveal>
            <span>
              03
            </span>

            <strong>
              تجديد وتنفيذ
            </strong>

            <p>
              من المعاينة حتى التسليم
            </p>
          </div>

          <div
            className="home-intro-band__note"
            data-reveal
          >
            <span>
              نخدم
            </span>

            <strong>
              الرياض
            </strong>
          </div>

        </div>
      </section>

      {/* =========================
          PROJECTS
      ========================== */}

      <section
        className="selected-work"
        id="selected-work"
        aria-labelledby="selected-projects-title"
      >
        <div className="shell">

          <div
            className="selected-work__top"
            data-reveal
          >
            <div>

              <p className="eyebrow">
                أعمال مختارة
              </p>

              <h2 id="selected-projects-title">
                مشاريع تصميم داخلي وتنفيذ مختارة
              </h2>

            </div>

            <p>
              مجموعة من مشاريع التصميم الداخلي والتنفيذ نعرض فيها
              الفكرة والمواد وتوزيع المساحات وكيف تحولت التفاصيل
              إلى تجربة متكاملة تناسب استخدام المكان.
            </p>

          </div>

          <div className="projects-editorial">

            {selectedProjects.map(
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
            شاهد جميع مشاريع التصميم الداخلي

            <ArrowUpLeft
              size={18}
              aria-hidden="true"
            />
          </Link>

        </div>
      </section>

      <StudioStatement />

      {/* =========================
          SERVICES
      ========================== */}

      <section
        className="selected-work"
        id="services"
        aria-labelledby="home-services-title"
      >
        <div className="shell">

          <div
            className="selected-work__top"
            data-reveal
          >
            <div>

              <p className="eyebrow">
                خدماتنا
              </p>

              <h2 id="home-services-title">
                خدمات التصميم الداخلي والتنفيذ
              </h2>

            </div>

            <p>
              نقدم خدمات متكاملة للمشاريع السكنية والتجارية تبدأ
              من دراسة المساحة والتصميم واختيار المواد وحتى التنفيذ
              والتشطيب والتسليم.
            </p>

          </div>

          <div className="projects-editorial">

            {services
              .slice(
                0,
                10
              )
              .map(
                (
                  service,
                  index
                ) => (
                  <ServiceCard
                    key={
                      service.id
                    }
                    service={
                      service
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
            href="/services"
          >
            استكشف جميع خدمات التصميم والتنفيذ

            <ArrowUpLeft
              size={18}
              aria-hidden="true"
            />
          </Link>

        </div>
      </section>

      {/* =========================
          CASE STUDY
      ========================== */}

      {caseStudy && (
        <section
          className="home-case"
          aria-labelledby="home-case-title"
        >
          <div className="shell home-case__grid">

            <div
              className="home-case__copy"
              data-reveal
            >
              <p className="eyebrow">
                دراسة مشروع
              </p>

              <h2 id="home-case-title">
                {caseStudy.title}
              </h2>

              <p>
                {caseStudy.story.slice(
                  0,
                  260
                )}

                {caseStudy.story.length >
                260
                  ? "…"
                  : ""}
              </p>

              <Link
                className="text-link"
                href={`/projects/${caseStudy.slug}`}
                aria-label={`شاهد تفاصيل مشروع ${caseStudy.title}`}
              >
                شاهد تفاصيل المشروع

                <ArrowUpLeft
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div
              className="home-case__media"
              data-reveal-media
            >
              <Image
                src={
                  caseStudy.cover.url
                }
                alt={projectImageAlt(
                  caseStudy,
                  caseStudy.cover
                )}
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
              />
            </div>

          </div>
        </section>
      )}

      {/* =========================
          BEFORE / AFTER
      ========================== */}

      {caseStudy?.before &&
        caseStudy?.after && (
          <section
            className="section"
            aria-labelledby="before-after-title"
          >
            <div className="shell">

              <div className="section-heading">

                <p className="eyebrow">
                  قبل وبعد
                </p>

                <h2 id="before-after-title">
                  كيف تتغير المساحة بعد إعادة التصميم؟
                </h2>

                <p className="section-heading__text">
                  قارن بين الحالة السابقة واتجاه التصميم بعد إعادة
                  توزيع الفراغ واختيار المواد والإضاءة والتفاصيل
                  المناسبة للمكان.
                </p>

              </div>

              <BeforeAfter
                before={
                  caseStudy.before.url
                }
                after={
                  caseStudy.after.url
                }
                title={
                  caseStudy.title
                }
              />

            </div>
          </section>
        )}

      <ProcessStrip />

      {/* =========================
          STYLE FINDER
      ========================== */}

      <section
        className="home-style-finder section-dark section"
        aria-labelledby="style-finder-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow eyebrow--light">
            اكتشف اتجاهك
          </p>

          <h2 id="style-finder-title">
            مش متأكد من
            <br />
            الاتجاه المناسب؟
          </h2>

          <div>

            <p
              className="section-heading__text"
              style={{
                color:
                  "rgba(255,255,255,.62)"
              }}
            >
              اختبار قصير يساعدك على تحديد اتجاه أولي للمواد
              والإضاءة والألوان والشعور العام للمساحة قبل بدء
              مرحلة التصميم.
            </p>

            <Link
              className="text-link text-link--light"
              href="/style-finder"
            >
              ابدأ اختبار اتجاه التصميم

              <ArrowUpLeft
                size={18}
                aria-hidden="true"
              />
            </Link>

          </div>

        </div>
      </section>

      {/* =========================
          LOCAL SEO
      ========================== */}

      <section
        className="home-local section"
        aria-labelledby="home-local-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow">
            الرياض
          </p>

          <h2 id="home-local-title">
            تصميم داخلي وديكور
            <br />
            في الرياض
          </h2>

          <div>

            <p className="section-heading__text">
              تقدم ديكور لاين الرياض خدمات التصميم الداخلي والديكور
              والتجديد والتنفيذ في الرياض للفلل والمنازل
              والمجالس والمقاهي والعيادات والمتاجر والمساحات
              التجارية.
            </p>

            <Link
              className="text-link"
              href="/riyadh-interior-design"
            >
              تصميم داخلي في الرياض

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
