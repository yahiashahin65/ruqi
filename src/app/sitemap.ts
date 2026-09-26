import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import {
  getArticles,
  getProjects,
  getServices
} from "@/lib/firebase/data";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

function createUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services, articles] =
    await Promise.all([
      getProjects(),
      getServices(),
      getArticles()
    ]);

  const fixedPages: Array<{
    path: string;
    priority: number;
    changeFrequency: ChangeFrequency;
  }> = [
    {
      path: "/",
      priority: 1,
      changeFrequency: "weekly"
    },

    {
      path: "/services",
      priority: 0.9,
      changeFrequency: "monthly"
    },

    {
      path: "/projects",
      priority: 0.9,
      changeFrequency: "weekly"
    },

    {
      path: "/madinah-interior-design",
      priority: 0.9,
      changeFrequency: "monthly"
    },

    {
      path: "/journal",
      priority: 0.8,
      changeFrequency: "weekly"
    },

    {
      path: "/about",
      priority: 0.7,
      changeFrequency: "yearly"
    },

    {
      path: "/process",
      priority: 0.7,
      changeFrequency: "yearly"
    },

    {
      path: "/contact",
      priority: 0.7,
      changeFrequency: "yearly"
    },

    {
      path: "/start-project",
      priority: 0.6,
      changeFrequency: "yearly"
    },

    {
      path: "/style-finder",
      priority: 0.5,
      changeFrequency: "yearly"
    },

    {
      path: "/privacy",
      priority: 0.2,
      changeFrequency: "yearly"
    }
  ];

  const fixedEntries: MetadataRoute.Sitemap =
    fixedPages.map((page) => ({
      url: createUrl(page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority
    }));

  const projectEntries: MetadataRoute.Sitemap =
    projects.map((project) => ({
      url: createUrl(
        `/projects/${project.slug}`
      ),

      changeFrequency: "monthly",
      priority: 0.85
    }));

  const serviceEntries: MetadataRoute.Sitemap =
    services.map((service) => ({
      url: createUrl(
        `/services/${service.slug}`
      ),

      changeFrequency: "monthly",
      priority: 0.9
    }));

  const articleEntries: MetadataRoute.Sitemap =
    articles.map((article) => ({
      url: createUrl(
        `/journal/${article.slug}`
      ),

      lastModified:
        new Date(article.publishedAt),

      changeFrequency: "monthly",
      priority: 0.7
    }));

  return [
    ...fixedEntries,
    ...serviceEntries,
    ...projectEntries,
    ...articleEntries
  ];
}
