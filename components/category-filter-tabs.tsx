"use client";

import { Search, LayoutGrid, Grid3X3, Code2 } from "lucide-react";
import { CATEGORY_TABS } from "@/lib/mock-data";

export const TECH_FILTER_PILLS = [
  "All Tech",
  "Next.js",
  "React",
  "Three.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "GLSL",
] as const;

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedTech: string;
  onSelectTech: (tech: string) => void;
  viewMode: "spacious" | "dense";
  onToggleViewMode: (mode: "spacious" | "dense") => void;
  onOpenSearchModal: () => void;
}

export function CategoryFilterTabs({
  selectedCategory,
  onSelectCategory,
  selectedTech,
  onSelectTech,
  viewMode,
  onToggleViewMode,
  onOpenSearchModal,
}: Props) {
  return (
    <div className="sticky top-[68px] z-20 bg-[#FAFAFB]/95 backdrop-blur-xl py-3 border-b border-[#E4E4E7] transition-all">
      <div className="flex flex-col gap-2.5">
        {/* Top Row: Category Tabs & View Mode / Search */}
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
                      ? "bg-[#09090B] text-white shadow-xs ring-2 ring-black/10"
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

        {/* Bottom Row: Tech Stack Filter Cloud */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 border-t border-[#F4F4F5] pt-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#71717A] uppercase tracking-wider shrink-0 mr-1">
            <Code2 size={12} className="text-violet-600" />
            <span>Stack:</span>
          </div>

          {TECH_FILTER_PILLS.map((tech) => {
            const isSelected = selectedTech === tech;
            return (
              <button
                key={tech}
                type="button"
                onClick={() => onSelectTech(tech)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-violet-950 text-white shadow-2xs ring-1 ring-violet-500/20"
                    : "bg-white text-[#52525B] hover:text-black border border-[#E4E4E7] hover:border-[#D4D4D8]"
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
