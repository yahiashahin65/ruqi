import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpLeft
} from "lucide-react";

import { projectWhatsapp } from "@/lib/whatsapp";
import { isBadImageAlt } from "@/lib/auto-seo";

type HeroImage = {
  url: string;
  alt?: string;
};

const HERO_FALLBACK_ALT =
  "مشروع تصميم داخلي وديكور في الرياض من ديكور لاين الرياض";

const fallbackImage: HeroImage = {
  url:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=92",

  alt:
    "تصميم داخلي عصري في الرياض"
};

export function Hero({
  image
}: {
  image?: HeroImage;
}) {
  const heroImage =
    image?.url
      ? image
      : fallbackImage;

  const imageAlt =
    !isBadImageAlt(
      heroImage.alt
    )
      ? heroImage.alt!
      : HERO_FALLBACK_ALT;

  return (
    <section
      className="hero"
      data-hero
      aria-labelledby="home-hero-title"
    >
      <div
        className="hero__media"
        data-hero-media
      >
        <Image
          src={heroImage.url}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
        />
      </div>

      <div
        className="hero__veil"
        aria-hidden="true"
      />

      <div
        className="hero__grain"
        aria-hidden="true"
      />

      <div className="shell hero__content">

        <div
          className="hero__kicker"
          data-hero-item
        >
          <span>
            تصميم داخلي · تنفيذ · تجديد
          </span>

          <span>
            الرياض · السعودية
          </span>
        </div>

        <div className="hero__headline-wrap">

          <h1
            id="home-hero-title"
            data-hero-item
          >
            تصميم داخلي وديكور
            <br />

            <em>
              في الرياض
            </em>
          </h1>

          <p
            className="hero__statement"
            data-hero-item
          >
            نرتقي بالمكان حتى يصبح
            تجربة تعيش معك.
          </p>

          <p
            className="hero__lead"
            data-hero-item
          >
            ديكور لاين الرياض تصمم وتنفذ
            المساحات السكنية والتجارية
            بعناية تجمع بين الجمال
            والوظيفة والتفاصيل المدروسة،
            من الفكرة وحتى التنفيذ.
          </p>

        </div>

        <div
          className="hero__actions"
          data-hero-item
        >
          <Link
            className="button button--light"
            href="/projects"
            aria-label="استعرض مشاريع ديكور لاين الرياض للتصميم الداخلي"
          >
            شاهد مشاريعنا

            <ArrowUpLeft
              size={18}
              aria-hidden="true"
            />
          </Link>

          <a
            className="hero__plain-link"
            href={projectWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ابدأ مشروع تصميم داخلي مع ديكور لاين الرياض عبر واتساب"
          >
            ابدأ مشروعك
          </a>
        </div>

      </div>

      <div
        className="hero__corner-card"
        data-hero-item
      >
        <span>
          ديكور لاين الرياض
        </span>

        <p>
          فلل · مجالس · تجديد · ضيافة
          · مشاريع تجارية
        </p>
      </div>

      <a
        className="hero__scroll"
        href="#selected-work"
        aria-label="انتقل إلى مشاريع التصميم الداخلي المختارة"
      >
        <span>
          اكتشف مشاريعنا
        </span>

        <ArrowDownLeft
          size={18}
          aria-hidden="true"
        />
      </a>

    </section>
  );
}
