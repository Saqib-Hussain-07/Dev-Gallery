"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Search, Bookmark, Sparkles, Shuffle } from "lucide-react";
import { portfolios } from "@/lib/mock-data";

import { BrandLogo } from "@/components/brand-logo";

/**
 * Navbar Component
 *
 * Top application header on the grey shell.
 * Features:
 * - Brand logo link to home
 * - Desktop command palette search trigger (⌘K)
 * - Random shuffle button (opens a surprise live portfolio from full dataset)
 * - Mobile search trigger button
 * - Saved bookmarks counter with reactive storage sync
 */
export function Navbar() {
  /* -------------------------------------------------------------------------- */
  /* State & Hooks                                                              */
  /* -------------------------------------------------------------------------- */
  const [savedBookmarkCount, setSavedBookmarkCount] = useState<number>(0);

  /**
   * Synchronizes saved bookmarks count from localStorage.
   */
  const handleSyncBookmarkCount = useCallback(() => {
    try {
      const stored = localStorage.getItem("wop_bookmarks");
      if (stored) {
        const parsedList: string[] = JSON.parse(stored);
        setSavedBookmarkCount(Array.isArray(parsedList) ? parsedList.length : 0);
      } else {
        setSavedBookmarkCount(0);
      }
    } catch {
      setSavedBookmarkCount(0);
    }
  }, []);

  // Listen for both global custom events and cross-tab storage changes
  useEffect(() => {
    handleSyncBookmarkCount();
    window.addEventListener("wop_bookmarks_updated", handleSyncBookmarkCount);
    window.addEventListener("storage", handleSyncBookmarkCount);
    return () => {
      window.removeEventListener("wop_bookmarks_updated", handleSyncBookmarkCount);
      window.removeEventListener("storage", handleSyncBookmarkCount);
    };
  }, [handleSyncBookmarkCount]);

  /* -------------------------------------------------------------------------- */
  /* Event Handlers                                                             */
  /* -------------------------------------------------------------------------- */

  /**
   * Picks a random portfolio from the curated dataset and launches it in a new tab.
   */
  const handleLaunchRandomPortfolio = useCallback(async () => {
    try {
      const response = await fetch("/api/wallfolio/sync");
      if (response.ok) {
        const data = await response.json();
        if (data.portfolios && data.portfolios.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.portfolios.length);
          const selected = data.portfolios[randomIndex];
          if (selected?.url) {
            window.open(selected.url, "_blank", "noopener,noreferrer");
            return;
          }
        }
      }
    } catch {
      // fallback
    }

    if (portfolios.length > 0) {
      const randomIndex = Math.floor(Math.random() * portfolios.length);
      const selectedPortfolio = portfolios[randomIndex];
      if (selectedPortfolio?.url) {
        window.open(selectedPortfolio.url, "_blank", "noopener,noreferrer");
      }
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <header className="app-navbar sticky top-0 z-40 bg-[#E2E4E9] border-b border-[#D0D3DC] transition-all">
      <div className="navbar-container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-13 sm:h-14 gap-3">
        {/* --- Section: Brand Logo --- */}
        <div className="navbar-brand-section flex items-center shrink-0">
          <Link
            href="/"
            className="navbar-brand-link focus:outline-none"
            aria-label="DevGallery Home"
          >
            <BrandLogo size="md" />
          </Link>
        </div>

        {/* --- Section: Search Trigger Pill (Desktop) --- */}
        <div className="navbar-search-section flex-1 max-w-sm hidden md:block">
          <button
            type="button"
            data-command-trigger
            aria-label="Search portfolios"
            className="search-trigger-button flex items-center justify-between w-full bg-white hover:bg-[#F9FAFB] text-[#6B7280] hover:text-black px-3.5 py-1.5 rounded-full border border-[#D0D3DC] hover:border-[#9CA3AF] transition-all text-xs shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-[#9CA3AF] group-hover:text-black transition-colors" />
              <span className="text-[#6B7280] group-hover:text-black truncate">
                Search DevGallery portfolios, categories...
              </span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 text-[10px] bg-[#F3F4F6] border border-[#E5E7EB] px-1.5 py-0.5 rounded font-medium text-[#4B5563]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* --- Section: Quick Action Controls --- */}
        <nav className="navbar-actions-section flex items-center gap-2 shrink-0" aria-label="Quick Actions">
          {/* Random Shuffle Button */}
          <button
            type="button"
            onClick={handleLaunchRandomPortfolio}
            title="Surprise me with a random live portfolio"
            aria-label="Launch random portfolio"
            className="btn-shuffle inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F9FAFB] text-black text-xs font-semibold border border-[#D0D3DC] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs"
          >
            <Shuffle size={12} className="text-black" aria-hidden="true" />
            <span>Shuffle</span>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            data-command-trigger
            aria-label="Open search dialog"
            className="btn-mobile-search md:hidden p-1.5 text-[#4B5563] hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          {/* Bookmarks Counter Button */}
          <Link
            href="/#wall"
            className="nav-link-bookmarks relative p-1.5 text-[#4B5563] hover:text-black hover:bg-white rounded-full transition-colors"
            title="View saved bookmarks"
            aria-label={`Saved Bookmarks: ${savedBookmarkCount}`}
          >
            <Bookmark size={18} aria-hidden="true" />
            {savedBookmarkCount > 0 && (
              <span
                role="status"
                className="bookmark-count-badge absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-white text-[9px] font-bold shadow-xs animate-in zoom-in-50"
              >
                {savedBookmarkCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
