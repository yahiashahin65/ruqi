# ديكور لاين الرياض · DECOR LINE RIYADH — Interior Design & Fit-Out · Riyadh

Production-ready Next.js website + CMS for ديكور لاين الرياض, an interior-design, decor and fit-out studio serving Riyadh, Saudi Arabia.

## Stack

- Next.js 16.3.3 App Router + React 19.3 + TypeScript
- Firebase Authentication
- Cloud Firestore
- Firebase Admin SDK
- Cloudflare R2 via S3-compatible API
- Vercel
- GSAP + Lenis
- Dynamic SEO metadata + sitemap + robots + JSON-LD

## Product scope

This is not a landing page. It includes:

- Editorial home page
- Filterable portfolio
- Project case-study pages
- Services and service detail pages
- Studio / process pages
- Journal
- Local Riyadh SEO page
- Privacy template + style-discovery quiz
- Contact
- Multi-step project brief
- Lead CRM
- Project CMS
- Services CMS
- Journal CMS
- R2 media uploads
- Firebase admin sessions with custom claim checks

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

The public website falls back to demo content when Firebase Admin is not configured.

For the complete Arabic configuration guide, read:

`SETUP_AR.md`

For the hardened Firebase + R2 V4 setup, read:

`FIREBASE_R2_SETUP_AR.md`

## Important

Demo images are external Unsplash references for prototyping only. Replace them with original client work before production launch.

## SEO endpoints

Next.js generates these automatically from the App Router metadata files:

- `/sitemap.xml` from `src/app/sitemap.ts`
- `/robots.txt` from `src/app/robots.ts`
- `/manifest.webmanifest` from `src/app/manifest.ts`

Set `NEXT_PUBLIC_SITE_URL` to the final production domain before indexing so canonical URLs and sitemap entries use the correct host.


> Firebase Admin على Vercel يدعم `FIREBASE_PRIVATE_KEY` مباشرة من قيمة `private_key` في ملف Service Account بدون Base64.


## Admin UID (V4.2)
لوحة الاداره تسمح بالدخول للحساب الذي يطابق `ADMIN_UID` في Environment Variables. انشئ المستخدم من Firebase Authentication ثم انسخ UID وضعه في Vercel باسم `ADMIN_UID`. لا تحتاج Custom Claims يدويا.
