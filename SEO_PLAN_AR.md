# SEO Notes — DECOR LINE RIYADH / ديكور لاين الرياض

## Primary intent

The website should win relevance by documenting real interior-design work in Riyadh, not by repeating keywords.

Core topics:

- تصميم داخلي في الرياض
- ديكور في الرياض
- تصميم فلل ومجالس
- تجديد وتشطيب
- تصميم تجاري وعيادات ومقاهي

## Page roles

- `/` establishes brand + selected work.
- `/projects` builds evidence and internal links.
- `/projects/[slug]` targets long-tail project/type/location intent.
- `/services/[slug]` explains service intent.
- `/riyadh-interior-design` is the primary local-service page.
- `/journal` captures informational queries.
- `/start-project` is conversion, not an SEO content page.

## Content rule

A project page should contain enough original information to stand alone:

- location at city/district level only when publishable
- scope
- area
- duration
- design challenge
- design response
- material/lighting decisions
- original photography
- before/after when available

Avoid creating thin pages for every district unless the business genuinely has distinct content and work there.

## Technical

Implemented in code:

- server-rendered public content
- dynamic metadata
- canonical URLs
- sitemap.xml ديناميكي يشمل الصفحات والمشاريع والخدمات والمقالات
- robots.txt يمنع `/admin` و`/api` من الزحف
- noindex على صفحات لوحة الإدارة
- LocalBusiness / ProfessionalService JSON-LD
- Service JSON-LD
- BreadcrumbList JSON-LD
- image alt text
- semantic headings
- project/service/article URL structure
- OpenGraph and social preview

## Production launch

Replace all placeholders before indexing:
- phone
- email
- domain
- Instagram
- demo projects
- demo photos

Then verify:
- Google Search Console
- sitemap indexed
- Rich Results Test
- Lighthouse / Core Web Vitals
- Google Business Profile consistency
