import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { PROJECT_TYPES } from "@/lib/constants";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className={`project-card project-card--${(index % 3) + 1}`} data-reveal>
      <Link href={`/projects/${project.slug}`} className="project-card__media" data-reveal-media>
        <Image
          src={project.cover.url}
          alt={project.cover.alt || project.title}
          fill
          sizes="(max-width: 680px) 90vw, (max-width: 1100px) 45vw, 55vw"
        />
        <span className="project-card__index">{String(index + 1).padStart(2, "0")}</span>
      </Link>
      <div className="project-card__meta">
        <div>
          <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
          <p>{project.city}{project.district ? ` · ${project.district}` : ""}</p>
        </div>
        <span>{PROJECT_TYPES[project.type]}</span>
      </div>
    </article>
  );
}
