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
    <header className="sticky top-0 z-40 bg-[#1E202B]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-[68px] gap-4">
        {/* Left: DevGallery Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500/20 via-violet-500/10 to-transparent text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform border border-indigo-500/30 ring-1 ring-indigo-500/20">
            <Terminal size={17} className="text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#F8FAFC] leading-none group-hover:text-white transition-colors">
                DevGallery
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                INDEX
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5">
              Curated Design &amp; Dev Portfolios
            </span>
          </div>
        </Link>

        {/* Center: Search Trigger Pill */}
        <button
          type="button"
          data-command-trigger
          aria-label="Search portfolios"
          className="hidden md:flex items-center justify-between w-full max-w-md bg-[#0F1117]/80 hover:bg-[#171922] text-[#94A3B8] hover:text-[#F8FAFC] px-4 py-2 rounded-full border border-white/[0.08] hover:border-white/[0.18] transition-all text-sm font-normal shadow-inner cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search size={15} className="text-[#64748B] group-hover:text-indigo-400 transition-colors" />
            <span className="text-[#94A3B8] group-hover:text-[#F8FAFC] truncate text-xs sm:text-sm">
              Search portfolios, categories or stack...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-[#171922] border border-white/[0.1] px-2 py-0.5 rounded-md font-medium text-[#64748B] shadow-2xs">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171922] hover:bg-[#1E202B] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold border border-white/[0.08] hover:border-white/[0.18] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-xs"
          >
            <Shuffle size={13} className="text-indigo-400" />
            <span>Shuffle</span>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            data-command-trigger
            aria-label="Search"
            className="md:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171922] rounded-full transition-colors cursor-pointer"
          >
            <Search size={19} />
          </button>

          {/* Bookmarks Icon */}
          <Link
            href="/#wall"
            className="relative p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171922] rounded-full transition-colors"
            title="Saved Bookmarks"
          >
            <Bookmark size={19} />
            {bookmarkCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* Submit Portfolio CTA (Indigo to Violet gradient with inset highlight ring) */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 btn-primary-gradient text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:py-2.5 rounded-full shadow-lg transition-all active:scale-[0.98] border border-white/20"
          >
            <Sparkles size={14} className="text-amber-300" />
            <span>Submit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
