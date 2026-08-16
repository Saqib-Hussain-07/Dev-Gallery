"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, X, ExternalLink } from "lucide-react";
import { portfolios } from "@/lib/mock-data";

import { Portfolio } from "@/lib/types";

/**
 * Props for the SearchModal component.
 */
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customPortfolios?: Portfolio[];
}

const POPULAR_SEARCH_CATEGORIES = [
  "Minimalist",
  "Dark Theme",
  "Interactive",
  "Creative",
  "Modern Layouts",
  "Engineering",
];

const POPULAR_TECH_KEYWORDS = [
  "Next.js",
  "React",
  "Three.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
];

/**
 * SearchModal Component
 *
 * Provides a fast fuzzy search across:
 * - Developer names and portfolio titles
 * - Style categories and taglines
 * - Technology stacks
 * Displays trending discovery tags when the input query is empty.
 */
export function SearchModal({ isOpen, onClose, customPortfolios }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchSource = customPortfolios && customPortfolios.length > 0 ? customPortfolios : portfolios;

  // Memoized search filtering across title, owner, category, and tech stack
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return searchSource.filter((item) => {
      return (
        item.owner.displayName.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        (item.tagline && item.tagline.toLowerCase().includes(query)) ||
        item.primaryCategory.toLowerCase().includes(query) ||
        (item.styleCategory && item.styleCategory.toLowerCase().includes(query)) ||
        item.technologies.some((tech) => tech.name.toLowerCase().includes(query))
      );
    }).slice(0, 50); // Limit to top 50 matches for instant UI response
  }, [searchQuery, searchSource]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      className="search-modal-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="search-modal-container w-full max-w-2xl rounded-3xl bg-white text-[#111827] shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* --- Header with Search Input --- */}
        <header className="search-modal-header p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center gap-3">
          <Search size={20} className="search-input-icon text-[#9CA3AF] shrink-0" aria-hidden="true" />
          <input
            id="search-dialog-title"
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search Portfolios, Categories or Stack..."
            className="search-text-input flex-1 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] bg-transparent focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="btn-clear-query text-xs font-semibold text-[#6B7280] hover:text-black px-2 py-1 bg-[#F3F4F6] rounded-md cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            className="btn-close-modal w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {/* --- Modal Content: Live Results or Suggestions --- */}
        <div className="search-modal-body max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-6">
          {searchQuery.trim() ? (
            /* Matching Results List */
            <div className="search-results-section">
              <p className="results-count-label text-xs font-bold uppercase text-[#6B7280] tracking-wider mb-3">
                Matching Portfolios ({searchResults.length})
              </p>

              {searchResults.length === 0 ? (
                <div className="empty-results-box py-12 text-center">
                  <p className="text-sm font-semibold text-[#111827]">No portfolios found</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Try searching with another category or tech keyword.
                  </p>
                </div>
              ) : (
                <ul className="results-list space-y-2.5" role="list">
                  {searchResults.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="result-item-link flex items-center justify-between p-3.5 rounded-2xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] hover:border-[#9CA3AF] transition-all group shadow-2xs"
                      >
                        <div className="result-info flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="result-thumbnail relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-[#E5E7EB] bg-[#F3F4F6]">
                            <Image
                              src={item.coverImage}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <p className="result-name text-sm font-bold text-[#111827] group-hover:text-black">
                              {item.title || item.owner.displayName}
                            </p>
                            <p className="result-category text-xs text-[#6B7280]">
                              {item.styleCategory || item.primaryCategory}
                            </p>
                          </div>
                        </div>

                        <div className="result-action flex items-center gap-1.5 text-xs font-semibold text-black">
                          <span>Live site</span>
                          <ExternalLink size={13} aria-hidden="true" />
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Trending Discovery Suggestions */
            <>
              {/* Categories */}
              <div className="trending-categories-group">
                <h4 className="trending-title text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  Trending Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCH_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSearchQuery(category)}
                      className="category-pill px-3.5 py-1.5 rounded-full border border-[#E5E7EB] hover:border-[#9CA3AF] bg-[#F9FAFB] hover:bg-white text-xs font-semibold text-[#4B5563] hover:text-black transition-colors cursor-pointer"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="trending-tech-group">
                <h4 className="trending-title text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  Trending Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TECH_KEYWORDS.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setSearchQuery(tech)}
                      className="tech-pill px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] hover:border-black text-xs font-semibold text-[#374151] hover:text-black transition-colors cursor-pointer"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
