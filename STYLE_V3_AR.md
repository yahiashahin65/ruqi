# DECOR LINE RIYADH — Style V3

هذه النسخة تحافظ على معمارية المشروع الحالية وتطوّر طبقة الواجهة فقط.

## ما تم تحديثه

- توحيد `globals.css` في Visual System واحد وإزالة تراكب V1/V2.
- تثبيت أوزان الخطوط على الأوزان المحملة فعليا: 300 / 400 / 500 / 600 / 700.
- إلغاء letter-spacing غير المناسب للعربية وفصل نمط الـ labels الإنجليزية في `.eyebrow--latin`.
- تحسين وضوح النصوص الثانوية والـ contrast مع الحفاظ على الهوية الهادئة.
- تحسين الـ Header والـ Mobile Menu وإضافة scroll lock وEscape-to-close ومعالجة الانتقال بين mobile/desktop.
- جعل صورة الـ Hero مرتبطة تلقائيا بأول مشروع مميز مع fallback عند عدم وجود مشاريع.
- تحسين حركة الـ Hero وإضافة parallax خفيف على الصورة في الشاشات الكبيرة فقط.
- الحفاظ على الأنيميشن الهادئ مع دعم `prefers-reduced-motion`.
- تطوير تخطيط المشاريع: Editorial على Desktop، عمودان على Tablet، وعمود واحد على Mobile.
- إصلاح Before/After باستخدام clip-path بدل الاعتماد على `100vw` حتى لا يحدث اختلاف في المحاذاة.
- تحسين Services / Process / Case Study / Style Finder / Riyadh closing sections.
- تحسين الـ responsive للموبايل والتابلت والهيدر والفوتر والخدمات والنماذج والصفحات الداخلية.
- إضافة focus-visible states لتحسين الوصول باستخدام لوحة المفاتيح.

## ملاحظات

- لم يتم تغيير Architecture المشروع أو مسارات Firebase / Firestore / R2.
- ملفات SEO الحالية (`sitemap.ts` و`robots.ts`) تم الحفاظ عليها كما هي.
- عند إضافة صور المشاريع الحقيقية من الـ CMS ستظهر صورة أول مشروع مميز تلقائيا في الـ Hero.
