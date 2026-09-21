import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getArticles, getProjects, getServices } from "@/lib/firebase/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services, articles] = await Promise.all([
    getProjects(),
    getServices(),
    getArticles()
  ]);

  const fixed: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/madinah-interior-design", priority: 0.95, changeFrequency: "monthly" },
    { path: "/journal", priority: 0.8, changeFrequency: "weekly" },
    { path: "/process", priority: 0.7, changeFrequency: "yearly" },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/start-project", priority: 0.75, changeFrequency: "yearly" },
    { path: "/style-finder", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" }
  ];

  return [
    ...fixed.map((item) => ({
      url: `${SITE_URL}${item.path}`,
      changeFrequency: item.changeFrequency,
      priority: item.priority
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85
    })),
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/journal/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
