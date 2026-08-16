import { Project } from "./types";

const GITHUB_API = "https://api.github.com";

/**
 * Very small in-memory cache to avoid hammering GitHub's rate limit
 * (60 req/hr unauthenticated, 5000/hr with a token) within a single server
 * process. This is NOT durable across serverless invocations or multiple
 * instances — production should back this with Upstash Redis per blueprint
 * §1.1, keyed the same way. Flagged in README.
 */
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, { expires: number; value: unknown }>();

function cacheGet<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

function cacheSet(key: string, value: unknown) {
  cache.set(key, { expires: Date.now() + CACHE_TTL_MS, value });
}

export class GithubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: "NOT_FOUND" | "RATE_LIMITED" | "FORBIDDEN" | "UNKNOWN"
  ) {
    super(message);
  }
}

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
}

async function githubFetch<T>(path: string, token?: string): Promise<T> {
  const cacheKey = token ? `${path}::authed` : path;
  const cached = cacheGet<T>(cacheKey);
  if (cached) return cached;

  const bearer = token || process.env.GITHUB_TOKEN;

  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    // Next.js server-side fetch cache — real HTTP-level caching layer for
    // production, on top of the in-memory map above. Skipped for
    // user-token requests so one signed-in user's session token is never
    // reused to serve a cached response to a different user.
    next: token ? undefined : { revalidate: 600 },
    cache: token ? "no-store" : undefined,
  });

  if (res.status === 404) {
    throw new GithubApiError(`GitHub resource not found: ${path}`, 404, "NOT_FOUND");
  }
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    throw new GithubApiError(
      remaining === "0"
        ? "GitHub API rate limit exceeded. Try again later, or set GITHUB_TOKEN for a higher limit."
        : "GitHub API request forbidden (private repo or blocked).",
      res.status,
      remaining === "0" ? "RATE_LIMITED" : "FORBIDDEN"
    );
  }
  if (!res.ok) {
    throw new GithubApiError(`GitHub API error (${res.status}) for ${path}`, res.status, "UNKNOWN");
  }

  const json = (await res.json()) as T;
  if (!token) cacheSet(cacheKey, json);
  return json;
}

/**
 * Fetch repos for sync. Two modes:
 *  - Authenticated (accessToken present): calls `/user/repos`, which
 *    includes the signed-in user's PRIVATE repos (their OAuth grant is
 *    `read:user repo`) — this is what "handle private repository
 *    permissions appropriately" actually requires: private repos only
 *    ever show up for the account that owns them, via their own token.
 *  - Unauthenticated (username only): calls the public
 *    `/users/:username/repos` endpoint, which the GitHub API itself never
 *    returns private repos from — no filtering needed to keep this safe,
 *    it's structurally impossible for it to leak someone else's private
 *    repo.
 */
export async function fetchGithubRepos(
  username: string,
  limit = 12,
  accessToken?: string
): Promise<(GithubRepo & { private: boolean })[]> {
  const path = accessToken
    ? `/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner`
    : `/users/${encodeURIComponent(username)}/repos?sort=updated&direction=desc&per_page=100&type=owner`;

  const repos = await githubFetch<GithubRepo[]>(path, accessToken);
  return repos.filter((r) => !r.fork && !r.archived).slice(0, limit);
}

