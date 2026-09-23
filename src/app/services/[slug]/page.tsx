import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getServiceBySlug } from "@/lib/firebase/data";
import {
  breadcrumbsJsonLd,
  serviceJsonLd,
  serviceMetadata
} from "@/lib/seo";
import { serviceWhatsapp } from "@/lib/whatsapp";


export async function generateMetadata({
  params
}: {
  params: Promise<{ slug:string }>;
}): Promise<Metadata> {

  const { slug } = await params;

  const service = await getServiceBySlug(slug);

  return service
    ? serviceMetadata(service)
    : {};

}



export default async function ServicePage({
  params
}: {
  params: Promise<{ slug:string }>;
}) {


  const { slug } = await params;


  const service = await getServiceBySlug(slug);


  if (!service) notFound();



  const crumbs = breadcrumbsJsonLd([
    {
      name:"الرئيسية",
      path:"/"
    },
    {
      name:"الخدمات",
      path:"/services"
    },
    {
      name:service.title,
      path:`/services/${service.slug}`
    }
  ]);



  return (

    <main className="page-main">



      <PageHero
        eyebrow="الخدمة"
        title={service.title}
        lead={service.excerpt}
      />




      {/* Main Service Image */}

      <section className="shell service-detail__image">

        <Image
          src={service.image.url}
          alt={
            service.image.alt ||
            service.title
          }
          fill
          priority
          sizes="100vw"
        />

      </section>





      {/* Service Gallery */}

      {service.gallery &&
        service.gallery.length > 0 && (

        <section className="shell service-gallery">


          {service.gallery.map(
            (image,index)=>(

              <div
                className="service-gallery__item"
                key={`${image.url}-${index}`}
                data-reveal
              >

                <Image
                  src={image.url}
                  alt={
                    image.alt ||
                    `${service.title} - صورة ${index + 1}`
                  }
                  fill
                  sizes="(max-width:900px) 100vw,70vw"
                />

              </div>

            )
          )}


        </section>

      )}






      <section className="content-page">


        <div className="shell content-grid">


          <p className="eyebrow">
            تفاصيل الخدمة
          </p>




          <div className="prose">


            <p>
              {service.body}
            </p>





            {service.deliverables &&
             service.deliverables.length > 0 && (

              <>

                <h3>
                  ماذا تشمل الخدمة؟
                </h3>



                <ul className="deliverables">

                  {service.deliverables.map(
                    item=>(
                      <li key={item}>
                        {item}
                      </li>
                    )
                  )}

                </ul>


              </>

            )}






            <div className="service-actions">


              <a
                className="button button--whatsapp"
                href={serviceWhatsapp(service.title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                اطلب الخدمة عبر واتساب
              </a>




              <Link
                className="button button--back-service"
                href="/services"
              >
                العودة للخدمات
              </Link>


            </div>




          </div>


        </div>


      </section>







      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
          JSON.stringify(serviceJsonLd(service))
        }}
      />



      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
          JSON.stringify(crumbs)
        }}
      />



    </main>

  );

}
