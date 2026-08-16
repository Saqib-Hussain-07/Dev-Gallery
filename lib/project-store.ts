import { promises as fs } from "fs";
import path from "path";
import { Project } from "./types";

/**
 * JSON-file persistence, scoped to this sandbox/dev environment only.
 *
 * Production note: this is exactly the kind of mutable state that must live
 * in Postgres (blueprint §1.3 — a `Project` table alongside `CaseStudy`),
 * not the filesystem. Serverless platforms like Vercel ship a read-only
 * filesystem outside `/tmp`, so this module will not persist writes once
 * deployed — it's a local-dev / same-process stand-in that keeps the admin
 * curation flow (§8 moderation queue) fully working end-to-end here.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<Project[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

async function writeAll(projects: Project[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export async function listProjects(portfolioId: string): Promise<Project[]> {
  const all = await readAll();
  return all.filter((p) => p.portfolioId === portfolioId).sort((a, b) => a.order - b.order);
}

export async function listPublishedProjects(portfolioId: string): Promise<Project[]> {
  const all = await listProjects(portfolioId);
  return all.filter((p) => p.published);
}

/**
 * Merge freshly-synced GitHub projects into the store. Fields the curator
 * has manually overridden (tracked in `overrides`) are preserved rather than
 * clobbered by the sync — this is the "manual override + automatic sync
 * coexist" requirement.
 */
export async function upsertSyncedProjects(incoming: Project[]): Promise<{ created: number; updated: number }> {
  const all = await readAll();
  let created = 0;
  let updated = 0;

  for (const next of incoming) {
    const idx = all.findIndex((p) => p.id === next.id);
    if (idx === -1) {
      all.push({ ...next, order: all.filter((p) => p.portfolioId === next.portfolioId).length });
      created += 1;
      continue;
    }

    const existing = all[idx];
    const merged: Project = { ...next, order: existing.order, published: existing.published, overrides: existing.overrides };
    for (const field of existing.overrides) {
      // @ts-expect-error — dynamic field copy across a known key set
      merged[field] = existing[field];
    }
    all[idx] = merged;
    updated += 1;
  }

  await writeAll(all);
  return { created, updated };
}

export async function updateProject(
  id: string,
  patch: Partial<Pick<Project, "title" | "description" | "thumbnailUrl" | "demoUrl" | "published" | "order">>
): Promise<Project | null> {
  const all = await readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const overrideFields = Object.keys(patch).filter((k) => k !== "published" && k !== "order");
  const nextOverrides = Array.from(new Set([...all[idx].overrides, ...overrideFields]));

  all[idx] = { ...all[idx], ...patch, overrides: nextOverrides };
  await writeAll(all);
  return all[idx];
}

export async function deleteProject(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((p) => p.id !== id);
  await writeAll(next);
  return next.length !== all.length;
}

export async function reorderProjects(portfolioId: string, orderedIds: string[]): Promise<void> {
  const all = await readAll();
  orderedIds.forEach((id, index) => {
    const item = all.find((p) => p.id === id && p.portfolioId === portfolioId);
    if (item) item.order = index;
  });
  await writeAll(all);
}