/** Best-effort README fetch — many repos won't have one, or it'll 404; that's not fatal. */
async function fetchReadme(fullName: string, accessToken?: string): Promise<string | null> {
  try {
    const data = await githubFetch<{ content: string; encoding: string }>(
      `/repos/${fullName}/readme`,
      accessToken
    );
    if (data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return data.content;
  } catch (err) {
    if (err instanceof GithubApiError && err.code === "NOT_FOUND") return null;
    throw err;
  }
}

/** Pull the first plausible "live demo" link and the first image out of a README. */
function parseReadme(readme: string) {
  // Demo/live link: a markdown link whose text contains words like "demo",
  // "live", "preview" — heuristic, best-effort.
  const linkPattern = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
  let demoUrl: string | null = null;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(readme))) {
    const [, text, url] = match;
    if (/demo|live|preview|website/i.test(text) && !url.includes("github.com")) {
      demoUrl = url;
      break;
    }
  }

  // First embedded image, for a thumbnail — badges (shields.io) are excluded.
  const imgPattern = /!\[[^\]]*\]\((https?:\/\/[^\s)]+\.(?:png|jpe?g|gif|webp|svg))\)/gi;
  let thumbnailUrl: string | null = null;
  let imgMatch: RegExpExecArray | null;
  while ((imgMatch = imgPattern.exec(readme))) {
    const url = imgMatch[1];
    if (!/shields\.io|badge|codecov|travis-ci|github\.com.*workflows/i.test(url)) {
      thumbnailUrl = url;
      break;
    }
  }

  return { demoUrl, thumbnailUrl };
}

// Fallback thumbnails stay within the monochrome system too — each language
// gets a distinct *lightness* tier rather than a hue, so repos are still
// visually distinguishable at a glance without breaking the black/white/gray
// palette constraint.
const LANGUAGE_GRADIENTS: Record<string, [string, string]> = {
  TypeScript: ["#4a4a4a", "#1a1a1a"],
  JavaScript: ["#5c5c5c", "#202020"],
  Python: ["#454545", "#161616"],
  Go: ["#525252", "#1c1c1c"],
  Rust: ["#3d3d3d", "#141414"],
  Java: ["#494949", "#181818"],
  Ruby: ["#404040", "#151515"],
  Swift: ["#4f4f4f", "#1e1e1e"],
  Kotlin: ["#585858", "#1f1f1f"],
  HTML: ["#464646", "#171717"],
  CSS: ["#565656", "#1d1d1d"],
  Shell: ["#3a3a3a", "#131313"],
};

/** Generative placeholder for repos with no README image — language-tinted gradient + initial. */
function fallbackThumbnail(name: string, language: string | null) {
  const [colorFrom, colorTo] = (language && LANGUAGE_GRADIENTS[language]) || ["#3a3a3a", "#161616"];
  return { initial: name.charAt(0).toUpperCase(), colorFrom, colorTo };
}

/**
 * Full pipeline: GitHub repo list -> normalized Project entries.
 * Errors on individual repos (README fetch failure, malformed data) are
 * swallowed per-repo so one bad repo doesn't fail the whole sync — the repo
 * still gets listed, just without README-derived enrichment.
 */
export async function syncGithubProjects(
  portfolioId: string,
  username: string,
  limit: number,
  accessToken?: string
): Promise<{ projects: Project[]; skipped: number }> {
  const repos = await fetchGithubRepos(username, limit, accessToken);
  let skipped = 0;

  const projects = await Promise.all(
    repos.map(async (repo): Promise<Project> => {
      let demoUrl: string | null = repo.homepage || null;
      let thumbnailUrl: string | null = null;

      try {
        const readme = await fetchReadme(repo.full_name, accessToken);
        if (readme) {
          const parsed = parseReadme(readme);
          demoUrl = demoUrl || parsed.demoUrl;
          thumbnailUrl = parsed.thumbnailUrl;
        }
      } catch {
        // README fetch failed (rate limit, transient error) — not fatal,
        // continue with what we have from the repo metadata itself.
        skipped += 1;
      }

      return {
        id: `gh-${repo.id}`,
        portfolioId,
        title: repo.name,
        description: repo.description || "No description provided in this repository.",
        thumbnailUrl,
        thumbnailFallback: thumbnailUrl ? null : fallbackThumbnail(repo.name, repo.language),
        language: repo.language,
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        sourceUrl: repo.html_url,
        demoUrl,
        updatedAt: repo.updated_at,
        isPrivate: repo.private,
        published: false, // curator must approve before it appears publicly — §8 moderation queue
        order: 0,
        source: "GITHUB_SYNC",
        overrides: [],
      };
    })
  );

  return { projects, skipped };
}
