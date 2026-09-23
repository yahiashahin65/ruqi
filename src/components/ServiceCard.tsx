import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { serviceWhatsapp } from "@/lib/whatsapp";

export function ServiceCard({
  service,
  index = 0
}: {
  service: Service;
  index?: number;
}) {
  return (
    <article
      className={`project-card project-card--${(index % 3) + 1}`}
      data-reveal
    >

      <Link
        href={`/services/${service.slug}`}
        className="project-card__media"
        data-reveal-media
      >

        <Image
          src={service.image.url}
          alt={
            service.image.alt ||
            service.title
          }
          fill
          sizes="(max-width: 680px) 90vw, (max-width: 1100px) 45vw, 55vw"
        />


        <span className="project-card__index">
          {String(index + 1).padStart(2, "0")}
        </span>

      </Link>


      <div className="project-card__meta">

        <div>

          <h3>
            <Link href={`/services/${service.slug}`}>
              {service.title}
            </Link>
          </h3>


          <p>
            {service.excerpt}
          </p>


          <div className="project-card__actions">

            <Link
              href={`/services/${service.slug}`}
              className="button button--solid"
            >
              تفاصيل الخدمة
            </Link>


            <a
              href={serviceWhatsapp(service.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--whatsapp"
            >
              اطلب الخدمة
            </a>

          </div>


        </div>


        <span>
          {service.eyebrow}
        </span>


      </div>


    </article>
  );
}
