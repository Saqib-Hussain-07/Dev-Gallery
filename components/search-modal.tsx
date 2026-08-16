"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X, ExternalLink, Sparkles } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-[#1E202B] text-[#94A3B8] shadow-2xl border border-white/[0.1] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Search Input */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center gap-3 bg-[#171922]/50">
          <Search size={20} className="text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Portfolios, Categories or Stack..."
            className="flex-1 text-sm sm:text-base text-[#F8FAFC] placeholder-[#64748B] bg-transparent focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-[#94A3B8] hover:text-white px-2 py-1 bg-[#171922] border border-white/[0.08] rounded-md cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-full bg-[#171922] hover:bg-[#252836] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results or Trending suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-6">
          {query.trim() ? (
            <div>
              <p className="text-xs font-bold uppercase text-[#64748B] tracking-wider mb-3">
                Matching Portfolios ({filteredPortfolios.length})
              </p>
              {filteredPortfolios.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-[#F8FAFC]">No portfolios found</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    Try searching with another category or tech keyword.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredPortfolios.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1117] hover:bg-[#171922] border border-white/[0.07] hover:border-white/[0.18] transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-white/[0.08] bg-[#171922]">
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
                          <p className="text-sm font-bold text-[#F8FAFC] group-hover:text-indigo-300 transition-colors">
                            {p.title || p.owner.displayName}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {p.styleCategory || p.primaryCategory}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                        <span>Live site</span>
                        <ExternalLink size={13} />
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
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                  Trending Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setQuery(cat)}
                      className="px-3.5 py-1.5 rounded-full border border-white/[0.08] hover:border-white/[0.2] bg-[#0F1117] hover:bg-[#171922] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Tech Stack */}
              <div>
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                  Trending Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_STACK.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setQuery(tech)}
                      className="px-3.5 py-1.5 rounded-full bg-[rgba(99,102,241,0.08)] text-[#A5B4FC] border border-[rgba(99,102,241,0.2)] hover:bg-[rgba(99,102,241,0.15)] hover:border-[rgba(99,102,241,0.35)] text-xs font-semibold transition-colors cursor-pointer"
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
