"use client";

import Link from "next/link";
import { Search, Bookmark, Sparkles, Shuffle, Terminal } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E4E4E7] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-[68px] gap-4">
        {/* Left: DevGallery Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#18181B] via-[#09090B] to-black text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform border border-white/10 ring-1 ring-black/5">
            <Terminal size={17} className="text-violet-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#09090B] leading-none">
                DevGallery
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 border border-violet-200">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-[#71717A] font-medium leading-tight mt-0.5">
              Curated Developer Portfolios
            </span>
          </div>
        </Link>

        {/* Center: Search Trigger Pill */}
        <button
          type="button"
          data-command-trigger
          aria-label="Search portfolios"
          className="hidden md:flex items-center justify-between w-full max-w-md bg-[#F4F4F5]/90 hover:bg-[#E4E4E7] text-[#71717A] hover:text-[#09090B] px-4 py-2 rounded-full border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all text-sm font-normal shadow-2xs cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search size={16} className="text-[#A1A1AA] group-hover:text-black transition-colors" />
            <span className="text-[#71717A] group-hover:text-[#18181B] truncate text-xs sm:text-sm">
              Search portfolios, categories or tech stack...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[11px] bg-white border border-[#E4E4E7] px-2 py-0.5 rounded-md font-medium text-[#71717A] shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Random Shuffle Button */}
          <button
            type="button"
            onClick={handleRandomShuffle}
            title="Surprise me with a random live portfolio"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181B] text-xs font-semibold border border-[#E4E4E7] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs"
          >
            <Shuffle size={13} className="text-violet-600" />
            <span>Shuffle</span>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            data-command-trigger
            aria-label="Search"
            className="md:hidden p-2 text-[#52525B] hover:bg-[#F4F4F5] rounded-full transition-colors cursor-pointer"
          >
            <Search size={19} />
          </button>

          {/* Bookmarks Icon */}
          <Link
            href="/#wall"
            className="relative p-2 text-[#52525B] hover:text-black hover:bg-[#F4F4F5] rounded-full transition-colors"
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
            className="inline-flex items-center gap-1.5 bg-[#09090B] hover:bg-[#18181B] text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-[0.98] border border-white/10"
          >
            <Sparkles size={14} className="text-amber-300" />
            <span>Submit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
