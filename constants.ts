
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
export const SITE_DISPLAY_NAME = "ديكور لاين الأحساء";

/**
 * Brand name used for SEO/search-facing content.
 */
export const SITE_SEO_NAME = "ديكور لاين الأحساء";

export const SITE_NAME_EN = "DECOR LINE AL AHSA";

/**
 * Original site contact information preserved by request.
 * Can be overridden with NEXT_PUBLIC_* environment settings.
 */
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_PHONE?.trim() || "0502354855";

export const CONTACT_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "966502354855";

export const CONTACT_WHATSAPP_URL = CONTACT_WHATSAPP
  ? `https://wa.me/${CONTACT_WHATSAPP}` : "/contact";

export const CONTACT_TIKTOK = process.env.NEXT_PUBLIC_TIKTOK?.trim() || "https://www.tiktok.com/@laqeinaha.lak";

/**
 * Default website settings.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: SITE_NAME_EN,

  brandNameAr: SITE_DISPLAY_NAME,

  tagline: "نصمم مساحات ترتقي بتفاصيل الحياة",

  city: "الأحساء",

  // Phone number for direct calls
  phone: CONTACT_PHONE,

  // WhatsApp number in international format
  whatsapp: CONTACT_WHATSAPP,

  address: "الأحساء، المملكة العربية السعودية",

  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM || "",

  // Original TikTok preserved by request; override in production if needed.
  tiktok: CONTACT_TIKTOK,

  snapchat:
    process.env.NEXT_PUBLIC_SNAPCHAT || "",

  businessHours: process.env.NEXT_PUBLIC_BUSINESS_HOURS?.trim() || ""
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
