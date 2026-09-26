import type { Metadata } from "next";

import {
  DEFAULT_SETTINGS,
  SITE_URL
} from "./constants";

import type {
  Project,
  Service
} from "./types";

const SITE_ORIGIN =
  SITE_URL.replace(/\/+$/, "");

const DEFAULT_SOCIAL_IMAGE =
  `${SITE_ORIGIN}/og-cover.png`;

type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
};

/**
 * Removes Arabic diacritics/tashkeel from SEO-facing text.
 *
 * Example:
 * رُقِيّ الجمال -> رقي الجمال
 *
 * UI components can continue using the fully styled/diacritized name.
 */
export function stripArabicDiacritics(
  value: string
) {
  return value
    .normalize("NFC")
    .replace(
      /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g,
      ""
    )
    .replace(/\u0640/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const SEO_BRAND_AR =
  stripArabicDiacritics(
    DEFAULT_SETTINGS.brandNameAr
  );

function absoluteUrl(
  value?: string
) {
  if (!value) {
    return DEFAULT_SOCIAL_IMAGE;
  }

  try {
    return new URL(
      value,
      `${SITE_ORIGIN}/`
    ).toString();
  } catch {
    return DEFAULT_SOCIAL_IMAGE;
  }
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const canonical = new URL(
    input.path || "/",
    `${SITE_ORIGIN}/`
  ).toString();

  /*
   * Everything that goes to search/social metadata
   * is normalized without Arabic tashkeel.
   */
  const cleanTitle =
    stripArabicDiacritics(
      input.title
    );

  const cleanDescription =
    stripArabicDiacritics(
      input.description
    );

  /*
   * Prevent:
   * "رقي الجمال ... | رُقِيّ الجمال"
   *
   * Both forms are normalized before checking.
   */
  const containsBrand =
    cleanTitle.includes(
      SEO_BRAND_AR
    );

  const finalTitle =
    containsBrand
      ? cleanTitle
      : `${cleanTitle} | ${SEO_BRAND_AR}`;

  const socialImage =
    absoluteUrl(input.image);

  return {
    title: {
      absolute: finalTitle
    },

    description:
      cleanDescription,

    alternates: {
      canonical
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview":
          "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },

    openGraph: {
      type: "website",

      locale: "ar_SA",

      url:
        canonical,

      siteName:
        SEO_BRAND_AR,

      title:
        finalTitle,

      description:
        cleanDescription,

      images: [
        {
          url:
            socialImage,

          width: 1200,
          height: 630,

          alt:
            finalTitle
        }
      ]
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        finalTitle,

      description:
        cleanDescription,

      images: [
        socialImage
      ]
    }
  };
}

/* ================================
   PROJECT METADATA
================================ */

export function projectMetadata(
  project: Project
): Metadata {
  const seo =
    project as Project &
      SeoFields;

  return pageMetadata({
    title:
      seo.seoTitle?.trim() ||
      project.title,

    description:
      seo.seoDescription?.trim() ||
      project.excerpt,

    path:
      `/projects/${project.slug}`,

    image:
      project.cover.url
  });
}

/* ================================
   SERVICE METADATA
================================ */

export function serviceMetadata(
  service: Service
): Metadata {
  const seo =
    service as Service &
      SeoFields;

  const defaultTitle =
    service.title.includes(
      "المدينة المنورة"
    )
      ? service.title
      : `${service.title} في المدينة المنورة`;

  const defaultDescription =
    `${service.excerpt} خدمة مقدمة من رقي الجمال في المدينة المنورة للمشاريع السكنية والتجارية.`;

  return pageMetadata({
    /*
     * Admin SEO fields have priority.
     *
     * If empty:
     * "التصميم الداخلي"
     * becomes:
     * "التصميم الداخلي في المدينة المنورة"
     */
    title:
      seo.seoTitle?.trim() ||
      defaultTitle,

    description:
      seo.seoDescription?.trim() ||
      defaultDescription,

    path:
      `/services/${service.slug}`,

    image:
      service.image.url
  });
}

/* ================================
   LOCAL BUSINESS
================================ */

export function localBusinessJsonLd() {
  const businessId =
    `${SITE_ORIGIN}/#business`;

  const websiteId =
    `${SITE_ORIGIN}/#website`;

  const socialLinks = [
    DEFAULT_SETTINGS.instagram,
    DEFAULT_SETTINGS.tiktok,
    DEFAULT_SETTINGS.snapchat
  ].filter(
    (url): url is string =>
      Boolean(url)
  );

  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type": [
          "LocalBusiness",
          "ProfessionalService"
        ],

        "@id":
          businessId,

        /*
         * Schema/search version:
         * بدون تشكيل
         */
        name:
          SEO_BRAND_AR,

        /*
         * Keep alternative brand spellings here.
         * The shaped form may still be included
         * as an alternate identity.
         */
        alternateName: [
          DEFAULT_SETTINGS.brandNameAr,
          DEFAULT_SETTINGS.brandName,
          "رقي الجمال للتصميم الداخلي والديكور"
        ].filter(Boolean),

        url:
          SITE_ORIGIN,

        telephone:
          DEFAULT_SETTINGS.phone,

        image:
          DEFAULT_SOCIAL_IMAGE,

        logo:
          `${SITE_ORIGIN}/icon.svg`,

        description:
          "رقي الجمال للتصميم الداخلي والديكور والتنفيذ والتجديد في المدينة المنورة للمشاريع السكنية والتجارية والضيافة.",

        areaServed: {
          "@type":
            "City",

          name:
            "المدينة المنورة"
        },

        address: {
          "@type":
            "PostalAddress",

          addressLocality:
            "المدينة المنورة",

          addressRegion:
            "المدينة المنورة",

          addressCountry:
            "SA"
        },

        sameAs:
          socialLinks
      },

      {
        "@type":
          "WebSite",

        "@id":
          websiteId,

        url:
          SITE_ORIGIN,

        name:
          SEO_BRAND_AR,

        alternateName: [
          DEFAULT_SETTINGS.brandNameAr,
          DEFAULT_SETTINGS.brandName
        ].filter(Boolean),

        inLanguage:
          "ar-SA",

        publisher: {
          "@id":
            businessId
        }
      }
    ]
  };
}

