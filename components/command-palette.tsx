"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { FileText, Search, Shapes, ExternalLink } from "lucide-react";
import { portfolios as staticPortfolios, CATEGORIES } from "@/lib/mock-data";
import { Portfolio } from "@/lib/types";

/**
 * CommandPalette Component
 *
 * Global keyboard shortcut palette triggered via ⌘K (or Ctrl+K) or clicking the search pill.
 * Features:
 * - Instant live fuzzy search across all 1,940+ developer portfolios
 * - Category filter navigation
 * - Direct live portfolio site launch
 */
export function CommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allPortfolios, setAllPortfolios] = useState<Portfolio[]>(staticPortfolios);
  const router = useRouter();

  const handleClosePalette = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
  }, []);

  // Fetch full live dataset on initial mount
  useEffect(() => {
    async function loadLivePortfolios() {
      try {
        const res = await fetch("/api/wallfolio/sync");
        if (res.ok) {
          const data = await res.json();
          if (data.portfolios && data.portfolios.length > 0) {
            setAllPortfolios(data.portfolios);
          }
        }
      } catch {
        // fallback to staticPortfolios
      }
    }
    loadLivePortfolios();
  }, []);

  // Global keydown listener for ⌘K / Ctrl+K and Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listener for custom click trigger buttons with [data-command-trigger]
  useEffect(() => {
    function handleTriggerClick(event: MouseEvent) {
      const triggerElement = (event.target as HTMLElement)?.closest("[data-command-trigger]");
      if (triggerElement) {
        setIsOpen(true);
      }
    }
    document.addEventListener("click", handleTriggerClick);
    return () => document.removeEventListener("click", handleTriggerClick);
  }, []);

  const handleNavigateCategory = useCallback(
    (categorySlug: string) => {
      handleClosePalette();
      // Dispatch custom event or route to update category
      window.dispatchEvent(
        new CustomEvent("devgallery_set_category", { detail: categorySlug })
      );
      const wallElement = document.getElementById("wall");
      if (wallElement) {
        wallElement.scrollIntoView({ behavior: "smooth" });
      }
    },
    [handleClosePalette]
  );

  // Filter top matches for instant response
  const filteredLivePortfolios = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return allPortfolios.slice(0, 15);
    }
    return allPortfolios
      .filter((p) => {
        return (
          p.owner.displayName.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          (p.tagline && p.tagline.toLowerCase().includes(query)) ||
          p.primaryCategory.toLowerCase().includes(query) ||
          (p.styleCategory && p.styleCategory.toLowerCase().includes(query)) ||
          p.technologies.some((t) => t.name.toLowerCase().includes(query))
        );
      })
      .slice(0, 40);
  }, [searchQuery, allPortfolios]);

  if (!isOpen) return null;

  return (
    <div
      className="cmdk-backdrop-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-xs"
      onClick={handleClosePalette}
      role="presentation"
    >
      <Command
        label="Search DevGallery"
        className="command-palette-modal w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        shouldFilter={false}
      >
        {/* Search Input Bar */}
        <div className="command-input-wrapper flex items-center gap-3 border-b border-[#E5E7EB] px-4">
          <Search size={16} className="text-[#9CA3AF] shrink-0" aria-hidden="true" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 1,900+ developer portfolios, technologies, categories…"
            className="command-input-field w-full bg-transparent py-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#9CA3AF] hover:text-black px-1 py-0.5"
            >
              Clear
            </button>
          )}
          <kbd className="kbd-esc text-[10px] font-mono text-[#6B7280] border border-[#E5E7EB] px-1.5 py-0.5 rounded-sm shrink-0">
            ESC
          </kbd>
        </div>

        {/* Command Search Results List */}
        <div className="command-results-list max-h-[60vh] overflow-y-auto p-2">
          {/* Group: Categories */}
          {!searchQuery && (
            <div className="mb-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] px-3 py-1.5">
                Categories
              </div>
              <div className="flex items-center gap-1.5 flex-wrap px-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => handleNavigateCategory(category.slug)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] transition-colors cursor-pointer"
                  >
                    <Shapes size={11} className="text-[#6B7280]" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group: Live Portfolios */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] px-3 py-1.5 flex items-center justify-between">
              <span>{searchQuery ? `Matching Portfolios (${filteredLivePortfolios.length})` : "Featured Portfolios"}</span>
              <span className="text-[9px] lowercase font-normal text-[#9CA3AF]">Click to visit live website</span>
            </div>

            {filteredLivePortfolios.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#6B7280]">
                No developer portfolios found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredLivePortfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  onClick={() => {
                    if (portfolio.url) {
                      window.open(portfolio.url, "_blank", "noopener,noreferrer");
                    }
                    handleClosePalette();
                  }}
                  className="command-result-item flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#F3F4F6] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={15} className="shrink-0 text-[#9CA3AF] group-hover:text-black transition-colors" />
                    <div className="min-w-0">
                      <p className="result-item-title text-sm font-semibold text-[#111827] group-hover:text-black truncate">
                        {portfolio.owner.displayName}
                      </p>
                      <p className="result-item-tagline text-xs text-[#6B7280] truncate">
                        {portfolio.tagline || portfolio.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {portfolio.styleCategory && (
                      <span className="text-[10px] font-medium text-[#6B7280] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                        {portfolio.styleCategory}
                      </span>
                    )}
                    <ExternalLink size={13} className="text-[#9CA3AF] group-hover:text-black" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Command>
    </div>
  );
}
