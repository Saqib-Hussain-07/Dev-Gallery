"use client";

import Image from "next/image";
import { Heart, ExternalLink, Flame } from "lucide-react";
import { Portfolio } from "@/lib/types";

/**
 * Props for the MostLikedStories component.
 */
interface MostLikedStoriesProps {
  portfolios: Portfolio[];
}

/**
 * Rank Badge Configuration Generator
 */
function getRankBadgeConfig(rank: number) {
  switch (rank) {
    case 1:
      return { label: "1st", color: "bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/30", icon: "🥇" };
    case 2:
      return { label: "2nd", color: "bg-zinc-200 text-black border-zinc-300 ring-2 ring-zinc-300/30", icon: "🥈" };
    case 3:
      return { label: "3rd", color: "bg-amber-700 text-white border-amber-600 ring-2 ring-amber-700/30", icon: "🥉" };
    default:
      return { label: `#${rank}`, color: "bg-black/80 text-white border-white/20", icon: null };
  }
}

/**
 * MostLikedStories Component
 *
 * Displays a 6-card spotlight grid of the community's top-rated developer portfolios.
 * Highlights top 3 positions with medal trophies and links directly to live websites.
 */
export function MostLikedStories({ portfolios }: MostLikedStoriesProps) {
  if (!portfolios || portfolios.length === 0) return null;

  // Show top 6 ranked portfolios
  const topLikedPortfolios = portfolios.slice(0, 6);

  return (
    <section className="spotlight-showcase-section py-8 border-b border-[#E4E4E7]">
      {/* Section Header */}
      <header className="section-header flex items-center justify-between mb-5">
        <div className="section-header-title-group flex items-center gap-2.5">
          <div className="spotlight-icon-wrapper w-8 h-8 rounded-xl bg-linear-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Flame size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="section-title text-xl sm:text-2xl font-extrabold text-[#09090B] tracking-tight">
              Community Spotlight
            </h2>
            <p className="section-subtitle text-xs text-[#71717A] font-medium hidden sm:block">
              Top ranked portfolios voted by designers &amp; engineers worldwide
            </p>
          </div>
        </div>

        <div className="spotlight-badge-pill flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs">
          <span>Top Rated</span>
        </div>
      </header>

      {/* Spotlight Cards Grid */}
      <div className="spotlight-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {topLikedPortfolios.map((portfolio, index) => {
          const rank = index + 1;
          const rankBadge = getRankBadgeConfig(rank);
          const isTopTierRank = rank <= 3;

          return (
            <article
              key={portfolio.id}
              className={`spotlight-card group flex flex-col rounded-2xl overflow-hidden bg-white border transition-all duration-300 relative ${
                isTopTierRank
                  ? "border-[#D4D4D8] hover:border-black shadow-xs hover:shadow-lg ring-1 ring-black/5"
                  : "border-[#E4E4E7] hover:border-[#A1A1AA] shadow-2xs hover:shadow-md"
              }`}
            >
              {/* Direct Live Portfolio Link */}
              <a
                href={portfolio.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${portfolio.owner.displayName}'s live portfolio`}
                className="spotlight-card-link flex flex-col h-full w-full"
              >
                {/* Floating Rank Pill */}
                <div
                  className={`rank-pill absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-extrabold backdrop-blur-md shadow-xs border flex items-center gap-1 ${rankBadge.color}`}
                >
                  {rankBadge.icon && <span>{rankBadge.icon}</span>}
                  <span>{rankBadge.label}</span>
                </div>

                {/* Screenshot Preview Media */}
                <figure className="spotlight-cover-figure relative aspect-16/10 w-full overflow-hidden bg-[#F4F4F5] m-0">
                  <Image
                    src={portfolio.coverImage}
                    alt={`${portfolio.owner.displayName} portfolio preview`}
                    fill
                    unoptimized
                    className="spotlight-cover-image object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, 200px"
                  />

                  {/* Hover Overlay Icon */}
                  <div className="spotlight-hover-overlay absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/95 text-black shadow-md">
                      <ExternalLink size={13} aria-hidden="true" />
                    </span>
                  </div>
                </figure>

                {/* Card Content Body */}
                <div className="spotlight-card-body p-3.5 flex flex-col justify-between flex-1">
                  <h3 className="developer-title font-bold text-xs text-[#09090B] leading-snug group-hover:text-black line-clamp-1">
                    {portfolio.owner.displayName}
                  </h3>

                  <footer className="spotlight-card-footer flex items-center justify-between text-[11px] font-semibold text-rose-600 mt-2">
                    <span className="like-counter flex items-center gap-1">
                      <Heart size={11} className="fill-rose-500 text-rose-500" aria-hidden="true" />
                      {portfolio.likes.allTime.toLocaleString()}
                    </span>
                    <span className="style-tag text-[10px] font-medium text-[#71717A] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
                      {portfolio.styleCategory}
                    </span>
                  </footer>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
