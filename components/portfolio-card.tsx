"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Portfolio } from "@/lib/types";
import { Bookmark, Briefcase, ExternalLink } from "lucide-react";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wop_bookmarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.includes(portfolio.id)) {
          setIsBookmarked(true);
        }
      }
    } catch {
      // ignore
    }
  }, [portfolio.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("wop_bookmarks");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (isBookmarked) {
        list = list.filter((id) => id !== portfolio.id);
        setIsBookmarked(false);
      } else {
        list.push(portfolio.id);
        setIsBookmarked(true);
      }
      localStorage.setItem("wop_bookmarks", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-2xs hover:shadow-xl transition-all duration-300 card-hover-effect overflow-hidden flex flex-col justify-between">
      {/* Top Right Bookmark Toggle */}
      <button
        type="button"
        onClick={toggleBookmark}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark portfolio"}
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white shadow-xs border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black transition-all hover:scale-105 cursor-pointer"
      >
        <Bookmark
          size={16}
          className={isBookmarked ? "fill-black text-black" : "text-[#4B5563]"}
        />
      </button>

      {/* Main Card — Clicking opens the LIVE portfolio in new tab */}
      <a
        href={portfolio.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block flex-1 group/link"
        title={`Visit ${portfolio.owner.displayName}'s live portfolio`}
      >
        {/* Cover / Thumbnail Preview */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-[#F3F4F6]">
          <Image
            src={portfolio.coverImage}
            alt={portfolio.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Open to Work Badge (Overlaid on top-left of image) */}
          {portfolio.openToWork && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5]/95 backdrop-blur-xs border border-[#A7F3D0] text-[#047857] text-[11px] font-semibold shadow-xs">
              <Briefcase size={12} className="text-[#059669]" />
              <span>Open to work</span>
            </div>
          )}

          {/* Live External Badge on Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/link:opacity-100 transition-opacity flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-black text-xs font-bold shadow-lg backdrop-blur-xs">
              <span>Visit Live Portfolio</span>
              <ExternalLink size={13} />
            </span>
          </div>
        </div>

        {/* Info Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Name and Location */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-[#111827] group-hover:text-black leading-tight flex items-center gap-1.5 truncate">
                <span className="truncate">{portfolio.owner.displayName}</span>
                <ExternalLink size={13} className="text-[#9CA3AF] group-hover/link:text-black opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </h3>

              {portfolio.country && (
                <span className="text-xs font-normal text-[#6B7280] shrink-0">
                  {portfolio.country}
                </span>
              )}
            </div>

            {/* Designation & Style Category */}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#6B7280]">
              <span className="truncate font-medium text-[#4B5563]">
                {portfolio.designation || portfolio.tagline}
              </span>
              {portfolio.styleCategory && (
                <>
                  <span className="text-[#9CA3AF] leading-none">•</span>
                  <span className="shrink-0 font-normal">{portfolio.styleCategory}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section Divider */}
        <div className="px-4 py-3 border-t border-[#F0F1F3] bg-[#FAFAFB] flex items-center justify-between rounded-b-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#111827] leading-tight">
              {portfolio.yearsOfExperience
                ? `${portfolio.yearsOfExperience} ${portfolio.yearsOfExperience === 1 ? "year" : "years"}`
                : "3+ years"}
            </span>
            <span className="text-[10px] text-[#6B7280] font-normal leading-tight">
              Experience
            </span>
          </div>

          {/* Discipline Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {portfolio.discipline.map((d) => (
              <span
                key={d}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#E5E7EB] text-[#374151] shadow-2xs uppercase tracking-tight"
              >
                {d.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}
