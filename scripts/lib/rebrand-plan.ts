/**
 * Deterministic CMS rebrand for the existing Firestore project.
 * Never changes slugs, previousSlugs, links, media URLs/keys, document IDs,
 * publication status, dates, contact details, or customer/lead records.
 * Only site-owned editorial text in projects/services/articles/settings is updated.
 */
export type CmsDocument = Record<string, unknown>;
export type CollectionName = "projects" | "services" | "articles" | "settings";
export interface PlannedChange {
  collection: CollectionName;
  id: string;
  changes: CmsDocument;
  fields: string[];
  warnings: string[];
}

const BRAND_RENAMES: ReadonlyArray<readonly [RegExp, string]> = [
  [/رُقِيّ الجمال|رقيّ الجمال|رقي الجمال|رقى الجمال/gi, "ديكور لاين الأحساء"],
  [/ديكور لاين (?:الرياض|المدينة المنورة|المدينه المنوره|جدة|الدمام|الخبر)/gi, "ديكور لاين الأحساء"],
  [/\bRUQI\s+AL\s+JAMAL\b/gi, "DECOR LINE AL AHSA"],
  [/\bDECOR\s+LINE\s+(?:RIYADH|MADINAH|MEDINA|JEDDAH|DAMMAM|KHOBAR)\b/gi, "DECOR LINE AL AHSA"]
];

const LOCATION_RENAMES: ReadonlyArray<readonly [RegExp, string]> = [
  [/المدينة المنورة|المدينه المنوره|مدينة الرياض|مدينة جدة|مكة المكرمة/gi, "الأحساء"],
  [/الرياض|جدة|جده|الدمام|الخبر|مكة|مكه|المدينة|الطائف|القصيم|تبوك|ينبع/gi, "الأحساء"],
  [/\b(?:Riyadh|Jeddah|Jidda|Medina|Madinah|Makkah|Mecca|Dammam|Khobar|Taif|Tabuk|Yanbu)\b/gi, "Al Ahsa"]
];

const OLD_CITY = /الرياض|جدة|جده|الدمام|الخبر|مكة|مكه|المدينة المنورة|المدينه المنوره|المدينة|الطائف|القصيم|تبوك|ينبع|Riyadh|Jeddah|Medina|Madinah|Makkah|Mecca|Dammam|Khobar|Taif|Tabuk|Yanbu/i;

// These fields are all editorial fields rather than structural/operational data.
const TEXT_FIELDS: Record<CollectionName, readonly string[]> = {
  projects: ["title", "subtitle", "excerpt", "story", "scope", "style", "description", "content", "details", "highlights", "features", "locationDescription", "seoTitle", "seoDescription", "metaTitle", "metaDescription", "keywords"],
  services: ["title", "eyebrow", "excerpt", "body", "description", "content", "deliverables", "features", "benefits", "highlights", "faq", "faqs", "seoTitle", "seoDescription", "metaTitle", "metaDescription", "keywords"],
  articles: ["title", "excerpt", "content", "body", "description", "category", "tags", "sections", "seoTitle", "seoDescription", "metaTitle", "metaDescription", "keywords"],
  settings: ["tagline", "description", "about", "aboutText", "heroTitle", "heroDescription", "footerText", "seoTitle", "seoDescription", "metaTitle", "metaDescription", "keywords"]
};
const MEDIA_FIELDS: Record<CollectionName, readonly string[]> = {
  projects: ["cover", "gallery", "before", "after"],
  services: ["image", "gallery", "cover"],
  articles: ["cover", "image", "gallery"],
  settings: []
};

// Never touch a URL or email embedded inside rich text / HTML / markdown.
const LINK_TOKEN = /(?:https?:\/\/|www\.)[^\s<>"']+|[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi;
function textOnly(input: string): string {
  const branded = BRAND_RENAMES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), input);
  return LOCATION_RENAMES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), branded);
}
export function localizeCopy(input: string): string {
  let output = "";
  let cursor = 0;
  for (const match of input.matchAll(LINK_TOKEN)) {
    const index = match.index ?? cursor;
    output += textOnly(input.slice(cursor, index)) + match[0];
    cursor = index + match[0].length;
  }
  return output + textOnly(input.slice(cursor));
}

