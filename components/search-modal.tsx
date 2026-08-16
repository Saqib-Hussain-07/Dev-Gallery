"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X, ExternalLink } from "lucide-react";
import { portfolios } from "@/lib/mock-data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_CATEGORIES = [
  "Minimalist",
  "Dark Theme",
  "Interactive",
  "Creative",
  "Modern Layouts",
  "Engineering",
];

const TRENDING_STACK = [
  "Next.js",
  "React",
  "Three.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
];

export function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filteredPortfolios = query.trim()
    ? portfolios.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.owner.displayName.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          p.primaryCategory.toLowerCase().includes(q) ||
          (p.styleCategory && p.styleCategory.toLowerCase().includes(q)) ||
          p.technologies.some((t) => t.name.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-white text-[#111827] shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Search Input */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center gap-3">
          <Search size={20} className="text-[#9CA3AF] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Portfolios, Categories or Stack..."
            className="flex-1 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] bg-transparent focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-[#6B7280] hover:text-black px-2 py-1 bg-[#F3F4F6] rounded-md cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results or Trending suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-6">
          {query.trim() ? (
            <div>
              <p className="text-xs font-bold uppercase text-[#6B7280] mb-3">
                Matching Portfolios ({filteredPortfolios.length})
              </p>
              {filteredPortfolios.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-[#374151]">No portfolios found</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Try searching with another category or keyword.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPortfolios.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-[#E5E7EB] bg-[#E5E7EB]">
                          <Image
                            src={p.coverImage}
                            alt={p.title}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827] group-hover:text-black">
                            {p.title || p.owner.displayName}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {p.styleCategory || p.primaryCategory}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#4B5563] group-hover:text-black">
                        <span>Live site</span>
                        <ExternalLink size={14} />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Trending Categories */}
              <div>
                <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  Trending Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setQuery(cat)}
                      className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] hover:border-black text-xs font-semibold text-[#374151] hover:text-black transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Tech Stack */}
              <div>
                <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  Trending Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_STACK.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setQuery(tech)}
                      className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] hover:border-black text-xs font-semibold text-[#374151] hover:text-black transition-colors cursor-pointer"
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
