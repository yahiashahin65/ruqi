import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/firebase/data";
import { articleJsonLd, breadcrumbsJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/journal/${article.slug}`,
    image: article.cover.url
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const schema = articleJsonLd(article);
  const crumbs = breadcrumbsJsonLd([
    { name: "الرئيسية", path: "/" },
    { name: "المجلة", path: "/journal" },
    { name: article.title, path: `/journal/${article.slug}` }
  ]);

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="shell page-hero__grid">
          <p className="eyebrow">{article.category}</p>
          <div>
            <h1 style={{fontSize:"clamp(42px,6.3vw,96px)", lineHeight:1.05}}>{article.title}</h1>
            <p className="page-hero__lead">{article.excerpt}</p>
          </div>
        </div>
      </section>
      <section className="shell home-case__media" style={{aspectRatio:"16/8", marginTop:60}}>
        <Image src={article.cover.url} alt={article.cover.alt || article.title} fill priority sizes="100vw" />
      </section>
      <article className="content-page">
        <div className="shell content-grid">
          <div>
            <p className="eyebrow">نُشر في</p>
            <time>{new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>
          </div>
          <div className="prose">
            {article.content.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </div>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
    </main>
  );
}
