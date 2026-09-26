import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";

import { getArticleBySlug } from "@/lib/firebase/data";
import {
  articleJsonLd,
  breadcrumbsJsonLd,
  pageMetadata
} from "@/lib/seo";

type ArticleSeoFields = {
  seoTitle?: string;
  seoDescription?: string;
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const article =
    await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  const seo =
    article as typeof article &
      ArticleSeoFields;

  return pageMetadata({
    title:
      seo.seoTitle?.trim() ||
      article.title,

    description:
      seo.seoDescription?.trim() ||
      article.excerpt,

    path:
      `/journal/${article.slug}`,

    image:
      article.cover.url
  });
}

function renderArticleContent(
  content: string
) {
  const blocks =
    content
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);

  return blocks.map(
    (block, index) => {

      /*
       * H2
       * Example:
       * ## كيف تختار الخامات؟
       */
      if (
        block.startsWith("## ")
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
       * Example:
       * ### الإضاءة الطبيعية
       */
      if (
        block.startsWith("### ")
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
       * Unordered list
       *
       * - العنصر الأول
       * - العنصر الثاني
       */
      const lines =
        block.split("\n");

      if (
        lines.length > 1 &&
        lines.every((line) =>
          line.trim().startsWith("- ")
        )
      ) {
        return (
          <ul key={index}>
            {lines.map(
              (line, itemIndex) => (
                <li key={itemIndex}>
                  {line
                    .trim()
                    .replace(
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

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article =
    await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const schema =
    articleJsonLd(article);

  const crumbs =
    breadcrumbsJsonLd([
      {
        name: "الرئيسية",
        path: "/"
      },
      {
        name: "المجلة",
        path: "/journal"
      },
      {
        name: article.title,
        path: `/journal/${article.slug}`
      }
    ]);

  const publishDate =
    new Date(
      article.publishedAt
    );

  const formattedDate =
    !Number.isNaN(
      publishDate.getTime()
    )
      ? new Intl.DateTimeFormat(
          "ar-SA",
          {
            dateStyle: "long"
          }
        ).format(
          publishDate
        )
      : null;

  return (
    <main className="page-main">

      {/* Article Hero */}
      <header
        className="page-hero"
        aria-labelledby="article-title"
      >
        <div className="shell page-hero__grid">

          <p className="eyebrow">
            {article.category ||
              "مجلة رُقِيّ الجمال"}
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

            <p className="page-hero__lead">
              {article.excerpt}
            </p>
          </div>

        </div>
      </header>

      {/* Cover */}
      <figure
        className="shell home-case__media"
        style={{
          aspectRatio: "16/8",
          marginTop: 60
        }}
      >
        <Image
          src={
            article.cover.url
          }
          alt={
            article.cover.alt ||
            `${article.title} - رقي الجمال`
          }
          fill
          priority
          sizes="100vw"
        />
      </figure>

      {/* Article */}
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
                  marginTop: 24
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
                استكشف خدمات رُقِيّ الجمال
                في التصميم الداخلي والديكور
                والتنفيذ والتجديد في المدينة
                المنورة، واختر الخدمة المناسبة
                لمرحلة مشروعك.
              </p>

              <Link
                className="text-link"
                href="/services"
              >
                استعرض خدماتنا
                <ArrowUpLeft
                  size={18}
                />
              </Link>
            </section>

          </div>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              schema
            )
        }}
      />

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
