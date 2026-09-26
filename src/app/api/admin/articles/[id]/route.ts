import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  revalidateTag
} from "next/cache";

import {
  FieldValue
} from "firebase-admin/firestore";

import {
  getAdminDb
} from "@/lib/firebase/admin";

import {
  isAdminRequest
} from "@/lib/firebase/session";

import {
  articleSchema
} from "@/lib/validators";

/* =========================================
   UPDATE ARTICLE
========================================= */

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
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
    const { id } =
      await context.params;

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
        .doc(id);

    const snapshot =
      await ref.get();

    if (
      !snapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "المقال غير موجود"
        },
        {
          status: 404
        }
      );
    }

    const current =
      snapshot.data();

    const wasPublished =
      current?.status ===
      "published";

    const now =
      new Date()
        .toISOString();

    /*
     * First publication:
     *
     * draft -> published
     * publishedAt = now
     *
     * Already published:
     * keep original publishedAt.
     *
     * Draft:
     * preserve existing value for
     * backward compatibility.
     */
    const publishedAt =
      parsed.data.status ===
      "published"
        ? wasPublished &&
          current?.publishedAt
          ? current.publishedAt
          : now
        : current?.publishedAt ||
          now;

    const update = {
      title:
        parsed.data.title,

      excerpt:
        parsed.data.excerpt,

      content:
        parsed.data.content,

      cover:
        parsed.data.cover,

      category:
        parsed.data.category,

      publishedAt,

      status:
        parsed.data.status,

      /*
       * SEO is now generated automatically
       * from title + excerpt.
       *
       * Remove old stored SEO fields.
       */
      seoTitle:
        FieldValue.delete(),

      seoDescription:
        FieldValue.delete(),

      updatedAt:
        now
    };

    await ref.set(
      update,
      {
        merge: true
      }
    );

    revalidateTag(
      "articles",
      "max"
    );

    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر تحديث المقال"
      },
      {
        status: 500
      }
    );
  }
}

/* =========================================
   DELETE ARTICLE
========================================= */

export async function DELETE(
  _: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
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
    const { id } =
      await context.params;

    const db =
      getAdminDb();

    if (!db) {
      return NextResponse.json(
        {
          error:
            "تعذر الحذف حاليا"
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
        .doc(id);

    const snapshot =
      await ref.get();

    if (
      !snapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "المقال غير موجود"
        },
        {
          status: 404
        }
      );
    }

    await ref.delete();

    revalidateTag(
      "articles",
      "max"
    );

    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر حذف المقال"
      },
      {
        status: 500
      }
    );
  }
}
