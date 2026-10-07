import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { StyleFinder } from "@/components/StyleFinder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "اكتشف أسلوب التصميم الداخلي المناسب لك",

  description:
    "اختبار قصير يساعدك على اكتشاف اتجاه التصميم الداخلي الأقرب لذوقك من حيث الخامات والإضاءة والألوان قبل بدء مشروعك.",

  path:
    "/style-finder"
});

export default function StyleFinderPage() {
  return (
    <main className="page-main">

      <PageHero
        eyebrow="اكتشف اتجاهك"
        title={
          <>
            اكتشف أسلوب التصميم الداخلي
            <br />
            الأقرب لك
          </>
        }
        lead="أجب عن مجموعة قصيرة من الأسئلة لنكوّن فكرة أولية عن تفضيلاتك في الخامات والإضاءة والألوان والشعور العام للمساحة."
      />

      <section
        className="section"
        aria-labelledby="style-finder-title"
      >
        <div className="shell">

          <div
            className="section-heading"
            data-reveal
          >
            <p className="eyebrow">
              اختبار سريع
            </p>

            <h2 id="style-finder-title">
              أي اتجاه تصميم
              <br />
              يناسب ذوقك؟
            </h2>

            <p className="section-heading__text">
              النتيجة ليست بديلا عن دراسة المشروع،
              لكنها تساعد على تحديد لغة بصرية أولية
              يمكن البناء عليها عند بدء التصميم.
            </p>
          </div>

          <StyleFinder />

        </div>
      </section>

    </main>
  );
}
