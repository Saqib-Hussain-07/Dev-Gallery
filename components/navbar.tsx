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
    <header className="sticky top-0 z-40 bg-[#E2E4E9] border-b border-[#D0D3DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-13 sm:h-14 gap-3">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex items-center text-black">
            <svg
              width="30"
              height="18"
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
            <span className="font-extrabold text-[9px] tracking-wider text-black">
              WALL OF
            </span>
            <span className="font-black text-xs tracking-tight text-black leading-none">
              PORTFOLIOS
            </span>
          </div>
        </Link>

        {/* Center: Search Trigger Pill */}
        <button
          type="button"
          data-command-trigger
          aria-label="Search portfolios"
          className="hidden md:flex items-center justify-between w-full max-w-sm bg-white hover:bg-[#F9FAFB] text-[#6B7280] hover:text-black px-3.5 py-1.5 rounded-full border border-[#D0D3DC] hover:border-[#9CA3AF] transition-all text-xs font-normal shadow-2xs cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-[#9CA3AF] group-hover:text-black transition-colors" />
            <span className="text-[#6B7280] group-hover:text-black truncate">
              Search portfolios, categories or stack...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-[#F3F4F6] border border-[#E5E7EB] px-1.5 py-0.5 rounded font-medium text-[#4B5563]">
            ⌘K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Random Shuffle Button */}
          <button
            type="button"
            onClick={handleRandomShuffle}
            title="Surprise me with a random live portfolio"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F9FAFB] text-black text-xs font-semibold border border-[#D0D3DC] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs"
          >
            <Shuffle size={12} className="text-black" />
            <span>Shuffle</span>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            data-command-trigger
            aria-label="Search"
            className="md:hidden p-1.5 text-[#4B5563] hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <Search size={18} />
          </button>

          {/* Bookmarks Icon */}
          <Link
            href="/#wall"
            className="relative p-1.5 text-[#4B5563] hover:text-black hover:bg-white rounded-full transition-colors"
            title="Saved Bookmarks"
          >
            <Bookmark size={18} />
            {bookmarkCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* Submit Portfolio CTA */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-1 bg-black hover:bg-[#27272A] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles size={12} className="text-amber-300" />
            <span>Submit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