/* ================================
   SERVICE SCHEMA
================================ */

export function serviceJsonLd(
  service: Service
) {
  const serviceUrl =
    `${SITE_ORIGIN}/services/${service.slug}`;

  const serviceName =
    stripArabicDiacritics(
      service.title
    );

  return {
    "@context":
      "https://schema.org",

    "@type":
      "Service",

    "@id":
      `${serviceUrl}#service`,

    name:
      serviceName,

    serviceType:
      serviceName,

    description:
      stripArabicDiacritics(
        service.excerpt
      ),

    url:
      serviceUrl,

    image:
      absoluteUrl(
        service.image.url
      ),

    provider: {
      "@id":
        `${SITE_ORIGIN}/#business`
    },

    areaServed: {
      "@type":
        "City",

      name:
        "المدينة المنورة"
    },

    availableChannel: {
      "@type":
        "ServiceChannel",

      serviceUrl:
        serviceUrl
    }
  };
}

/* ================================
   BREADCRUMBS
================================ */

export function breadcrumbsJsonLd(
  items: Array<{
    name: string;
    path: string;
  }>
) {
  return {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:
      items.map(
        (
          item,
          index
        ) => ({
          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            stripArabicDiacritics(
              item.name
            ),

          item:
            new URL(
              item.path,
              `${SITE_ORIGIN}/`
            ).toString()
        })
      )
  };
}

/* ================================
   PROJECT SCHEMA
================================ */

export function projectJsonLd(
  project: Project
) {
  const projectUrl =
    `${SITE_ORIGIN}/projects/${project.slug}`;

  return {
    "@context":
      "https://schema.org",

    "@type":
      "CreativeWork",

    "@id":
      `${projectUrl}#project`,

    name:
      stripArabicDiacritics(
        project.title
      ),

    description:
      stripArabicDiacritics(
        project.excerpt
      ),

    url:
      projectUrl,

    image: [
      project.cover.url,

      ...project.gallery
        .slice(0, 5)
        .map(
          (item) =>
            item.url
        )
    ],

    creator: {
      "@id":
        `${SITE_ORIGIN}/#business`
    },

    contentLocation: {
      "@type":
        "Place",

      name:
        "المدينة المنورة"
    },

    inLanguage:
      "ar-SA"
  };
}

/* ================================
   ARTICLE SCHEMA
================================ */

export function articleJsonLd(
  article: {
    title: string;
    excerpt: string;
    slug: string;

    cover: {
      url: string;
    };

    publishedAt: string;
  }
) {
  const articleUrl =
    `${SITE_ORIGIN}/journal/${article.slug}`;

  return {
    "@context":
      "https://schema.org",

    "@type":
      "Article",

    "@id":
      `${articleUrl}#article`,

    headline:
      stripArabicDiacritics(
        article.title
      ),

    description:
      stripArabicDiacritics(
        article.excerpt
      ),

    image: [
      absoluteUrl(
        article.cover.url
      )
    ],

    datePublished:
      article.publishedAt,

    mainEntityOfPage: {
      "@type":
        "WebPage",

      "@id":
        articleUrl
    },

    author: {
      "@id":
        `${SITE_ORIGIN}/#business`
    },

    publisher: {
      "@id":
        `${SITE_ORIGIN}/#business`
    },

    inLanguage:
      "ar-SA"
  };
}
