"use client";

import { useState, useMemo } from "react";
import { Sparkles, Terminal, Code2, Flame, Layers } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import { CategoriesSection } from "@/components/categories-section";
import { MostLikedStories } from "@/components/most-liked-stories";
import { CategoryFilterTabs } from "@/components/category-filter-tabs";
import { PortfolioCard } from "@/components/portfolio-card";
import { SearchModal } from "@/components/search-modal";
import { portfolios, getMostLikedPortfolios } from "@/lib/mock-data";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTech, setSelectedTech] = useState("All Tech");
  const [viewMode, setViewMode] = useState<"spacious" | "dense">("spacious");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const mostLikedList = useMemo(() => getMostLikedPortfolios(8), []);

  // Filter portfolios by selected category and tech stack
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((p) => {
      // Category tab filter
      if (selectedCategory !== "all") {
        if (p.primaryCategory !== selectedCategory) return false;
      }

      // Tech stack pill filter
      if (selectedTech !== "All Tech") {
        const matchesTech = p.technologies.some(
          (t) => t.name.toLowerCase() === selectedTech.toLowerCase()
        );
        if (!matchesTech) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedTech]);

  return (
    <div className="flex w-full min-h-screen bg-[#E2E4E9]">
      {/* Left Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area: Large White Card with Rounded Top-Left */}
      <div className="flex-1 w-full min-w-0 px-4 sm:px-8 py-6 sm:py-8 bg-white rounded-tl-[24px] sm:rounded-tl-[28px] border-t border-l border-[#D0D3DC] shadow-xs">
        <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <section className="text-center pt-6 sm:pt-10 pb-6 flex flex-col items-center">
          {/* Live Ecosystem Ticker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-xs font-semibold text-[#52525B] mb-6 shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>1,200+ Live Portfolios Indexed</span>
            <span className="text-[#D4D4D8]">•</span>
            <span className="text-violet-700 font-bold">Updated Hourly</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#09090B] tracking-tight leading-[1.06] max-w-4xl">
            The curated gallery of <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-[#09090B] via-violet-950 to-zinc-700 bg-clip-text text-transparent">
              world-class developer portfolios
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#52525B] mt-4 max-w-2xl font-normal leading-relaxed">
            Discover cutting-edge interfaces, interactive design engineering, and verified tech stacks from top software creators.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-6 sm:gap-10 mt-6 pt-6 border-t border-[#E4E4E7]/60 text-center">
            <div>
              <p className="text-lg sm:text-xl font-extrabold text-[#09090B]">100%</p>
              <p className="text-[11px] text-[#71717A] font-medium uppercase tracking-wider">Live &amp; Verified</p>
            </div>
            <div className="w-px h-8 bg-[#E4E4E7]" />
            <div>
              <p className="text-lg sm:text-xl font-extrabold text-[#09090B]">30+ Tech</p>
              <p className="text-[11px] text-[#71717A] font-medium uppercase tracking-wider">Stacks Detected</p>
            </div>
            <div className="w-px h-8 bg-[#E4E4E7]" />
            <div>
              <p className="text-lg sm:text-xl font-extrabold text-[#09090B]">Zero Gate</p>
              <p className="text-[11px] text-[#71717A] font-medium uppercase tracking-wider">Instant Showcase</p>
            </div>
          </div>
        </section>

        {/* EXPLORE TOP CATEGORIES */}
        <CategoriesSection />

        {/* MOST LIKED / SPOTLIGHT RAIL */}
        <MostLikedStories portfolios={mostLikedList} />

        {/* CURATED PORTFOLIOS WALL SECTION */}
        <section id="wall" className="pt-8 pb-20">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#09090B] tracking-tight">
                Curated Developer Portfolios
              </h2>
              <p className="text-xs text-[#71717A] font-medium">
                Showing {filteredPortfolios.length} handpicked portfolios
              </p>
            </div>
          </div>

          {/* Sticky Category & Tech Stack Tabs with View Mode Toggle */}
          <CategoryFilterTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedTech={selectedTech}
            onSelectTech={setSelectedTech}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
          />

          {/* Portfolio Grid */}
          <div className="pt-6">
            {filteredPortfolios.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-[#E4E4E7] p-8 shadow-xs">
                <p className="text-base font-bold text-[#09090B]">
                  No portfolios match this combination
                </p>
                <p className="text-xs text-[#71717A] mt-1 mb-4">
                  Try clearing the tech stack or selecting all categories.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedTech("All Tech");
                    }}
                    className="px-5 py-2 rounded-full bg-[#09090B] text-white text-xs font-semibold cursor-pointer shadow-xs hover:bg-[#18181B] transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-6 sm:gap-7 ${
                  viewMode === "spacious"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {filteredPortfolios.map((portfolio) => (
                  <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    onSelectTech={(techName) => setSelectedTech(techName)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}
