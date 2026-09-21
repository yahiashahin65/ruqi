import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "عن رقي الجمال | تصميم داخلي وديكور في المدينة المنورة",
  description:
    "رقي الجمال استوديو تصميم داخلي وديكور وتنفيذ في المدينة المنورة، نصمم مساحات سكنية وتجارية تجمع الجمال والوظيفة وجودة التفاصيل.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <main className="page-main">
      <PageHero
        eyebrow="RUQI AL JAMAL · Studio"
        title={<>رقي في الفكرة.<br />جمال يعيش مع المكان.</>}
        lead="رقي الجمال هو استوديو تصميم وديكور في المدينة المنورة يبني كل مشروع من احتياج العميل وسياق المكان، لا من قالب جاهز أو ترند مؤقت."
      />
      <section className="section">
        <div className="shell home-case__grid">
          <div className="prose" data-reveal>
            <p className="eyebrow">فلسفتنا</p>
            <h2>الجمال الحقيقي يظهر عندما تعمل التفاصيل معا.</h2>
            <p>نوازن بين التخطيط الذكي، الراحة، الضوء، الخامات، الأثاث والتفاصيل التنفيذية حتى تكون النتيجة جميلة في الصورة وعملية في الحياة اليومية.</p>
            <p>نخدم داخل المدينة المنورة مشاريع الفلل والمنازل والمجالس والتجديد والعيادات والمقاهي والمتاجر والمكاتب، من التصميم إلى التنفيذ حسب نطاق الاتفاق.</p>
            <Link className="text-link" href="/start-project">ناقش مشروعك <ArrowUpLeft size={18} /></Link>
          </div>
          <div className="home-case__media" data-reveal>
            <Image src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=88" alt="تفاصيل تصميم داخلي راقية" fill sizes="60vw" />
          </div>
        </div>
      </section>
      <section className="section-dark section">
        <div className="shell section-heading">
          <p className="eyebrow eyebrow--light">Principles</p>
          <h2>الوظيفة قبل الاستعراض.<br />الهوية قبل التقليد.<br />الجودة حتى آخر تفصيلة.</h2>
          <p className="section-heading__text" style={{ color: "rgba(255,255,255,.62)" }}>
            مبادئنا تجعل كل مشروع مختلفا فعلا، مع لغة هادئة وراقية تناسب طبيعة العميل والمكان.
          </p>
        </div>
      </section>
    </main>
  );
}
