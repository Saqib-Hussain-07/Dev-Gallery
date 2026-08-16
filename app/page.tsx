"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Globe, ArrowRight } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import { CategoriesSection } from "@/components/categories-section";
import { MostLikedStories } from "@/components/most-liked-stories";
import { CategoryFilterTabs } from "@/components/category-filter-tabs";
import { PortfolioCard } from "@/components/portfolio-card";
import { SearchModal } from "@/components/search-modal";
import { portfolios, getMostLikedPortfolios } from "@/lib/mock-data";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const mostLikedList = useMemo(() => getMostLikedPortfolios(8), []);

  // Filter portfolios by selected category
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((p) => {
      if (selectedCategory !== "all") {
        return p.primaryCategory === selectedCategory;
      }
      return true;
    });
  }, [selectedCategory]);

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <section className="text-center pt-6 sm:pt-10 pb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#4B5563] mb-6 shadow-2xs">
            <Sparkles size={13} className="text-amber-500" />
            <span>Discover &amp; Showcase Worldwide Portfolios</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.08] max-w-4xl">
            Discover curated work from <br className="hidden sm:inline" />
            the world&apos;s top designers &amp; developers
          </h1>

          <p className="text-sm sm:text-lg text-[#4B5563] mt-4 max-w-2xl font-normal leading-relaxed">
            Explore handpicked portfolios, live sites &amp; project showcases from top builders.
          </p>

          {/* Global Showcase Banner */}
          <div className="w-full max-w-3xl mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center text-[#111827] shrink-0">
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                  Showcase your portfolio to builders &amp; recruiters worldwide
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Get indexed, reviewed, and discovered by teams globally.
                </p>
              </div>
            </div>
            <Link
              href="/submit"
              className="shrink-0 px-5 py-2.5 rounded-full bg-black text-white hover:bg-[#27272A] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Submit Portfolio</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* EXPLORE TOP CATEGORIES */}
        <CategoriesSection />

        {/* MOST LIKED PORTFOLIOS */}
        <MostLikedStories portfolios={mostLikedList} />

        {/* CURATED PORTFOLIOS WALL SECTION */}
        <section id="wall" className="pt-8 pb-20">
          <div className="mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Curated Portfolios for you !
            </h2>
          </div>

          {/* Sticky Category Tabs & Search Trigger */}
          <CategoryFilterTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
          />

          {/* Portfolio Grid */}
          <div className="pt-6">
            {filteredPortfolios.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-[#E5E7EB] p-8">
                <p className="text-base font-bold text-[#111827]">
                  No portfolios found in this category
                </p>
                <p className="text-xs text-[#6B7280] mt-1 mb-4">
                  Explore all portfolios or switch category.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="px-5 py-2 rounded-full bg-black text-white text-xs font-semibold cursor-pointer"
                >
                  View all portfolios
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredPortfolios.map((portfolio) => (
                  <PortfolioCard key={portfolio.id} portfolio={portfolio} />
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
