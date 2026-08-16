"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Portfolio } from "@/lib/types";
import { TrendingPeriod } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Heart, TrendingUp } from "lucide-react";

const PERIODS: { value: TrendingPeriod; label: string }[] = [
  { value: "day", label: "24 hours" },
  { value: "week", label: "7 days" },
  { value: "month", label: "30 days" },
  { value: "allTime", label: "All time" },
];

export function TrendingSection({
  byPeriod,
}: {
  byPeriod: Record<TrendingPeriod, Portfolio[]>;
}) {
  const [period, setPeriod] = useState<TrendingPeriod>("week");
  const results = byPeriod[period];

  return (
    <section aria-labelledby="trending-heading" className="pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-ink-faint" aria-hidden="true" />
          <h2 id="trending-heading" className="font-display text-2xl">
            Trending
          </h2>
        </div>
        <div role="tablist" aria-label="Trending time period" className="flex gap-1 border border-rule rounded-sm p-1 w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              role="tab"
              aria-selected={period === p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors rounded-sm",
                period === p.value ? "bg-signal text-signal-ink" : "text-ink-faint hover:text-ink"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-2">
        {results.map((p, i) => {
          const rank = i + 1;
          const isTop3 = rank <= 3;
          return (
            <li key={p.id}>
              <Link
                href={`/portfolio/${p.slug}`}
                className={cn(
                  "flex items-center gap-4 border rounded-[var(--radius-card)] px-4 py-3 transition-colors",
                  isTop3
                    ? "border-signal/40 bg-signal/[0.04] hover:bg-signal/[0.08]"
                    : "border-rule hover:border-ink-faint bg-card"
                )}
              >
                <span
                  className={cn(
                    "font-display text-2xl w-8 text-center shrink-0",
                    isTop3 ? "text-signal" : "text-ink-faint"
                  )}
                  aria-hidden="true"
                >
                  {rank}
                </span>

                <div className="relative w-14 h-14 rounded-sm overflow-hidden border border-rule shrink-0">
                  <Image src={p.coverImage} alt="" fill unoptimized sizes="56px" className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base truncate">{p.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-ink-faint">
                    <Image
                      src={p.owner.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt=""
                      width={14}
                      height={14}
                      unoptimized
                      className="rounded-full"
                    />
                    <span className="truncate">{p.owner.displayName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-mono shrink-0">
                  <Heart size={14} className={isTop3 ? "text-signal fill-signal" : "text-ink-faint"} />
                  {p.likes[period].toLocaleString()}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
