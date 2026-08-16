"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Home, Bookmark } from "lucide-react";

/**
 * SidebarNav Component
 *
 * Fixed desktop sidebar navigation pinned to the left of the viewport.
 * Features:
 * - "Portfolios" home gallery launcher
 * - "Bookmarks" launcher with reactive saved count badge
 */
export function SidebarNav() {
  const currentPathname = usePathname();
  const [savedBookmarkCount, setSavedBookmarkCount] = useState<number>(0);

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

  useEffect(() => {
    handleSyncBookmarkCount();
    window.addEventListener("wop_bookmarks_updated", handleSyncBookmarkCount);
    window.addEventListener("storage", handleSyncBookmarkCount);
    return () => {
      window.removeEventListener("wop_bookmarks_updated", handleSyncBookmarkCount);
      window.removeEventListener("storage", handleSyncBookmarkCount);
    };
  }, [handleSyncBookmarkCount]);

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="app-sidebar-fixed hidden lg:flex flex-col items-center w-18 shrink-0 py-4.5 bg-[#E2E4E9] fixed top-14 left-0 h-[calc(100vh-56px)] z-30 border-r border-[#D0D3DC]/40"
    >
      <nav className="sidebar-nav-container flex flex-col items-center gap-4 w-full px-1.5" aria-label="Main Navigation">
        {/* 1. Portfolios Home */}
        <Link
          href="/"
          title="All Portfolios"
          aria-current={currentPathname === "/" ? "page" : undefined}
          className={`nav-item-link flex flex-col items-center gap-1 w-full py-2 px-1 text-center transition-all group rounded-xl ${
            currentPathname === "/"
              ? "nav-item-active text-black font-bold bg-white/60 shadow-2xs"
              : "nav-item-inactive text-[#4B5563] hover:text-black hover:bg-white/40"
          }`}
        >
          <div
            className={`nav-item-icon-wrapper p-2 rounded-xl transition-all ${
              currentPathname === "/"
                ? "text-black"
                : "text-[#4B5563] group-hover:text-black group-hover:scale-105"
            }`}
          >
            <Home
              size={20}
              className={currentPathname === "/" ? "stroke-[2.5]" : "stroke-[1.75]"}
              aria-hidden="true"
            />
          </div>
          <span className="nav-item-label text-[11px] font-semibold tracking-tight">
            Portfolios
          </span>
        </Link>

        {/* 2. Saved Bookmarks */}
        <Link
          href="/#wall"
          title={`Saved Bookmarks (${savedBookmarkCount})`}
          className="nav-item-link relative flex flex-col items-center gap-1 w-full py-2 px-1 text-center transition-all group rounded-xl text-[#4B5563] hover:text-black hover:bg-white/40"
        >
          <div className="nav-item-icon-wrapper relative p-2 rounded-xl transition-all text-[#4B5563] group-hover:text-black group-hover:scale-105">
            <Bookmark size={20} className="stroke-[1.75]" aria-hidden="true" />
            {savedBookmarkCount > 0 && (
              <span
                role="status"
                className="bookmark-count-badge absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-white text-[9px] font-bold shadow-xs animate-in zoom-in-50"
              >
                {savedBookmarkCount}
              </span>
            )}
          </div>
          <span className="nav-item-label text-[11px] font-semibold tracking-tight">
            Bookmarks
          </span>
        </Link>
      </nav>
    </aside>
  );
}
