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
        eyebrow="Services"
        title={<>نصمم القرار.<br />ثم نضبط تنفيذه.</>}
        lead="يمكنك العمل معنا في التصميم فقط أو التصميم والتنفيذ أو إعادة تأهيل مساحة قائمة."
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
        </div>
      </section>
    </main>
  );
}
