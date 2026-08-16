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
    <div className="sticky top-[68px] z-20 bg-[#08090C]/90 backdrop-blur-xl py-3.5 border-b border-white/[0.07] transition-all">
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
                      ? "bg-[#1E202B] text-[#F8FAFC] border border-white/[0.2] shadow-sm ring-1 ring-white/10"
                      : "bg-[#0F1117] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/[0.07] hover:border-white/[0.15]"
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
            <div className="hidden sm:flex items-center bg-[#0F1117] p-0.5 rounded-full border border-white/[0.07] shadow-inner">
              <button
                type="button"
                onClick={() => onToggleViewMode("spacious")}
                title="Spacious Bento Grid View"
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === "spacious"
                    ? "bg-[#1E202B] text-[#F8FAFC] shadow-xs"
                    : "text-[#64748B] hover:text-[#F8FAFC]"
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
                    ? "bg-[#1E202B] text-[#F8FAFC] shadow-xs"
                    : "text-[#64748B] hover:text-[#F8FAFC]"
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
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F1117] border border-white/[0.07] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-white/[0.18] transition-colors text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Search size={13} />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Tech Stack Filter Cloud with Vivid Semi-Transparent Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 border-t border-white/[0.04] pt-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0 mr-1">
            <Code2 size={12} className="text-indigo-400" />
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
                    ? "bg-indigo-600 text-white shadow-md border border-indigo-400"
                    : "bg-[rgba(99,102,241,0.08)] text-[#A5B4FC] border border-[rgba(99,102,241,0.2)] hover:bg-[rgba(99,102,241,0.15)] hover:border-[rgba(99,102,241,0.35)]"
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
