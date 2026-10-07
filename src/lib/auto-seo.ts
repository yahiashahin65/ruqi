import {
  PROJECT_TYPES
} from "./constants";

import type {
  Article,
  Project,
  Service
} from "./types";

/* =========================================
   BASIC TEXT HELPERS
========================================= */

export function stripArabicDiacritics(
  value = ""
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

export function cleanSeoText(
  value = ""
) {
  return stripArabicDiacritics(
    value
  )
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateSeoDescription(
  value: string,
  maxLength = 155
) {
  const text =
    cleanSeoText(value);

  if (
    text.length <= maxLength
  ) {
    return text;
  }

  const sliced =
    text.slice(
      0,
      maxLength - 1
    );

  const lastSpace =
    sliced.lastIndexOf(" ");

  return `${
    lastSpace > 80
      ? sliced.slice(
          0,
          lastSpace
        )
      : sliced
  }…`;
}

/* =========================================
   BAD / OLD IMAGE ALT DETECTION
========================================= */

export function isBadImageAlt(
  value?: string | null
) {
  if (!value) {
    return true;
  }

  const text =
    value.trim();

  if (!text) {
    return true;
  }

  /*
   * Example:
   * 1000248950.jpg
   * IMG_2388.jpeg
   * screenshot.png
   */
  if (
    /\.(jpe?g|png|webp|avif|gif)$/i.test(
      text
    )
  ) {
    return true;
  }

  /*
   * Pure numbers.
   */
  if (/^\d+$/.test(text)) {
    return true;
  }

  /*
   * Common camera/file names.
   */
  if (
    /^(img|image|dsc|photo|pic|screenshot|whatsapp)[-_ ]?\d*/i.test(
      text
    )
  ) {
    return true;
  }

  /*
   * Long machine-generated IDs.
   */
  if (
    /^[a-f0-9_-]{18,}$/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

function useExistingAlt(
  value?: string | null
) {
  return !isBadImageAlt(value)
    ? cleanSeoText(value!)
    : null;
}

/* =========================================
   PROJECT SEO
========================================= */

export function getProjectTypeLabel(
  project: Project
) {
  return (
    PROJECT_TYPES[
      project.type
    ] ||
    "تصميم داخلي"
  );
}

export function projectSeoTitle(
  project: Project
) {
  const type =
    getProjectTypeLabel(
      project
    );

  return cleanSeoText(
    `${project.title} | ${type} في الرياض`
  );
}

export function projectSeoDescription(
  project: Project
) {
  return truncateSeoDescription(
    `${project.excerpt} استعرض تفاصيل مشروع ${project.title} من ديكور لاين الرياض للمشاريع داخل الرياض.`
  );
}

export function projectImageAlt(
  project: Project,
  image?: {
    alt?: string;
  },
  index?: number
) {
  const existing =
    useExistingAlt(
      image?.alt
    );

  if (existing) {
    return existing;
  }

  const type =
    getProjectTypeLabel(
      project
    );

  return cleanSeoText(
    `مشروع ${project.title} - ${type} في الرياض${
      typeof index === "number"
        ? ` - صورة ${index + 1}`
        : ""
    }`
  );
}

/* =========================================
   SERVICE SEO
========================================= */

export function serviceSeoTitle(
  service: Service
) {
  const title =
    service.title.includes(
      "الرياض"
    )
      ? service.title
      : `${service.title} في الرياض`;

  return cleanSeoText(
    title
  );
}

export function serviceSeoDescription(
  service: Service
) {
  return truncateSeoDescription(
    `${service.excerpt} تعرف على خدمة ${service.title} من ديكور لاين الرياض للمشاريع السكنية والتجارية في الرياض.`
  );
}

export function serviceImageAlt(
  service: Service,
  image?: {
    alt?: string;
  },
  index?: number
) {
  const existing =
    useExistingAlt(
      image?.alt
    );

  if (existing) {
    return existing;
  }

  return cleanSeoText(
    `${service.title} في الرياض - ديكور لاين الرياض${
      typeof index === "number"
        ? ` - صورة ${index + 1}`
        : ""
    }`
  );
}

/* =========================================
   ARTICLE SEO
========================================= */

export function articleSeoTitle(
  article: Article
) {
  return cleanSeoText(
    article.title
  );
}

export function articleSeoDescription(
  article: Article
) {
  return truncateSeoDescription(
    article.excerpt
  );
}

export function articleImageAlt(
  article: Article,
  image?: {
    alt?: string;
  }
) {
  const existing =
    useExistingAlt(
      image?.alt
    );

  if (existing) {
    return existing;
  }

  return cleanSeoText(
    `${article.title} - مجلة ديكور لاين الرياض`
  );
}

/* =========================================
   FUTURE IMAGE FILE NAMES
========================================= */

export function slugifyFileName(
  value: string
) {
  return cleanSeoText(value)
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}]+/gu,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

function getExtension(
  originalName: string
) {
  const extension =
    originalName
      .split(".")
      .pop()
      ?.toLowerCase();

  if (
    extension &&
    /^[a-z0-9]+$/.test(
      extension
    )
  ) {
    return extension;
  }

  return "jpg";
}

export function createUploadFileName({
  title,
  originalName,
  index
}: {
  title: string;
  originalName: string;
  index?: number;
}) {
  const base =
    slugifyFileName(title) ||
    "decor-line-riyadh";

  const extension =
    getExtension(
      originalName
    );

  const suffix =
    typeof index === "number"
      ? `-${index + 1}`
      : "";

  return `${base}${suffix}-${Date.now()}.${extension}`;
}
