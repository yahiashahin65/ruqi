import Image from "next/image";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpLeft } from "lucide-react";

type HeroImage = {
  url: string;
  alt?: string;
};

const fallbackImage: HeroImage = {
  url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=92",
  alt: "تصميم داخلي دافئ ومعاصر"
};

export function Hero({ image }: { image?: HeroImage }) {
  const heroImage = image?.url ? image : fallbackImage;

  return (
    <section className="hero" data-hero>
      <div className="hero__media" data-hero-media>
        <Image
          src={heroImage.url}
          alt={heroImage.alt || "أحد مشاريع رقي الجمال للتصميم الداخلي"}
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero__veil" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="shell hero__content">
        <div className="hero__kicker" data-hero-item>
          <span>INTERIOR ARCHITECTURE · FIT-OUT</span>
          <span>المدينة المنورة · السعودية</span>
        </div>

        <div className="hero__headline-wrap">
          <h1 data-hero-item>
            نرتقي بالمكان<br />
            <em>حتى يصبح تجربة</em><br />
            تعيش معك.
          </h1>
          <p className="hero__lead" data-hero-item>
            تصميم داخلي وتنفيذ للمساحات السكنية والتجارية، برؤية هادئة وخامات مدروسة وتفاصيل يمكن تنفيذها فعلا.
          </p>
        </div>

        <div className="hero__actions" data-hero-item>
          <Link className="button button--light" href="/projects">
            استعرض المشاريع <ArrowUpLeft size={18} />
          </Link>
          <Link className="hero__plain-link" href="/start-project">ابدأ مشروعك</Link>
        </div>
      </div>

      <div className="hero__corner-card" data-hero-item>
        <span>RUQI / 01</span>
        <p>فلل · مجالس · تجديد · ضيافة · مشاريع تجارية</p>
      </div>

      <a className="hero__scroll" href="#selected-work" aria-label="انتقل للمشاريع المختارة">
        <span>اكتشف</span><ArrowDownLeft size={18} />
      </a>
    </section>
  );
}
