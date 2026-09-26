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
  const projectUrl = `/projects/${project.slug}`;

  const projectType =
    PROJECT_TYPES[project.type] || "تصميم داخلي";

  const imageAlt =
    project.cover.alt ||
    `مشروع ${project.title} - ${projectType} من رقي الجمال`;

  return (
    <article
      className={`project-card project-card--${(index % 3) + 1}`}
      data-reveal
      aria-labelledby={`project-${project.id}-title`}
    >
      <Link
        href={projectUrl}
        className="project-card__media"
        data-reveal-media
        aria-label={`عرض تفاصيل مشروع ${project.title}`}
      >
        <Image
          src={project.cover.url}
          alt={imageAlt}
          fill
          sizes="(max-width: 680px) 90vw, (max-width: 1100px) 45vw, 55vw"
        />

        <span
          className="project-card__index"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>

      <div className="project-card__meta">
        <div>
          <h3 id={`project-${project.id}-title`}>
            <Link href={projectUrl}>
              {project.title}
            </Link>
          </h3>

          <p>{project.excerpt}</p>

          <div className="project-card__actions">
            <Link
              href={projectUrl}
              className="button button--solid"
              aria-label={`مشاهدة تفاصيل مشروع ${project.title}`}
            >
              تفاصيل مشروع {project.title}
            </Link>

            <a
              href={projectWhatsapp(project.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--whatsapp"
              aria-label={`اطلب تنفيذ مشروع مشابه لـ ${project.title} عبر واتساب`}
            >
              اطلب مشروع مشابه
            </a>
          </div>
        </div>

        <span>
          {projectType}
        </span>
      </div>
    </article>
  );
}
