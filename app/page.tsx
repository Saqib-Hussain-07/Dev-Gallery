"use client";

import { useState, useMemo, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { CategoriesSection } from "@/components/categories-section";
import { MostLikedStories } from "@/components/most-liked-stories";
import { CategoryFilterTabs } from "@/components/category-filter-tabs";
import { PortfolioCard } from "@/components/portfolio-card";
import { SearchModal } from "@/components/search-modal";
import { portfolios as staticFallbackPortfolios, getMostLikedPortfolios } from "@/lib/mock-data";
import { Portfolio } from "@/lib/types";
import { Sparkles, Loader2, ArrowDown } from "lucide-react";

const INITIAL_PAGE_SIZE = 24;
const PAGE_INCREMENT = 24;

/**
 * HomePage Component
 *
 * Dynamically synchronized with Saqib-Hussain-07/Wallfolio repository.
 * Features:
 * - 1,900+ Live verified developer portfolios parsed in real-time
 * - Progressive loading / pagination for snappy browser performance
 * - Category filter tabs & grid view switcher (Bento vs Dense)
 * - Community spotlight top-rated rail
 */
export default function HomePage() {
  /* -------------------------------------------------------------------------- */
  /* State & Data Sync                                                          */
  /* -------------------------------------------------------------------------- */
  const [allPortfolios, setAllPortfolios] = useState<Portfolio[]>(staticFallbackPortfolios);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"spacious" | "dense">("spacious");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PAGE_SIZE);

  // Fetch live Wallfolio dataset on initial mount
  useEffect(() => {
    let isMounted = true;

    async function fetchLivePortfolios() {
      try {
        const response = await fetch("/api/wallfolio/sync");
        if (!response.ok) throw new Error("Failed to load Wallfolio sync");
        const data = await response.json();
        if (isMounted && data.portfolios && data.portfolios.length > 0) {
          setAllPortfolios(data.portfolios);
        }
      } catch (error) {
        console.warn("Could not load live Wallfolio dataset, using fallback:", error);
      } finally {
        if (isMounted) setIsLoadingLive(false);
      }
    }

    fetchLivePortfolios();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset pagination when switching categories
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [selectedCategory]);

  // Spotlight top ranked portfolios
  const spotlightPortfolios = useMemo(() => {
    return allPortfolios.slice(0, 8);
  }, [allPortfolios]);

  // Filtered dataset according to category
  const filteredPortfolios = useMemo(() => {
    return allPortfolios.filter((portfolio) => {
      if (selectedCategory !== "all") {
        return portfolio.primaryCategory === selectedCategory;
      }
      return true;
    });
  }, [allPortfolios, selectedCategory]);

  // Sliced paginated subset for rendering
  const paginatedPortfolios = useMemo(() => {
    return filteredPortfolios.slice(0, visibleCount);
  }, [filteredPortfolios, visibleCount]);

  const hasMorePortfolios = visibleCount < filteredPortfolios.length;

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="home-layout-wrapper flex w-full min-h-screen bg-[#E2E4E9]">
      {/* Fixed Left Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Card on Grey Shell */}
      <main className="main-content-card flex-1 w-full min-w-0 lg:ml-18 px-4 sm:px-8 py-6 sm:py-8 bg-white rounded-tl-[24px] sm:rounded-tl-[28px] border-t border-l border-[#D0D3DC] shadow-xs">
        <div className="content-inner-container max-w-7xl mx-auto">
          {/* ================================================================= */}
          {/* 1. HERO SECTION                                                  */}
          {/* ================================================================= */}
          <section className="hero-section text-center pt-6 sm:pt-10 pb-6 flex flex-col items-center">
            {/* Live Repository Sync Ticker */}
            <div className="hero-ticker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-xs font-semibold text-[#52525B] mb-6 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{allPortfolios.length.toLocaleString()}+ Live Portfolios Synced</span>
              <span className="text-[#D4D4D8]">•</span>
              <span className="text-violet-700 font-bold">Updated Daily</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-headline text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#09090B] tracking-tight leading-[1.06] max-w-4xl">
              The curated gallery of <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-[#09090B] via-violet-950 to-zinc-700 bg-clip-text text-transparent">
                world-class developer portfolios
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="hero-subheadline text-sm sm:text-lg text-[#52525B] mt-4 max-w-2xl font-normal leading-relaxed">
              Discover cutting-edge interfaces, interactive design engineering, and verified tech stacks from top software creators worldwide.
            </p>

            {/* Verification Metrics Bar */}
            <div className="hero-metrics-bar flex items-center gap-6 sm:gap-10 mt-6 pt-6 border-t border-[#E4E4E7]/60 text-center">
              <div className="metric-item">
                <p className="metric-value text-lg sm:text-xl font-extrabold text-[#09090B]">100%</p>
                <p className="metric-label text-[11px] text-[#71717A] font-medium uppercase tracking-wider">Live &amp; Verified</p>
              </div>
              <div className="metric-divider w-px h-8 bg-[#E4E4E7]" />
              <div className="metric-item">
                <p className="metric-value text-lg sm:text-xl font-extrabold text-[#09090B]">{allPortfolios.length}+</p>
                <p className="metric-label text-[11px] text-[#71717A] font-medium uppercase tracking-wider">Developers Listed</p>
              </div>
              <div className="metric-divider w-px h-8 bg-[#E4E4E7]" />
              <div className="metric-item">
                <p className="metric-value text-lg sm:text-xl font-extrabold text-[#09090B]">Zero Gate</p>
                <p className="metric-label text-[11px] text-[#71717A] font-medium uppercase tracking-wider">Instant Showcase</p>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 2. EXPLORE TOP CATEGORIES                                        */}
          {/* ================================================================= */}
          <CategoriesSection />

          {/* ================================================================= */}
          {/* 3. COMMUNITY SPOTLIGHT RAIL                                      */}
          {/* ================================================================= */}
          <MostLikedStories portfolios={spotlightPortfolios} />

          {/* ================================================================= */}
          {/* 4. CURATED PORTFOLIO WALL & FILTER GRID                          */}
          {/* ================================================================= */}
          <section id="wall" className="portfolio-wall-section pt-8 pb-20">
            {/* Section Header */}
            <header className="wall-section-header flex items-center justify-between mb-2">
              <div>
                <h2 className="wall-title text-xl sm:text-2xl font-extrabold text-[#09090B] tracking-tight">
                  Curated Developer Portfolios
                </h2>
                <p className="wall-subtitle text-xs text-[#71717A] font-medium">
                  Showing {paginatedPortfolios.length} of {filteredPortfolios.length} portfolios
                </p>
              </div>
            </header>

            {/* Sticky Category Tabs with View Mode Toggle */}
            <CategoryFilterTabs
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => setSelectedCategory(category)}
              viewMode={viewMode}
              onToggleViewMode={(mode) => setViewMode(mode)}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
            />

            {/* Portfolio Grid Container */}
            <div className="portfolio-grid-wrapper pt-6">
              {filteredPortfolios.length === 0 ? (
                /* Empty Filter Result State */
                <div className="empty-filter-state py-20 text-center bg-white rounded-3xl border border-[#E4E4E7] p-8 shadow-xs">
                  <p className="text-base font-bold text-[#09090B]">
                    No portfolios match this category
                  </p>
                  <p className="text-xs text-[#71717A] mt-1 mb-4">
                    Explore all portfolios or switch category.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="btn-reset-filters px-5 py-2 rounded-full bg-[#09090B] text-white text-xs font-semibold cursor-pointer shadow-xs hover:bg-[#18181B] transition-colors"
                  >
                    View all portfolios
                  </button>
                </div>
              ) : (
                /* Dynamic Portfolio Grid */
                <>
                  <div
                    className={`portfolio-grid grid gap-6 sm:gap-7 ${
                      viewMode === "spacious"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    }`}
                  >
                    {paginatedPortfolios.map((portfolio) => (
                      <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                    ))}
                  </div>

                  {/* Load More Button & Progress */}
                  {hasMorePortfolios && (
                    <div className="load-more-container mt-12 flex flex-col items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + PAGE_INCREMENT)}
                        className="btn-load-more inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#09090B] hover:bg-[#18181B] text-white text-sm font-bold shadow-md hover:shadow-xl transition-all hover:scale-102 active:scale-98 cursor-pointer"
                      >
                        <ArrowDown size={15} />
                        <span>Load more portfolios</span>
                      </button>
                      <p className="text-xs text-[#71717A] font-medium">
                        Showing {paginatedPortfolios.length} of {filteredPortfolios.length.toLocaleString()} total
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Global Search Dialog Modal with Full Dataset */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        customPortfolios={allPortfolios}
      />
    </div>
  );
}
