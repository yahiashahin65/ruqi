import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectWizard } from "@/components/ProjectWizard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ابدأ مشروع تصميم داخلي في المدينة المنورة",
  description: "أرسل التفاصيل الأساسية لمشروعك وسيتواصل معك فريق رقي الجمال لمناقشة التصميم الداخلي أو التنفيذ في المدينة المنورة.",
  path: "/start-project"
});

export default function StartProjectPage() {
  return (
    <main className="page-main">
      <PageHero eyebrow="ابدأ مشروعك" title={<>احك لنا<br />عن مشروعك.</>} lead="أرسل التفاصيل الأساسية وسيتواصل معك فريق رقي الجمال لمناقشة المشروع والخطوة التالية." />
      <section className="section"><div className="shell"><ProjectWizard /></div></section>
    </main>
  );
}
