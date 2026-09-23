import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { PROJECT_TYPES } from "@/lib/constants";
import { projectWhatsapp } from "@/lib/whatsapp";

export function ProjectCard({
  project,
  index = 0
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article
      className={`project-card project-card--${(index % 3) + 1}`}
      data-reveal
    >

      <Link
        href={`/projects/${project.slug}`}
        className="project-card__media"
        data-reveal-media
      >
        <Image
          src={project.cover.url}
          alt={project.cover.alt || project.title}
          fill
          sizes="(max-width: 680px) 90vw, (max-width: 1100px) 45vw, 55vw"
        />

        <span className="project-card__index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>


      <div className="project-card__meta">

        <div>
          <h3>
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p>{project.excerpt}</p>


          <div className="project-card__actions">

            <Link
              href={`/projects/${project.slug}`}
              className="button button--solid"
            >
              مشاهدة المشروع
            </Link>


            <a
              href={projectWhatsapp(project.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--whatsapp"
            >
              اطلب مشروع مشابه
            </a>

          </div>

        </div>


        <span>
          {PROJECT_TYPES[project.type]}
        </span>

      </div>

    </article>
  );
}
