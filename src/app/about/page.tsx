import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "من نحن | رُقِيّ الجمال للتصميم الداخلي والديكور",
  description:
    "تعرف على رُقِيّ الجمال للتصميم الداخلي والديكور والتنفيذ في المدينة المنورة، نصمم مساحات سكنية وتجارية تجمع بين الجمال والوظيفة وجودة التفاصيل.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <main className="page-main">
      <PageHero
        eyebrow="من نحن"
        title={
          <>
            رُقِيّ في الفكرة.
            <br />
            جمال يعيش مع المكان.
          </>
        }
        lead="في رُقِيّ الجمال نصمم المساحات السكنية والتجارية انطلاقا من احتياج العميل وطبيعة المكان، لنصنع تجربة متكاملة تجمع بين الجمال والراحة والوظيفة."
      />

      <section className="section">
        <div className="shell">
          <div
            className="prose"
            data-reveal
            style={{
              maxWidth: "900px"
            }}
          >
            <p className="eyebrow">فلسفتنا</p>

            <h2>
              الجمال الحقيقي يظهر عندما تعمل التفاصيل معا.
            </h2>

            <p>
              نؤمن أن التصميم الناجح لا يعتمد على المظهر فقط،
              بل على كيفية تفاعل جميع عناصر المكان معا.
              لذلك نوازن بين التخطيط الذكي والراحة والإضاءة
              والخامات والأثاث والتفاصيل التنفيذية، حتى تكون
              النتيجة جميلة بصريا وعملية في الحياة اليومية.
            </p>

            <p>
              نقدم خدماتنا في المدينة المنورة للمشاريع السكنية
              والتجارية، بما يشمل الفلل والمنازل والمجالس
              والتجديد والعيادات والمقاهي والمتاجر والمكاتب،
              بداية من التصميم وحتى التنفيذ حسب نطاق كل مشروع.
            </p>

            <Link
              className="text-link"
              href="/start-project"
            >
              ناقش مشروعك
              <ArrowUpLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-dark section">
        <div className="shell section-heading">
          <p className="eyebrow eyebrow--light">
            مبادئنا
          </p>

          <h2>
            الوظيفة قبل الاستعراض.
            <br />
            الهوية قبل التقليد.
            <br />
            الجودة حتى آخر تفصيلة.
          </h2>

          <p
            className="section-heading__text"
            style={{
              color: "rgba(255,255,255,.62)"
            }}
          >
            نبحث في كل مشروع عن الحل الذي يناسب صاحبه
            والمكان نفسه، مع اهتمام بالتفاصيل وجودة التنفيذ
            وهوية تصميمية هادئة تعيش لسنوات.
          </p>
        </div>
      </section>
    </main>
  );
}
