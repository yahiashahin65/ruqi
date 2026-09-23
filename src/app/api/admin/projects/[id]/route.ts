import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import { projectSchema } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json(
      { error: "غير مصرح" },
      { status: 401 }
    );
  }


  const { id } = await context.params;


  const body = await request.json();


  const parsed = projectSchema.safeParse(
    body
  );


  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues
          .map(
            (issue) => issue.message
          )
          .join(" - ")
      },
      {
        status: 422
      }
    );
  }


  const db = getAdminDb();


  if (!db) {
    return NextResponse.json(
      {
        error: "تعذر الحفظ حاليا"
      },
      {
        status: 503
      }
    );
  }



  const update = {

    title: parsed.data.title,

    type: parsed.data.type,

    style: parsed.data.style || "",

    duration: parsed.data.duration || "",


    excerpt: parsed.data.excerpt,

    story: parsed.data.story,


    cover: parsed.data.cover,

    gallery: parsed.data.gallery,


    featured: parsed.data.featured,


    order:
      parsed.data.order > 0
        ? parsed.data.order
        : 1,


    status: parsed.data.status,


    seoTitle: parsed.data.title,

    seoDescription:
      parsed.data.excerpt.slice(
        0,
        180
      ),



    ...(parsed.data.area
      ? {
          area: parsed.data.area
        }
      : {
          area: null
        }),



    ...(parsed.data.before
      ? {
          before: parsed.data.before
        }
      : {
          before: null
        }),



    ...(parsed.data.after
      ? {
          after: parsed.data.after
        }
      : {
          after: null
        }),



    updatedAt:
      new Date().toISOString()

  };



  await db
    .collection("projects")
    .doc(id)
    .set(
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
}





export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  if (!(await isAdminRequest())) {
    return NextResponse.json(
      {
        error: "غير مصرح"
      },
      {
        status: 401
      }
    );
  }


  const { id } = await context.params;


  const db = getAdminDb();



  if (!db) {
    return NextResponse.json(
      {
        error: "تعذر الحذف حاليا"
      },
      {
        status: 503
      }
    );
  }



  await db
    .collection("projects")
    .doc(id)
    .delete();



  revalidateTag(
    "projects",
    "max"
  );



  return NextResponse.json({
    ok: true
  });

}
