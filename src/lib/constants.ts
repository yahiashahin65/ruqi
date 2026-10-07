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
  "ديكور لاين الرياض";

/**
 * Brand name used for SEO/search-facing content.
 */
export const SITE_SEO_NAME =
  "ديكور لاين الرياض";

export const SITE_NAME_EN =
  "DECOR LINE RIYADH";

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: SITE_NAME_EN,

  // Keep tashkeel here because this is also used
  // throughout the visual identity.
  brandNameAr: SITE_DISPLAY_NAME,

  tagline:
    "نصمم مساحات ترتقي بتفاصيل الحياة",

  city:
    "الرياض",

  phone:
    process.env.NEXT_PUBLIC_PHONE ||
    "0502354855",

  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP ||
    "966502354855",

  address:
    "الرياض، المملكة العربية السعودية",

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
