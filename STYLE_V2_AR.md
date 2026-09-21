# رقي الجمال — Visual System V2

هذه النسخة تركز فقط على الواجهة والتجربة البصرية. Firebase وCloudflare R2 لم يتم تغييرهما.

## الهوية الجديدة

- Deep Evergreen: `#14221F`
- Night: `#0F1B18`
- Warm Ivory: `#F5F0E7`
- Clay / Terracotta: `#B96448`
- Muted Sage: `#87947F`
- Soft Gold: `#C6A56D`

الهدف الابتعاد عن البيج/الأسود التقليدي في مواقع الديكور، مع بقاء الهوية هادئة وفاخرة.

## اللوجو المبدئي

تم إضافة علامة Vector مبدئية مبنية على فكرة «بوابة / فراغ معماري» مع Wordmark عربي وإنجليزي. هذه العلامة مناسبة للاختبار داخل الموقع والـ favicon والـ Open Graph، لكنها ليست بديلا عن Brand Identity نهائية.

## ما تغير بصريا

- Header أبيض فوق الـ Hero ويتحول إلى Ivory بعد الـ scroll.
- Hero جديد بتدرجات أهدأ، Grain خفيف، Copy أوضح، وتوزيع Editorial.
- Intro band مباشرة بعد الـ Hero لتوضيح نطاق الخدمة.
- Project cards أخف وأهدأ مع hierarchy أوضح.
- Services أصبحت Deep Evergreen بدل الأسود الصريح.
- Process أصبح Clay/Sand بدلا من البيج الرمادي.
- تحسين الـ mobile menu والـ responsive spacing.
- تحسين Typography باستخدام `next/font`.
- تقليل مبالغة الـ smooth scrolling والـ parallax.
- Hero animation أصبح sequence واضح بدلا من reveal متكرر لكل شيء.
- Media reveal أصبح clip reveal خفيف ومحدود.

## ملفات الهوية

- `public/icon.svg`
- `public/icon.png`
- `public/og-cover.svg`
- `public/og-cover.png`
- `src/components/BrandMark.tsx`

## ملاحظة البناء

لم يتمكن `npm install` من الاكتمال داخل بيئة إنشاء الملف بسبب timeout للـ npm registry. المشروع السابق كان يبني بنجاح على Vercel، والتعديلات الحالية Frontend فقط. بعد رفع النسخة شغّل Vercel build أو محليا:

```bash
npm install
npm run typecheck
npm run build
```
