"use client";

import Link from "next/link";
import { Search, Bookmark, Sparkles, Shuffle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { portfolios } from "@/lib/mock-data";

export function Navbar() {
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const updateCount = useCallback(() => {
    try {
      const saved = localStorage.getItem("wop_bookmarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        setBookmarkCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setBookmarkCount(0);
      }
    } catch {
      setBookmarkCount(0);
    }
  }, []);

  useEffect(() => {
    updateCount();
    window.addEventListener("wop_bookmarks_updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("wop_bookmarks_updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, [updateCount]);

  const handleRandomShuffle = () => {
    if (portfolios.length > 0) {
      const randomIdx = Math.floor(Math.random() * portfolios.length);
      const randomPortfolio = portfolios[randomIdx];
      if (randomPortfolio && randomPortfolio.url) {
        window.open(randomPortfolio.url, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ECEEF2] border-b border-[#D8DCE3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-[68px] gap-4">
        {/* Left: Brand Logo from Screenshot */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {/* Logo SVG Icon */}
          <div className="flex items-center text-black">
            <svg
              width="36"
              height="22"
              viewBox="0 0 44 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black transition-transform group-hover:scale-105"
            >
              <path
                d="M3 14C5 7 9 4 13 4L17 17L23 5L28 19L33 9C35 5 39 4 43 4L37 20L30 8L24 20L18 7L13 20L3 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-[10px] tracking-wider text-black">
              WALL OF
            </span>
            <span className="font-black text-sm tracking-tight text-black leading-none">
              PORTFOLIOS
            </span>
          </div>
        </Link>

        {/* Center: Search Trigger Pill */}
        <button
          type="button"
          data-command-trigger
          aria-label="Search portfolios"
          className="hidden md:flex items-center justify-between w-full max-w-md bg-white hover:bg-[#F9FAFB] text-[#6B7280] hover:text-black px-4 py-2 rounded-full border border-[#D8DCE3] hover:border-[#9CA3AF] transition-all text-sm font-normal shadow-2xs cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search size={16} className="text-[#9CA3AF] group-hover:text-black transition-colors" />
            <span className="text-[#6B7280] group-hover:text-black truncate text-xs sm:text-sm">
              Search portfolios, categories or stack...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[11px] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-md font-medium text-[#4B5563] shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Random Shuffle Button */}
          <button
            type="button"
            onClick={handleRandomShuffle}
            title="Surprise me with a random live portfolio"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-[#F9FAFB] text-black text-xs font-semibold border border-[#D8DCE3] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs"
          >
            <Shuffle size={13} className="text-black" />
            <span>Shuffle</span>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            data-command-trigger
            aria-label="Search"
            className="md:hidden p-2 text-[#4B5563] hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <Search size={19} />
          </button>

          {/* Bookmarks Icon */}
          <Link
            href="/#wall"
            className="relative p-2 text-[#4B5563] hover:text-black hover:bg-white rounded-full transition-colors"
            title="Saved Bookmarks"
          >
            <Bookmark size={19} />
            {bookmarkCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* Submit Portfolio CTA */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 bg-black hover:bg-[#27272A] text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles size={14} className="text-amber-300" />
            <span>Submit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
