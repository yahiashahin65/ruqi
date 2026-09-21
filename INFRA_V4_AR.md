# RUQI AL JAMAL — Infrastructure V4

## ما تم تعديله

- دعم `FIREBASE_PRIVATE_KEY` مباشرة مع fallback اختياري لـ `FIREBASE_PRIVATE_KEY_BASE64`.
- تقوية جلسة الإدارة: admin custom claim + recent sign-in + HttpOnly cookie + same-origin check.
- منع Firestore Client reads/writes بالكامل؛ البيانات تمر عبر Firebase Admin على السيرفر.
- فصل R2 إلى Public bucket وPrivate bucket.
- صور الـ CMS العامة فقط تحصل على Public URL.
- مرفقات العملاء تخزن في Private R2 بدون Public URL.
- لوحة الإدارة تولد Presigned GET URL مؤقتا لمرفقات العملاء.
- Presigned PUT للعملاء صالح 5 دقائق.
- Upload token للطلب صالح 30 دقيقة ويُلغى بعد تثبيت المرفقات.
- حد أقصى 6 حجوزات رفع لكل طلب و10MB معلنة لكل ملف.
- أسماء Objects تعتمد UUID + extension من MIME وليس اسم الملف المرسل.
- إضافة ملفات CORS منفصلة للـ public/private buckets.
- إصلاح `npm run seed` ليقرأ `.env.local` عبر Next env loader.
- إضافة `npm run check:services` لفحص Firestore وR2 bucketين.

## قبل التشغيل

1. انسخ `.env.example` إلى `.env.local`.
2. أكمل Firebase Client + Firebase Admin.
3. أنشئ R2 public/private buckets وأكمل القيم.
4. طبّق CORS من الملفات المرفقة.
5. شغّل `npm run check:services`.
6. شغّل `npm run seed`.
7. شغّل `npm run dev`.

راجع `FIREBASE_R2_SETUP_AR.md` للتفاصيل.


## Admin UID (V4.2)
لوحة الاداره تسمح بالدخول للحساب الذي يطابق `ADMIN_UID` في Environment Variables. انشئ المستخدم من Firebase Authentication ثم انسخ UID وضعه في Vercel باسم `ADMIN_UID`. لا تحتاج Custom Claims يدويا.
