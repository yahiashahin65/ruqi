import type {
  DocumentData
} from "firebase-admin/firestore";

import {
  unstable_cache
} from "next/cache";

import {
  getAdminDb,
  isFirebaseAdminConfigured
} from "./admin";

import {
  demoArticles,
  demoProjects,
  demoServices
} from "../demo-data";

import type {
  Article,
  Lead,
  Project,
  Service,
  SiteSettings
} from "../types";

import {
  DEFAULT_SETTINGS
} from "../constants";

/* =========================================
   DEMO CONTENT
========================================= */

/*
 * Important:
 *
 * Demo content is now OFF by default.
 *
 * To enable it intentionally:
 *
 * NEXT_PUBLIC_DEMO_CONTENT=true
 *
 * This prevents demo projects/services/articles
 * from accidentally appearing on production.
 */
const useDemoContent =
  process.env
    .NEXT_PUBLIC_DEMO_CONTENT ===
  "true";

/* =========================================
   BASIC NORMALIZATION
========================================= */

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

/*
 * Old Firestore records may still contain:
 *
 * seoTitle
 * seoDescription
 *
 * They are no longer part of the application
 * and must not be returned to the rest
 * of the public/admin code.
 *
 * They remain in Firestore until the record
 * is edited, where PATCH routes delete them.
 */
function removeLegacySeoFields(
  data: DocumentData
): DocumentData {
  const clean = {
    ...data
  };

  delete clean.seoTitle;
  delete clean.seoDescription;

  return clean;
}

/* =========================================
   CONTENT NORMALIZERS
========================================= */

function normalizeProject(
  id: string,
  data: DocumentData
): Project {
  const project =
    normalize<Project>(
      id,
      removeLegacySeoFields(
        data
      )
    );

  return {
    ...project,

    city:
      project.city ||
      "المدينة المنورة",

    gallery:
      Array.isArray(
        project.gallery
      )
        ? project.gallery
        : [],

    services:
      Array.isArray(
        project.services
      )
        ? project.services
        : [],

    featured:
      Boolean(
        project.featured
      ),

    order:
      Number.isFinite(
        Number(
          project.order
        )
      )
        ? Number(
            project.order
          )
        : 1
  };
}

function normalizeService(
  id: string,
  data: DocumentData
): Service {
  const service =
    normalize<Service>(
      id,
      removeLegacySeoFields(
        data
      )
    );

  return {
    ...service,

    eyebrow:
      service.eyebrow ||
      "خدماتنا",

    gallery:
      Array.isArray(
        service.gallery
      )
        ? service.gallery
        : [],

    deliverables:
      Array.isArray(
        service.deliverables
      )
        ? service.deliverables
        : [],

    order:
      Number.isFinite(
        Number(
          service.order
        )
      )
        ? Number(
            service.order
          )
        : 1
  };
}

function normalizeArticle(
  id: string,
  data: DocumentData
): Article {
  return normalize<Article>(
    id,
    removeLegacySeoFields(
      data
    )
  );
}

/* =========================================
   SLUG
========================================= */

function normalizeSlug(
  slug: string
) {
  let value =
    slug;

  try {
    value =
      decodeURIComponent(
        slug
      );
  } catch {
    value =
      slug;
  }

  return value
    .normalize("NFKC")
    .trim()
    .replace(
      /^\/+|\/+$/g,
      ""
    );
}


/* =========================================
   SLUG LOOKUP WITH HISTORY
========================================= */

