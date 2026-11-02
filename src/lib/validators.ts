import { z } from "zod";

/* =========================================
   MEDIA
========================================= */

export const mediaSchema = z.object({
  url: z
    .string()
    .url("رابط الصورة غير صالح"),

  /*
   * Optional for old images that may not
   * have an R2 object key stored.
   */
  key: z
    .string()
    .optional(),

  /*
   * Optional because old images may have:
   * - no alt
   * - a filename as alt
   *
   * Public pages will generate a proper
   * automatic alt when needed.
   */
  alt: z
    .string()
    .max(
      300,
      "وصف الصورة طويل جدا"
    )
    .optional(),

  /*
   * Optional future support.
   */
  width: z
    .number()
    .positive()
    .optional(),

  height: z
    .number()
    .positive()
    .optional()
});

/* =========================================
   LEADS
========================================= */

export const leadSchema = z.object({
  name: z
    .string()
    .min(
      2,
      "الاسم قصير جدا"
    )
    .max(
      80,
      "الاسم طويل جدا"
    ),

  phone: z
    .string()
    .min(
      8,
      "رقم الهاتف غير صالح"
    )
    .max(
      24,
      "رقم الهاتف غير صالح"
    ),

  projectType: z
    .string()
    .min(
      2,
      "اختر نوع المشروع"
    )
    .max(
      50,
      "نوع المشروع غير صالح"
    ),

  serviceNeed: z
    .string()
    .min(
      2,
      "حدد الخدمة المطلوبة"
    )
    .max(
      80,
      "الخدمة المطلوبة غير صالحة"
    ),

  area: z
    .string()
    .max(
      40,
      "المساحة غير صالحة"
    )
    .optional(),

  notes: z
    .string()
    .max(
      1800,
      "الملاحظات طويلة جدا"
    )
    .optional(),

  turnstileToken: z
    .string()
    .optional()
});

/* =========================================
   PROJECT
========================================= */

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      2,
      "اسم المشروع قصير جدا"
    )
    .max(
      120,
      "اسم المشروع طويل جدا"
    ),

  type: z.enum([
    "residential",
    "commercial",
    "hospitality",
    "office",
    "renovation"
  ]),

  style: z
    .string()
    .trim()
    .max(
      80,
      "اسم الأسلوب طويل جدا"
    )
    .optional()
    .default(""),

  area: z
    .coerce
    .number()
    .positive(
      "المساحة يجب أن تكون أكبر من صفر"
    )
    .optional(),

  duration: z
    .string()
    .trim()
    .max(
      80,
      "مدة التنفيذ طويلة جدا"
    )
    .optional()
    .default(""),

  excerpt: z
    .string()
    .trim()
    .min(
      10,
      "الوصف المختصر قصير جدا"
    )
    .max(
      320,
      "الوصف المختصر طويل جدا"
    ),

  story: z
    .string()
    .trim()
    .min(
      20,
      "تفاصيل المشروع قصيرة جدا"
    )
    .max(
      7000,
      "تفاصيل المشروع طويلة جدا"
    ),

  cover:
    mediaSchema,

  gallery: z
    .array(
      mediaSchema
    )
    .max(
      30,
      "الحد الأقصى 30 صورة"
    )
    .default([]),

  before:
    mediaSchema
      .nullable()
      .optional(),

  after:
    mediaSchema
      .nullable()
      .optional(),

  featured: z
    .boolean()
    .default(false),

  order: z
    .coerce
    .number({
      message:
        "ترتيب العرض يجب أن يكون رقم"
    })
    .int(
      "ترتيب العرض يجب أن يكون رقم صحيح"
    )
    .positive(
      "ترتيب العرض يجب أن يكون أكبر من صفر"
    )
    .default(1),

  status: z.enum([
    "draft",
    "published"
  ])
});

/* =========================================
   SERVICE
========================================= */

export const serviceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      2,
      "اسم الخدمة قصير جدا"
    )
    .max(
      120,
      "اسم الخدمة طويل جدا"
    ),

  excerpt: z
    .string()
    .trim()
    .min(
      10,
      "الوصف المختصر قصير جدا"
    )
    .max(
      350,
      "الوصف المختصر طويل جدا"
    ),

  body: z
    .string()
    .trim()
    .min(
      20,
      "تفاصيل الخدمة قصيرة جدا"
    )
    .max(
      7000,
      "تفاصيل الخدمة طويلة جدا"
    ),

  deliverables: z
    .array(
      z
        .string()
        .trim()
        .min(
          1,
          "نقطة الخدمة لا يمكن أن تكون فارغة"
        )
        .max(
          140,
          "نقطة الخدمة طويلة جدا"
        )
    )
    .max(
      30,
      "الحد الأقصى 30 نقطة"
    )
    .default([]),

  image:
    mediaSchema,

  gallery: z
    .array(
      mediaSchema
    )
    .max(
      30,
      "الحد الأقصى 30 صورة"
    )
    .default([]),

  status: z.enum([
    "draft",
    "published"
  ])
});

/* =========================================
   ARTICLE
========================================= */

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      4,
      "عنوان المقال قصير جدا"
    )
    .max(
      180,
      "عنوان المقال طويل جدا"
    ),

  excerpt: z
    .string()
    .trim()
    .min(
      10,
      "مقدمة المقال قصيرة جدا"
    )
    .max(
      350,
      "مقدمة المقال طويلة جدا"
    ),

  content: z
    .string()
    .trim()
    .min(
      40,
      "محتوى المقال قصير جدا"
    )
    .max(
      30000,
      "محتوى المقال طويل جدا"
    ),

  cover:
    mediaSchema,

  category: z
    .string()
    .trim()
    .min(
      2,
      "اختر تصنيف المقال"
    )
    .max(
      80,
      "اسم التصنيف طويل جدا"
    ),

  status: z.enum([
    "draft",
    "published"
  ])
});
