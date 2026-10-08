
import type { SiteSettings } from "./types";

/**
 * Production domain.
 * Used for canonical URLs, sitemap and structured data.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://ruqialjamal.com"
).replace(/\/+$/, "");

/**
 * Brand name shown inside the visual UI.
 */
export const SITE_DISPLAY_NAME = "ديكور لاين الرياض";

/**
 * Brand name used for SEO/search-facing content.
 */
export const SITE_SEO_NAME = "ديكور لاين الرياض";

export const SITE_NAME_EN = "DECOR LINE RIYADH";

/**
 * Official contact information.
 */
export const CONTACT_PHONE = "0502354855";

export const CONTACT_WHATSAPP = "966502354855";

export const CONTACT_WHATSAPP_URL =
  `https://wa.me/${CONTACT_WHATSAPP}`;

export const CONTACT_TIKTOK =
  "https://www.tiktok.com/@laqeinaha.lak";

/**
 * Default website settings.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: SITE_NAME_EN,

  brandNameAr: SITE_DISPLAY_NAME,

  tagline: "نصمم مساحات ترتقي بتفاصيل الحياة",

  city: "الرياض",

  // Phone number for direct calls
  phone: CONTACT_PHONE,

  // WhatsApp number in international format
  whatsapp: CONTACT_WHATSAPP,

  address: "الرياض، المملكة العربية السعودية",

  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM || "",

  // Official TikTok account
  tiktok: CONTACT_TIKTOK,

  snapchat:
    process.env.NEXT_PUBLIC_SNAPCHAT || "",

  businessHours: "السبت–الخميس 09:00–18:00"
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
