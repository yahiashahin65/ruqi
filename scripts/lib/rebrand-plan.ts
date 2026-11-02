/**
 * Al Ahsa content migration plan. Pure / deterministic and deliberately does
 * not change IDs, slugs, media URLs, dates, prices, or the publication status.
 * An owner must verify that a real project's claimed city/location is factual.
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
  [/رُقِيّ الجمال|رقي الجمال|رقيّ الجمال/gi, "ديكور لاين الأحساء"],
  [/ديكور لاين الرياض|ديكور لاين المدينة المنورة|ديكور لاين جدة/gi, "ديكور لاين الأحساء"],
  [/RUQI AL JAMAL|Ruqi Al Jamal/gi, "DECOR LINE AL AHSA"],
  [/DECOR LINE (?:RIYADH|MADINAH|MEDINA|JEDDAH)/gi, "DECOR LINE AL AHSA"]
];
// These are city names in copy, never URLs/slugs/image locations. Long patterns first.
const LOCATION_RENAMES: ReadonlyArray<readonly [RegExp, string]> = [
  [/المدينة المنورة|المدينه المنوره|مدينة الرياض|مدينة جدة|مكة المكرمة/gi, "الأحساء"],
  [/الرياض|جدة|جده|الدمام|الخبر|مكة|مكه|المدينة|الطائف|القصيم|تبوك|ينبع/gi, "الأحساء"],
  [/\b(?:Riyadh|Jeddah|Jidda|Medina|Madinah|Makkah|Mecca|Dammam|Khobar|Taif|Tabuk|Yanbu)\b/gi, "Al Ahsa"]
];
const OTHER_CITY = /الرياض|جدة|جده|الدمام|الخبر|مكة|مكه|المدينة المنورة|المدينة|الطائف|القصيم|تبوك|ينبع|Riyadh|Jeddah|Medina|Madinah|Makkah|Mecca|Dammam|Khobar|Taif|Tabuk|Yanbu/i;
const PROJECT_FIELDS = ["title", "subtitle", "excerpt", "story", "scope", "style"] as const;
const SERVICE_FIELDS = ["title", "eyebrow", "excerpt", "body", "deliverables"] as const;
const ARTICLE_FIELDS = ["title", "excerpt", "content", "category"] as const;

export function localizeCopy(value: string): string {
  const branded = BRAND_RENAMES.reduce((text, [pattern, value]) => text.replace(pattern, value), value);
  return LOCATION_RENAMES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), branded);
}

function copyFields(before: CmsDocument, changes: CmsDocument, fields: readonly string[]) {
  for (const field of fields) {
    const current = before[field];
    if (typeof current === "string") {
      const translated = localizeCopy(current);
      if (translated !== current) changes[field] = translated;
    } else if (Array.isArray(current)) {
      const translated = current.map((part) => typeof part === "string" ? localizeCopy(part) : part);
      if (JSON.stringify(current) !== JSON.stringify(translated)) changes[field] = translated;
    }
  }
}

function mediaAlt(before: CmsDocument, changes: CmsDocument, field: "cover" | "before" | "after" | "image" | "gallery") {
  const original = before[field];
  if (Array.isArray(original)) {
    const next = original.map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const media = item as CmsDocument;
      return typeof media.alt === "string" ? { ...media, alt: localizeCopy(media.alt) } : media;
    });
    if (JSON.stringify(original) !== JSON.stringify(next)) changes[field] = next;
  } else if (original && typeof original === "object" && !Array.isArray(original)) {
    const media = original as CmsDocument;
    if (typeof media.alt === "string") {
      const alt = localizeCopy(media.alt);
      if (alt !== media.alt) changes[field] = { ...media, alt };
    }
  }
}

export function createPlan(collection: CollectionName, id: string, before: CmsDocument): PlannedChange {
  const changes: CmsDocument = {};
  const warnings: string[] = [];

  if (collection === "projects") {
    copyFields(before, changes, PROJECT_FIELDS);
    for (const field of ["cover", "gallery", "before", "after"] as const) mediaAlt(before, changes, field);

    const city = typeof before.city === "string" ? before.city.trim() : "";
    if (city !== "الأحساء") {
      changes.city = "الأحساء";
      warnings.push(`PROJECT_LOCATION_REVIEW: originally ${city || "unspecified"}; confirm the actual project location before representing it as a completed Al Ahsa project`);
    }
    // A district in a different city must not appear to be a neighborhood of Al Ahsa.
    const district = typeof before.district === "string" ? before.district.trim() : "";
    if (city !== "الأحساء" && district) {
      changes.district = "";
      warnings.push(`District cleared: '${district}' is not verified as an Al Ahsa neighborhood`);
    } else if (district && OTHER_CITY.test(district)) {
      changes.district = "";
      warnings.push("Old city name was found in district; cleared until reviewed");
    }
    if (OTHER_CITY.test(JSON.stringify(before))) {
      warnings.push("Review project image(s), description, and historical claims: changing text does not relocate a completed physical project");
    }
  }
  if (collection === "services") {
    copyFields(before, changes, SERVICE_FIELDS);
    for (const field of ["image", "gallery"] as const) mediaAlt(before, changes, field);
  }
  if (collection === "articles") {
    copyFields(before, changes, ARTICLE_FIELDS);
    mediaAlt(before, changes, "cover");
    if (OTHER_CITY.test(JSON.stringify(before))) {
      warnings.push("Article discusses another city: review local accuracy rather than merely swapping its name");
    }
  }
  if (collection === "settings" && id === "public") {
    if (before.brandName !== "DECOR LINE AL AHSA") changes.brandName = "DECOR LINE AL AHSA";
    if (before.brandNameAr !== "ديكور لاين الأحساء") changes.brandNameAr = "ديكور لاين الأحساء";
    if (before.city !== "الأحساء") changes.city = "الأحساء";
    if (before.address !== "الأحساء، المملكة العربية السعودية") changes.address = "الأحساء، المملكة العربية السعودية";
    if (typeof before.tagline === "string") {
      const next = localizeCopy(before.tagline);
      if (next !== before.tagline) changes.tagline = next;
    }
    if (before.phone || before.whatsapp || before.instagram || before.snapchat || before.tiktok) {
      warnings.push("Verify business contact / social ownership separately; old contacts are not treated as the new Al Ahsa business");
    }
  }
  return { collection, id, changes, fields: Object.keys(changes), warnings };
}
