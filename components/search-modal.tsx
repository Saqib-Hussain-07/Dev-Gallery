"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { portfolios } from "@/lib/mock-data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_ROLES = [
  "Visual designer",
  "UI/UX Designer",
  "Product designer",
  "Senior Frontend Engineer",
  "Creative Director",
  "Brand & Motion Designer",
];

const TRENDING_SKILLS = [
  "Design Systems",
  "SaaS",
  "Next.js",
  "Three.js",
  "WebGL",
  "Micro-animations",
  "TypeScript",
  "Figma",
];

export function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filteredPortfolios = query.trim()
    ? portfolios.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.owner.displayName.toLowerCase().includes(q) ||
          p.designation?.toLowerCase().includes(q) ||
          p.country?.toLowerCase().includes(q) ||
          p.primaryCategory.toLowerCase().includes(q) ||
          p.owner.skills?.some((s) => s.toLowerCase().includes(q))
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
            placeholder="Search Designers, Roles or Skills..."
            className="flex-1 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] bg-transparent focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-[#6B7280] hover:text-black px-2 py-1 bg-[#F3F4F6] rounded-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results or Trending suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-6">
          {query.trim() ? (
            <div>
              <p className="text-xs font-bold uppercase text-[#6B7280] mb-3">
                Matching Profiles ({filteredPortfolios.length})
              </p>
              {filteredPortfolios.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-[#374151]">No designers found</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Try searching with another role or skill.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPortfolios.map((p) => (
                    <Link
                      key={p.id}
                      href={`/portfolio/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E5E7EB]">
                          <Image
                            src={p.owner.avatarUrl}
                            alt={p.owner.displayName}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827] group-hover:text-black">
                            {p.owner.displayName}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {p.designation} · {p.country}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight size={18} className="text-[#9CA3AF] group-hover:text-black" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Trending Roles */}
              <div>
                <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  Trending Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setQuery(role)}
                      className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] hover:border-black text-xs font-semibold text-[#374151] hover:text-black transition-colors"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Skills */}
              <div>
                <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                  Trending Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setQuery(skill)}
                      className="px-3.5 py-1.5 rounded-full border border-[#E5E7EB] hover:border-black text-xs font-semibold text-[#374151] hover:text-black transition-colors"
                    >
                      {skill}
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
