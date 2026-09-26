import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  randomUUID
} from "node:crypto";

import {
  PutObjectCommand
} from "@aws-sdk/client-s3";

import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";

import {
  isAdminRequest
} from "@/lib/firebase/session";

import {
  getR2Client,
  getR2PublicBaseUrl,
  getR2PublicBucket,
  isR2PublicConfigured
} from "@/lib/r2";

import {
  slugifyFileName
} from "@/lib/auto-seo";

const allowedTypes = new Map([
  [
    "image/jpeg",
    "jpg"
  ],
  [
    "image/png",
    "png"
  ],
  [
    "image/webp",
    "webp"
  ],
  [
    "image/avif",
    "avif"
  ]
]);

const allowedFolders =
  new Set([
    "projects",
    "services",
    "articles",
    "site"
  ]);

const MAX_SIZE =
  20 * 1024 * 1024;

const MAX_TITLE_LENGTH =
  160;

function createObjectKey({
  folder,
  title,
  extension,
  index
}: {
  folder: string;
  title: string;
  extension: string;
  index?: number;
}) {
  /*
   * Convert:
   *
   * فيلا العوالي
   *
   * into:
   *
   * فيلا-العوالي
   */
  const slug =
    slugifyFileName(
      title
    )
      .slice(
        0,
        90
      )
      .replace(
        /-+$/g,
        ""
      ) ||
    "ruqi-al-jamal";

  /*
   * Gallery images:
   *
   * index = 0
   * becomes:
   * -1
   */
  const imageNumber =
    typeof index === "number" &&
    Number.isInteger(index) &&
    index >= 0
      ? `-${index + 1}`
      : "";

  /*
   * Keep a short unique suffix.
   *
   * This prevents collisions when:
   * - the same image is replaced
   * - multiple images share the same title
   * - two projects have similar names
   */
  const unique =
    randomUUID()
      .replace(/-/g, "")
      .slice(0, 8);

  return (
    `${folder}/` +
    `${slug}` +
    `${imageNumber}` +
    `-${unique}` +
    `.${extension}`
  );
}

export async function POST(
  request: NextRequest
) {
  if (
    !(await isAdminRequest())
  ) {
    return NextResponse.json(
      {
        error:
          "غير مصرح"
      },
      {
        status: 401
      }
    );
  }

  try {
    const body =
      await request.json();

    const {
      type,
      size,
      folder = "projects",
      title,
      index
    } = body;

    const normalizedType =
      String(
        type || ""
      );

    const normalizedFolder =
      String(
        folder || ""
      );

    const normalizedTitle =
      String(
        title || ""
      )
        .trim()
        .slice(
          0,
          MAX_TITLE_LENGTH
        );

    const numericSize =
      Number(size);

    const extension =
      allowedTypes.get(
        normalizedType
      );

    /*
     * Validate image type,
     * size and target folder.
     */
    if (
      !extension ||
      !Number.isFinite(
        numericSize
      ) ||
      numericSize <= 0 ||
      numericSize >
        MAX_SIZE ||
      !allowedFolders.has(
        normalizedFolder
      )
    ) {
      return NextResponse.json(
        {
          error:
            "الملف غير مسموح"
        },
        {
          status: 422
        }
      );
    }

    /*
     * Projects / services / articles
     * must have a meaningful title.
     *
     * Site assets can fallback to
     * a generic brand title.
     */
    if (
      normalizedFolder !==
        "site" &&
      !normalizedTitle
    ) {
      return NextResponse.json(
        {
          error:
            "يجب كتابة عنوان المحتوى قبل رفع الصورة"
        },
        {
          status: 422
        }
      );
    }

    const safeTitle =
      normalizedTitle ||
      "رقي الجمال";

    const client =
      getR2Client();

    const bucket =
      getR2PublicBucket();

    const publicBaseUrl =
      getR2PublicBaseUrl();

    if (
      !client ||
      !bucket ||
      !publicBaseUrl ||
      !isR2PublicConfigured()
    ) {
      return NextResponse.json(
        {
          error:
            "خدمة رفع الصور غير متاحة حاليا"
        },
        {
          status: 503
        }
      );
    }

    const key =
      createObjectKey({
        folder:
          normalizedFolder,

        title:
          safeTitle,

        extension,

        index:
          typeof index ===
          "number"
            ? index
            : undefined
      });

    const command =
      new PutObjectCommand({
        Bucket:
          bucket,

        Key:
          key,

        ContentType:
          normalizedType
      });

    const uploadUrl =
      await getSignedUrl(
        client,
        command,
        {
          expiresIn:
            600
        }
      );

    const baseUrl =
      publicBaseUrl.replace(
        /\/+$/,
        ""
      );

    return NextResponse.json({
      uploadUrl,

      publicUrl:
        `${baseUrl}/${key}`,

      key
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "تعذر تجهيز رفع الصورة"
      },
      {
        status: 500
      }
    );
  }
}
