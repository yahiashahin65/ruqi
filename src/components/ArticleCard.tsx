import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import type { Article } from "@/lib/types";
import { articleWhatsapp } from "@/lib/whatsapp";

export function ArticleCard({
  article
}: {
  article: Article;
}) {
  const articleUrl =
    `/journal/${article.slug}`;

  const publishedDate =
    new Date(article.publishedAt);

  const hasValidDate =
    !Number.isNaN(
      publishedDate.getTime()
    );

  const formattedDate =
    hasValidDate
      ? new Intl.DateTimeFormat(
          "ar-SA",
          {
            dateStyle: "medium"
          }
        ).format(publishedDate)
      : null;

  const imageAlt =
    article.cover.alt ||
    `${article.title} - مجلة رقي الجمال`;

  return (
    <article
      className="article-card"
      data-reveal
      aria-labelledby={`article-${article.id}-title`}
    >
      <Link
        className="article-card__image"
        href={articleUrl}
        aria-label={`اقرا مقال ${article.title}`}
      >
        <Image
          src={article.cover.url}
          alt={imageAlt}
          fill
          sizes="(max-width: 700px) 100vw, 33vw"
        />
      </Link>

      <div className="article-card__meta">

        {article.category && (
          <span>
            {article.category}
          </span>
        )}

        {formattedDate && (
          <time
            dateTime={
              publishedDate.toISOString()
            }
          >
            {formattedDate}
          </time>
        )}

      </div>

      <h3
        id={`article-${article.id}-title`}
      >
        <Link href={articleUrl}>
          {article.title}
        </Link>
      </h3>

      {article.excerpt && (
        <p className="article-card__excerpt">
          {article.excerpt}
        </p>
      )}

      <div className="article-card__actions">

        <Link
          href={articleUrl}
          className="button button--solid"
          aria-label={`اقرا مقال ${article.title}`}
        >
          اقرا المقال
          <ArrowUpLeft
            size={18}
            aria-hidden="true"
          />
        </Link>

        <a
          href={articleWhatsapp(
            article.title
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="button button--whatsapp"
          aria-label={`اطلب استشاره متعلقه بمقال ${article.title} عبر واتساب`}
        >
          اطلب استشاره
        </a>

      </div>
    </article>
  );
}
