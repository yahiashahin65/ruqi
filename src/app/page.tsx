import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { ServiceCard } from "@/components/ServiceCard";
import { StudioStatement } from "@/components/StudioStatement";
import { ProcessStrip } from "@/components/ProcessStrip";
import { BeforeAfter } from "@/components/BeforeAfter";
import { getProjects, getServices } from "@/lib/firebase/data";

export default async function HomePage() {
  const [projects, services] = await Promise.all([
    getProjects(),
    getServices()
  ]);

  const featured = projects
    .filter((project) => project.featured)
    .slice(0, 23);

  const selectedProjects = featured.length
    ? featured
    : projects.slice(0, 23);

  const caseStudy = projects[0];

  return (
    <main>
      <Hero
        image={
          selectedProjects[0]?.cover ||
          projects[0]?.cover
        }
      />

      <section
        className="home-intro-band"
        aria-label="ملخص خدمات رُقِيّ الجمال"
      >
        <div className="shell home-intro-band__grid">
          <div data-reveal>
            <span>01</span>
            <strong>سكني</strong>
            <p>فلل · شقق · مجالس</p>
          </div>

          <div data-reveal>
            <span>02</span>
            <strong>
              تجاري وضيافة
            </strong>
            <p>
              مقاه · عيادات · متاجر
            </p>
          </div>

          <div data-reveal>
            <span>03</span>
            <strong>
              تجديد وتنفيذ
            </strong>
            <p>
              من المعاينة حتى التسليم
            </p>
          </div>

          <div
            className="home-intro-band__note"
            data-reveal
          >
            <span>نخدم</span>
            <strong>
              المدينة المنورة
            </strong>
          </div>
        </div>
      </section>

      <section
        className="selected-work"
        id="selected-work"
      >
        <div className="shell">
          <div
            className="selected-work__top"
            data-reveal
          >
            <div>
              <p className="eyebrow">
                أعمال مختارة
              </p>

              <h2>
                مشاريع مختارة
              </h2>
            </div>

            <p>
              نقدم المشاريع كقصص واضحة: لماذا اتخذنا القرار،
              وكيف خدم الاستخدام، وكيف تحولت الخامة إلى جزء من
              التجربة.
            </p>
          </div>

          <div className="projects-editorial">
            {selectedProjects.map(
              (project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              )
            )}
          </div>

          <Link
            className="text-link"
            href="/projects"
          >
            جميع المشاريع
            <ArrowUpLeft size={18} />
          </Link>
        </div>
      </section>

      <StudioStatement />

      <section
  className="selected-work"
  id="services"
>
  <div className="shell">

    <div
      className="selected-work__top"
      data-reveal
    >
      <div>
        <p className="eyebrow">
          خدماتنا
        </p>

        <h2>
          حلول التصميم والتنفيذ
        </h2>
      </div>

      <p>
        نقدم خدمات متكاملة تبدأ من دراسة المساحة
        والتصميم وحتى التنفيذ والتسليم.
      </p>
    </div>


    <div className="projects-editorial">

      {services
        .slice(0, 10)
        .map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
          />
        ))}

    </div>


    <Link
      className="text-link"
      href="/services"
    >
      جميع الخدمات
      <ArrowUpLeft size={18} />
    </Link>


  </div>
</section>

      {caseStudy && (
        <section className="home-case">
          <div className="shell home-case__grid">
            <div
              className="home-case__copy"
              data-reveal
            >
              <p className="eyebrow">
                دراسة مشروع
              </p>

              <h2>
                {caseStudy.title}
              </h2>

              <p>
                {caseStudy.story.slice(
                  0,
                  260
                )}

                {caseStudy.story.length >
                260
                  ? "…"
                  : ""}
              </p>

              <Link
                className="text-link"
                href={`/projects/${caseStudy.slug}`}
              >
                عرض المشروع
                <ArrowUpLeft
                  size={18}
                />
              </Link>
            </div>

            <div
              className="home-case__media"
              data-reveal-media
            >
              <Image
                src={
                  caseStudy.cover.url
                }
                alt={
                  caseStudy.cover.alt ||
                  caseStudy.title
                }
                fill
                sizes="60vw"
              />
            </div>
          </div>
        </section>
      )}

      {caseStudy?.before &&
        caseStudy?.after && (
          <section className="section">
            <div className="shell">
              <div className="section-heading">
                <p className="eyebrow">
                  قبل وبعد
                </p>

                <h2>
                  التغيير الجيد لا يبدأ من اللون.
                </h2>

                <p className="section-heading__text">
                  اسحب للمقارنة بين الحالة السابقة واتجاه التصميم
                  بعد إعادة توزيع وتشكيل الفراغ.
                </p>
              </div>

              <BeforeAfter
                before={
                  caseStudy.before.url
                }
                after={
                  caseStudy.after.url
                }
                title={
                  caseStudy.title
                }
              />
            </div>
          </section>
        )}

      <ProcessStrip />

      <section className="home-style-finder section-dark section">
        <div className="shell section-heading">
          <p className="eyebrow eyebrow--light">
            اكتشف اتجاهك
          </p>

          <h2>
            مش متأكد من
            <br />
            الاتجاه المناسب؟
          </h2>

          <div>
            <p
              className="section-heading__text"
              style={{
                color:
                  "rgba(255,255,255,.62)"
              }}
            >
              اختبار قصير يحدد لغة أولية للمواد والإضاءة والشعور
              العام قبل بدء التصميم.
            </p>

            <Link
              className="text-link text-link--light"
              href="/style-finder"
            >
              ابدأ الاختبار
              <ArrowUpLeft
                size={18}
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-local section">
        <div className="shell section-heading">
          <p className="eyebrow">
            المدينة المنورة
          </p>

          <h2>
            خدمة محلية.
            <br />
            رؤية مدروسة.
          </h2>

          <div>
            <p className="section-heading__text">
              نعمل داخل المدينة المنورة في التصميم الداخلي والتجديد
              والتنفيذ للمنازل والفلل والمجالس والمقاهي والعيادات
              والمساحات التجارية.
            </p>

            <Link
              className="text-link"
              href="/madinah-interior-design"
            >
              تفاصيل الخدمة في المدينة
              <ArrowUpLeft
                size={18}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
