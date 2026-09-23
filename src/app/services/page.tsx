import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "خدمات التصميم الداخلي والديكور والتنفيذ في المدينة المنورة",
  description:
    "تصميم داخلي، تنفيذ وتشطيب، تجديد، ومشاريع تجارية وضيافة في المدينة المنورة.",
  path: "/services"
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="page-main">

      <PageHero
        eyebrow="خدماتنا"
        title={
          <>
            من الفكرة إلى التنفيذ،
            <br />
            نهتم بكل تفصيلة.
          </>
        }
        lead="نقدم خدمات التصميم الداخلي والتنفيذ والتجديد للمساحات السكنية والتجارية، حسب احتياج كل مشروع."
      />


      <section className="section">

        <div className="shell projects-editorial">

          {services.map((service, index) => (

            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />

          ))}


          {!services.length && (
            <p className="empty-state">
              سيتم إضافة الخدمات قريبا.
            </p>
          )}

        </div>

      </section>

    </main>
  );
}
