export type Discipline = "DESIGN" | "ENGINEERING" | "PRODUCT" | "DATA" | "OTHER";

export type PortfolioStatus = "PENDING" | "LIVE" | "FLAGGED" | "ARCHIVED" | "BROKEN";

export type DetectionSource = "SELF_DECLARED" | "AI_DETECTED" | "VERIFIED";

export interface Technology {
  id: string;
  name: string;
  category: "FRAMEWORK" | "DESIGN_TOOL" | "LANGUAGE" | "PLATFORM" | "LIBRARY";
  source: DetectionSource;
}

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

export interface EngagementMetrics {
  day: number;
  week: number;
  month: number;
  allTime: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl?: string;
}

export type ProjectSource = "GITHUB_SYNC" | "MANUAL";

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

export interface CaseStudySummary {
  id: string;
  title: string;
  format: "STATIC" | "VIDEO" | "INTERACTIVE_PROTOTYPE" | "PROCESS_DOC";
}

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
