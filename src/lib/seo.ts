import type { Metadata } from "next";

import {
  DEFAULT_SETTINGS,
  SITE_URL
} from "./constants";

import type {
  Article,
  Project,
  Service
} from "./types";

import {
  articleSeoDescription,
  articleSeoTitle,
  cleanSeoText,
  projectSeoDescription,
  projectSeoTitle,
  serviceSeoDescription,
  serviceSeoTitle,
  stripArabicDiacritics,
  truncateSeoDescription
} from "./auto-seo";

/*
 * Keep this export so any old file importing
 * stripArabicDiacritics from "@/lib/seo"
 * will continue working.
 */
export {
  stripArabicDiacritics
} from "./auto-seo";

const SITE_ORIGIN =
  SITE_URL.replace(/\/+$/, "");

const DEFAULT_SOCIAL_IMAGE =
  `${SITE_ORIGIN}/og-cover.png`;

const SEO_BRAND_AR =
  stripArabicDiacritics(
    DEFAULT_SETTINGS.brandNameAr
  );

/* =========================================
   URL HELPERS
========================================= */

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

/* =========================================
   GENERIC PAGE METADATA
========================================= */

export function pageMetadata(input: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const canonical =
    new URL(
      input.path || "/",
      `${SITE_ORIGIN}/`
    ).toString();

  /*
   * Anything sent to search engines/social metadata
   * is automatically cleaned from Arabic tashkeel.
   */
  const cleanTitle =
    cleanSeoText(
      input.title
    );

  const cleanDescription =
    truncateSeoDescription(
      input.description,
      160
    );

  /*
   * Avoid:
   * ديكور لاين الرياض ... | ديكور لاين الرياض
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
    absoluteUrl(
      input.image
    );

  return {
    title: {
      absolute:
        finalTitle
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

        "max-snippet":
          -1,

        "max-video-preview":
          -1
      }
    },

    openGraph: {
      type:
        "website",

      locale:
        "ar_SA",

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

          width:
            1200,

          height:
            630,

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

/* =========================================
   PROJECT METADATA
   Automatic - no manual SEO fields
========================================= */

export function projectMetadata(
  project: Project
): Metadata {
  return pageMetadata({
    title:
      projectSeoTitle(
        project
      ),

    description:
      projectSeoDescription(
        project
      ),

    path:
      `/projects/${project.slug}`,

    image:
      project.cover.url
  });
}

/* =========================================
   SERVICE METADATA
   Automatic - no manual SEO fields
========================================= */

export function serviceMetadata(
  service: Service
): Metadata {
  return pageMetadata({
    title:
      serviceSeoTitle(
        service
      ),

    description:
      serviceSeoDescription(
        service
      ),

    path:
      `/services/${service.slug}`,

    image:
      service.image.url
  });
}

/* =========================================
   ARTICLE METADATA
   Automatic - no manual SEO fields
========================================= */

export function articleMetadata(
  article: Article
): Metadata {
  return pageMetadata({
    title:
      articleSeoTitle(
        article
      ),

    description:
      articleSeoDescription(
        article
      ),

    path:
      `/journal/${article.slug}`,

    image:
      article.cover.url
  });
}

/* =========================================
   LOCAL BUSINESS SCHEMA
========================================= */

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
      Boolean(
        url?.trim()
      )
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
         * No tashkeel in SEO/schema.
         * The styled name stays only in the visual UI.
         */
        name:
          SEO_BRAND_AR,

        alternateName: [
          DEFAULT_SETTINGS.brandName,
          "ديكور لاين الرياض للتصميم الداخلي والديكور"
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
          "ديكور لاين الرياض للتصميم الداخلي والديكور والتنفيذ والتجديد في الرياض للمشاريع السكنية والتجارية والضيافة.",

        areaServed: {
          "@type":
            "City",

          name:
            "الرياض"
        },

        address: {
          "@type":
            "PostalAddress",

          addressLocality:
            "الرياض",

          addressRegion:
            "الرياض",

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

        alternateName:
          DEFAULT_SETTINGS.brandName,

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

/* =========================================
   SERVICE SCHEMA
========================================= */

export function serviceJsonLd(
  service: Service
) {
  const serviceUrl =
    `${SITE_ORIGIN}/services/${service.slug}`;

  const serviceName =
    cleanSeoText(
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
      serviceSeoDescription(
        service
      ),

    url:
      serviceUrl,

    image:
      absoluteUrl(
        service.image.url
      ),

    provider: {
      "@type":
        "LocalBusiness",

      "@id":
        `${SITE_ORIGIN}/#business`,

      name:
        SEO_BRAND_AR
    },

    areaServed: {
      "@type":
        "City",

      name:
        "الرياض"
    },

    offers: {
      "@type":
        "Offer",

      availability:
        "https://schema.org/InStock",

      priceCurrency:
        "SAR",

      url:
        serviceUrl
    },

    inLanguage:
      "ar-SA"
  };
}

/* =========================================
   PROJECT SCHEMA
========================================= */

export function projectJsonLd(
  project: Project
) {
  const projectUrl =
    `${SITE_ORIGIN}/projects/${project.slug}`;

  const galleryImages =
    project.gallery
      ?.slice(0, 5)
      .map(
        (item) =>
          absoluteUrl(
            item.url
          )
      ) || [];

  return {
    "@context":
      "https://schema.org",

    "@type":
      "CreativeWork",

    "@id":
      `${projectUrl}#project`,

    name:
      cleanSeoText(
        project.title
      ),

    description:
      projectSeoDescription(
        project
      ),

    url:
      projectUrl,

    image: [
      absoluteUrl(
        project.cover.url
      ),
      ...galleryImages
    ],

    creator: {
      "@type": "LocalBusiness",
  "@id":
    `${SITE_ORIGIN}/#business`
    },

    contentLocation: {
      "@type":
        "Place",

      name:
        "الرياض"
    },
    provider: {
  "@type": "LocalBusiness",
  "@id":
    `${SITE_ORIGIN}/#business`
    },

    inLanguage:
      "ar-SA"
  };
}

/* =========================================
   ARTICLE SCHEMA
========================================= */

export function articleJsonLd(
  article: Article
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
      articleSeoTitle(
        article
      ),

    description:
      articleSeoDescription(
        article
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
      "@type": "Organization",
  "@id":
    `${SITE_ORIGIN}/#business`
    },

    publisher: {
      "@type": "Organization",
  "@id":
    `${SITE_ORIGIN}/#business`
    },

    inLanguage:
      "ar-SA"
  };
}

/* =========================================
   BREADCRUMBS SCHEMA
========================================= */

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
            cleanSeoText(
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
