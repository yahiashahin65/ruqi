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
  serviceSchema
} from "@/lib/validators";

/* =========================================
   UPDATE SERVICE
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
      serviceSchema.safeParse(
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

    const serviceRef =
      db
        .collection(
          "services"
        )
        .doc(id);

    const serviceSnapshot =
      await serviceRef.get();

    if (
      !serviceSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "الخدمة غير موجودة"
        },
        {
          status: 404
        }
      );
    }

    const update = {
      title:
        parsed.data.title,

      eyebrow:
        "خدماتنا",

      excerpt:
        parsed.data.excerpt,

      body:
        parsed.data.body,

      deliverables:
        parsed.data.deliverables,

      image:
        parsed.data.image,

      gallery:
        parsed.data.gallery ||
        [],

      status:
        parsed.data.status,

      /*
       * SEO is now generated automatically
       * from:
       *
       * title + excerpt
       *
       * Remove legacy fields from old services
       * when they are edited.
       */
      seoTitle:
        FieldValue.delete(),

      seoDescription:
        FieldValue.delete(),

      updatedAt:
        new Date()
          .toISOString()
    };

    await serviceRef.set(
      update,
      {
        merge: true
      }
    );

    revalidateTag(
      "services",
      "max"
    );

    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر تحديث الخدمة"
      },
      {
        status: 500
      }
    );
  }
}

/* =========================================
   DELETE SERVICE
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

    const serviceRef =
      db
        .collection(
          "services"
        )
        .doc(id);

    const serviceSnapshot =
      await serviceRef.get();

    if (
      !serviceSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "الخدمة غير موجودة"
        },
        {
          status: 404
        }
      );
    }

    await serviceRef.delete();

    revalidateTag(
      "services",
      "max"
    );

    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر حذف الخدمة"
      },
      {
        status: 500
      }
    );
  }
}
