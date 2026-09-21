import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getPublicSettings } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "تواصل مع رقي الجمال | تصميم داخلي في المدينة المنورة",
  description: "تواصل لطلب تصميم داخلي أو تنفيذ أو تجديد في المدينة المنورة.",
  path: "/contact"
});

export default async function ContactPage() {
  const settings = await getPublicSettings();
  return (
    <main className="page-main">
      <PageHero eyebrow="تواصل معنا" title={<>ابدأ بمحادثة<br />واضحة.</>} lead="إذا عندك مخطط أو صور أو مساحة قائمة، شاركنا التفاصيل الأساسية وسنرتب الخطوة التالية." />
      <section className="section">
        <div className="shell contact-grid">
          <div>
            <h2 className="contact-big">المدينة<br />المنورة</h2>
            <div className="contact-list">
              <a href={`tel:${settings.phone}`}><span>الهاتف</span><strong>{settings.phone}</strong></a>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><span>واتساب</span><strong>ابدأ محادثة</strong></a>
              <a href={`mailto:${settings.email}`}><span>البريد</span><strong>{settings.email}</strong></a>
              <div><span>ساعات العمل</span><strong>{settings.businessHours}</strong></div>
            </div>
          </div>
          <div className="prose">
            <p className="eyebrow">للطلبات الجديدة</p>
            <h2>كلما كانت البداية واضحة، كان ردنا أدق.</h2>
            <p>شاركنا نوع المشروع والخدمة المطلوبة والمساحة التقريبية، ويمكنك إرفاق صور أو مخطط إذا كان متاحا.</p>
            <Link className="button button--solid" href="/start-project">ابدأ مشروعك</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
