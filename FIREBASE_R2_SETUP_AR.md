# Firebase + Cloudflare R2 — إعداد البنية V4

هذه النسخة تفصل بين بيانات التطبيق وملفات العملاء بشكل آمن:

- Firebase Auth: تسجيل دخول الإدارة فقط من المتصفح.
- Firestore: القراءة والكتابة من Next.js Server عبر Firebase Admin SDK فقط.
- R2 Public: صور المشاريع والخدمات والمقالات التي يجب أن تظهر للعامة.
- R2 Private: صور ومخططات العملاء. لا يوجد لها Public URL.
- Presigned PUT: الرفع يتم مباشرة من المتصفح إلى R2 بدون مرور الملف عبر Vercel.
- Presigned GET: مرفقات العملاء تفتح من لوحة الإدارة برابط مؤقت فقط.

## 1. Firebase

### Web App

من Firebase Console:

Project settings → General → Your apps → Web app

ضع القيم في `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Authentication

Authentication → Sign-in method → Email/Password → Enable

لا تمنح أي مستخدم صلاحية إدارة لمجرد وجوده في Firebase Auth. الإدارة تتطلب Custom Claim:

```json
{ "admin": true }
```

`npm run seed` ينشئ/يجهز مستخدم الإدارة ويضيف الـ claim.

### Firestore

Firestore Database → Create database

الـ browser لا يقرأ Firestore مباشرة في V4. `firestore.rules` يمنع كل client reads/writes، بينما Firebase Admin SDK على السيرفر يدير البيانات.

طبّق `firestore.rules` من Firebase Console أو Firebase CLI.

### Service Account

Project settings → Service accounts → Generate new private key

لا ترفع ملف JSON إلى GitHub.

الأفضل على Vercel تحويل `private_key` إلى Base64 ووضعه في:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

يمكن استخدام `FIREBASE_PRIVATE_KEY_BASE64` فقط للتوافق مع نشر قديم، لكنه لم يعد مطلوبا.

## 2. Cloudflare R2

أنشئ Bucketين منفصلين:

```text
decor-line-public-media
decor-line-private-uploads
```

### Public bucket

هذا فقط للـ portfolio / services / journal / site media.

فعّل له Custom Domain في الإنتاج مثل:

```text
media.example.com
```

يمكن استخدام `r2.dev` مؤقتا أثناء التطوير فقط.

### Private bucket

لا تفعل له Public Access ولا Custom Domain ولا r2.dev.

هذا bucket خاص بمخططات وصور العملاء.

### API Token

R2 → Manage API Tokens → Create API Token

استخدم Object Read & Write وحدد الـ bucketين فقط.

ضع:

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_BUCKET=decor-line-public-media
R2_PRIVATE_BUCKET=decor-line-private-uploads
R2_PUBLIC_BASE_URL=https://media.example.com
```

## 3. R2 CORS

الرفع يتم من browser مباشرة عبر Presigned PUT، لذلك يجب ضبط CORS على كل bucket.

استخدم الملفين:

```text
r2-cors-public.example.json
r2-cors-private.example.json
```

واستبدل:

```text
YOUR_PROJECT.vercel.app
YOUR_DOMAIN.com
```

بالدومينات الحقيقية.

في Cloudflare Dashboard:

R2 → bucket → Settings → CORS policy

الصق JSON المناسب.

## 4. ملف البيئة المحلي

```bash
cp .env.example .env.local
```

املأ القيم الحقيقية ثم:

```bash
npm run check:services
```

النتيجة الصحيحة:

```text
✓ Firebase Admin / Firestore: connected
✓ R2 Public: connected to decor-line-public-media
✓ R2 Private: connected to decor-line-private-uploads
```

ثم:

```bash
npm run seed
npm run dev
```

## 5. Vercel

أضف نفس Environment Variables من:

Project → Settings → Environment Variables

القيم التي تبدأ بـ `NEXT_PUBLIC_` مسموح وصولها للمتصفح. هذه ليست أسرار Firebase الإدارية.

لا تضع أبدا القيم التالية تحت `NEXT_PUBLIC_`:

```text
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY_BASE64
FIREBASE_PRIVATE_KEY
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
TURNSTILE_SECRET_KEY
ADMIN_PASSWORD
```

بعد تغيير Environment Variables قم بعمل Redeploy.

## 6. مسار الملفات في V4

Public R2:

```text
projects/<uuid>.<ext>
services/<uuid>.<ext>
articles/<uuid>.<ext>
site/<uuid>.<ext>
```

Private R2:

```text
leads/<leadId>/<uuid>.<ext>
```

Firestore يخزن `key` فقط لمرفقات العميل. عند فتح لوحة الإدارة يولد السيرفر Presigned GET URL مؤقتا لمدة 5 دقائق.

## 7. حماية رفع العملاء

- أقصى عدد: 6 ملفات لكل طلب.
- أقصى حجم معلن: 10MB لكل ملف.
- الأنواع: JPG / PNG / WEBP / PDF.
- Upload token صالح لمدة 30 دقيقة.
- Presigned upload URL صالح 5 دقائق.
- بعد تثبيت المرفقات يتم إبطال upload token.

ملاحظة: R2 Presigned PUT لا يقدم POST-policy لتطبيق حد حجم صارم على مستوى R2 نفسه. التحقق الحالي يتم قبل إصدار رابط الرفع، ومع Turnstile وحد الملفات/الحجوزات. إذا احتجنا حماية حجم صارمة ضد عميل متعمد يمكن لاحقا وضع مسار الرفع الخاص خلف Cloudflare Worker يتحقق من الحجم أثناء النقل.


## Admin UID (V4.2)
لوحة الاداره تسمح بالدخول للحساب الذي يطابق `ADMIN_UID` في Environment Variables. انشئ المستخدم من Firebase Authentication ثم انسخ UID وضعه في Vercel باسم `ADMIN_UID`. لا تحتاج Custom Claims يدويا.
