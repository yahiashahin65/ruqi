"use client";

import {
  useRef,
  useState
} from "react";

import {
  ImagePlus,
  Trash2
} from "lucide-react";

export type UploadedMedia = {
  url: string;
  key: string;
  alt?: string;
};

type UploadFolder =
  | "projects"
  | "services"
  | "articles"
  | "site";

function cleanText(
  value = ""
) {
  return value
    .normalize("NFC")
    .replace(
      /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g,
      ""
    )
    .replace(/\u0640/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAutomaticAlt({
  folder,
  title,
  label,
  index
}: {
  folder: UploadFolder;
  title?: string;
  label: string;
  index?: number;
}) {
  const cleanTitle =
    cleanText(title || label);

  const imageNumber =
    typeof index === "number"
      ? ` - صورة ${index + 1}`
      : "";

  switch (folder) {
    case "projects":
      return `مشروع ${cleanTitle} في المدينة المنورة${imageNumber} - رقي الجمال`;

    case "services":
      return `${cleanTitle} في المدينة المنورة${imageNumber} - رقي الجمال`;

    case "articles":
      return `${cleanTitle}${imageNumber} - مجلة رقي الجمال`;

    case "site":
    default:
      return `${cleanTitle}${imageNumber} - رقي الجمال`;
  }
}

export function ImageUploader({
  value,
  onChange,
  onClear,

  folder = "projects",

  label = "رفع صورة",

  /*
   * اسم المشروع / الخدمة / المقال.
   *
   * لا يتم إدخاله كـ SEO field منفصل.
   * الفورم يرسل نفس title الموجود بالفعل.
   */
  contentTitle,

  /*
   * للجاليري:
   * 0 = الصورة الأولى
   * 1 = الصورة الثانية...
   */
  imageIndex
}: {
  value?: UploadedMedia | null;

  onChange: (
    media: UploadedMedia
  ) => void;

  onClear?: () => void;

  folder?: UploadFolder;

  label?: string;

  contentTitle?: string;

  imageIndex?: number;
}) {
  const [
    state,
    setState
  ] = useState<
    "idle" |
    "uploading" |
    "error"
  >("idle");

  const [
    errorMessage,
    setErrorMessage
  ] = useState("");

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  async function upload(
    file: File
  ) {
    /*
     * For content images, force the admin
     * to type the content title first.
     *
     * This guarantees useful automatic
     * filenames and alt text.
     */
    if (
      folder !== "site" &&
      !contentTitle?.trim()
    ) {
      setState("error");

      setErrorMessage(
        folder === "projects"
          ? "اكتب اسم المشروع أولا ثم ارفع الصورة."
          : folder === "services"
            ? "اكتب اسم الخدمة أولا ثم ارفع الصورة."
            : "اكتب عنوان المقال أولا ثم ارفع الصورة."
      );

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }

      return;
    }

    setState("uploading");
    setErrorMessage("");

    try {
      const automaticAlt =
        buildAutomaticAlt({
          folder,
          title:
            contentTitle,
          label,
          index:
            imageIndex
        });

      const sign =
        await fetch(
          "/api/admin/upload/presign",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                type:
                  file.type,

                size:
                  file.size,

                folder,

                /*
                 * Used by the API to create
                 * a meaningful R2 filename.
                 */
                title:
                  contentTitle ||
                  label,

                originalName:
                  file.name,

                index:
                  imageIndex
              })
          }
        );

      const data =
        await sign.json();

      if (!sign.ok) {
        throw new Error(
          data.error ||
          "تعذر تجهيز الرفع"
        );
      }

      const put =
        await fetch(
          data.uploadUrl,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                file.type
            },

            body:
              file
          }
        );

      if (!put.ok) {
        throw new Error(
          "تعذر رفع الملف"
        );
      }

      onChange({
        url:
          data.publicUrl,

        key:
          data.key,

        /*
         * IMPORTANT:
         * Never use file.name as alt.
         */
        alt:
          automaticAlt
      });

      setState("idle");
      setErrorMessage("");
    } catch (
      error
    ) {
      setState("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر رفع الصورة. حاول مرة أخرى."
      );
    } finally {
      /*
       * Allows selecting the same file again.
       */
      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }
  }

  return (
    <div className="field field--media">

      <label>
        {label}
      </label>

      {value?.url && (
        <div className="admin-media-preview">

          <img
            src={value.url}
            alt={
              value.alt ||
              buildAutomaticAlt({
                folder,
                title:
                  contentTitle,
                label,
                index:
                  imageIndex
              })
            }
          />

          {onClear && (
            <button
              type="button"
              className="admin-media-remove"
              onClick={
                onClear
              }
              aria-label="حذف الصورة"
            >
              <Trash2
                size={16}
                aria-hidden="true"
              />

              حذف
            </button>
          )}

        </div>
      )}

      <label className="admin-upload-control">

        <ImagePlus
          size={18}
          aria-hidden="true"
        />

        <span>
          {value?.url
            ? "تغيير الصورة"
            : "اختيار صورة"}
        </span>

        <input
          ref={inputRef}
          type="file"
          hidden

          accept="image/jpeg,image/png,image/webp,image/avif"

          disabled={
            state ===
            "uploading"
          }

          onChange={(
            event
          ) => {
            const file =
              event
                .target
                .files?.[0];

            if (file) {
              upload(file);
            }
          }}
        />

      </label>

      {state ===
        "uploading" && (
        <small>
          جاري رفع الصورة...
        </small>
      )}

      {state ===
        "error" && (
        <small className="field-error">
          {errorMessage ||
            "تعذر رفع الصورة. حاول مرة أخرى."}
        </small>
      )}

    </div>
  );
}
