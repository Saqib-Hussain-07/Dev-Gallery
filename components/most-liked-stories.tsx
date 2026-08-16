"use client";

import Image from "next/image";
import { useState } from "react";
import { Portfolio } from "@/lib/types";
import { Heart } from "lucide-react";
import { MostLikedModal } from "./most-liked-modal";

interface Props {
  portfolios: Portfolio[];
}

export function MostLikedStories({ portfolios }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!portfolios || portfolios.length === 0) return null;

  const handleOpen = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

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

      <div className="flex items-center gap-6 overflow-x-auto pb-4 pt-1 hide-scrollbar scroll-rail">
        {portfolios.map((portfolio, idx) => {
          const rank = idx + 1;
          return (
            <button
              key={portfolio.id}
              onClick={() => handleOpen(idx)}
              type="button"
              className="flex flex-col items-center gap-2.5 shrink-0 group focus:outline-none cursor-pointer"
            >
              {/* Glowing Story Ring with Portfolio Screenshot Preview */}
              <div className="relative p-[3px] rounded-full story-ring-gradient group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white p-[2px]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F3F4F6]">
                    {/* Portfolio Website Screenshot */}
                    <Image
                      src={portfolio.coverImage}
                      alt={portfolio.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </div>

                {/* Creator Avatar Badge overlapping bottom-left */}
                <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                  <Image
                    src={portfolio.owner.avatarUrl}
                    alt={portfolio.owner.displayName}
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </div>

                {/* Rank Badge overlapping bottom-right */}
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-black text-white border-2 border-white flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                  #{rank}
                </div>
              </div>

              {/* Name & Like Count */}
              <div className="flex flex-col items-center max-w-[100px]">
                <span className="text-xs font-semibold text-[#111827] text-center truncate group-hover:text-black w-full">
                  {portfolio.owner.displayName}
                </span>
                <span className="text-[10px] font-medium text-rose-600 flex items-center gap-0.5 mt-0.5">
                  <Heart size={10} className="fill-rose-500 text-rose-500" />
                  {portfolio.likes.allTime.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Story Modal */}
      <MostLikedModal
        portfolios={portfolios}
        currentIndex={activeIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectIndex={setActiveIndex}
      />
    </section>
  );
}
