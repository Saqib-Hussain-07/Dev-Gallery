"use client";

import { SlidersHorizontal, Search } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/mock-data";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  activeFilterCount: number;
  onOpenFilterDialog: () => void;
  onOpenSearchModal: () => void;
}

export function CategoryFilterTabs({
  selectedCategory,
  onSelectCategory,
  activeFilterCount,
  onOpenFilterDialog,
  onOpenSearchModal,
}: Props) {
  return (
    <div className="sticky top-[68px] z-20 bg-[#FAFAFB]/95 backdrop-blur-md py-3.5 border-b border-[#E5E7EB] transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Horizontal Category Radio Pills */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1 py-1">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => onSelectCategory(tab.slug)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#111827] text-white shadow-xs"
                    : "bg-white text-[#4B5563] hover:text-[#111827] border border-[#E5E7EB] hover:border-[#D1D5DB]"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Trigger Button & Search Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenFilterDialog}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activeFilterCount > 0
                ? "bg-black text-white border-black"
                : "bg-white text-[#111827] border-[#E5E7EB] hover:border-[#9CA3AF]"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSearchModal}
            aria-label="Open search dialog"
            className="p-2 rounded-full bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-black hover:border-[#9CA3AF] transition-colors"
          >
            <Search size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
