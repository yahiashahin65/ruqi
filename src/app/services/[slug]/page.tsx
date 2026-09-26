import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/PageHero";
import { getServiceBySlug } from "@/lib/firebase/data";
import {
  breadcrumbsJsonLd,
  serviceJsonLd,
  serviceMetadata
} from "@/lib/seo";
import { serviceWhatsapp } from "@/lib/whatsapp";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const service = await getServiceBySlug(slug);

  return service
    ? serviceMetadata(service)
    : {};
}

export default async function ServicePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceTitle =
    service.title.includes("المدينة المنورة")
      ? service.title
      : `${service.title} في المدينة المنورة`;

  const crumbs = breadcrumbsJsonLd([
    {
      name: "الرئيسية",
      path: "/"
    },
    {
      name: "الخدمات",
      path: "/services"
    },
    {
      name: service.title,
      path: `/services/${service.slug}`
    }
  ]);

  const bodyParagraphs = service.body
    ?.split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="page-main">

      <PageHero
        eyebrow="خدمات رُقِيّ الجمال"
        title={serviceTitle}
        lead={service.excerpt}
      />

      {/* Main Service Image */}
      <section
        className="shell service-detail__image"
        aria-label={`صورة توضيحية لخدمة ${service.title}`}
      >
        <Image
          src={service.image.url}
          alt={
            service.image.alt ||
            `${service.title} في المدينة المنورة - رقي الجمال`
          }
          fill
          priority
          sizes="100vw"
        />
      </section>

      {/* Service Gallery */}
      {service.gallery &&
        service.gallery.length > 0 && (
          <section
            className="shell service-gallery"
            aria-label={`صور خدمة ${service.title}`}
          >
            {service.gallery.map(
              (image, index) => (
                <div
                  className="service-gallery__item"
                  key={`${image.url}-${index}`}
                  data-reveal
                >
                  <Image
                    src={image.url}
                    alt={
                      image.alt ||
                      `${service.title} في المدينة المنورة - صورة ${index + 1}`
                    }
                    fill
                    sizes="(max-width: 900px) 100vw, 70vw"
                  />
                </div>
              )
            )}
          </section>
        )}

      <section
        className="content-page"
        aria-labelledby="service-details-title"
      >
        <div className="shell content-grid">

          <p className="eyebrow">
            تفاصيل الخدمة
          </p>

          <div className="prose">

            <h2 id="service-details-title">
              عن خدمة {service.title}
            </h2>

            {bodyParagraphs?.length ? (
              bodyParagraphs.map(
                (paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                )
              )
            ) : (
              <p>
                {service.excerpt}
              </p>
            )}

            {service.deliverables &&
              service.deliverables.length > 0 && (
                <section
                  aria-labelledby="service-deliverables-title"
                >
                  <h2 id="service-deliverables-title">
                    ماذا تشمل خدمة {service.title}؟
                  </h2>

                  <ul className="deliverables">
                    {service.deliverables.map(
                      (item) => (
                        <li key={item}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </section>
              )}

            <section
              aria-labelledby="service-location-title"
            >
              <h2 id="service-location-title">
                {service.title} في المدينة المنورة
              </h2>

              <p>
                تقدم رُقِيّ الجمال هذه الخدمة داخل المدينة
                المنورة للمشاريع السكنية والتجارية، مع دراسة
                احتياجات كل مساحة واختيار الحلول المناسبة
                للتصميم والتنفيذ وطبيعة الاستخدام.
              </p>
            </section>

            <div className="service-actions">
              <a
                className="button button--whatsapp"
                href={serviceWhatsapp(service.title)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`اطلب خدمة ${service.title} عبر واتساب`}
              >
                اطلب خدمة {service.title}
              </a>

              <Link
                className="button button--back-service"
                href="/services"
              >
                استعرض جميع الخدمات
              </Link>
            </div>

          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd(service)
          )
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(crumbs)
        }}
      />

    </main>
  );
}