async function findBySlugOrPreviousSlug<T>(
  collectionName:
    | "services"
    | "projects"
    | "articles",
  slug: string,
  normalizeItem: (
    id: string,
    data: DocumentData
  ) => T
): Promise<{
  item: T | null;
  isOldSlug: boolean;
}> {
  const db = getAdminDb();

  if (!db) {
    return {
      item: null,
      isOldSlug: false
    };
  }

  const normalizedSlug =
    normalizeSlug(slug);

  const currentSnapshot =
    await db
      .collection(collectionName)
      .where("slug", "==", normalizedSlug)
      .limit(1)
      .get();

  if (!currentSnapshot.empty) {
    const doc =
      currentSnapshot.docs[0];

    return {
      item:
        normalizeItem(
          doc.id,
          doc.data()
        ),
      isOldSlug: false
    };
  }

  const oldSnapshot =
    await db
      .collection(collectionName)
      .where(
        "previousSlugs",
        "array-contains",
        normalizedSlug
      )
      .limit(1)
      .get();

  if (!oldSnapshot.empty) {
    const doc =
      oldSnapshot.docs[0];

    return {
      item:
        normalizeItem(
          doc.id,
          doc.data()
        ),
      isOldSlug: true
    };
  }

  return {
    item: null,
    isOldSlug: false
  };
}

/* =========================================
   DATE HELPERS
========================================= */

function dateTimestamp(
  value?: string
) {
  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(
      value
    ).getTime();

  return Number.isNaN(
    timestamp
  )
    ? 0
    : timestamp;
}

/* =========================================
   GENERIC FIRESTORE LIST
========================================= */

async function firestoreList(
  collectionName: string
): Promise<
  Array<{
    id: string;
    data: DocumentData;
  }>
> {
  const db =
    getAdminDb();

  if (!db) {
    return [];
  }

  const snap =
    await db
      .collection(
        collectionName
      )
      .get();

  return snap.docs.map(
    (doc) => ({
      id:
        doc.id,

      data:
        doc.data()
    })
  );
}

/* =========================================
   PUBLIC PROJECTS
========================================= */

export const getProjects =
  unstable_cache(
    async (): Promise<
      Project[]
    > => {
      if (
        !isFirebaseAdminConfigured()
      ) {
        return useDemoContent
          ? demoProjects
          : [];
      }

      try {
        const docs =
          await firestoreList(
            "projects"
          );

        const items =
          docs.map(
            ({
              id,
              data
            }) =>
              normalizeProject(
                id,
                data
              )
          );

        const published =
          items
            .filter(
              (item) =>
                item.status ===
                "published"
            )
            .sort(
              (
                a,
                b
              ) =>
                a.order -
                b.order
            );

        if (
          published.length
        ) {
          return published;
        }

        return useDemoContent
          ? demoProjects
          : [];
      } catch (
        error
      ) {
        console.error(
          "[getProjects]",
          error
        );

        return useDemoContent
          ? demoProjects
          : [];
      }
    },
    [
      "public-projects"
    ],
    {
      revalidate:
        120,

      tags: [
        "projects"
      ]
    }
  );

/* =========================================
   PUBLIC PROJECT BY SLUG
========================================= */

export async function getProjectBySlug(
  slug: string
): Promise<
  Project | null
> {
  const normalizedSlug =
    normalizeSlug(
      slug
    );

  if (
    !isFirebaseAdminConfigured()
  ) {
    if (
      !useDemoContent
    ) {
      return null;
    }

    return (
      demoProjects.find(
        (project) =>
          normalizeSlug(
            project.slug
          ) ===
          normalizedSlug
      ) || null
    );
  }

  const result =
    await findBySlugOrPreviousSlug(
      "projects",
      normalizedSlug,
      normalizeProject
    );

  return result.item;
}

/* =========================================
   PUBLIC SERVICES
========================================= */

export const getServices =
  unstable_cache(
    async (): Promise<
      Service[]
    > => {
      if (
        !isFirebaseAdminConfigured()
      ) {
        return useDemoContent
          ? demoServices
          : [];
      }

      try {
        const docs =
          await firestoreList(
            "services"
          );

        const items =
          docs.map(
            ({
              id,
              data
            }) =>
              normalizeService(
                id,
                data
              )
          );

        const published =
          items
            .filter(
              (item) =>
                item.status ===
                "published"
            )
            .sort(
              (
                a,
                b
              ) =>
                a.order -
                b.order
            );

        if (
          published.length
        ) {
          return published;
        }

        return useDemoContent
          ? demoServices
          : [];
      } catch (
        error
      ) {
        console.error(
          "[getServices]",
          error
        );

        return useDemoContent
          ? demoServices
          : [];
      }
    },
    [
      "public-services"
    ],
    {
      revalidate:
        300,

      tags: [
        "services"
      ]
    }
  );

