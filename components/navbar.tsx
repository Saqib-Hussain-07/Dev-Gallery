"use client";

import Link from "next/link";
import { Search, Bookmark, Sparkles, LayoutGrid } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-[68px] gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            <LayoutGrid size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-[#111827] leading-none">
              Wall of Portfolios
            </span>
            <span className="text-[11px] text-[#6B7280] font-normal leading-tight">
              Curated Designer &amp; Dev Wall
            </span>
          </div>
        </Link>

        {/* Center: Search Trigger Pill */}
        <button
          type="button"
          data-command-trigger
          aria-label="Search portfolios"
          className="hidden md:flex items-center justify-between w-full max-w-md bg-[#F3F4F6] hover:bg-[#ECEEF2] text-[#6B7280] hover:text-[#111827] px-4 py-2 rounded-full border border-transparent hover:border-[#E5E7EB] transition-all text-sm font-normal shadow-inner cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search size={16} className="text-[#9CA3AF]" />
            <span className="text-[#6B7280] truncate">Search Portfolios, Categories or Stack...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[11px] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-md font-medium text-[#4B5563] shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Mobile Search Button */}
          <button
            type="button"
            data-command-trigger
            aria-label="Search"
            className="md:hidden p-2 text-[#4B5563] hover:bg-[#F3F4F6] rounded-full transition-colors cursor-pointer"
          >
            <Search size={20} />
          </button>

          {/* Bookmarks Icon */}
          <Link
            href="/#wall"
            className="relative p-2 text-[#4B5563] hover:text-black hover:bg-[#F3F4F6] rounded-full transition-colors"
            title="Saved Bookmarks"
          >
            <Bookmark size={20} />
            {bookmarkCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* Submit Portfolio CTA */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-medium px-4 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles size={14} className="text-amber-300" />
            <span>Submit Portfolio</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
