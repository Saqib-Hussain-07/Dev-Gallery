"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { CategoriesSection } from "@/components/categories-section";
import { MostLikedStories } from "@/components/most-liked-stories";
import { CategoryFilterTabs } from "@/components/category-filter-tabs";
import { PortfolioCard } from "@/components/portfolio-card";
import { SearchModal } from "@/components/search-modal";
import { PortfolioCardSkeleton } from "@/components/ui/skeleton";
import { portfolios as staticFallbackPortfolios } from "@/lib/mock-data";
import { Portfolio } from "@/lib/types";
import { CheckCircle2, Loader2, Bookmark } from "lucide-react";

const INITIAL_PAGE_SIZE = 24;
const PAGE_INCREMENT = 24;

/**
 * HomePage Component
 *
 * Full-width, edge-to-edge responsive gallery synchronized with Saqib-Hussain-07/Wallfolio.
 * Features:
 * - 1,940+ Live developer portfolios parsed in real-time
 * - Wide expansive layout with minimal horizontal gaps
 * - 100% No-login bookmarks filter (using localStorage)
 * - Smooth Infinite Scrolling with IntersectionObserver
 * - Shimmering skeleton placeholders matching Wall of Portfolios aesthetic
 * - Category filter tabs & grid view switcher (Bento vs Dense)
 */
