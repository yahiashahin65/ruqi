import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(8).max(24),
  email: z.string().email().optional().or(z.literal("")),
  projectType: z.string().min(2).max(50),
  serviceNeed: z.string().min(2).max(80),
  area: z.string().max(40).optional(),
  city: z.string().min(2).max(60),
  district: z.string().max(80).optional(),
  budget: z.string().max(60).optional(),
  startTime: z.string().max(60).optional(),
  notes: z.string().max(1800).optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    key: z.string().optional(),
    alt: z.string().optional()
  })).max(6).optional(),
  turnstileToken: z.string().optional()
});

export const projectSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(120),
  subtitle: z.string().max(180).optional(),
  type: z.enum(["residential", "commercial", "hospitality", "office", "renovation"]),
  style: z.string().max(80).optional(),
  city: z.string().min(2).max(80),
  district: z.string().max(80).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  area: z.coerce.number().positive().optional(),
  duration: z.string().max(80).optional(),
  scope: z.string().max(180).optional(),
  excerpt: z.string().min(20).max(300),
  story: z.string().min(40).max(7000),
  cover: z.object({ url: z.string().url(), key: z.string().optional(), alt: z.string().optional() }),
  gallery: z.array(z.object({ url: z.string().url(), key: z.string().optional(), alt: z.string().optional() })).max(30),
  before: z.object({ url: z.string().url(), key: z.string().optional(), alt: z.string().optional() }).optional(),
  after: z.object({ url: z.string().url(), key: z.string().optional(), alt: z.string().optional() }).optional(),
  services: z.array(z.string()).max(12),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
  order: z.coerce.number().int().min(0).max(999),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(180).optional()
});


export const serviceSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(120),
  eyebrow: z.string().min(2).max(120),
  excerpt: z.string().min(20).max(350),
  body: z.string().min(40).max(7000),
  deliverables: z.array(z.string().min(1).max(120)).max(30),
  image: z.object({ url: z.string().url(), key: z.string().optional(), alt: z.string().optional() }),
  order: z.coerce.number().int().min(0).max(999),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(180).optional()
});

export const articleSchema = z.object({
  title: z.string().min(4).max(180),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(150),
  excerpt: z.string().min(20).max(350),
  content: z.string().min(80).max(30000),
  cover: z.object({ url: z.string().url(), key: z.string().optional(), alt: z.string().optional() }),
  category: z.string().min(2).max(80),
  publishedAt: z.string().min(8).max(40),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(180).optional()
});
