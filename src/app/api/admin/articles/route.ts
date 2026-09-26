import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  revalidateTag
} from "next/cache";

import {
  getAdminDb
} from "@/lib/firebase/admin";

import {
  isAdminRequest
} from "@/lib/firebase/session";

import {
  articleSchema
} from "@/lib/validators";

import {
  uniqueSlug
} from "@/lib/content-utils";

/* =========================================
   CREATE ARTICLE
========================================= */

export async function POST(
  request: NextRequest
) {
  if (
    !(await isAdminRequest())
  ) {
    return NextResponse.json(
      {
        error: "غير مصرح"
      },
      {
        status: 401
      }
    );
  }

  try {
    const body =
      await request.json();

    const parsed =
      articleSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues
              .map(
                (issue) =>
                  issue.message
              )
              .join(" - ")
        },
        {
          status: 422
        }
      );
    }

    const db =
      getAdminDb();

    if (!db) {
      return NextResponse.json(
        {
          error:
            "تعذر الحفظ حاليا"
        },
        {
          status: 503
        }
      );
    }

    const ref =
      db
        .collection(
          "articles"
        )
        .doc();

    const slug =
      await uniqueSlug(
        db,
        "articles",
        parsed.data.title
      );

    const now =
      new Date()
        .toISOString();

    const data = {
      title:
        parsed.data.title,

      slug,

      excerpt:
        parsed.data.excerpt,

      content:
        parsed.data.content,

      cover:
        parsed.data.cover,

      category:
        parsed.data.category,

      /*
       * نحتفظ بالتاريخ حاليا لضمان
       * التوافق مع البيانات الحالية.
       *
       * في Route التعديل سنجعل
       * publishedAt يمثل أول نشر فعلي.
       */
      publishedAt:
        now,

      status:
        parsed.data.status,

      /*
       * لا يتم تخزين:
       *
       * seoTitle
       * seoDescription
       *
       * يتم توليد SEO تلقائيا من:
       *
       * title + excerpt
       */
      createdAt:
        now,

      updatedAt:
        now
    };

    await ref.set(
      data
    );

    revalidateTag(
      "articles",
      "max"
    );

    return NextResponse.json(
      {
        id: ref.id
      },
      {
        status: 201
      }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر حفظ المقال"
      },
      {
        status: 500
      }
    );
  }
}
