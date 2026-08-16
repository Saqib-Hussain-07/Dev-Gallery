"use client";

import { Search } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/mock-data";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenSearchModal: () => void;
}

export function CategoryFilterTabs({
  selectedCategory,
  onSelectCategory,
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

        {/* Quick Search Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearchModal}
            aria-label="Open search dialog"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-black hover:border-[#9CA3AF] transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
