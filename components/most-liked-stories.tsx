"use client";

import Image from "next/image";
import { Portfolio } from "@/lib/types";
import { Heart, ExternalLink } from "lucide-react";

interface Props {
  portfolios: Portfolio[];
}

export function MostLikedStories({ portfolios }: Props) {
  if (!portfolios || portfolios.length === 0) return null;

  // Show top 6 most liked portfolios in the category card format
  const topLiked = portfolios.slice(0, 6);

  return (
    <section className="py-8 border-b border-[#E5E7EB]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Heart size={20} className="fill-rose-500 text-rose-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Most Liked Portfolios
          </h2>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          Ranked by Community
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {topLiked.map((portfolio, idx) => {
          const rank = idx + 1;
          return (
            <a
              key={portfolio.id}
              href={portfolio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#9CA3AF] shadow-2xs hover:shadow-md transition-all duration-200 card-hover-effect relative"
              title={`Visit ${portfolio.owner.displayName}'s live portfolio`}
            >
              {/* Rank Pill in Top-Left */}
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/80 text-white text-[10px] font-extrabold backdrop-blur-xs shadow-xs">
                #{rank}
              </div>

              {/* Cover Preview Image */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[#F3F4F6]">
                <Image
                  src={portfolio.coverImage}
                  alt={portfolio.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
                {/* External link indicator */}
                <div className="absolute bottom-2 right-2 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={12} />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <h3 className="font-semibold text-xs text-[#111827] leading-snug group-hover:text-black line-clamp-2">
                  {portfolio.owner.displayName}
                </h3>
                <div className="flex items-center justify-between text-[11px] font-medium text-rose-600 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Heart size={11} className="fill-rose-500 text-rose-500" />
                    {portfolio.likes.allTime.toLocaleString()} Likes
                  </span>
                  <span className="text-[10px] text-[#6B7280]">
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
