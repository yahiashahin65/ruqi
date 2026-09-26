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
  serviceSchema
} from "@/lib/validators";

import {
  nextOrder,
  uniqueSlug
} from "@/lib/content-utils";

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

    const ref =
      db
        .collection(
          "services"
        )
        .doc();

    const slug =
      await uniqueSlug(
        db,
        "services",
        parsed.data.title
      );

    const order =
      await nextOrder(
        db,
        "services"
      );

    const now =
      new Date()
        .toISOString();

    const data = {
      title:
        parsed.data.title,

      slug,

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
        parsed.data.gallery || [],

      order,

      status:
        parsed.data.status,

      /*
       * SEO is generated automatically
       * from:
       *
       * title + excerpt
       *
       * لذلك لا نخزن:
       * seoTitle
       * seoDescription
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
      "services",
      "max"
    );

    return NextResponse.json(
      {
        id:
          ref.id
      },
      {
        status: 201
      }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر حفظ الخدمة"
      },
      {
        status: 500
      }
    );
  }
}
