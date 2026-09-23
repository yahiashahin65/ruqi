import type { DocumentData } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { getAdminDb, isFirebaseAdminConfigured } from "./admin";
import { demoArticles, demoProjects, demoServices } from "../demo-data";
import type {
  Article,
  Lead,
  Project,
  Service,
  SiteSettings
} from "../types";
import { DEFAULT_SETTINGS } from "../constants";

const useDemoContent =
  process.env.NEXT_PUBLIC_DEMO_CONTENT !== "false";

function normalize<T>(
  id: string,
  data: DocumentData
): T {
  return JSON.parse(
    JSON.stringify({
      id,
      ...data
    })
  ) as T;
}

function normalizeSlug(slug: string) {
  let value = slug;

  try {
    value = decodeURIComponent(slug);
  } catch {
    value = slug;
  }

  return value
    .normalize("NFKC")
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

async function firestoreList<T>(
  collectionName: string
): Promise<T[]> {
  const db = getAdminDb();

  if (!db) return [];

  const snap = await db
    .collection(collectionName)
    .get();

  return snap.docs.map((doc) =>
    normalize<T>(
      doc.id,
      doc.data()
    )
  );
}

export const getProjects =
  unstable_cache(
    async (): Promise<Project[]> => {
      if (!isFirebaseAdminConfigured()) {
        return useDemoContent
          ? demoProjects
          : [];
      }

      try {
        const items =
          await firestoreList<Project>(
            "projects"
          );

        const published =
          items.filter(
            (item) =>
              item.status ===
              "published"
          );

        return published.length
          ? published.sort(
              (a, b) =>
                a.order - b.order
            )
          : useDemoContent
            ? demoProjects
            : [];
      } catch {
        return useDemoContent
          ? demoProjects
          : [];
      }
    },
    ["public-projects"],
    {
      revalidate: 120,
      tags: ["projects"]
    }
  );

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {

  const normalizedSlug =
    normalizeSlug(slug);

  const projects =
    await getProjects();

  return (
    projects.find(
      (project) =>
        normalizeSlug(project.slug) === normalizedSlug
    ) || null
  );
}

export const getServices =
  unstable_cache(
    async (): Promise<Service[]> => {
      if (!isFirebaseAdminConfigured()) {
        return useDemoContent
          ? demoServices
          : [];
      }

      try {
        const items =
  await firestoreList<Service>(
    "services"
  );

const normalizedItems = items.map((item) => ({
  ...item,
  gallery: item.gallery || []
}));

const published =
  normalizedItems.filter(
    (item) =>
      item.status === "published"
  );

        return published.length
          ? published.sort(
              (a, b) =>
                a.order - b.order
            )
          : useDemoContent
            ? demoServices
            : [];
      } catch {
        return useDemoContent
          ? demoServices
          : [];
      }
    },
    ["public-services"],
    {
      revalidate: 300,
      tags: ["services"]
    }
  );

/**
 * Get one published service directly from Firestore.
 *
 * We deliberately do NOT depend only on getServices() here because
 * getServices() is cached. A newly-created service may already appear
 * in the public list while a detail request can still hit stale cache.
 */
export async function getServiceBySlug(
  slug: string
): Promise<Service | null> {
  const normalizedSlug =
    normalizeSlug(slug);

  if (!isFirebaseAdminConfigured()) {
    if (!useDemoContent) {
      return null;
    }

    return (
      demoServices.find(
        (service) =>
          normalizeSlug(
            service.slug
          ) === normalizedSlug
      ) || null
    );
  }

  try {
    const db = getAdminDb();

    if (!db) return null;

    /*
     * Query Firestore directly so the detail page always gets
     * the current service instead of depending on the cached list.
     */
    const snapshot = await db
      .collection("services")
      .where(
        "slug",
        "==",
        normalizedSlug
      )
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc =
        snapshot.docs[0];

      const service = {
  ...normalize<Service>(
    doc.id,
    doc.data()
  ),
  gallery: doc.data().gallery || []
};


return service.status === "published"
  ? service
  : null;
    }

    /*
     * Safe fallback for older records or a temporary cache/data
     * mismatch. This also compares normalized URL values.
     */
    const services =
      await getServices();

    return (
      services.find(
        (service) =>
          normalizeSlug(
            service.slug
          ) === normalizedSlug
      ) || null
    );
  } catch (error) {
    console.error(
      "[getServiceBySlug]",
      error
    );

    return null;
  }
}

