/**
 * Primary professional discipline domain.
 */
export type Discipline = "DESIGN" | "ENGINEERING" | "PRODUCT" | "DATA" | "OTHER";

/**
 * Portfolio lifecycle and verification status.
 */
export type PortfolioStatus = "PENDING" | "LIVE" | "FLAGGED" | "ARCHIVED" | "BROKEN";

/**
 * Source of detected tech stack tags.
 */
export type DetectionSource = "SELF_DECLARED" | "AI_DETECTED" | "VERIFIED";

/**
 * Technology tag representation.
 */
export interface Technology {
  id: string;
  name: string;
  category: "FRAMEWORK" | "DESIGN_TOOL" | "LANGUAGE" | "PLATFORM" | "LIBRARY";
  source: DetectionSource;
}

/**
 * Developer / Designer profile owner.
 */
export interface Owner {
  username: string;
  displayName: string;
  avatarUrl: string;
  role: "MEMBER" | "VERIFIED" | "MODERATOR" | "ADMIN" | "RECRUITER";
  githubUsername?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  contactEmail?: string;
}

/**
 * Community engagement and ranking metrics.
 */
export interface EngagementMetrics {
  day: number;
  week: number;
  month: number;
  allTime: number;
}

/**
 * Peer recommendation or testimonial quote.
 */
export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl?: string;
}

/**
 * Project repository source type.
 */
export type ProjectSource = "GITHUB_SYNC" | "MANUAL";

/**
 * Individual showcase project or GitHub repository.
 */
export interface Project {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailFallback: { initial: string; colorFrom: string; colorTo: string } | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  sourceUrl: string;
  demoUrl: string | null;
  updatedAt: string;
  isPrivate: boolean;
  published: boolean;
  order: number;
  source: ProjectSource;
  overrides: string[];
}

/**
 * Case study preview summary.
 */
export interface CaseStudySummary {
  id: string;
  title: string;
  format: "STATIC" | "VIDEO" | "INTERACTIVE_PROTOTYPE" | "PROCESS_DOC";
}

/**
 * Core Portfolio data model representing a curated website entry.
 */
export interface Portfolio {
  id: string;
  slug: string;
  title: string;
  url: string;
  owner: Owner;
  tagline: string;
  description: string;
  status: PortfolioStatus;
  discipline: Discipline[];
  coverImage: string;
  qualityScore: number;
  aiSummary: string;
  viewCount: number;
  bookmarkCount: number;
  likes: EngagementMetrics;
  primaryCategory: string;
  verifiedAt: string | null;
  createdAt: string;
  technologies: Technology[];
  caseStudies: CaseStudySummary[];
  testimonials: Testimonial[];
  styleCategory?: string;
}
