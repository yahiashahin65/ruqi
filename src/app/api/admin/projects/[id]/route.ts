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
  projectSchema
} from "@/lib/validators";

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
      projectSchema.safeParse(
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

    const projectRef =
      db
        .collection("projects")
        .doc(id);

    const projectSnapshot =
      await projectRef.get();

    if (
      !projectSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "المشروع غير موجود"
        },
        {
          status: 404
        }
      );
    }

    const update = {
      title:
        parsed.data.title,

      type:
        parsed.data.type,

      style:
        parsed.data.style ||
        "",

      duration:
        parsed.data.duration ||
        "",

      excerpt:
        parsed.data.excerpt,

      story:
        parsed.data.story,

      cover:
        parsed.data.cover,

      gallery:
        parsed.data.gallery,

      featured:
        parsed.data.featured,

      order:
        parsed.data.order > 0
          ? parsed.data.order
          : 1,

      status:
        parsed.data.status,

      /*
       * SEO is now generated automatically
       * from project content.
       *
       * When an old project is edited,
       * remove the legacy fields from Firestore.
       */
      seoTitle:
        FieldValue.delete(),

      seoDescription:
        FieldValue.delete(),

      ...(parsed.data.area
        ? {
            area:
              parsed.data.area
          }
        : {
            area:
              FieldValue.delete()
          }),

      ...(parsed.data.before
        ? {
            before:
              parsed.data.before
          }
        : {
            before:
              FieldValue.delete()
          }),

      ...(parsed.data.after
        ? {
            after:
              parsed.data.after
          }
        : {
            after:
              FieldValue.delete()
          }),

      updatedAt:
        new Date()
          .toISOString()
    };

    await projectRef.set(
      update,
      {
        merge: true
      }
    );

    revalidateTag(
      "projects",
      "max"
    );

    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر تحديث المشروع"
      },
      {
        status: 500
      }
    );
  }
}

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

    const projectRef =
      db
        .collection("projects")
        .doc(id);

    const projectSnapshot =
      await projectRef.get();

    if (
      !projectSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "المشروع غير موجود"
        },
        {
          status: 404
        }
      );
    }

    await projectRef.delete();

    revalidateTag(
      "projects",
      "max"
    );

    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر حذف المشروع"
      },
      {
        status: 500
      }
    );
  }
}
