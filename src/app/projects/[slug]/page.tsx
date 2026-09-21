import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { getProjectBySlug } from "@/lib/firebase/data";
import { breadcrumbsJsonLd, projectJsonLd, projectMetadata } from "@/lib/seo";
import { PROJECT_TYPES } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return project ? projectMetadata(project) : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projectSchema = projectJsonLd(project);
  const crumbs = breadcrumbsJsonLd([
    { name: "الرئيسية", path: "/" },
    { name: "المشاريع", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` }
  ]);

  return (
    <main className="project-detail__hero">
      <section className="project-detail__hero-image">
        <Image src={project.cover.url} alt={project.cover.alt || project.title} fill priority sizes="100vw" />
      </section>
      <div className="shell project-detail__intro">
        <p className="eyebrow">{PROJECT_TYPES[project.type]}</p>
        <div><h1>{project.title}</h1></div>
        <div className="project-detail__facts">
          {project.area && <div><span>المساحة</span><strong>{project.area} م²</strong></div>}
          {project.duration && <div><span>المدة</span><strong>{project.duration}</strong></div>}
          {project.style && <div><span>الأسلوب</span><strong>{project.style}</strong></div>}
        </div>
      </div>

      <section className="project-story shell">
        <p className="eyebrow">عن المشروع</p>
        <p>{project.story}</p>
      </section>

      {project.gallery.length > 0 && (
        <section className="shell gallery-grid">
          {project.gallery.map((image, index) => (
            <div className="gallery-grid__item" key={`${image.url}-${index}`} data-reveal>
              <Image src={image.url} alt={image.alt || `${project.title} - صورة ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 70vw" />
            </div>
          ))}
        </section>
      )}

      {project.before && project.after && (
        <section className="section">
          <div className="shell">
            <p className="eyebrow">قبل وبعد</p>
            <BeforeAfter before={project.before.url} after={project.after.url} title={project.title} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell section-heading">
          <p className="eyebrow">عندك مشروع مشابه؟</p>
          <h2>ابدأ مشروعك<br />بخطوة واضحة.</h2>
          <div>
            <p className="section-heading__text">شاركنا التفاصيل الأساسية، وسيتواصل معك فريق رقي الجمال لمناقشة الخطوة التالية.</p>
            <Link className="text-link" href="/start-project">ابدأ مشروعك <ArrowUpLeft size={18} /></Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
    </main>
  );
}
