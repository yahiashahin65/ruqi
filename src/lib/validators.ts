import { z } from "zod";

const mediaSchema = z.object({
  url: z.string().url(),
  key: z.string().optional(),
  alt: z.string().optional()
});

export const leadSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(8).max(24),
  projectType: z.string().min(2).max(50),
  serviceNeed: z.string().min(2).max(80),
  area: z.string().max(40).optional(),
  notes: z.string().max(1800).optional(),
  turnstileToken: z.string().optional()
});

export const projectSchema = z.object({
  title: z.string().min(2).max(120),
  type: z.enum(["residential", "commercial", "hospitality", "office", "renovation"]),
  style: z.string().max(80).optional().default(""),
  area: z.coerce.number().positive().optional(),
  duration: z.string().max(80).optional().default(""),
  excerpt: z.string().min(10).max(320),
  story: z.string().min(20).max(7000),
  cover: mediaSchema,
  gallery: z.array(mediaSchema).max(30).default([]),
  before: mediaSchema.optional(),
  after: mediaSchema.optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"])
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(120),
  excerpt: z.string().min(10).max(350),
  body: z.string().min(20).max(7000),
  deliverables: z.array(z.string().min(1).max(140)).max(30).default([]),
  image: mediaSchema,
  gallery: z.array(mediaSchema).max(30).default([]),
  status: z.enum(["draft", "published"])
});

export const articleSchema = z.object({
  title: z.string().min(4).max(180),
  excerpt: z.string().min(10).max(350),
  content: z.string().min(40).max(30000),
  cover: mediaSchema,
  category: z.string().min(2).max(80),
  status: z.enum(["draft", "published"])
});
