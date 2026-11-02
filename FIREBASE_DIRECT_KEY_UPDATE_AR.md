# تحديث Firebase Admin - V4.1

تم تعديل المشروع ليقبل قيمة `private_key` من ملف Firebase Service Account مباشرة في Vercel بدون تحويل Base64.

## متغيرات Firebase Admin على Vercel

```env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

- `FIREBASE_PROJECT_ID`: Config.
- `FIREBASE_CLIENT_EMAIL`: Sensitive/Secret.
- `FIREBASE_PRIVATE_KEY`: Sensitive/Secret.
- `private_key_id`: غير مطلوب.
- `FIREBASE_PRIVATE_KEY_BASE64`: اختياري فقط للتوافق مع النسخ القديمة.

الكود يقوم تلقائيا بتحويل `\n` النصية إلى أسطر فعلية ويقبل أيضا المفتاح متعدد الأسطر كما هو.
