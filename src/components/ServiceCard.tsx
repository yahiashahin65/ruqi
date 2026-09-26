import Image from "next/image";
import Link from "next/link";

import type { Service } from "@/lib/types";
import { serviceWhatsapp } from "@/lib/whatsapp";
import { serviceImageAlt } from "@/lib/auto-seo";

export function ServiceCard({
  service,
  index = 0
}: {
  service: Service;
  index?: number;
}) {
  const serviceUrl =
    `/services/${service.slug}`;

  const imageAlt =
    serviceImageAlt(
      service,
      service.image
    );

  return (
    <article
      className={`project-card project-card--${(index % 3) + 1}`}
      data-reveal
      aria-labelledby={`service-${service.id}-title`}
    >
      <Link
        href={serviceUrl}
        className="project-card__media"
        data-reveal-media
        aria-label={`عرض تفاصيل خدمة ${service.title}`}
      >
        <Image
          src={service.image.url}
          alt={imageAlt}
          fill
          sizes="(max-width: 680px) 90vw, (max-width: 1100px) 45vw, 55vw"
        />

        <span
          className="project-card__index"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>

      <div className="project-card__meta">
        <div>
          <h3
            id={`service-${service.id}-title`}
          >
            <Link
              href={serviceUrl}
            >
              {service.title}
            </Link>
          </h3>

          <p>
            {service.excerpt}
          </p>

          <div className="project-card__actions">
            <Link
              href={serviceUrl}
              className="button button--solid"
              aria-label={`تفاصيل خدمة ${service.title}`}
            >
              تفاصيل الخدمة
            </Link>

            <a
              href={serviceWhatsapp(
                service.title
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--whatsapp"
              aria-label={`اطلب خدمة ${service.title} عبر واتساب`}
            >
              اطلب الخدمة
            </a>
          </div>
        </div>

        {service.eyebrow && (
          <span>
            {service.eyebrow}
          </span>
        )}
      </div>
    </article>
  );
}
