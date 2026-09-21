import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StyleFinder } from "@/components/StyleFinder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "اكتشف اتجاه تصميمك الداخلي", description: "اختبار قصير يساعدك على تحديد اتجاه بصري أولي لمشروعك قبل بدء التصميم.", path: "/style-finder" });

export default function StyleFinderPage() {
  return <main className="page-main"><PageHero eyebrow="اكتشف اتجاهك" title={<>لغة تصميم<br />أقرب لك.</>} lead="ثلاثة أسئلة بسيطة تساعدنا على فهم إحساسك المفضل تجاه المواد والإضاءة والتفاصيل." /><section className="section"><div className="shell"><StyleFinder /></div></section></main>;
}
