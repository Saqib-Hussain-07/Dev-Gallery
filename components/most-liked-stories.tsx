"use client";

import Image from "next/image";
import { Portfolio } from "@/lib/types";
import { Heart, ExternalLink, Trophy, Flame } from "lucide-react";

interface Props {
  portfolios: Portfolio[];
}

export function MostLikedStories({ portfolios }: Props) {
  if (!portfolios || portfolios.length === 0) return null;

  // Show top 6 most liked portfolios in spotlight card format
  const topLiked = portfolios.slice(0, 6);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: "1st", color: "bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/30", icon: "🥇" };
    if (rank === 2) return { label: "2nd", color: "bg-zinc-200 text-black border-zinc-300 ring-2 ring-zinc-300/30", icon: "🥈" };
    if (rank === 3) return { label: "3rd", color: "bg-amber-700 text-white border-amber-600 ring-2 ring-amber-700/30", icon: "🥉" };
    return { label: `#${rank}`, color: "bg-black/80 text-white border-white/20", icon: null };
  };

  return (
    <section className="py-8 border-b border-[#E4E4E7]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Flame size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#09090B] tracking-tight flex items-center gap-2">
              <span>Community Spotlight</span>
            </h2>
            <p className="text-xs text-[#71717A] font-medium hidden sm:block">
              Top ranked portfolios voted by designers &amp; engineers worldwide
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs">
          <Trophy size={13} className="text-rose-600" />
          <span>Top Rated</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {topLiked.map((portfolio, idx) => {
          const rank = idx + 1;
          const badge = getRankBadge(rank);
          const isTop3 = rank <= 3;

          return (
            <a
              key={portfolio.id}
              href={portfolio.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col rounded-2xl overflow-hidden bg-white border transition-all duration-300 card-hover-effect relative ${
                isTop3
                  ? "border-[#D4D4D8] hover:border-black shadow-xs hover:shadow-lg ring-1 ring-black/5"
                  : "border-[#E4E4E7] hover:border-[#A1A1AA] shadow-2xs hover:shadow-md"
              }`}
              title={`Visit ${portfolio.owner.displayName}'s live portfolio`}
            >
              {/* Rank Pill in Top-Left */}
              <div
                className={`absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-extrabold backdrop-blur-md shadow-xs border flex items-center gap-1 ${badge.color}`}
              >
                {badge.icon && <span>{badge.icon}</span>}
                <span>{badge.label}</span>
              </div>

              {/* Cover Preview Image */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[#F4F4F5]">
                <Image
                  src={portfolio.coverImage}
                  alt={portfolio.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
                {/* External link indicator */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-white/95 text-black shadow-md">
                    <ExternalLink size={13} />
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <h3 className="font-bold text-xs text-[#09090B] leading-snug group-hover:text-violet-950 line-clamp-1">
                  {portfolio.owner.displayName}
                </h3>
                <div className="flex items-center justify-between text-[11px] font-semibold text-rose-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Heart size={11} className="fill-rose-500 text-rose-500" />
                    {portfolio.likes.allTime.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-medium text-[#71717A] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
                    {portfolio.styleCategory}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
