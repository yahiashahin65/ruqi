# دليل تشغيل وربط مشروع ديكور لاين الرياض DECOR LINE RIYADH

هذا الملف يشرح تجهيز المشروع للعمل على:

- GitHub: حفظ الكود والإصدارات
- Vercel: استضافة Next.js والـ API Routes
- Firebase Authentication: دخول لوحة الإدارة
- Cloud Firestore: المشاريع والخدمات والمقالات والطلبات والإعدادات
- Cloudflare R2: الصور والمخططات وملفات العملاء
- Cloudflare Turnstile: حماية نموذج طلب المشروع اختياريا

> المشروع يعمل ببيانات Demo حتى قبل ربط Firebase، لذلك يمكنك رفعه إلى Vercel ورؤية الواجهة فورا. الإدارة والحفظ الفعلي ورفع الملفات يحتاجون إعداد الخدمات أدناه.

---

## 1) التشغيل المحلي

المتطلبات:

- Node.js 22 أو أحدث (Next.js 16 يتطلب Node 20.9+؛ Node 22 مناسب)
- npm
- حساب Firebase
- حساب Cloudflare عند استخدام R2

```bash
npm install
cp .env.example .env.local
npm run dev
```

افتح:

```text
http://localhost:3000
```

لوحة الإدارة:

```text
http://localhost:3000/admin/login
```

---

## 2) إنشاء Firebase Project

من Firebase Console:

1. Create project
2. Project settings
3. General
4. أضف Web App
5. انسخ Firebase config إلى `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

هذه القيم تستخدم في المتصفح لتسجيل دخول الإدارة. وجود `apiKey` هنا طبيعي في Firebase؛ الحماية الحقيقية تعتمد على Authentication والقواعد وصلاحيات السيرفر.

---

## 3) تفعيل Firebase Authentication

من:

```text
Firebase Console
→ Authentication
→ Sign-in method
→ Email/Password
→ Enable
```

المشروع لا يعتبر أي مستخدم Firebase مديراً تلقائيا. يجب أن يحمل المستخدم Custom Claim:

```json
{
  "admin": true
}
```

سكريبت `npm run seed` ينشئ حساب الإدارة ويضيف الـ claim تلقائيا.

---

## 4) تفعيل Cloud Firestore

من:

```text
Firebase Console
→ Firestore Database
→ Create database
```

اختر المنطقة الأقرب لمستخدميك قدر الإمكان.

الـ Collections الأساسية:

```text
projects
services
articles
leads
settings
testimonials
```

البيانات العامة يقرأها Next.js Server Side باستخدام Firebase Admin SDK.

### قواعد Firestore

الملف موجود:

```text
firestore.rules
```

الفكرة الأمنية هنا:

- المحتوى المنشور Public Read فقط عند القراءة المباشرة من Firestore
- لا يوجد Client Write مباشر
- كل عمليات الإدارة تمر من Next.js API
- Firebase Admin SDK هو المسؤول عن الكتابة
- Admin routes تتطلب Session Cookie ناتجة عن مستخدم عليه `admin: true`

لتطبيق القواعد يمكنك استخدام Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore
```

أو انسخ `firestore.rules` يدويا من Firebase Console.

---

## 5) Service Account لـ Firebase Admin

من:

```text
Firebase Console
→ Project Settings
→ Service accounts
→ Generate new private key
```

لا ترفع ملف JSON إلى GitHub.

ضع القيم في `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

مهم جدا:

- `FIREBASE_PRIVATE_KEY` Secret
- لا تضعه داخل أي متغير يبدأ بـ `NEXT_PUBLIC_`
- لا ترفعه إلى GitHub

---

## 6) Seed أول بيانات + إنشاء Admin

في `.env.local`:

```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=StrongPasswordHere
```

ثم:

```bash
npm run seed
```

السكريبت يقوم بـ:

1. إنشاء مستخدم Firebase Auth إن لم يكن موجودا
2. إضافة Custom Claim باسم `admin=true`
3. إضافة Demo Projects
4. إضافة Services
5. إضافة Journal Articles
6. إنشاء Public Settings

بعد ذلك سجل الدخول من:

```text
/admin/login
```

### لو كان المستخدم موجودا قبل الـ seed

السكريبت سيجلبه ويضيف له Custom Claim.

بعد تغيير Claims، سجل خروج ثم دخول مرة أخرى حتى يحصل المستخدم على Token جديد.

---

## 7) Cloudflare R2 للصور والملفات

في V4 نستخدم **Bucketين منفصلين**:

```text
decor-line-public-media     # صور المشاريع والخدمات والمقالات
decor-line-private-uploads  # صور ومخططات العملاء
```

لا تجعل bucket الخاص بمرفقات العملاء Public ولا تربط له Custom Domain أو r2.dev.

أنشئ R2 API Token بصلاحية Object Read & Write ومقيدا بالـ bucketين فقط، ثم ضع:

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_BUCKET=decor-line-public-media
R2_PRIVATE_BUCKET=decor-line-private-uploads
R2_PUBLIC_BASE_URL=https://media.example.com
```

