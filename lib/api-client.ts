import { Portfolio } from "./types";
import { SubmitPortfolioInput } from "./schemas";

export interface SearchParams {
  q?: string;
  discipline?: string[];
  technology?: string;
  category?: string;
  sort?: "default" | "recent" | "popular";
}

function buildQuery(params: SearchParams) {
  const usp = new URLSearchParams();
  if (params.q) usp.set("q", params.q);
  if (params.technology) usp.set("technology", params.technology);
  if (params.category) usp.set("category", params.category);
  if (params.sort) usp.set("sort", params.sort);
  params.discipline?.forEach((d) => usp.append("discipline", d));
  return usp.toString();
}

export async function fetchPortfolios(params: SearchParams): Promise<{ results: Portfolio[]; count: number }> {
  const qs = buildQuery(params);
  const res = await fetch(`/api/portfolios${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to load portfolios");
  return res.json();
}

export async function submitPortfolio(input: SubmitPortfolioInput) {
  const res = await fetch("/api/portfolios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ? "Please check the form for errors" : "Submission failed");
  return data as { status: string; message: string; submission: SubmitPortfolioInput };
}
