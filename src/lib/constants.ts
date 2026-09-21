import type { SiteSettings } from "./types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ruqi-al-jamal.vercel.app").replace(/\/+$/, "");

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "RUQI AL JAMAL",
  brandNameAr: "رقي الجمال",
  tagline: "نصمم مساحات ترتقي بتفاصيل الحياة",
  city: "المدينة المنورة",
  phone: process.env.NEXT_PUBLIC_PHONE || "+966500000000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "966500000000",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@ruqialjamal.sa",
  address: "المدينة المنورة، المملكة العربية السعودية",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
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
