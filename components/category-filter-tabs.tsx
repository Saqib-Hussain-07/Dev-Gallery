"use client";

import { Search, LayoutGrid, Grid3X3 } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/mock-data";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  viewMode: "spacious" | "dense";
  onToggleViewMode: (mode: "spacious" | "dense") => void;
  onOpenSearchModal: () => void;
}

export function CategoryFilterTabs({
  selectedCategory,
  onSelectCategory,
  viewMode,
  onToggleViewMode,
  onOpenSearchModal,
}: Props) {
  return (
    <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-xl py-3.5 border-b border-[#E4E4E7] transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Horizontal Category Radio Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar flex-1 py-0.5">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => onSelectCategory(tab.slug)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#09090B] text-white shadow-xs"
                    : "bg-white text-[#52525B] hover:text-[#09090B] border border-[#E4E4E7] hover:border-[#D4D4D8]"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Controls: View Mode & Search */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-white p-0.5 rounded-full border border-[#E4E4E7] shadow-2xs">
            <button
              type="button"
              onClick={() => onToggleViewMode("spacious")}
              title="Spacious Bento Grid View"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === "spacious"
                  ? "bg-[#09090B] text-white"
                  : "text-[#71717A] hover:text-black"
              }`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode("dense")}
              title="Dense Multi-Column Grid View"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === "dense"
                  ? "bg-[#09090B] text-white"
                  : "text-[#71717A] hover:text-black"
              }`}
            >
              <Grid3X3 size={14} />
            </button>
          </div>

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearchModal}
            aria-label="Open search dialog"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-[#52525B] hover:text-black hover:border-[#A1A1AA] transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <Search size={13} />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
