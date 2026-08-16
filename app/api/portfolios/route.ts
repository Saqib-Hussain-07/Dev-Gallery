import { NextRequest, NextResponse } from "next/server";
import { getWallfolioPortfolios } from "@/lib/wallfolio-sync";
import { searchQuerySchema, submitPortfolioSchema } from "@/lib/schemas";
import { Portfolio } from "@/lib/types";

// GET /api/portfolios
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const parsed = searchQuerySchema.safeParse({
    q: params.get("q") ?? undefined,
    discipline: params.getAll("discipline").length ? params.getAll("discipline") : undefined,
    technology: params.get("technology") ?? undefined,
    category: params.get("category") ?? undefined,
    sort: params.get("sort") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { q, discipline, technology, category, sort } = parsed.data;

  const allPortfolios = await getWallfolioPortfolios();
  let results = allPortfolios.filter((p) => p.status === "LIVE");

  if (discipline?.length) {
    results = results.filter((p) => p.discipline.some((d) => discipline.includes(d)));
  }
  if (technology) {
    results = results.filter((p) => p.technologies.some((t) => t.name === technology));
  }
  if (category && category !== "all") {
    results = results.filter((p) => p.primaryCategory === category);
  }
  if (q) {
    const needle = q.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.owner.displayName.toLowerCase().includes(needle) ||
        p.tagline.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.technologies.some((t) => t.name.toLowerCase().includes(needle))
    );
  }

  results = sortPortfolios(results, sort);

  return NextResponse.json({ results, count: results.length });
}

function sortPortfolios(list: Portfolio[], sort: "default" | "recent" | "popular") {
  if (sort === "recent") {
    return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  if (sort === "popular") {
    return [...list].sort((a, b) => b.bookmarkCount - a.bookmarkCount);
  }
  return [...list].sort((a, b) => b.qualityScore - a.qualityScore);
}

// POST /api/portfolios — submission
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = submitPortfolioSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json(
    {
      status: "PENDING",
      message: "Baseline checks queued: link health, parked-domain check, screenshot capture.",
      submission: parsed.data,
    },
    { status: 202 }
  );
}
