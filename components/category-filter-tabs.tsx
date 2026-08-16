"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, LayoutGrid, Grid3X3, Bookmark } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/mock-data";

/**
 * Props for the CategoryFilterTabs component.
 */
interface CategoryFilterTabsProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  viewMode: "spacious" | "dense";
  onToggleViewMode: (mode: "spacious" | "dense") => void;
  onOpenSearchModal: () => void;
}

/**
 * CategoryFilterTabs Component
 *
 * Sticky horizontal control bar containing:
 * - Filter pills for categories (All, Minimalist, Dark Theme, 3D/WebGL, etc.)
 * - Saved Bookmarks filter pill with real-time count badge
 * - Grid density toggle (3-column Bento vs 4-column Dense)
 * - Quick search modal launcher button
 */
export function CategoryFilterTabs({
  selectedCategory,
  onSelectCategory,
  viewMode,
  onToggleViewMode,
  onOpenSearchModal,
}: CategoryFilterTabsProps) {
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);

  const syncBookmarkCount = useCallback(() => {
    try {
      const stored = localStorage.getItem("wop_bookmarks");
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        setBookmarkCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setBookmarkCount(0);
      }
    } catch {
      setBookmarkCount(0);
    }
  }, []);

  useEffect(() => {
    syncBookmarkCount();
    window.addEventListener("wop_bookmarks_updated", syncBookmarkCount);
    window.addEventListener("storage", syncBookmarkCount);
    return () => {
      window.removeEventListener("wop_bookmarks_updated", syncBookmarkCount);
      window.removeEventListener("storage", syncBookmarkCount);
    };
  }, [syncBookmarkCount]);

  return (
    <div className="sticky-filter-toolbar sticky top-14 z-30 bg-white py-3.5 border-b border-[#E4E4E7] shadow-2xs transition-all">
      <div className="filter-toolbar-container flex items-center justify-between gap-3">
        {/* --- Category Filter Radio Pills --- */}
        <nav
          aria-label="Filter by category"
          className="category-pills-rail flex items-center gap-1.5 overflow-x-auto hide-scrollbar flex-1 py-0.5"
        >
          {CATEGORY_TABS.map((tab) => {
            const isCategorySelected = selectedCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => onSelectCategory(tab.slug)}
                aria-pressed={isCategorySelected}
                className={`category-pill-button flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isCategorySelected
                    ? "category-pill-selected bg-[#09090B] text-white shadow-xs"
                    : "category-pill-unselected bg-white text-[#52525B] hover:text-[#09090B] border border-[#E4E4E7] hover:border-[#D4D4D8]"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Bookmarks Filter Pill (Works 100% without login via localStorage) */}
          <button
            type="button"
            onClick={() => onSelectCategory("bookmarks")}
            aria-pressed={selectedCategory === "bookmarks"}
            title="View saved bookmarked portfolios"
            className={`category-pill-button flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === "bookmarks"
                ? "category-pill-selected bg-[#09090B] text-white shadow-xs"
                : "category-pill-unselected bg-white text-[#52525B] hover:text-[#09090B] border border-[#E4E4E7] hover:border-[#D4D4D8]"
            }`}
          >
            <Bookmark size={12} className={selectedCategory === "bookmarks" ? "fill-white text-white" : "text-[#71717A]"} />
            <span>Saved Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedCategory === "bookmarks" ? "bg-white text-black" : "bg-[#F3F4F6] text-black"
              }`}>
                {bookmarkCount}
              </span>
            )}
          </button>
        </nav>

        {/* --- Right Controls: View Switcher & Search Button --- */}
        <div className="toolbar-controls-group flex items-center gap-2 shrink-0">
          {/* Grid View Mode Switcher */}
          <div
            className="view-mode-toggle-group hidden sm:flex items-center bg-white p-0.5 rounded-full border border-[#E4E4E7] shadow-2xs"
            role="group"
            aria-label="Grid layout density"
          >
            <button
              type="button"
              onClick={() => onToggleViewMode("spacious")}
              title="Spacious Bento Grid View (3 Columns)"
              aria-label="Spacious 3-column view"
              aria-pressed={viewMode === "spacious"}
              className={`view-mode-btn p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === "spacious"
                  ? "bg-[#09090B] text-white"
                  : "text-[#71717A] hover:text-black"
              }`}
            >
              <LayoutGrid size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode("dense")}
              title="Dense Multi-Column Grid View (4 Columns)"
              aria-label="Dense 4-column view"
              aria-pressed={viewMode === "dense"}
              className={`view-mode-btn p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === "dense"
                  ? "bg-[#09090B] text-white"
                  : "text-[#71717A] hover:text-black"
              }`}
            >
              <Grid3X3 size={14} aria-hidden="true" />
            </button>
          </div>

          {/* Quick Search Action Button */}
          <button
            type="button"
            onClick={onOpenSearchModal}
            aria-label="Open search dialog"
            className="btn-quick-search flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-[#52525B] hover:text-black hover:border-[#A1A1AA] transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <Search size={13} aria-hidden="true" />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
