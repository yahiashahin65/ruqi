import Image from "next/image";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpLeft } from "lucide-react";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__media" data-parallax>
        <Image
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90"
          alt="تصميم داخلي دافئ ومعاصر"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero__veil" />
      <div className="shell hero__content">
        <div className="hero__kicker" data-reveal>
          <span>Interior Design · Fit-out</span>
          <span>المدينة المنورة</span>
        </div>
        <h1 data-reveal>
          نصنع مساحات<br />
          <em>تشبه أصحابها</em><br />
          وتعيش طويلا.
        </h1>
        <div className="hero__actions" data-reveal>
          <Link className="button button--light" href="/projects">
            استعرض المشاريع <ArrowUpLeft size={18} />
          </Link>
          <Link className="hero__plain-link" href="/start-project">ابدأ مشروعك</Link>
        </div>
      </div>
      <a className="hero__scroll" href="#selected-work" aria-label="انتقل للمشاريع المختارة">
        <span>اكتشف</span><ArrowDownLeft size={18} />
      </a>
    </section>
  );
}
