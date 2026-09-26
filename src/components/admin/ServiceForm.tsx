"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Trash2
} from "lucide-react";

import type {
  Service
} from "@/lib/types";

import {
  ImageUploader,
  type UploadedMedia
} from "./ImageUploader";

type ServiceEditor = {
  title: string;
  excerpt: string;
  body: string;
  deliverables: string[];
  image?: UploadedMedia;
  gallery: UploadedMedia[];
  status: "draft" | "published";
};

function initialState(
  service?: Service
): ServiceEditor {
  return {
    title:
      service?.title || "",

    excerpt:
      service?.excerpt || "",

    body:
      service?.body || "",

    deliverables:
      service?.deliverables?.length
        ? service.deliverables
        : [""],

    image:
      service?.image as
        | UploadedMedia
        | undefined,

    gallery:
      (service?.gallery ||
        []) as UploadedMedia[],

    status:
      service?.status ||
      "draft"
  };
}

function isBadAlt(
  value?: string
) {
  if (!value) {
    return true;
  }

  const text =
    value.trim();

  if (!text) {
    return true;
  }

  if (
    /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(
      text
    )
  ) {
    return true;
  }

  if (
    /^\d+$/.test(
      text
    )
  ) {
    return true;
  }

  if (
    /^(img|image|dsc|photo|pic|screenshot|whatsapp)[-_ ]?\d*/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

function serviceGalleryAlt(
  title: string,
  index: number
) {
  const cleanTitle =
    title.trim() ||
    "خدمة التصميم الداخلي";

  return `${cleanTitle} في المدينة المنورة - صورة ${index + 1} - رقي الجمال`;
}

export function ServiceForm({
  service
}: {
  service?: Service;
}) {
  const router =
    useRouter();

  const [
    form,
    setForm
  ] =
    useState<ServiceEditor>(
      () =>
        initialState(
          service
        )
    );

  const [
    message,
    setMessage
  ] =
    useState("");

  const [
    saving,
    setSaving
  ] =
    useState(false);

  const set = <
    K extends keyof ServiceEditor
  >(
    key: K,
    value: ServiceEditor[K]
  ) => {
    setForm(
      (prev) => ({
        ...prev,
        [key]:
          value
      })
    );
  };

  async function save(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          service
            ? `/api/admin/services/${service.id}`
            : "/api/admin/services",
          {
            method:
              service
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                title:
                  form.title,

                excerpt:
                  form.excerpt,

                body:
                  form.body,

                deliverables:
                  form.deliverables
                    .map(
                      (item) =>
                        item.trim()
                    )
                    .filter(
                      Boolean
                    ),

                image:
                  form.image,

                gallery:
                  form.gallery,

                status:
                  form.status
              })
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        setMessage(
          data.error ||
            "تعذر حفظ الخدمة"
        );

        return;
      }

      router.push(
        "/admin/services"
      );

      router.refresh();
    } catch {
      setMessage(
        "حدث خطأ أثناء حفظ الخدمة"
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  function updateDeliverable(
    index: number,
    value: string
  ) {
    setForm(
      (prev) => ({
        ...prev,

        deliverables:
          prev.deliverables.map(
            (
              item,
              i
            ) =>
              i === index
                ? value
                : item
          )
      })
    );
  }

  function removeDeliverable(
    index: number
  ) {
    setForm(
      (prev) => {
        const next =
          prev.deliverables.filter(
            (
              _,
              i
            ) =>
              i !== index
          );

        return {
          ...prev,

          deliverables:
            next.length
              ? next
              : [""]
        };
      }
    );
  }

  function moveGallery(
    index: number,
    direction:
      | -1
      | 1
  ) {
    setForm(
      (prev) => {
        const next = [
          ...prev.gallery
        ];

        const target =
          index +
          direction;

        if (
          target < 0 ||
          target >=
            next.length
        ) {
          return prev;
        }

        [
          next[index],
          next[target]
        ] = [
          next[target],
          next[index]
        ];

        return {
          ...prev,
          gallery:
            next
        };
      }
    );
  }

  function removeGalleryImage(
    index: number
  ) {
    setForm(
      (prev) => ({
        ...prev,

        gallery:
          prev.gallery.filter(
            (
              _,
              i
            ) =>
              i !== index
          )
      })
    );
  }

  return (
    <form
      className="admin-form"
      onSubmit={save}
    >
      {/* =========================
          SERVICE DATA
      ========================== */}

      <div className="admin-form-section">

        <div className="admin-form-section__head">
          <span>
            01
          </span>

          <div>
            <h2>
              الخدمة
            </h2>

            <p>
              المعلومات الأساسية للخدمة.
            </p>
          </div>
        </div>

        <div className="admin-form__grid">

          <div className="field field--full">

            <label htmlFor="service-title">
              اسم الخدمة
            </label>

            <input
              id="service-title"
              value={
                form.title
              }
              onChange={(
                event
              ) =>
                set(
                  "title",
                  event.target
                    .value
                )
              }
              required
            />

            <small>
              يستخدم اسم الخدمة تلقائيًا في SEO وأسماء ووصف الصور.
            </small>

          </div>

          <div className="field field--full">

            <label htmlFor="service-excerpt">
              وصف مختصر
            </label>

            <textarea
              id="service-excerpt"
              value={
                form.excerpt
              }
              onChange={(
                event
              ) =>
                set(
                  "excerpt",
                  event.target
                    .value
                )
              }
              required
            />

            <small>
              يستخدم هذا الوصف تلقائيًا لإنشاء وصف الصفحة لمحركات البحث.
            </small>

          </div>

          <div className="field field--full">

            <label htmlFor="service-body">
              تفاصيل الخدمة
            </label>

            <textarea
              id="service-body"
              className="admin-textarea--large"
              value={
                form.body
              }
              onChange={(
                event
              ) =>
                set(
                  "body",
                  event.target
                    .value
                )
              }
              required
            />

          </div>

        </div>
      </div>

      {/* =========================
          DELIVERABLES
      ========================== */}

      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>
            02
          </span>

          <div>
            <h2>
              ماذا تشمل الخدمة؟
            </h2>

            <p>
              أضف النقاط الرئيسية التي يحصل عليها العميل ضمن الخدمة.
            </p>
          </div>

        </div>

        <div className="admin-repeat-list">

          {form.deliverables.map(
            (
              item,
              index
            ) => (
              <div
                className="admin-repeat-row"
                key={
                  index
                }
              >

                <input
                  value={
                    item
                  }
                  onChange={(
                    event
                  ) =>
                    updateDeliverable(
                      index,
                      event.target
                        .value
                    )
                  }
                  placeholder={`النقطة ${index + 1}`}
                />

                <button
                  type="button"
                  onClick={() =>
                    removeDeliverable(
                      index
                    )
                  }
                  aria-label={`حذف النقطة ${index + 1}`}
                >
                  <Trash2
                    size={
                      16
                    }
                    aria-hidden="true"
                  />
                </button>

              </div>
            )
          )}

          <button
            type="button"
            className="button button--ghost admin-add-row"
            onClick={() =>
              set(
                "deliverables",
                [
                  ...form.deliverables,
                  ""
                ]
              )
            }
          >
            <Plus
              size={
                16
              }
              aria-hidden="true"
            />

            إضافة نقطة
          </button>

        </div>
      </div>

      {/* =========================
          IMAGES
      ========================== */}

      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>
            03
          </span>

          <div>
            <h2>
              الصور
            </h2>

            <p>
              الصورة الرئيسية ثم صور معرض الخدمة. يتم إنشاء اسم الصورة ووصفها تلقائيًا من اسم الخدمة.
            </p>
          </div>

        </div>

        <div className="admin-form__grid">

          {/* Main Image */}

          <ImageUploader
            label="الصورة الرئيسية"
            value={
              form.image
            }
            onChange={(
              media
            ) =>
              set(
                "image",
                media
              )
            }
            onClear={() =>
              set(
                "image",
                undefined
              )
            }
            folder="services"
            contentTitle={
              form.title
            }
          />

          {/* Gallery Uploader */}

          <ImageUploader
            label="إضافة صورة للخدمة"
            onChange={(
              media
            ) =>
              set(
                "gallery",
                [
                  ...form.gallery,
                  media
                ]
              )
            }
            folder="services"
            contentTitle={
              form.title
            }
            imageIndex={
              form.gallery
                .length
            }
          />

          {/* Gallery Manager */}

          {form.gallery.length >
            0 && (
            <div className="field field--full">

              <label>
                صور الخدمة
              </label>

              <div className="admin-gallery-manager">

                {form.gallery.map(
                  (
                    image,
                    index
                  ) => {
                    const alt =
                      isBadAlt(
                        image.alt
                      )
                        ? serviceGalleryAlt(
                            form.title,
                            index
                          )
                        : image.alt!;

                    return (
                      <div
                        className="admin-gallery-item"
                        key={`${image.url}-${index}`}
                      >

                        <img
                          src={
                            image.url
                          }
                          alt={
                            alt
                          }
                        />

                        <div className="admin-gallery-item__actions">

                          <button
                            type="button"
                            onClick={() =>
                              moveGallery(
                                index,
                                -1
                              )
                            }
                            disabled={
                              index ===
                              0
                            }
                            aria-label={`تحريك الصورة ${index + 1} لأعلى`}
                          >
                            <ArrowUp
                              size={
                                15
                              }
                              aria-hidden="true"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveGallery(
                                index,
                                1
                              )
                            }
                            disabled={
                              index ===
                              form.gallery
                                .length -
                              1
                            }
                            aria-label={`تحريك الصورة ${index + 1} لأسفل`}
                          >
                            <ArrowDown
                              size={
                                15
                              }
                              aria-hidden="true"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeGalleryImage(
                                index
                              )
                            }
                            aria-label={`حذف الصورة ${index + 1}`}
                          >
                            <Trash2
                              size={
                                15
                              }
                              aria-hidden="true"
                            />
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </div>
      </div>

      {/* =========================
          PUBLISH
      ========================== */}

      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>
            04
          </span>

          <div>
            <h2>
              النشر
            </h2>
          </div>

        </div>

        <div className="admin-form__grid">

          <div className="field">

            <label htmlFor="service-status">
              الحالة
            </label>

            <select
              id="service-status"
              value={
                form.status
              }
              onChange={(
                event
              ) =>
                set(
                  "status",
                  event.target
                    .value as
                    | "draft"
                    | "published"
                )
              }
            >

              <option value="draft">
                مسودة
              </option>

              <option value="published">
                منشورة
              </option>

            </select>

          </div>

        </div>
      </div>

      {/* =========================
          MESSAGES
      ========================== */}

      {message && (
        <div className="notice">
          {message}
        </div>
      )}

      {/* =========================
          SAVE
      ========================== */}

      <button
        type="submit"
        className="button button--solid"
        style={{
          marginTop:
            22
        }}
        disabled={
          saving ||
          !form.image?.url
        }
      >
        {saving
          ? "جاري الحفظ..."
          : "حفظ الخدمة"}
      </button>

    </form>
  );
}
