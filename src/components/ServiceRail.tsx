"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpLeft } from "lucide-react";
import type { Service } from "@/lib/types";
import { serviceWhatsapp } from "@/lib/whatsapp";

export function ServiceRail({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const service = services[active] || services[0];

  if (!service) return null;

  return (
    <section className="service-rail section-dark">
      <div className="shell service-rail__grid">

        <div className="service-rail__list">
          <p className="eyebrow eyebrow--light">ما نقدمه</p>

          {services.map((item, index) => (
            <button
              key={item.slug}
              className={active === index ? "is-active" : ""}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <ArrowUpLeft size={19} />
            </button>
          ))}

          <Link className="text-link text-link--light" href="/services">
            كل الخدمات <ArrowUpLeft size={18} />
          </Link>
        </div>


        <div className="service-rail__visual">

          <div className="service-rail__image">
            <Image
              src={service.image.url}
              alt={service.image.alt || service.title}
              fill
              sizes="50vw"
            />
          </div>

          <p>{service.excerpt}</p>


          <div className="service-actions">

            <a
              href={serviceWhatsapp(service.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--whatsapp"
            >
              اطلب الخدمة عبر واتساب
            </a>


            <Link
              href={`/services/${service.slug}`}
              className="button button--outline"
            >
              تفاصيل الخدمة
            </Link>

          </div>


        </div>

      </div>
    </section>
  );
}
