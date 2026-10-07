import type { Metadata } from "next";

import { ArticleCard } from "@/components/ArticleCard";
import { PageHero } from "@/components/PageHero";

import { getArticles } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = pageMetadata({
  title:
    "مقالات ونصائح التصميم الداخلي والتجديد في الرياض",

  description:
    "مقالات ونصائح عملية من ديكور لاين الرياض عن التصميم الداخلي، تصميم المجالس، تجديد الفلل، الخامات، الإضاءة، التشطيبات والتنفيذ في الرياض.",

  path: "/journal"
});

export default async function JournalPage() {
  const articles = await getArticles();

  const journalUrl =
    `${SITE_URL}/journal`;

  const journalSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${journalUrl}#webpage`,

    url:
      journalUrl,

    name:
      "مقالات ونصائح التصميم الداخلي والتجديد في الرياض",

    description:
      "مقالات عملية عن التصميم الداخلي والتجديد والتشطيبات والخامات والتنفيذ في الرياض.",

    inLanguage:
      "ar-SA",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`
    },

    mainEntity: {
      "@type":
        "ItemList",

      numberOfItems:
        articles.length,

      itemListElement:
        articles.map(
          (article, index) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              article.title,

            url:
              `${SITE_URL}/journal/${article.slug}`
          })
        )
    }
  };

  return (
    <main className="page-main">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              journalSchema
            )
        }}
      />

      <PageHero
        eyebrow="مجلة ديكور لاين الرياض"
        title={
          <>
            مقالات ونصائح عن التصميم الداخلي
            <br />
            والتجديد في الرياض
          </>
        }
        lead="محتوى عملي يساعدك على فهم قرارات التصميم الداخلي والتجديد والتشطيب واختيار الخامات قبل بدء المشروع وأثناء التنفيذ."
      />

      <section
        className="section"
        aria-labelledby="journal-list-title"
      >
        <div className="shell">

          <div
            className="section-heading"
            data-reveal
          >
            <p className="eyebrow">
              دليل عملي
            </p>

            <h2 id="journal-list-title">
              معلومات تساعدك قبل اتخاذ القرار
            </h2>

            <p className="section-heading__text">
              نشارك خبرات عملية عن تخطيط المساحات
              والخامات والإضاءة والتشطيبات والتجديد
              حتى تكون قرارات مشروعك أوضح من البداية.
            </p>
          </div>

          {articles.length ? (
            <div className="journal-grid">
              {articles.map(
                (article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                )
              )}
            </div>
          ) : (
            <p className="empty-state">
              سيتم إضافة مقالات جديدة قريبا.
            </p>
          )}

        </div>
      </section>

    </main>
  );
}
