import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { ArrowUpLeft } from "lucide-react";
import { articleWhatsapp } from "@/lib/whatsapp";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="article-card" data-reveal>


      <Link
        className="article-card__image"
        href={`/journal/${article.slug}`}
      >
        <Image
          src={article.cover.url}
          alt={article.cover.alt || article.title}
          fill
          sizes="(max-width: 700px) 100vw, 33vw"
        />
      </Link>



      <div className="article-card__meta">

        <span>
          {article.category}
        </span>

        <time>
          {new Intl.DateTimeFormat("ar-SA", {
            dateStyle: "medium"
          }).format(new Date(article.publishedAt))}
        </time>

      </div>



      <h2>
        <Link href={`/journal/${article.slug}`}>
          {article.title}
        </Link>
      </h2>



      {article.excerpt && (
        <p className="article-card__excerpt">
          {article.excerpt}
        </p>
      )}



      <div className="article-card__actions">


        <Link
          href={`/journal/${article.slug}`}
          className="button button--solid"
        >
          اقرأ المقال
          <ArrowUpLeft size={18} />
        </Link>



        <a
          href={articleWhatsapp(article.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="button button--whatsapp"
        >
          اطلب استشارة
        </a>


      </div>


    </article>
  );
}
