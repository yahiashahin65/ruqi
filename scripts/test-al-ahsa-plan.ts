import assert from "node:assert/strict";
import { createPlan, localizeCopy } from "./lib/rebrand-plan";
const project = createPlan("projects", "one", {
  title: "ترميم فيلا عصرية في المدينة المنورة", slug: "villa-in-madinah", previousSlugs: ["villa-in-riyadh"], city: "المدينة المنورة", district: "العليا", year: 2025,
  story: "تنفيذ في الرياض - رقي الجمال. راجع https://example.com/riyadh وsupport@riyadh.com",
  cover: { url: "https://example.com/riyadh/cover.jpg", alt: "غرفة في الرياض" },
  gallery: [{ url: "https://example.com/b.jpg", key: "riyadh/gallery", alt: "غرفة في الرياض" }],
  details: [{ title: "مشروع المدينة المنورة", info: { description: "رقي الجمال في الرياض", url: "https://example.com/riyadh" } }],
  createdAt: "2025-01-01", status: "published"
});
assert.equal(project.changes.city, "الأحساء");
assert.equal(project.changes.title, "ترميم فيلا عصرية في الأحساء");
assert.equal(project.changes.district, "");
assert.equal((project.changes.cover as {alt:string}).alt, "غرفة في الأحساء");
assert.equal((project.changes.cover as {url:string}).url, "https://example.com/riyadh/cover.jpg");
assert.equal((project.changes.gallery as Array<{key:string}>)[0].key, "riyadh/gallery");
assert.equal((project.changes.details as Array<{info:{url:string}} >)[0].info.url, "https://example.com/riyadh");
assert.equal(project.changes.slug, undefined);
assert.equal(project.changes.previousSlugs, undefined);
assert.equal(project.changes.year, undefined);
assert.equal(project.changes.createdAt, undefined);
assert.equal(project.changes.status, undefined);
assert.ok(String(project.changes.story).includes("https://example.com/riyadh"));
assert.ok(String(project.changes.story).includes("support@riyadh.com"));
const service = createPlan("services", "s", { title:"ديكور لاين الرياض", faq:[{ question:"تشطيب في الرياض؟", answer:"نخدم المدينة المنورة" }], deliverables:["تصميم بالرياض"] });
assert.equal(service.changes.title, "ديكور لاين الأحساء");
assert.equal((service.changes.faq as Array<{question:string}>)[0].question, "تشطيب في الأحساء؟");
const article = createPlan("articles", "a", { title:"دليل الرياض", slug:"my-old-slug", content:"رقي الجمال في الرياض", tags:["الرياض"] });
assert.equal(article.changes.title, "دليل الأحساء");
assert.equal(article.changes.slug, undefined);
const settings = createPlan("settings", "public", {brandNameAr:"رقي الجمال", city:"الرياض", address:"عنوان آخر", whatsapp:"966502354855"});
assert.equal(settings.changes.address, "الأحساء، المملكة العربية السعودية");
assert.equal(settings.changes.whatsapp, undefined);
assert.equal(localizeCopy("DECOR LINE RIYADH"), "DECOR LINE AL AHSA");
assert.equal(localizeCopy("رقي الجمال في المدينة المنورة"), "ديكور لاين الأحساء في الأحساء");
console.log("PASS: full CMS rebrand, nested editorial content, URL/slug/contact preservation, historical-location warnings");