// Values in these keys must remain exactly as stored, even in nested CMS structures.
const PROTECTED_KEYS = new Set([
  "id", "slug", "previousSlugs", "url", "href", "src", "key", "path", "email", "phone", "whatsapp", "instagram", "snapchat", "tiktok", "youtube", "facebook", "twitter", "linkedin",
  "createdAt", "updatedAt", "publishedAt", "status", "order", "year", "area", "duration", "budget", "price", "type", "width", "height", "lat", "lng", "latitude", "longitude", "coordinates", "geo", "geopoint", "reference", "uid", "authorId", "projectId", "serviceId", "articleId"
]);

function translateValue(value: unknown, key = ""): unknown {
  if (PROTECTED_KEYS.has(key)) return value;
  if (typeof value === "string") return localizeCopy(value);
  if (Array.isArray(value)) return value.map((item) => translateValue(item));
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value as CmsDocument).map(([childKey, childValue]) => [childKey, translateValue(childValue, childKey)]));
  }
  return value;
}
function updateEditorialFields(before: CmsDocument, changes: CmsDocument, fields: readonly string[]) {
  for (const field of fields) {
    if (!(field in before)) continue;
    const current = before[field];
    const translated = translateValue(current, field);
    if (JSON.stringify(current) !== JSON.stringify(translated)) changes[field] = translated;
  }
}
function updateMediaAlt(before: CmsDocument, changes: CmsDocument, field: string) {
  if (!(field in before)) return;
  const current = before[field];
  function walkMedia(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(walkMedia);
    if (!value || typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) return value;
    const media = value as CmsDocument;
    return Object.fromEntries(Object.entries(media).map(([key, entry]) => [
      key, key === "alt" || key === "caption" || key === "title" ? translateValue(entry, key) : entry
    ]));
  }
  const translated = walkMedia(current);
  if (JSON.stringify(current) !== JSON.stringify(translated)) changes[field] = translated;
}
export function createPlan(collection: CollectionName, id: string, before: CmsDocument): PlannedChange {
  const changes: CmsDocument = {};
  const warnings: string[] = [];
  updateEditorialFields(before, changes, TEXT_FIELDS[collection]);
  for (const field of MEDIA_FIELDS[collection]) updateMediaAlt(before, changes, field);

  if (collection === "projects") {
    const city = typeof before.city === "string" ? before.city.trim() : "";
    if (city !== "الأحساء") {
      changes.city = "الأحساء";
      warnings.push(`VERIFY_PROJECT_LOCATION: original city '${city || "unknown"}' — do not claim this is a completed Al Ahsa project without verifying it`);
    }
    const district = typeof before.district === "string" ? before.district.trim() : "";
    if (district && (city !== "الأحساء" || OLD_CITY.test(district))) {
      changes.district = "";
      warnings.push(`District '${district}' cleared: not verified to be in Al Ahsa`);
    }
  }
  if (collection === "articles" && OLD_CITY.test(JSON.stringify(before))) {
    warnings.push("Review article geography, citations and case studies for factual accuracy.");
  }
  if (collection === "settings" && id === "public") {
    if (before.brandName !== "DECOR LINE AL AHSA") changes.brandName = "DECOR LINE AL AHSA";
    if (before.brandNameAr !== "ديكور لاين الأحساء") changes.brandNameAr = "ديكور لاين الأحساء";
    if (before.city !== "الأحساء") changes.city = "الأحساء";
    if (before.address !== "الأحساء، المملكة العربية السعودية") changes.address = "الأحساء، المملكة العربية السعودية";
    warnings.push("Existing phone, WhatsApp and social profiles are kept as-is; confirm they belong to the business.");
  }
  return { collection, id, changes, fields: Object.keys(changes), warnings };
}