export default function HomePage() {
  /* -------------------------------------------------------------------------- */
  /* State & Data Sync                                                          */
  /* -------------------------------------------------------------------------- */
  const [allPortfolios, setAllPortfolios] = useState<Portfolio[]>(staticFallbackPortfolios);
  const [savedBookmarkIds, setSavedBookmarkIds] = useState<string[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"spacious" | "dense">("spacious");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PAGE_SIZE);

  // Sentinel ref for infinite scroll trigger
  const infiniteScrollSentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync localStorage bookmarks (100% client-side, zero login required)
  const syncLocalBookmarks = useCallback(() => {
    try {
      const stored = localStorage.getItem("wop_bookmarks");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedBookmarkIds(Array.isArray(parsed) ? parsed : []);
      } else {
        setSavedBookmarkIds([]);
      }
    } catch {
      setSavedBookmarkIds([]);
    }
  }, []);

  useEffect(() => {
    syncLocalBookmarks();
    window.addEventListener("wop_bookmarks_updated", syncLocalBookmarks);
    window.addEventListener("storage", syncLocalBookmarks);
    return () => {
      window.removeEventListener("wop_bookmarks_updated", syncLocalBookmarks);
      window.removeEventListener("storage", syncLocalBookmarks);
    };
  }, [syncLocalBookmarks]);

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
        if (isMounted) setIsLoadingInitial(false);
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

  // Listen for global category changes from navbar/command-palette
  useEffect(() => {
    function handleCategoryEvent(event: Event) {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedCategory(customEvent.detail);
      }
    }
    window.addEventListener("devgallery_set_category", handleCategoryEvent);
    return () => {
      window.removeEventListener("devgallery_set_category", handleCategoryEvent);
    };
  }, []);

  // Spotlight top ranked portfolios
  const spotlightPortfolios = useMemo(() => {
    return allPortfolios.slice(0, 8);
  }, [allPortfolios]);

  // Filtered dataset according to category or saved bookmarks
  const filteredPortfolios = useMemo(() => {
    if (selectedCategory === "bookmarks") {
      const bookmarkSet = new Set(savedBookmarkIds);
      return allPortfolios.filter(
        (p) =>
          bookmarkSet.has(p.id) ||
          bookmarkSet.has(p.slug) ||
          bookmarkSet.has(p.url)
      );
    }
    if (selectedCategory !== "all") {
      return allPortfolios.filter((p) => p.primaryCategory === selectedCategory);
    }
    return allPortfolios;
  }, [allPortfolios, selectedCategory, savedBookmarkIds]);

  // Sliced paginated subset for rendering
  const paginatedPortfolios = useMemo(() => {
    return filteredPortfolios.slice(0, visibleCount);
  }, [filteredPortfolios, visibleCount]);

  const hasMorePortfolios = visibleCount < filteredPortfolios.length;

  /**
   * Loads the next batch of portfolios smoothly.
   */
  const handleLoadNextBatch = useCallback(() => {
    if (!hasMorePortfolios || isLoadingMore) return;
    setIsLoadingMore(true);

    // Subtle micro-delay to let skeleton shimmer render smoothly
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_INCREMENT, filteredPortfolios.length));
      setIsLoadingMore(false);
    }, 250);
  }, [hasMorePortfolios, isLoadingMore, filteredPortfolios.length]);

  // IntersectionObserver for seamless infinite scrolling
  useEffect(() => {
    const sentinel = infiniteScrollSentinelRef.current;
    if (!sentinel || !hasMorePortfolios) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting) {
          handleLoadNextBatch();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [handleLoadNextBatch, hasMorePortfolios]);

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="home-layout-wrapper flex flex-col w-full min-h-screen bg-[#E2E4E9]">
      {/* Main Expansive Content Container */}
      <main className="main-content-card flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 pt-2 sm:pt-3 pb-5">
        <div className="content-inner-container w-full bg-white rounded-2xl sm:rounded-3xl border border-[#D0D3DC] px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-6 shadow-xs">
          {/* ================================================================= */}
          {/* 1. HERO SECTION                                                  */}
          {/* ================================================================= */}
          <section className="hero-section text-center pt-2 sm:pt-4 pb-3 flex flex-col items-center">
            {/* Live Repository Sync Ticker */}
            <div className="hero-ticker inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E4E4E7] text-xs font-semibold text-[#52525B] mb-3 shadow-2xs">
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
            <p className="hero-subheadline text-sm sm:text-lg text-[#52525B] mt-3 max-w-2xl font-normal leading-relaxed">
              Discover cutting-edge interfaces, interactive design engineering, and verified tech stacks from top software creators worldwide.
            </p>

            {/* Verification Metrics Bar */}
            <div className="hero-metrics-bar flex items-center gap-6 sm:gap-10 mt-5 pt-5 border-t border-[#E4E4E7]/60 text-center">
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
                <p className="metric-label text-[11px] text-[#71717A] font-medium uppercase tracking-wider">Instant Discovery</p>
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
          {/* 4. CURATED PORTFOLIO WALL & INFINITE SCROLL GRID                 */}
          {/* ================================================================= */}
          <section id="wall" className="portfolio-wall-section pt-6 pb-8">
            {/* Section Header */}
            <header className="wall-section-header flex items-center justify-between mb-2">
              <div>
                <h2 className="wall-title text-xl sm:text-2xl font-extrabold text-[#09090B] tracking-tight">
                  {selectedCategory === "bookmarks" ? "Your Saved Bookmarks" : "Curated Developer Portfolios"}
                </h2>
                <p className="wall-subtitle text-xs text-[#71717A] font-medium">
                  Showing {paginatedPortfolios.length} of {filteredPortfolios.length.toLocaleString()} portfolios
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
              {isLoadingInitial ? (
                /* Initial Loading Skeleton Grid */
                <div
                  className={`portfolio-grid grid gap-5 sm:gap-6 ${
                    viewMode === "spacious"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  }`}
                >
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <PortfolioCardSkeleton key={idx} />
                  ))}
                </div>
              ) : filteredPortfolios.length === 0 ? (
                /* Empty Filter Result State */
                <div className="empty-filter-state py-20 text-center bg-white rounded-3xl border border-[#E4E4E7] p-8 shadow-xs">
                  {selectedCategory === "bookmarks" ? (
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-[#F3F4F6] rounded-full mb-3">
                        <Bookmark size={20} className="text-[#6B7280]" />
                      </div>
                      <p className="text-base font-bold text-[#09090B]">
                        No saved bookmarks yet
                      </p>
                      <p className="text-xs text-[#71717A] mt-1 mb-4 max-w-sm">
                        Click the bookmark icon on any portfolio card to save it here for later. No login or account required!
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory("all")}
                        className="btn-reset-filters px-5 py-2 rounded-full bg-[#09090B] text-white text-xs font-semibold cursor-pointer shadow-xs hover:bg-[#18181B] transition-colors"
                      >
                        Explore all portfolios
                      </button>
                    </div>
                  ) : (
                    <div>
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
                  )}
                </div>
              ) : (
                /* Dynamic Portfolio Grid with Infinite Scroll */
                <>
                  <div
                    className={`portfolio-grid grid gap-5 sm:gap-6 ${
                      viewMode === "spacious"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    }`}
                  >
                    {paginatedPortfolios.map((portfolio) => (
                      <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                    ))}

                    {/* Skeletons when fetching next batch */}
                    {isLoadingMore &&
                      Array.from({ length: 6 }).map((_, idx) => (
                        <PortfolioCardSkeleton key={`loading-${idx}`} />
                      ))}
                  </div>

                  {/* Infinite Scroll Sentinel */}
                  {hasMorePortfolios ? (
                    <div
                      ref={infiniteScrollSentinelRef}
                      className="infinite-scroll-sentinel py-8 flex items-center justify-center gap-2 text-xs font-semibold text-[#71717A]"
                    >
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>Loading more portfolios...</span>
                    </div>
                  ) : (
                    /* End of List Confirmation */
                    <div className="end-of-gallery-state mt-16 py-8 border-t border-[#F0F1F3] flex flex-col items-center justify-center gap-1.5 text-center text-[#71717A]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>All {filteredPortfolios.length.toLocaleString()} portfolios loaded</span>
                      </div>
                      <p className="text-[11px]">
                        Curated by DevGallery from the open source developer community
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
