import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";

const SITE_URL = "https://ruqialjamal.com";

export const metadata: Metadata = pageMetadata({
  title:
    "خدمات التصميم الداخلي والديكور في المدينة المنورة",

  description:
    "تعرف على خدمات رقي الجمال في التصميم الداخلي والديكور والتنفيذ والتشطيب والتجديد للمنازل والفلل والمجالس والمشاريع التجارية في المدينة المنورة.",

  path: "/services"
});

export default async function ServicesPage() {
  const services = await getServices();

  const servicesUrl = `${SITE_URL}/services`;

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${servicesUrl}#webpage`,

    url: servicesUrl,

    name:
      "خدمات التصميم الداخلي والديكور في المدينة المنورة",

    description:
      "خدمات التصميم الداخلي والديكور والتنفيذ والتشطيب والتجديد في المدينة المنورة.",

    inLanguage: "ar-SA",

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "رقي الجمال"
    },

    about: {
      "@type": "ProfessionalService",
      name: "رقي الجمال",

      areaServed: {
        "@type": "City",
        name: "المدينة المنورة"
      }
    },

    mainEntity: {
      "@type": "ItemList",

      numberOfItems: services.length,

      itemListElement: services.map(
        (service, index) => ({
          "@type": "ListItem",

          position: index + 1,

          name: service.title,

          url: `${SITE_URL}/services/${service.slug}`
        })
      )
    }
  };

  return (
    <main className="page-main">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema)
        }}
      />

      <PageHero
        eyebrow="خدمات رُقِيّ الجمال"
        title={
          <>
            خدمات التصميم الداخلي والديكور
            <br />
            في المدينة المنورة
          </>
        }
        lead="نقدم خدمات متكاملة للتصميم الداخلي والديكور والتنفيذ والتشطيب والتجديد للمساحات السكنية والتجارية، من دراسة المساحة والفكرة وحتى التنفيذ والتسليم."
      />

      <section
        className="section"
        aria-labelledby="services-list-title"
      >
        <div className="shell">

          <div
            className="section-heading"
            data-reveal
          >
            <p className="eyebrow">
              حلول متكاملة
            </p>

            <h2 id="services-list-title">
              اختر الخدمة المناسبة لمشروعك
            </h2>

            <p className="section-heading__text">
              نعمل على الفلل والمنازل والمجالس
              والمساحات التجارية في المدينة المنورة،
              مع حلول تناسب احتياجات كل مساحة
              ومرحلة من مراحل المشروع.
            </p>
          </div>

          <div className="projects-editorial">
            {services.map(
              (service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              )
            )}

            {!services.length && (
              <p className="empty-state">
                سيتم إضافة الخدمات قريبا.
              </p>
            )}
          </div>

        </div>
      </section>

    </main>
  );
}
