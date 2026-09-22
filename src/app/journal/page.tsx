import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { PageHero } from "@/components/PageHero";
import { getArticles } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "مجلة رُقِيّ الجمال | نصائح التصميم الداخلي والتجديد في المدينة المنورة",
  description: "مقالات عملية عن التصميم الداخلي، المجالس، تجديد الفلل، الخامات والتنفيذ في المدينة المنورة.",
  path: "/journal"
});

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <main className="page-main">
      <PageHero
        eyebrow="المجلة"
        title={
          <>
            ملاحظات من
            <br />
            داخل المشروع.
          </>
        }
        lead="محتوى عملي يساعدك على فهم قرارات التصميم والتنفيذ قبل بدء المشروع وأثناءه."
      />

      <section className="section">
        <div className="shell journal-grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
