import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StyleFinder } from "@/components/StyleFinder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "اكتشف اتجاه تصميمك الداخلي",
  description: "اختبار قصير يساعدك على تحديد اتجاه بصري أولي لمشروع التصميم الداخلي قبل بدء المشروع.",
  path: "/style-finder"
});

export default function StyleFinderPage() {
  return (
    <main className="page-main">
      <PageHero
        eyebrow="Style Finder"
        title={<>ذوقك نقطة بداية.<br />ليس قالبا نهائيا.</>}
        lead="ثلاثة أسئلة قصيرة تعطينا لغة أولية نتحدث بها عن مشروعك، ثم نعيد صياغتها حسب المكان والميزانية والاستخدام."
      />
      <section className="section">
        <div className="shell"><StyleFinder /></div>
      </section>
    </main>
  );
}
