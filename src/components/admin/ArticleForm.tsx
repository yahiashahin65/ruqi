"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Article } from "@/lib/types";

import {
  ImageUploader,
  type UploadedMedia
} from "./ImageUploader";

const categories = [
  "نصائح التصميم",
  "دليل المشروع",
  "دليل التشطيب",
  "الخامات",
  "أفكار وألوان",
  "مشاريع وتجارب"
];

type ArticleEditor = {
  title: string;
  excerpt: string;
  content: string;
  cover?: UploadedMedia;
  category: string;
  status: "draft" | "published";
};

function initialState(
  article?: Article
): ArticleEditor {
  return {
    title:
      article?.title || "",

    excerpt:
      article?.excerpt || "",

    content:
      article?.content || "",

    cover:
      article?.cover as
        | UploadedMedia
        | undefined,

    category:
      article?.category ||
      categories[0],

    status:
      article?.status ||
      "draft"
  };
}

export function ArticleForm({
  article
}: {
  article?: Article;
}) {
  const router =
    useRouter();

  const [
    form,
    setForm
  ] = useState<ArticleEditor>(
    () =>
      initialState(
        article
      )
  );

  const [
    message,
    setMessage
  ] = useState("");

  const [
    saving,
    setSaving
  ] = useState(false);

  const set = <
    K extends keyof ArticleEditor
  >(
    key: K,
    value: ArticleEditor[K]
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
          article
            ? `/api/admin/articles/${article.id}`
            : "/api/admin/articles",
          {
            method:
              article
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

                content:
                  form.content,

                cover:
                  form.cover,

                category:
                  form.category,

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
            "تعذر حفظ المقال"
        );

        return;
      }

      router.push(
        "/admin/articles"
      );

      router.refresh();
    } catch {
      setMessage(
        "حدث خطأ أثناء حفظ المقال"
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <form
      className="admin-form"
      onSubmit={save}
    >
      {/* =========================
          ARTICLE DATA
      ========================== */}

      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>
            01
          </span>

          <div>
            <h2>
              بيانات المقال
            </h2>

            <p>
              عنوان واضح وتصنيف يساعد القارئ على الوصول للمحتوى المناسب.
            </p>
          </div>

        </div>

        <div className="admin-form__grid">

          <div className="field field--full">

            <label htmlFor="article-title">
              عنوان المقال
            </label>

            <input
              id="article-title"
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
              يستخدم هذا العنوان تلقائيا في SEO واسم ووصف صورة الغلاف.
            </small>

          </div>

          <div className="field">

            <label htmlFor="article-category">
              التصنيف
            </label>

            <select
              id="article-category"
              value={
                form.category
              }
              onChange={(
                event
              ) =>
                set(
                  "category",
                  event.target
                    .value
                )
              }
            >
              {categories.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {category}
                  </option>
                )
              )}
            </select>

          </div>

          <div className="field">

            <label htmlFor="article-status">
              الحالة
            </label>

            <select
              id="article-status"
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
                منشور
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* =========================
          CONTENT
      ========================== */}

      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>
            02
          </span>

          <div>
            <h2>
              المحتوى
            </h2>

            <p>
              مقدمة قصيرة ثم محتوى المقال. افصل الفقرات بسطر فارغ.
            </p>
          </div>

        </div>

        <div className="admin-form__grid">

          <div className="field field--full">

            <label htmlFor="article-excerpt">
              مقدمة قصيرة
            </label>

            <textarea
              id="article-excerpt"
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
              تستخدم هذه المقدمة تلقائيا لإنشاء وصف المقال في محركات البحث.
            </small>

          </div>

          <div className="field field--full">

            <label htmlFor="article-content">
              محتوى المقال
            </label>

            <textarea
              id="article-content"
              className="admin-textarea--article"
              value={
                form.content
              }
              onChange={(
                event
              ) =>
                set(
                  "content",
                  event.target
                    .value
                )
              }
              placeholder={`اكتب محتوى المقال هنا...

## عنوان رئيسي داخل المقال

فقرة المحتوى...

### عنوان فرعي

فقرة أخرى...

- نقطة أولى
- نقطة ثانية
- نقطة ثالثة`}
              required
            />

            <small>
              يمكنك استخدام ## للعناوين الرئيسية و### للعناوين الفرعية و- للقوائم.
            </small>

          </div>

        </div>

      </div>

      {/* =========================
          COVER IMAGE
      ========================== */}

      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>
            03
          </span>

          <div>
            <h2>
              صورة الغلاف
            </h2>

            <p>
              تستخدم في بطاقة المقال وصفحة المقال والمشاركة على الشبكات الاجتماعية.
            </p>
          </div>

        </div>

        <div className="admin-form__grid">

          <ImageUploader
            label="صورة الغلاف"
            value={
              form.cover
            }
            onChange={(
              media
            ) =>
              set(
                "cover",
                media
              )
            }
            onClear={() =>
              set(
                "cover",
                undefined
              )
            }
            folder="articles"
            contentTitle={
              form.title
            }
          />

        </div>

      </div>

      {/* =========================
          MESSAGE
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
            20
        }}
        disabled={
          saving ||
          !form.cover?.url
        }
      >
        {saving
          ? "جاري الحفظ..."
          : "حفظ المقال"}
      </button>

    </form>
  );
}
