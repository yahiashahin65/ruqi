import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectWizard } from "@/components/ProjectWizard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ابدأ مشروع تصميم داخلي في المدينة المنورة",
  description: "أرسل نوع مشروعك ومساحته وميزانيته ومخططاته إلى رقي الجمال لبدء مناقشة التصميم الداخلي أو التنفيذ في المدينة المنورة.",
  path: "/start-project"
});

export default function StartProjectPage() {
  return (
    <main className="page-main">
      <PageHero
        eyebrow="Start a Project"
        title={<>أعطنا الصورة<br />قبل الصور.</>}
        lead="خمس خطوات قصيرة تساعدنا على فهم المشروع قبل التواصل، وتوفر عليك شرح نفس التفاصيل أكثر من مرة."
      />
      <section className="section">
        <div className="shell"><ProjectWizard /></div>
      </section>
    </main>
  );
}
