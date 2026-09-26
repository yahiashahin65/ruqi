"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpLeft } from "lucide-react";

import type { Service } from "@/lib/types";
import { serviceWhatsapp } from "@/lib/whatsapp";
import { serviceImageAlt } from "@/lib/auto-seo";

export function ServiceRail({
  services
}: {
  services: Service[];
}) {
  const [active, setActive] = useState(0);

  const service =
    services[active] ||
    services[0];

  if (!service) {
    return null;
  }

  const imageAlt =
    serviceImageAlt(
      service,
      service.image
    );

  return (
    <section
      className="service-rail section-dark"
      aria-labelledby="service-rail-title"
    >
      <div className="shell service-rail__grid">

        <div className="service-rail__list">

          <p className="eyebrow eyebrow--light">
            ما نقدمه
          </p>

          <h2
            id="service-rail-title"
            className="sr-only"
          >
            خدمات رقي الجمال للتصميم الداخلي والديكور
          </h2>

          {services.map(
            (
              item,
              index
            ) => (
              <button
                key={
                  item.slug
                }
                type="button"
                className={
                  active === index
                    ? "is-active"
                    : ""
                }
                onMouseEnter={() =>
                  setActive(
                    index
                  )
                }
                onFocus={() =>
                  setActive(
                    index
                  )
                }
                onClick={() =>
                  setActive(
                    index
                  )
                }
                aria-pressed={
                  active === index
                }
                aria-label={`عرض خدمة ${item.title}`}
              >
                <span aria-hidden="true">
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <strong>
                  {item.title}
                </strong>

                <ArrowUpLeft
                  size={19}
                  aria-hidden="true"
                />
              </button>
            )
          )}

          <Link
            className="text-link text-link--light"
            href="/services"
          >
            كل الخدمات

            <ArrowUpLeft
              size={18}
              aria-hidden="true"
            />
          </Link>

        </div>

        <div className="service-rail__visual">

          <div className="service-rail__image">

            <Image
              src={
                service.image.url
              }
              alt={
                imageAlt
              }
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />

          </div>

          <p>
            {service.excerpt}
          </p>

          <div className="service-actions">

            <a
              href={
                serviceWhatsapp(
                  service.title
                )
              }
              target="_blank"
              rel="noopener noreferrer"
              className="button button--whatsapp"
              aria-label={`اطلب خدمة ${service.title} عبر واتساب`}
            >
              اطلب الخدمة عبر واتساب
            </a>

            <Link
              href={`/services/${service.slug}`}
              className="button button--outline"
              aria-label={`عرض تفاصيل خدمة ${service.title}`}
            >
              تفاصيل الخدمة
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}
