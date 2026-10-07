import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";

import { BeforeAfter } from "@/components/BeforeAfter";

import {
  getProjectBySlugWithHistory
} from "@/lib/firebase/data";

import {
  breadcrumbsJsonLd,
  projectJsonLd,
  projectMetadata
} from "@/lib/seo";

import {
  projectImageAlt
} from "@/lib/auto-seo";

import {
  PROJECT_TYPES
} from "@/lib/constants";

/* =========================================
   METADATA
========================================= */

export async function generateMetadata({
  params
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } =
    await params;

  const { item: project } =
    await getProjectBySlugWithHistory(
      slug
    );

  return project
    ? projectMetadata(
        project
      )
    : {};
}

/* =========================================
   PROJECT PAGE
========================================= */

export default async function ProjectPage({
  params
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const { item: project, isOldSlug } =
    await getProjectBySlugWithHistory(
      slug
    );

  if (!project) {
    notFound();
  }

  if (isOldSlug) {
    permanentRedirect(`/projects/${project.slug}`);
  }

  const projectType =
    PROJECT_TYPES[
      project.type
    ] ||
    "تصميم داخلي";

  const storyParagraphs =
    project.story
      ?.split(/\n\s*\n/)
      .map(
        (paragraph) =>
          paragraph.trim()
      )
      .filter(Boolean) ||
    [];

  const projectSchema =
    projectJsonLd(
      project
    );

  const crumbs =
    breadcrumbsJsonLd([
      {
        name:
          "الرئيسية",
        path:
          "/"
      },
      {
        name:
          "المشاريع",
        path:
          "/projects"
      },
      {
        name:
          project.title,
        path:
          `/projects/${project.slug}`
      }
    ]);

  return (
    <main className="project-detail__hero">

      {/* =========================
          MAIN PROJECT IMAGE
      ========================== */}

      <section
        className="project-detail__hero-image"
        aria-label={`صورة مشروع ${project.title}`}
      >
        <Image
          src={
            project.cover.url
          }
          alt={projectImageAlt(
            project,
            project.cover
          )}
          fill
          priority
          sizes="100vw"
          className="project-detail-main-image"
        />
      </section>

      {/* =========================
          PROJECT INTRODUCTION
      ========================== */}

      <section
        className="shell project-detail__intro"
        aria-labelledby="project-title"
      >
        <p className="eyebrow">
          {projectType} · الرياض
        </p>

        <div>

          <h1 id="project-title">
            {project.title}
          </h1>

          {project.excerpt && (
            <p className="project-detail__lead">
              {project.excerpt}
            </p>
          )}

        </div>

        <div className="project-detail__facts">

          {project.area && (
            <div>
              <span>
                المساحة
              </span>

              <strong>
                {project.area} م²
              </strong>
            </div>
          )}

          {project.duration && (
            <div>
              <span>
                المدة
              </span>

              <strong>
                {project.duration}
              </strong>
            </div>
          )}

          {project.style && (
            <div>
              <span>
                أسلوب التصميم
              </span>

              <strong>
                {project.style}
              </strong>
            </div>
          )}

        </div>
      </section>

      {/* =========================
          PROJECT STORY
      ========================== */}

      <section
        className="project-story shell"
        aria-labelledby="project-story-title"
      >
        <p className="eyebrow">
          عن المشروع
        </p>

        <div className="prose">

          <h2 id="project-story-title">
            تفاصيل مشروع {project.title}
          </h2>

          {storyParagraphs.length ? (
            storyParagraphs.map(
              (
                paragraph,
                index
              ) => (
                <p key={index}>
                  {paragraph}
                </p>
              )
            )
          ) : (
            <p>
              {project.excerpt}
            </p>
          )}

        </div>
      </section>

      {/* =========================
          PROJECT GALLERY
      ========================== */}

      {project.gallery.length >
        0 && (
        <section
          className="shell gallery-grid"
          aria-label={`صور مشروع ${project.title}`}
        >
          {project.gallery.map(
            (
              image,
              index
            ) => (
              <div
                className="gallery-grid__item"
                key={`${image.url}-${index}`}
                data-reveal
              >
                <Image
                  src={
                    image.url
                  }
                  alt={projectImageAlt(
                    project,
                    image,
                    index
                  )}
                  fill
                  sizes="(max-width: 900px) 100vw, 70vw"
                  className="project-gallery-image"
                />
              </div>
            )
          )}
        </section>
      )}

      {/* =========================
          BEFORE / AFTER
      ========================== */}

      {project.before &&
        project.after && (
          <section
            className="section"
            aria-labelledby="before-after-title"
          >
            <div className="shell">

              <p className="eyebrow">
                قبل وبعد
              </p>

              <h2
                id="before-after-title"
                className="sr-only"
              >
                مقارنة قبل وبعد مشروع {project.title}
              </h2>

              <BeforeAfter
                before={
                  project.before.url
                }
                after={
                  project.after.url
                }
                title={
                  project.title
                }
              />

            </div>
          </section>
        )}

      {/* =========================
          CTA
      ========================== */}

      <section
        className="section"
        aria-labelledby="similar-project-title"
      >
        <div className="shell section-heading">

          <p className="eyebrow">
            عندك مشروع مشابه؟
          </p>

          <h2 id="similar-project-title">
            ابدأ مشروعك
            <br />
            بخطوة واضحة.
          </h2>

          <div>

            <p className="section-heading__text">
              إذا كنت تخطط لمشروع تصميم داخلي
              أو تجديد أو تنفيذ في الرياض،
              شاركنا التفاصيل الأساسية وسيتواصل
              معك فريق ديكور لاين الرياض لمناقشة
              احتياجات المشروع والخطوة التالية.
            </p>

            <Link
              className="text-link"
              href="/start-project"
              aria-label={`ابدأ مشروع تصميم داخلي مشابه لمشروع ${project.title}`}
            >
              ابدأ مشروعك مع ديكور لاين الرياض

              <ArrowUpLeft
                size={18}
                aria-hidden="true"
              />
            </Link>

          </div>

        </div>
      </section>

      {/* =========================
          PROJECT SCHEMA
      ========================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              projectSchema
            )
        }}
      />

      {/* =========================
          BREADCRUMBS
      ========================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              crumbs
            )
        }}
      />

    </main>
  );
}
