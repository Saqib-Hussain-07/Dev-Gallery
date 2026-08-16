"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { disciplineFacets, technologyFacets, CATEGORIES } from "@/lib/mock-data";
import { fetchPortfolios } from "@/lib/api-client";
import { PortfolioCard } from "@/components/portfolio-card";
import { cn } from "@/lib/utils";
import { Discipline } from "@/lib/types";
import { Loader2, X } from "lucide-react";

type Sort = "default" | "recent" | "popular";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL is the source of truth for filter state — this is what makes browser
  // back-navigation actually restore the previous filtered/sorted view
  // (requirement: "back navigation returning to the user's previous
  // filtered/sorted state"), instead of resetting to defaults on remount.
  const activeDisciplines = useMemo(
    () => searchParams.getAll("discipline") as Discipline[],
    [searchParams]
  );
  const activeTech = searchParams.get("technology");
  const activeCategory = searchParams.get("category");
  const sort = (searchParams.get("sort") as Sort) || "default";

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      // replace (not push) — filter tweaks shouldn't pile up browser history
      // entries; a single "back" from a detail page should land on the wall
      // exactly as it was, not step through every checkbox click.
      router.replace(`${pathname}?${next.toString()}#wall`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  function toggleDiscipline(d: Discipline) {
    updateParams((params) => {
      const current = params.getAll("discipline");
      params.delete("discipline");
      const next = current.includes(d) ? current.filter((x) => x !== d) : [...current, d];
      next.forEach((v) => params.append("discipline", v));
    });
  }

  function setTech(tech: string | null) {
    updateParams((params) => {
      if (tech) params.set("technology", tech);
      else params.delete("technology");
    });
  }

  function clearCategory() {
    updateParams((params) => params.delete("category"));
  }

  function setSort(value: Sort) {
    updateParams((params) => params.set("sort", value));
  }

  const queryParams = useMemo(
    () => ({
      discipline: activeDisciplines.length ? activeDisciplines : undefined,
      technology: activeTech ?? undefined,
      category: activeCategory ?? undefined,
      sort,
    }),
    [activeDisciplines, activeTech, activeCategory, sort]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["portfolios", queryParams],
    queryFn: () => fetchPortfolios(queryParams),
  });

  const results = data?.results ?? [];
  const categoryLabel = CATEGORIES.find((c) => c.slug === activeCategory)?.label;

  return (
    <div>
      {activeCategory && (
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-ink-faint uppercase tracking-wider">Category:</span>
          <button
            onClick={clearCategory}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider bg-signal text-signal-ink rounded-sm"
          >
            {categoryLabel ?? activeCategory} <X size={12} />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 mb-10 pb-6 border-b border-rule">
        <div className="flex-1">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-2">
            Discipline
          </span>
          <div className="flex flex-wrap gap-2">
            {disciplineFacets.map((d) => (
              <button
                key={d}
                onClick={() => toggleDiscipline(d)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors",
                  activeDisciplines.includes(d)
                    ? "bg-signal text-signal-ink border-signal"
                    : "bg-transparent text-ink-soft border-rule hover:border-ink-faint"
                )}
              >
                {d.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-2">
            Technology
          </span>
          <div className="flex flex-wrap gap-2">
            {technologyFacets.map((t) => (
              <button
                key={t}
                onClick={() => setTech(activeTech === t ? null : t)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono border transition-colors",
                  activeTech === t
                    ? "bg-signal text-signal-ink border-signal"
                    : "bg-transparent text-ink-soft border-rule hover:border-ink-faint"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:w-48">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-2">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-full bg-transparent border border-rule px-3 py-1.5 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-ink-faint"
          >
            <option className="bg-card" value="default">Quality (default)</option>
            <option className="bg-card" value="recent">Most recent</option>
            <option className="bg-card" value="popular">Most bookmarked</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-ink-faint uppercase tracking-wider">
          {isLoading ? "Loading…" : `${results.length} portfolio${results.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-ink-faint font-mono text-xs uppercase tracking-wider">
          <Loader2 size={14} className="animate-spin" /> Querying the wall
        </div>
      ) : isError ? (
        <div className="border border-dashed border-rule rounded-[var(--radius-card)] py-20 text-center text-ink-soft">
          Couldn&apos;t load portfolios right now — try again in a moment.
        </div>
      ) : results.length === 0 ? (
        <div className="border border-dashed border-rule rounded-[var(--radius-card)] py-20 text-center text-ink-soft">
          Nothing matches those filters yet — quality score never hides work, so try widening your filters.
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={gridVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {results.map((p) => (
            <motion.div key={p.id} variants={cardVariants}>
              <PortfolioCard portfolio={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
