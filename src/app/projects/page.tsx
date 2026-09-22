import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { PageHero } from "@/components/PageHero";
import { getProjects } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";
import { PROJECT_TYPES } from "@/lib/constants";

export const metadata: Metadata = pageMetadata({
  title: "مشاريع التصميم الداخلي والديكور في المدينة المنورة",
  description: "استعرض مشاريع رُقِيّ الجمال السكنية والتجارية والضيافة والتجديد في المدينة المنورة.",
  path: "/projects"
});

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const projects = await getProjects();

  const availableTypes = Object.entries(
    PROJECT_TYPES
  ).filter(([key]) =>
    projects.some(
      (project) => project.type === key
    )
  );

  const filtered =
    params.type &&
    params.type in PROJECT_TYPES
      ? projects.filter(
          (project) =>
            project.type === params.type
        )
      : projects;

  return (
    <main className="page-main">
      <PageHero
        eyebrow="مشاريعنا"
        title={
          <>
            مساحات صممناها
            <br />
            لتعيش وتدوم.
          </>
        }
        lead="مجموعة من مشاريعنا السكنية والتجارية، من الفكرة والتصميم حتى التفاصيل النهائية."
      />

      <section className="section">
        <div className="shell">
          <div className="filter-row">
            <a
              className={
                !params.type
                  ? "is-active"
                  : ""
              }
              href="/projects"
            >
              الكل
            </a>

            {availableTypes.map(
              ([key, label]) => (
                <a
                  className={
                    params.type === key
                      ? "is-active"
                      : ""
                  }
                  href={`/projects?type=${key}`}
                  key={key}
                >
                  {label}
                </a>
              )
            )}
          </div>

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
              لا توجد مشاريع منشورة في هذا التصنيف حاليا.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
