import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";

import { getArticleBySlugWithHistory } from "@/lib/firebase/data";

import {
  articleJsonLd,
  articleMetadata,
  breadcrumbsJsonLd
} from "@/lib/seo";

import {
  articleImageAlt
} from "@/lib/auto-seo";

/* =========================================
   METADATA
   Automatic SEO from article data
========================================= */

export async function generateMetadata({
  params
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } =
    await params;

  const { item: article } =
    await getArticleBySlugWithHistory(
      slug
    );

  return article
    ? articleMetadata(
        article
      )
    : {};
}

/* =========================================
   ARTICLE CONTENT RENDERER
========================================= */

function renderArticleContent(
  content: string
) {
  const blocks =
    content
      .split(/\n\s*\n/)
      .map(
        (block) =>
          block.trim()
      )
      .filter(Boolean);

  return blocks.map(
    (block, index) => {
      /*
       * H2
       *
       * ## كيف تختار الخامات؟
       */
      if (
        block.startsWith(
          "## "
        )
      ) {
        return (
          <h2 key={index}>
            {block.replace(
              /^##\s+/,
              ""
            )}
          </h2>
        );
      }

      /*
       * H3
       *
       * ### الإضاءة الطبيعية
       */
      if (
        block.startsWith(
          "### "
        )
      ) {
        return (
          <h3 key={index}>
            {block.replace(
              /^###\s+/,
              ""
            )}
          </h3>
        );
      }

      /*
       * Unordered lists
       *
       * - العنصر الأول
       * - العنصر الثاني
       */
      const lines =
        block
          .split("\n")
          .map(
            (line) =>
              line.trim()
          )
          .filter(Boolean);

      if (
        lines.length > 0 &&
        lines.every(
          (line) =>
            line.startsWith(
              "- "
            )
        )
      ) {
        return (
          <ul key={index}>
            {lines.map(
              (
                line,
                itemIndex
              ) => (
                <li
                  key={
                    itemIndex
                  }
                >
                  {line.replace(
                    /^-\s+/,
                    ""
                  )}
                </li>
              )
            )}
          </ul>
        );
      }

      return (
        <p key={index}>
          {block}
        </p>
      );
    }
  );
}

/* =========================================
   ARTICLE PAGE
========================================= */

export default async function ArticlePage({
  params
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const { item: article, isOldSlug } =
    await getArticleBySlugWithHistory(
      slug
    );

  if (!article) {
    notFound();
  }

  if (isOldSlug) {
    permanentRedirect(`/journal/${article.slug}`);
  }

  const schema =
    articleJsonLd(
      article
    );

  const crumbs =
    breadcrumbsJsonLd([
      {
        name:
          "الرئيسية",
        path:
          "/"
      },
      {
        name:
          "المجلة",
        path:
          "/journal"
      },
      {
        name:
          article.title,
        path:
          `/journal/${article.slug}`
      }
    ]);

  const publishDate =
    new Date(
      article.publishedAt
    );

  const hasValidDate =
    !Number.isNaN(
      publishDate.getTime()
    );

  const formattedDate =
    hasValidDate
      ? new Intl.DateTimeFormat(
          "ar-SA",
          {
            dateStyle:
              "long"
          }
        ).format(
          publishDate
        )
      : null;

  return (
    <main className="page-main">

      {/* =========================
          HERO
      ========================== */}

      <header
        className="page-hero"
        aria-labelledby="article-title"
      >
        <div className="shell page-hero__grid">

          <p className="eyebrow">
            {article.category ||
              "مجلة ديكور لاين الرياض"}
          </p>

          <div>
            <h1
              id="article-title"
              style={{
                fontSize:
                  "clamp(42px, 6.3vw, 96px)",
                lineHeight:
                  1.05
              }}
            >
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="page-hero__lead">
                {article.excerpt}
              </p>
            )}
          </div>

        </div>
      </header>

      {/* =========================
          COVER IMAGE
      ========================== */}

      <figure
        className="shell home-case__media"
        style={{
          aspectRatio:
            "16/8",
          marginTop:
            60
        }}
      >
        <Image
          src={
            article.cover.url
          }
          alt={articleImageAlt(
            article,
            article.cover
          )}
          fill
          priority
          sizes="100vw"
        />
      </figure>

      {/* =========================
          ARTICLE CONTENT
      ========================== */}

      <article
        className="content-page"
        aria-labelledby="article-title"
      >
        <div className="shell content-grid">

          <aside>

            {formattedDate && (
              <>
                <p className="eyebrow">
                  نشر في
                </p>

                <time
                  dateTime={
                    publishDate.toISOString()
                  }
                >
                  {formattedDate}
                </time>
              </>
            )}

            {article.category && (
              <p
                style={{
                  marginTop:
                    24
                }}
              >
                {article.category}
              </p>
            )}

          </aside>

          <div className="prose">

            {renderArticleContent(
              article.content
            )}

            {/* =========================
                INTERNAL LINKING / CTA
            ========================== */}

            <section
              aria-labelledby="article-services-title"
              style={{
                marginTop:
                  "clamp(48px, 7vw, 90px)"
              }}
            >
              <h2 id="article-services-title">
                تخطط لمشروع تصميم أو تجديد؟
              </h2>

              <p>
                استكشف خدمات ديكور لاين الرياض
                في التصميم الداخلي والديكور
                والتنفيذ والتجديد في الرياض، واختر الخدمة المناسبة
                لمرحلة مشروعك.
              </p>

              <Link
                className="text-link"
                href="/services"
              >
                استعرض خدماتنا

                <ArrowUpLeft
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            </section>

          </div>
        </div>
      </article>

      {/* =========================
          ARTICLE SCHEMA
      ========================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              schema
            )
        }}
      />

      {/* =========================
          BREADCRUMBS SCHEMA
      ========================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              crumbs
            )
        }}
      />

    </main>
  );
}