export const getArticles =
  unstable_cache(
    async (): Promise<Article[]> => {
      if (!isFirebaseAdminConfigured()) {
        return useDemoContent
          ? demoArticles
          : [];
      }

      try {
        const items =
          await firestoreList<Article>(
            "articles"
          );

        const published =
          items.filter(
            (item) =>
              item.status ===
              "published"
          );

        return published.length
          ? published.sort(
              (a, b) =>
                +new Date(
                  b.publishedAt
                ) -
                +new Date(
                  a.publishedAt
                )
            )
          : useDemoContent
            ? demoArticles
            : [];
      } catch {
        return useDemoContent
          ? demoArticles
          : [];
      }
    },
    ["public-articles"],
    {
      revalidate: 300,
      tags: ["articles"]
    }
  );

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const normalizedSlug =
    normalizeSlug(slug);

  if (!isFirebaseAdminConfigured()) {
    if (!useDemoContent) {
      return null;
    }

    return (
      demoArticles.find(
        (article) =>
          normalizeSlug(
            article.slug
          ) === normalizedSlug
      ) || null
    );
  }

  try {
    const db = getAdminDb();

    if (!db) return null;

    const snapshot = await db
      .collection("articles")
      .where(
        "slug",
        "==",
        normalizedSlug
      )
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc =
        snapshot.docs[0];

      const article =
        normalize<Article>(
          doc.id,
          doc.data()
        );

      return article.status === "published"
        ? article
        : null;
    }

    const articles =
      await getArticles();

    return (
      articles.find(
        (article) =>
          normalizeSlug(
            article.slug
          ) === normalizedSlug
      ) || null
    );

  } catch (error) {
    console.error(
      "[getArticleBySlug]",
      error
    );

    return null;
  }
    }

export async function getPublicSettings(): Promise<SiteSettings> {
  const db = getAdminDb();

  if (!db) {
    return DEFAULT_SETTINGS;
  }

  try {
    const snap = await db
      .collection("settings")
      .doc("public")
      .get();

    return snap.exists
      ? {
          ...DEFAULT_SETTINGS,
          ...snap.data()
        }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getAdminProjects(): Promise<
  Project[]
> {
  if (!isFirebaseAdminConfigured()) {
    return useDemoContent
      ? demoProjects
      : [];
  }

  const items =
    await firestoreList<Project>(
      "projects"
    );

  return items.sort(
    (a, b) =>
      a.order - b.order
  );
}

export async function getAdminProject(
  id: string
): Promise<Project | null> {
  if (!isFirebaseAdminConfigured()) {
    return useDemoContent
      ? demoProjects.find(
          (item) =>
            item.id === id
        ) || null
      : null;
  }

  const db = getAdminDb();

  if (!db) return null;

  const snap = await db
    .collection("projects")
    .doc(id)
    .get();

  return snap.exists
    ? normalize<Project>(
        snap.id,
        snap.data() || {}
      )
    : null;
}

export async function getAdminServices(): Promise<
  Service[]
> {
  if (!isFirebaseAdminConfigured()) {
    return useDemoContent
      ? demoServices
      : [];
  }

  const items =
    await firestoreList<Service>(
      "services"
    );

  return items.sort(
    (a, b) =>
      a.order - b.order
  );
}

export async function getAdminService(
  id: string
): Promise<Service | null> {
  if (!isFirebaseAdminConfigured()) {
    return useDemoContent
      ? demoServices.find(
          (item) =>
            item.id === id
        ) || null
      : null;
  }

  const db = getAdminDb();

  if (!db) return null;

  const snap = await db
    .collection("services")
    .doc(id)
    .get();

  return snap.exists
    ? normalize<Service>(
        snap.id,
        snap.data() || {}
      )
    : null;
}

export async function getAdminArticles(): Promise<
  Article[]
> {
  if (!isFirebaseAdminConfigured()) {
    return useDemoContent
      ? demoArticles
      : [];
  }

  const items =
    await firestoreList<Article>(
      "articles"
    );

  return items.sort(
    (a, b) =>
      +new Date(
        b.publishedAt
      ) -
      +new Date(
        a.publishedAt
      )
  );
}

export async function getAdminArticle(
  id: string
): Promise<Article | null> {
  if (!isFirebaseAdminConfigured()) {
    return useDemoContent
      ? demoArticles.find(
          (item) =>
            item.id === id
        ) || null
      : null;
  }

  const db = getAdminDb();

  if (!db) return null;

  const snap = await db
    .collection("articles")
    .doc(id)
    .get();

  return snap.exists
    ? normalize<Article>(
        snap.id,
        snap.data() || {}
      )
    : null;
}

export async function getAdminLeads(): Promise<
  Lead[]
> {
  const db = getAdminDb();

  if (!db) return [];

  const snap = await db
    .collection("leads")
    .orderBy(
      "createdAt",
      "desc"
    )
    .limit(200)
    .get();

  return snap.docs.map(
    (doc) =>
      normalize<Lead>(
        doc.id,
        doc.data()
      )
  );
}

export async function getAdminLead(
  id: string
): Promise<Lead | null> {
  const db = getAdminDb();

  if (!db) return null;

  const snap = await db
    .collection("leads")
    .doc(id)
    .get();

  return snap.exists
    ? normalize<Lead>(
        snap.id,
        snap.data() || {}
      )
    : null;
          }