اربط `R2_PUBLIC_BASE_URL` بالـ public bucket فقط. في الإنتاج يفضل Custom Domain مثل `media.yourdomain.com`.

### CORS للرفع المباشر

الرفع يتم مباشرة من المتصفح إلى R2 باستخدام Presigned PUT URL. استخدم:

```text
r2-cors-public.example.json
r2-cors-private.example.json
```

واستبدل الدومينات التجريبية بالدومين الفعلي ثم ألصق JSON من إعدادات CORS لكل bucket.

### طريقة التخزين

Public media:

```text
projects/<uuid>.<ext>
services/<uuid>.<ext>
articles/<uuid>.<ext>
site/<uuid>.<ext>
```

Private lead files:

```text
leads/<leadId>/<uuid>.<ext>
```

Firestore يخزن `key` فقط لمرفقات العميل. لوحة الإدارة تنشئ Presigned GET URL مؤقتا عند فتح الطلب.

للتفاصيل الأمنية وخطوات الربط الكاملة اقرأ `FIREBASE_R2_SETUP_AR.md`.

---

## 8) ربط Vercel

ارفع المشروع إلى GitHub:

```bash
git init
git add .
git commit -m "Initial DECOR LINE RIYADH interior studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/decor-line-riyadh-interiors.git
git push -u origin main
```

في Vercel:

```text
Add New
→ Project
→ Import GitHub repository
```

Vercel سيكتشف Next.js.

أضف Environment Variables نفسها من `.env.local` داخل:

```text
Project
→ Settings
→ Environment Variables
```

اختر Production + Preview + Development حسب احتياجك.

أهم المتغيرات:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_BUCKET=
R2_PRIVATE_BUCKET=
R2_PUBLIC_BASE_URL=

NEXT_PUBLIC_WHATSAPP=
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_EMAIL=
NEXT_PUBLIC_DEMO_CONTENT=true
```

ثم Redeploy.

---


### إيقاف المحتوى التجريبي قبل الإطلاق

خلال مرحلة العرض اترك:

```env
NEXT_PUBLIC_DEMO_CONTENT=true
```

بعد رفع المشاريع والخدمات الحقيقية غيّره إلى:

```env
NEXT_PUBLIC_DEMO_CONTENT=false
```

وبذلك إذا كانت قاعدة البيانات فارغة لن يعرض الموقع مشاريع Demo بالخطأ.

## 9) Cloudflare Turnstile - اختياري لكن مستحسن

هدفه حماية نموذج `ابدأ مشروعك` من السبام.

Cloudflare:

```text
Turnstile
→ Add widget
```

أضف:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

إذا تركت `TURNSTILE_SECRET_KEY` فارغا، المشروع يسمح بإرسال الطلبات بدون Turnstile أثناء التطوير.

للإنتاج يفضل تفعيله.

---

## 10) SEO الموجود داخل المشروع

المشروع لا يعتمد على إضافة SEO خارجية. يوجد داخل Next.js:

```text
src/app/sitemap.ts
src/app/robots.ts
src/app/manifest.ts
src/lib/seo.ts
```

وموجود:

- Title وDescription لكل صفحة
- Canonical URLs
- Open Graph
- Twitter Cards
- sitemap.xml ديناميكي
- robots.txt
- `noindex` للوحة الإدارة `/admin`
- دعم Google Search Console verification من Environment Variable
- LocalBusiness / ProfessionalService JSON-LD
- Service JSON-LD
- BreadcrumbList JSON-LD
- Metadata ديناميكية للمشاريع والخدمات والمقالات
- صفحات Project منفصلة
- صفحات Service منفصلة
- Journal للمحتوى
- صفحة محلية فعلية `/riyadh-interior-design`
- Alt text للصور
- Next Image Optimization
- Server rendering للمحتوى العام

### بعد ربط الدومين

غير:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=ضع_كود_Google_هنا_بعد_إضافته_في_Search_Console
```

ولا تترك رابط Vercel كـ canonical في الإنتاج.

ثم أضف الموقع في Google Search Console وأرسل:

```text
https://yourdomain.com/sitemap.xml
```

وتأكد أن الملفين يعملان مباشرة:

```text
https://yourdomain.com/sitemap.xml
https://yourdomain.com/robots.txt
```

---

## 11) SEO محلي للرياض

الصفحات الحالية تستهدف بشكل طبيعي:

```text
تصميم داخلي الرياض
ديكور الرياض
مصمم داخلي الرياض
تصميم فلل الرياض
تصميم مجالس الرياض
تشطيب فلل الرياض
ديكور محلات الرياض
تصميم عيادات الرياض
تصميم مقاهي الرياض
```

