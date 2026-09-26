import type { SiteSettings } from "./types";

/**
 * Production domain.
 * Never fallback to the old Vercel URL because this value
 * is used by canonical URLs, sitemap and structured data.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://ruqialjamal.com"
).replace(/\/+$/, "");

/**
 * Brand name shown inside the visual UI.
 */
export const SITE_DISPLAY_NAME =
  "رُقِيّ الجمال";

/**
 * Brand name used for SEO/search-facing content.
 */
export const SITE_SEO_NAME =
  "رقي الجمال";

export const SITE_NAME_EN =
  "RUQI AL JAMAL";

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: SITE_NAME_EN,

  // Keep tashkeel here because this is also used
  // throughout the visual identity.
  brandNameAr: SITE_DISPLAY_NAME,

  tagline:
    "نصمم مساحات ترتقي بتفاصيل الحياة",

  city:
    "المدينة المنورة",

  phone:
    process.env.NEXT_PUBLIC_PHONE ||
    "0533654669",

  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP ||
    "966533654669",

  address:
    "المدينة المنورة، المملكة العربية السعودية",

  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM ||
    "",

  tiktok:
    process.env.NEXT_PUBLIC_TIKTOK ||
    "",

  snapchat:
    process.env.NEXT_PUBLIC_SNAPCHAT ||
    "",

  businessHours:
    "السبت–الخميس 09:00–18:00"
};

export const PROJECT_TYPES = {
  residential: "سكني",
  commercial: "تجاري",
  hospitality: "ضيافة",
  office: "مكاتب",
  renovation: "تجديد"
} as const;

export const LEAD_STATUS_LABELS = {
  new: "جديد",
  contacted: "تم التواصل",
  site_visit: "معاينة",
  quotation: "عرض سعر",
  won: "تم التعاقد",
  lost: "مغلق"
} as const;
