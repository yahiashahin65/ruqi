export function createSlug(value: string) {
  const slug = value
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 110);

  return slug || "item";
}