لا ننشئ عشرات صفحات أحياء بنصوص مكررة. الأفضل إنشاء محتوى حقيقي لمشاريع فعلية داخل المدينة، بحيث تحمل صفحة المشروع:

- اسم المشروع
- الحي إن كان مناسبا للنشر
- نوع المشروع
- المساحة
- الخدمة
- الصور الأصلية
- قصة القرار
- Before / After
- FAQ متعلق بالمشروع عند توفره

هذا أقوى من صفحات SEO رقيقة ومكررة.

### محتوى Journal المقترح

```text
تكلفة التصميم الداخلي في الرياض: ما الذي يغيّر السعر؟
كيف تختار مصمم داخلي لفيلا في الرياض؟
دليل تجديد الفلل القديمة في الرياض
تصميم المجلس السعودي المعاصر
اختيار الإضاءة للمجالس وغرف الضيافة
الفرق بين التصميم الداخلي والتنفيذ والتشطيب
كيف تقرأ عرض سعر التشطيب؟
```

اكتبها من واقع العمل الحقيقي ولا تستخدم محتوى آلي مكرر.

---

## 12) Google Business Profile

لأن النشاط محلي في الرياض:

1. أنشئ/حدّث Google Business Profile
2. استخدم نفس اسم النشاط والهاتف والموقع في الموقع وGoogle Profile
3. أضف صور مشاريع حقيقية
4. اربط الدومين الرسمي
5. اجمع مراجعات حقيقية بعد التنفيذ
6. لا تضف تقييمات وهمية داخل Schema

Structured data يساعد Google على فهم النشاط، لكنه لا يضمن ترتيباً محدداً.

---

## 13) هوية البراند

النسخة الحالية تستخدم:

```text
ديكور لاين الرياض
DECOR LINE RIYADH
```

الهوية البصرية هادئة وفاخرة ومناسبة لمجال التصميم الداخلي:

```text
Charcoal
Warm sand / stone
Bronze accent
Off-white
```

SEO لا يعتمد على أن يكون اسم البراند عبارة عن Keyword.

الأفضل:

```text
DECOR LINE RIYADH
```

كاسم لاتيني موحد للبراند

ثم Title واضح لمحركات البحث:

```text
ديكور لاين الرياض | تصميم داخلي وديكور في الرياض
```

قبل تسجيل الاسم رسميا افحص:

- العلامات التجارية في السعودية
- السجل التجاري
- الدومين
- حسابات التواصل

---

## 14) ماذا أغير قبل إطلاق العميل؟

ابحث داخل المشروع عن:

```text
+966500000000
hello@your-domain.sa
decor-line-riyadh.vercel.app
instagram.com
```

واستبدلها بالقيم الحقيقية أو عدّلها من `/admin/settings` بعد ربط Firestore.

استبدل Demo Projects بصور ومشاريع حقيقية.

لا تترك صور Unsplash كأعمال منسوبة للشركة عند الإطلاق.

---

## 15) Checklist قبل Production

- [ ] Firebase Auth Email/Password مفعّل
- [ ] Admin user عليه custom claim `admin=true`
- [ ] Firestore Rules مطبقة
- [ ] Firestore indexes مطبقة إذا طلبها Firebase
- [ ] R2 bucket خاص بالمشروع
- [ ] R2 CORS مضبوط
- [ ] R2 Custom Domain
- [ ] Turnstile مفعّل
- [ ] أرقام التواصل حقيقية
- [ ] الدومين مربوط بـ Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` على الدومين النهائي
- [ ] Google Search Console
- [ ] sitemap.xml submitted
- [ ] Google Business Profile
- [ ] مشاريع وصور أصلية
- [ ] راجع `/privacy` واعتمد النص القانوني المناسب لنشاطك
- [ ] `NEXT_PUBLIC_DEMO_CONTENT=false` بعد استبدال المحتوى التجريبي
- [ ] نسخ احتياطي لبيانات Firestore حسب سياسة المشروع

---

## مسارات مهمة

```text
/                           Home
/projects                   Portfolio
/projects/[slug]            Project Case Study
/services                   Services
/services/[slug]            Service Detail
/process                    Method
/about                      Studio
/journal                    SEO / Editorial
/journal/[slug]             Article
/riyadh-interior-design    Local SEO page
/contact                    Contact
/start-project              Lead Wizard
/style-finder               Style discovery quiz
/privacy                    Privacy template

/admin/login                Admin login
/admin                      Dashboard
/admin/projects             Projects CMS
/admin/projects/new         Create project
/admin/services             Services CMS
/admin/articles             Journal CMS
/admin/leads                Lead CRM
/admin/media                R2 upload test
/admin/settings             Public settings
```


## Admin UID (V4.2)
لوحة الاداره تسمح بالدخول للحساب الذي يطابق `ADMIN_UID` في Environment Variables. انشئ المستخدم من Firebase Authentication ثم انسخ UID وضعه في Vercel باسم `ADMIN_UID`. لا تحتاج Custom Claims يدويا.
