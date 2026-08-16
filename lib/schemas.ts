import { z } from "zod";

export const disciplineEnum = z.enum(["DESIGN", "ENGINEERING", "PRODUCT", "DATA", "OTHER"]);

export const technologySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["FRAMEWORK", "DESIGN_TOOL", "LANGUAGE", "PLATFORM", "LIBRARY"]),
  source: z.enum(["SELF_DECLARED", "AI_DETECTED", "VERIFIED"]),
});

export const ownerSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().url(),
  role: z.enum(["MEMBER", "VERIFIED", "MODERATOR", "ADMIN", "RECRUITER"]),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  githubUsername: z.string().optional(),
  contactEmail: z.string().email().optional(),
});

export const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  authorName: z.string(),
  authorRole: z.string(),
  authorAvatarUrl: z.string().url().optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  portfolioId: z.string(),
  title: z.string().min(1),
  description: z.string(),
  thumbnailUrl: z.string().url().nullable(),
  thumbnailFallback: z
    .object({ initial: z.string(), colorFrom: z.string(), colorTo: z.string() })
    .nullable(),
  language: z.string().nullable(),
  topics: z.array(z.string()),
  stars: z.number(),
  forks: z.number(),
  sourceUrl: z.string().url(),
  demoUrl: z.string().url().nullable(),
  updatedAt: z.string(),
  isPrivate: z.boolean(),
  published: z.boolean(),
  order: z.number(),
  source: z.enum(["GITHUB_SYNC", "MANUAL"]),
  overrides: z.array(z.string()),
});

/** POST /api/github/sync request body */
export const githubSyncSchema = z.object({
  portfolioId: z.string().min(1),
  githubUsername: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, "Not a valid GitHub username")
    .optional(),
  maxRepos: z.number().min(1).max(30).default(12),
});
export type GithubSyncInput = z.infer<typeof githubSyncSchema>;

/** PATCH /api/admin/projects/:id — curator edits, per-field overrides */
export const projectUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  demoUrl: z.string().url().nullable().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

/** POST /api/contact — per-portfolio contact form */
export const contactFormSchema = z.object({
  portfolioId: z.string().min(1),
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Say a bit more (10+ characters)").max(2000),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const caseStudySummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  format: z.enum(["STATIC", "VIDEO", "INTERACTIVE_PROTOTYPE", "PROCESS_DOC"]),
});

export const portfolioSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  owner: ownerSchema,
  tagline: z.string(),
  description: z.string(),
  status: z.enum(["PENDING", "LIVE", "FLAGGED", "ARCHIVED", "BROKEN"]),
  discipline: z.array(disciplineEnum),
  coverImage: z.string().url(),
  qualityScore: z.number().min(0).max(100),
  aiSummary: z.string(),
  viewCount: z.number(),
  bookmarkCount: z.number(),
  verifiedAt: z.string().nullable(),
  createdAt: z.string(),
  technologies: z.array(technologySchema),
  caseStudies: z.array(caseStudySummarySchema),
  testimonials: z.array(testimonialSchema),
});

/**
 * POST /api/portfolios request body — mirrors the submission form (§3.1 stage 5)
 * and the automated baseline gate inputs (§4.1). This is intentionally a small
 * subset of the full Portfolio model: everything else (screenshot, tech
 * detection, quality score, AI summary) is server/worker-derived, never
 * client-supplied.
 */
export const submitPortfolioSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Enter a valid URL, including https://"),
  title: z
    .string()
    .min(3, "Title needs at least 3 characters")
    .max(100, "Keep it under 100 characters"),
  discipline: z
    .array(disciplineEnum)
    .min(1, "Select at least one discipline"),
});

export type SubmitPortfolioInput = z.infer<typeof submitPortfolioSchema>;

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  discipline: z.array(disciplineEnum).optional(),
  technology: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["default", "recent", "popular"]).default("default"),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
