import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { getServices } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";
import { serviceWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "خدمات التصميم الداخلي والديكور والتنفيذ في المدينة المنورة",
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

        <div className="shell services-list">

          {services.map((service, index) => (

            <article
              className="service-row"
              key={service.id}
            >

              <div className="service-row__number">
                0{index + 1}
              </div>


              <div className="service-row__content">

                <h2>
                  {service.title}
                </h2>


                <p>
                  {service.excerpt}
                </p>


                <div className="service-row__actions">


                  <Link
                    href={`/services/${service.slug}`}
                    className="button button--solid"
                  >
                    عرض الخدمة
                    <ArrowUpLeft size={18} />
                  </Link>



                  <a
                    href={serviceWhatsapp(service.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--whatsapp"
                  >
                    اطلب الخدمة عبر واتساب
                  </a>


                </div>

              </div>


            </article>

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
