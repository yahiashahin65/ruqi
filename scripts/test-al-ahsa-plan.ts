import assert from "node:assert/strict";
import { createPlan, localizeCopy } from "./lib/rebrand-plan";
const project = createPlan("projects", "one", {
  title: "فيلا في الرياض", slug: "villa-in-riyadh", city: "الرياض", district: "العليا", year: 2025,
  story: "تصميم في الرياض - رقي الجمال",
  cover: { url: "https://example.com/a.jpg", alt: "ديكور الرياض" },
  gallery: [{ url: "https://example.com/b.jpg", alt: "غرفة في الرياض" }]
});
assert.equal(project.changes.city, "الأحساء");
assert.equal(project.changes.title, "فيلا في الأحساء");
assert.equal(project.changes.district, "");
assert.equal((project.changes.cover as {alt: string}).alt, "ديكور الأحساء");
assert.equal((project.changes.gallery as Array<{url: string}>)[0].url, "https://example.com/b.jpg");
assert.equal(project.changes.slug, undefined);
assert.equal(project.changes.year, undefined);
const article = createPlan("articles", "a", { title: "دليل الرياض", slug: "my-old-slug", content: "التصميم في الرياض" });
assert.equal(article.changes.title, "دليل الأحساء");
assert.equal(article.changes.slug, undefined);
const settings = createPlan("settings", "public", { brandNameAr: "رقي الجمال", city: "الرياض", address: "عنوان آخر" });
assert.equal(settings.changes.address, "الأحساء، المملكة العربية السعودية");
assert.equal(localizeCopy("DECOR LINE RIYADH"), "DECOR LINE AL AHSA");
console.log("PASS: Al Ahsa localization, projects/articles/services settings and preservation of URLs/media");
