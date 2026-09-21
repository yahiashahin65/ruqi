import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { getServices } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "خدمات التصميم الداخلي والديكور والتنفيذ في المدينة المنورة",
  description: "تصميم داخلي، تنفيذ وتشطيب، تجديد، ومشاريع تجارية وضيافة في المدينة المنورة.",
  path: "/services"
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main className="page-main">
      <PageHero
        eyebrow="خدماتنا"
        title={<>من الفكرة إلى التنفيذ،<br />نهتم بكل تفصيلة.</>}
        lead="نقدم خدمات التصميم الداخلي والتنفيذ والتجديد للمساحات السكنية والتجارية، حسب احتياج كل مشروع."
      />
      <section className="section">
        <div className="shell services-list">
          {services.map((service, index) => (
            <Link className="service-row" href={`/services/${service.slug}`} key={service.id}>
              <span>0{index + 1}</span>
              <h2>{service.title}</h2>
              <p>{service.excerpt}</p>
              <ArrowUpLeft size={20} />
            </Link>
          ))}
          {!services.length && <p className="empty-state">سيتم إضافة الخدمات قريبا.</p>}
        </div>
      </section>
    </main>
  );
}
