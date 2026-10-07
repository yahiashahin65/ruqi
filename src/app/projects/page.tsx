import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/components/ProjectCard";
import { PageHero } from "@/components/PageHero";

import { getProjects } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";

import {
  PROJECT_TYPES,
  SITE_URL
} from "@/lib/constants";

type ProjectsSearchParams = {
  type?: string;
};

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<ProjectsSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;

  const baseMetadata = pageMetadata({
    title:
      "مشاريع التصميم الداخلي والديكور في الرياض",

    description:
      "استعرض مشاريع ديكور لاين الرياض في التصميم الداخلي والديكور والتنفيذ والتجديد للفلل والمنازل والمجالس والمساحات التجارية في الرياض.",

    path:
      "/projects"
  });

  /*
   * Filtered query-string versions مثل:
   * /projects?type=residential
   *
   * لا نحتاج فهرستها كصفحات مستقله.
   */
  if (
    params.type &&
    params.type in PROJECT_TYPES
  ) {
    return {
      ...baseMetadata,

      robots: {
        index: false,
        follow: true
      },

      alternates: {
        canonical:
          `${SITE_URL}/projects`
      }
    };
  }

  return baseMetadata;
}

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<ProjectsSearchParams>;
}) {
  const params = await searchParams;

  const projects = await getProjects();

  const selectedType =
    params.type &&
    params.type in PROJECT_TYPES
      ? params.type as keyof typeof PROJECT_TYPES
      : undefined;

  const availableTypes =
    Object.entries(
      PROJECT_TYPES
    ).filter(([key]) =>
      projects.some(
        (project) =>
          project.type === key
      )
    );

  const filtered =
    selectedType
      ? projects.filter(
          (project) =>
            project.type === selectedType
        )
      : projects;

  const selectedTypeLabel =
    selectedType
      ? PROJECT_TYPES[selectedType]
      : undefined;

  const projectsUrl =
    `${SITE_URL}/projects`;

  const projectsSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${projectsUrl}#webpage`,

    url:
      projectsUrl,

    name:
      "مشاريع التصميم الداخلي والديكور في الرياض",

    description:
      "مشاريع ديكور لاين الرياض في التصميم الداخلي والديكور والتنفيذ للمساحات السكنية والتجارية في الرياض.",

    inLanguage:
      "ar-SA",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`
    },

    mainEntity: {
      "@type":
        "ItemList",

      numberOfItems:
        projects.length,

      itemListElement:
        projects.map(
          (project, index) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              project.title,

            url:
              `${SITE_URL}/projects/${project.slug}`
          })
        )
    }
  };

  return (
    <main className="page-main">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              projectsSchema
            )
        }}
      />

      <PageHero
        eyebrow="مشاريع ديكور لاين الرياض"
        title={
          <>
            مشاريع التصميم الداخلي والديكور
            <br />
            في الرياض
          </>
        }
        lead="استعرض مجموعه من مشاريعنا السكنيه والتجاريه في التصميم الداخلي والديكور والتجديد والتنفيذ، من الفكره وتخطيط المساحه وحتى التفاصيل النهائيه."
      />

      <section
        className="section"
        aria-labelledby="projects-list-title"
      >
        <div className="shell">

          <div
            className="section-heading"
            data-reveal
          >
            <p className="eyebrow">
              أعمال مختاره
            </p>

            <h2 id="projects-list-title">
              {selectedTypeLabel
                ? `مشاريع ${selectedTypeLabel}`
                : "استكشف مشاريعنا"}
            </h2>

            <p className="section-heading__text">
              مشاريع تعكس اختلاف المساحات
              والاحتياجات، مع اهتمام بتوزيع
              الفراغات والخامات والإضاءه
              والتفاصيل القابله للتنفيذ.
            </p>
          </div>

          <nav
            className="filter-row"
            aria-label="تصفية المشاريع حسب النوع"
          >
            <Link
              className={
                !selectedType
                  ? "is-active"
                  : ""
              }
              href="/projects"
              aria-current={
                !selectedType
                  ? "page"
                  : undefined
              }
            >
              الكل
            </Link>

            {availableTypes.map(
              ([key, label]) => (
                <Link
                  className={
                    selectedType === key
                      ? "is-active"
                      : ""
                  }
                  href={`/projects?type=${key}`}
                  key={key}
                  aria-current={
                    selectedType === key
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {filtered.length ? (
            <div className="projects-editorial">
              {filtered.map(
                (project, index) => (
                  <ProjectCard
                    project={project}
                    index={index}
                    key={project.id}
                  />
                )
              )}
            </div>
          ) : (
            <p className="empty-state">
              لا توجد مشاريع منشوره في هذا التصنيف حاليا.
            </p>
          )}

        </div>
      </section>

    </main>
  );
}
