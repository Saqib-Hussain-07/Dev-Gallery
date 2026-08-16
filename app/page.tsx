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
    <div className="flex w-full min-h-screen bg-[#08090C] text-[#94A3B8]">
      {/* Left Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* HERO SECTION with Ambient Radial Mesh Glow */}
        <section className="relative text-center pt-8 sm:pt-14 pb-8 flex flex-col items-center ambient-hero-glow rounded-3xl mb-4 border border-white/[0.04]">
          {/* Ambient Glow Orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-600/15 blur-[90px] pointer-events-none rounded-full" />

          {/* Live Ecosystem Ticker */}
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F1117]/90 border border-white/[0.1] text-xs font-semibold text-[#94A3B8] mb-6 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[#F8FAFC]">1,200+ Live Portfolios Indexed</span>
            <span className="text-[#64748B]">•</span>
            <span className="text-indigo-400 font-bold">Updated Hourly</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#F8FAFC] tracking-tight leading-[1.08] max-w-4xl">
            The curated gallery of <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              world-class developer portfolios
            </span>
          </h1>

          <p className="relative text-sm sm:text-lg text-[#94A3B8] mt-4 max-w-2xl font-normal leading-relaxed">
            Discover cutting-edge interfaces, interactive design engineering, and verified tech stacks from top software creators.
          </p>

          {/* Quick Metrics Bar */}
          <div className="relative flex items-center gap-6 sm:gap-12 mt-8 pt-6 border-t border-white/[0.06] text-center">
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">100%</p>
              <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">Live &amp; Verified</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">30+ Tech</p>
              <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">Stacks Detected</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">Zero Gate</p>
              <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">Instant Showcase</p>
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
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
                Curated Developer Portfolios
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">
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
              <div className="py-20 text-center bg-[#0F1117] rounded-3xl border border-white/[0.07] p-8 shadow-2xl">
                <p className="text-base font-bold text-[#F8FAFC]">
                  No portfolios match this combination
                </p>
                <p className="text-xs text-[#64748B] mt-1 mb-5">
                  Try clearing the tech stack or selecting all categories.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedTech("All Tech");
                    }}
                    className="px-5 py-2.5 rounded-full btn-primary-gradient text-white text-xs font-semibold cursor-pointer shadow-md transition-transform active:scale-98"
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

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}
