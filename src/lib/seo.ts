import type { Metadata } from "next";
import { DEFAULT_SETTINGS, SITE_URL } from "./constants";
import type { Project, Service } from "./types";

const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-cover.png`;

export function pageMetadata(input: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const canonical = new URL(input.path || "/", `${SITE_URL}/`).toString();
  const finalTitle = input.title.includes(DEFAULT_SETTINGS.brandNameAr)
    ? input.title
    : `${input.title} | ${DEFAULT_SETTINGS.brandNameAr}`;
  const socialImage = input.image || DEFAULT_SOCIAL_IMAGE;

  return {
    title: { absolute: finalTitle },
    description: input.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: canonical,
      siteName: `${DEFAULT_SETTINGS.brandNameAr} | ${DEFAULT_SETTINGS.brandName}`,
      title: finalTitle,
      description: input.description,
      images: [{ url: socialImage, width: 1200, height: 630, alt: finalTitle }]
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: input.description,
      images: [socialImage]
    }
  };
}

export function projectMetadata(project: Project): Metadata {
  return pageMetadata({
    title: project.title,
    description: project.excerpt,
    path: `/projects/${project.slug}`,
    image: project.cover.url
  });
}

export function serviceMetadata(service: Service): Metadata {
  return pageMetadata({
    title: service.title,
    description: service.excerpt,
    path: `/services/${service.slug}`,
    image: service.image.url
  });
}

export function localBusinessJsonLd() {
  const businessId = `${SITE_URL}/#business`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": businessId,
        name: DEFAULT_SETTINGS.brandNameAr,
        alternateName: [DEFAULT_SETTINGS.brandName, "رقي الجمال للتصميم الداخلي والديكور"],
        url: SITE_URL,
        telephone: DEFAULT_SETTINGS.phone,
        email: DEFAULT_SETTINGS.email,
        image: DEFAULT_SOCIAL_IMAGE,
        logo: `${SITE_URL}/icon.svg`,
        description:
          "رقي الجمال لخدمات التصميم الداخلي والديكور والتنفيذ في المدينة المنورة للمشاريع السكنية والتجارية والضيافة.",
        areaServed: {
          "@type": "City",
          name: "المدينة المنورة"
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "المدينة المنورة",
          addressRegion: "المدينة المنورة",
          addressCountry: "SA"
        },
        sameAs: DEFAULT_SETTINGS.instagram ? [DEFAULT_SETTINGS.instagram] : []
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${DEFAULT_SETTINGS.brandNameAr} | ${DEFAULT_SETTINGS.brandName}`,
        inLanguage: "ar-SA",
        publisher: { "@id": businessId }
      }
    ]
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.excerpt,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name: "المدينة المنورة" },
    url: `${SITE_URL}/services/${service.slug}`
  };
}

export function breadcrumbsJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, `${SITE_URL}/`).toString()
    }))
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: [project.cover.url, ...project.gallery.slice(0, 5).map((item) => item.url)],
    creator: { "@id": `${SITE_URL}/#business` },
    contentLocation: {
      "@type": "Place",
      name: "المدينة المنورة"
    }
  };
}

export function articleJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  cover: { url: string };
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.cover.url],
    datePublished: article.publishedAt,
    mainEntityOfPage: `${SITE_URL}/journal/${article.slug}`,
    author: { "@id": `${SITE_URL}/#business` },
    publisher: { "@id": `${SITE_URL}/#business` }
  };
}
