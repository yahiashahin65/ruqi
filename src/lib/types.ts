export type ProjectType = "residential" | "commercial" | "hospitality" | "office" | "renovation";
export type LeadStatus = "new" | "contacted" | "site_visit" | "quotation" | "won" | "lost";

export interface MediaRef {
  url: string;
  key?: string;
  alt?: string;
  width?: number;
  height?: number;
}

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
  status: "draft" | "published";
  order: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  eyebrow: string;
  excerpt: string;
  body: string;
  deliverables: string[];
  image: MediaRef;
  order: number;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: MediaRef;
  category: string;
  publishedAt: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
}

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

export interface SiteSettings {
  brandName: string;
  brandNameAr: string;
  tagline: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string;
  instagram?: string;
  businessHours?: string;
}
