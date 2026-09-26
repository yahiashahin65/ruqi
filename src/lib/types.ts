export type ProjectType =
  | "residential"
  | "commercial"
  | "hospitality"
  | "office"
  | "renovation";

export type LeadStatus =
  | "new"
  | "contacted"
  | "site_visit"
  | "quotation"
  | "won"
  | "lost";

/* =========================================
   MEDIA
========================================= */

export interface MediaRef {
  url: string;

  /**
   * R2 object key.
   *
   * Optional for compatibility with
   * older uploaded images.
   */
  key?: string;

  /**
   * Can be missing on old records.
   *
   * Public pages automatically generate
   * a useful fallback alt when this value
   * is missing or contains a bad filename.
   */
  alt?: string;

  width?: number;
  height?: number;
}

/* =========================================
   PROJECT
========================================= */

export interface Project {
  id: string;

  title: string;
  slug: string;

  subtitle?: string;

  type: ProjectType;

  style?: string;

  city: string;
  district?: string;

  year?: number;
  area?: number;

  duration?: string;
  scope?: string;

  excerpt: string;
  story: string;

  cover: MediaRef;
  gallery: MediaRef[];

  before?: MediaRef;
  after?: MediaRef;

  services: string[];

  featured: boolean;

  status:
    | "draft"
    | "published";

  order: number;
}

/* =========================================
   SERVICE
========================================= */

export interface Service {
  id: string;

  title: string;
  slug: string;

  eyebrow: string;

  excerpt: string;
  body: string;

  deliverables: string[];

  image: MediaRef;
  gallery: MediaRef[];

  order: number;

  status:
    | "draft"
    | "published";
}

/* =========================================
   ARTICLE
========================================= */

export interface Article {
  id: string;

  title: string;
  slug: string;

  excerpt: string;
  content: string;

  cover: MediaRef;

  category: string;

  publishedAt: string;

  status:
    | "draft"
    | "published";
}

/* =========================================
   LEADS
========================================= */

export interface LeadAttachment {
  key: string;

  name?: string;
  contentType?: string;
  size?: number;
}

export interface Lead {
  id?: string;

  name: string;
  phone: string;
  email?: string;

  projectType: string;
  serviceNeed: string;

  area?: string;

  city: string;
  district?: string;

  budget?: string;
  startTime?: string;

  notes?: string;

  attachments?: LeadAttachment[];

  status?: LeadStatus;

  source?: string;

  createdAt?: string;
}

/* =========================================
   SITE SETTINGS
========================================= */

export interface SiteSettings {
  brandName: string;

  /**
   * Visual/display version:
   * رُقِيّ الجمال
   */
  brandNameAr: string;

  tagline: string;

  city: string;

  phone: string;
  whatsapp: string;

  email?: string;

  address?: string;

  instagram?: string;
  tiktok?: string;
  snapchat?: string;

  businessHours?: string;
}