/* =========================================
   PUBLIC SERVICE BY SLUG
========================================= */

export async function getServiceBySlug(
  slug: string
): Promise<
  Service | null
> {
  const normalizedSlug =
    normalizeSlug(
      slug
    );

  if (
    !isFirebaseAdminConfigured()
  ) {
    if (
      !useDemoContent
    ) {
      return null;
    }

    return (
      demoServices.find(
        (service) =>
          normalizeSlug(
            service.slug
          ) ===
          normalizedSlug
      ) || null
    );
  }

  const result =
    await findBySlugOrPreviousSlug(
      "services",
      normalizedSlug,
      normalizeService
    );

  return result.item;
}

/* =========================================
   PUBLIC ARTICLES
========================================= */

export const getArticles =
  unstable_cache(
    async (): Promise<
      Article[]
    > => {
      if (
        !isFirebaseAdminConfigured()
      ) {
        return useDemoContent
          ? demoArticles
          : [];
      }

      try {
        const docs =
          await firestoreList(
            "articles"
          );

        const items =
          docs.map(
            ({
              id,
              data
            }) =>
              normalizeArticle(
                id,
                data
              )
          );

        const published =
          items
            .filter(
              (item) =>
                item.status ===
                "published"
            )
            .sort(
              (
                a,
                b
              ) =>
                dateTimestamp(
                  b.publishedAt
                ) -
                dateTimestamp(
                  a.publishedAt
                )
            );

        if (
          published.length
        ) {
          return published;
        }

        return useDemoContent
          ? demoArticles
          : [];
      } catch (
        error
      ) {
        console.error(
          "[getArticles]",
          error
        );

        return useDemoContent
          ? demoArticles
          : [];
      }
    },
    [
      "public-articles"
    ],
    {
      revalidate:
        300,

      tags: [
        "articles"
      ]
    }
  );

/* =========================================
   PUBLIC ARTICLE BY SLUG
========================================= */

export async function getArticleBySlug(
  slug: string
): Promise<
  Article | null
> {
  const normalizedSlug =
    normalizeSlug(
      slug
    );

  if (
    !isFirebaseAdminConfigured()
  ) {
    if (
      !useDemoContent
    ) {
      return null;
    }

    return (
      demoArticles.find(
        (article) =>
          normalizeSlug(
            article.slug
          ) ===
          normalizedSlug
      ) || null
    );
  }

  const result =
    await findBySlugOrPreviousSlug(
      "articles",
      normalizedSlug,
      normalizeArticle
    );

  return result.item;
}

/* =========================================
   PUBLIC SETTINGS
========================================= */

export async function getPublicSettings(): Promise<
  SiteSettings
> {
  const db =
    getAdminDb();

  if (!db) {
    return DEFAULT_SETTINGS;
  }

  try {
    const snap =
      await db
        .collection(
          "settings"
        )
        .doc(
          "public"
        )
        .get();

    if (
      !snap.exists
    ) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...snap.data()
    } as SiteSettings;
  } catch (
    error
  ) {
    console.error(
      "[getPublicSettings]",
      error
    );

    return DEFAULT_SETTINGS;
  }
}

/* =========================================
   ADMIN PROJECTS
========================================= */

export async function getAdminProjects(): Promise<
  Project[]
> {
  if (
    !isFirebaseAdminConfigured()
  ) {
    return useDemoContent
      ? demoProjects
      : [];
  }

  const docs =
    await firestoreList(
      "projects"
    );

  return docs
    .map(
      ({
        id,
        data
      }) =>
        normalizeProject(
          id,
          data
        )
    )
    .sort(
      (
        a,
        b
      ) =>
        a.order -
        b.order
    );
}

/* =========================================
   ADMIN PROJECT
========================================= */

export async function getAdminProject(
  id: string
): Promise<
  Project | null
> {
  if (
    !isFirebaseAdminConfigured()
  ) {
    return useDemoContent
      ? demoProjects.find(
          (item) =>
            item.id ===
            id
        ) || null
      : null;
  }

  const db =
    getAdminDb();

  if (!db) {
    return null;
  }

  const snap =
    await db
      .collection(
        "projects"
      )
      .doc(id)
      .get();

  if (
    !snap.exists
  ) {
    return null;
  }

  return normalizeProject(
    snap.id,
    snap.data() || {}
  );
}

/* =========================================
   ADMIN SERVICES
========================================= */

export async function getAdminServices(): Promise<
  Service[]
> {
  if (
    !isFirebaseAdminConfigured()
  ) {
    return useDemoContent
      ? demoServices
      : [];
  }

  const docs =
    await firestoreList(
      "services"
    );

  return docs
    .map(
      ({
        id,
        data
      }) =>
        normalizeService(
          id,
          data
        )
    )
    .sort(
      (
        a,
        b
      ) =>
        a.order -
        b.order
    );
}

/* =========================================
   ADMIN SERVICE
========================================= */

export async function getAdminService(
  id: string
): Promise<
  Service | null
> {
  if (
    !isFirebaseAdminConfigured()
  ) {
    return useDemoContent
      ? demoServices.find(
          (item) =>
            item.id ===
            id
        ) || null
      : null;
  }

  const db =
    getAdminDb();

  if (!db) {
    return null;
  }

  const snap =
    await db
      .collection(
        "services"
      )
      .doc(id)
      .get();

  if (
    !snap.exists
  ) {
    return null;
  }

  return normalizeService(
    snap.id,
    snap.data() || {}
  );
}

/* =========================================
   ADMIN ARTICLES
========================================= */

export async function getAdminArticles(): Promise<
  Article[]
> {
  if (
    !isFirebaseAdminConfigured()
  ) {
    return useDemoContent
      ? demoArticles
      : [];
  }

  const docs =
    await firestoreList(
      "articles"
    );

  return docs
    .map(
      ({
        id,
        data
      }) =>
        normalizeArticle(
          id,
          data
        )
    )
    .sort(
      (
        a,
        b
      ) =>
        dateTimestamp(
          b.publishedAt
        ) -
        dateTimestamp(
          a.publishedAt
        )
    );
}

/* =========================================
   ADMIN ARTICLE
========================================= */

export async function getAdminArticle(
  id: string
): Promise<
  Article | null
> {
  if (
    !isFirebaseAdminConfigured()
  ) {
    return useDemoContent
      ? demoArticles.find(
          (item) =>
            item.id ===
            id
        ) || null
      : null;
  }

  const db =
    getAdminDb();

  if (!db) {
    return null;
  }

  const snap =
    await db
      .collection(
        "articles"
      )
      .doc(id)
      .get();

  if (
    !snap.exists
  ) {
    return null;
  }

  return normalizeArticle(
    snap.id,
    snap.data() || {}
  );
}

/* =========================================
   ADMIN LEADS
========================================= */

export async function getAdminLeads(): Promise<
  Lead[]
> {
  const db =
    getAdminDb();

  if (!db) {
    return [];
  }

  const snap =
    await db
      .collection(
        "leads"
      )
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

/* =========================================
   ADMIN LEAD
========================================= */

export async function getAdminLead(
  id: string
): Promise<
  Lead | null
> {
  const db =
    getAdminDb();

  if (!db) {
    return null;
  }

  const snap =
    await db
      .collection(
        "leads"
      )
      .doc(id)
      .get();

  return snap.exists
    ? normalize<Lead>(
        snap.id,
        snap.data() || {}
      )
    : null;
}
