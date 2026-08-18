"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/mock-data";

/**
 * CategoriesSection Component
 *
 * Displays a curated 6-column grid of design styles and categories.
 * Each card features a minimalist cover image and a live portfolio count.
 */
export function CategoriesSection() {
  return (
    <section id="categories" className="categories-showcase-section py-8 border-b border-[#E5E7EB]">
      {/* Section Header */}
      <header className="section-header flex items-center justify-between mb-5">
        <h2 className="section-title text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
          Explore Top Categories
        </h2>
      </header>

      {/* Categories Cards Grid */}
      <div className="categories-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/?category=${category.slug}#wall`}
            className="category-card group flex flex-col rounded-xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#9CA3AF] shadow-2xs hover:shadow-md transition-all duration-200"
          >
            {/* Category Cover Thumbnail */}
            <figure className="category-cover-figure relative aspect-16/10 w-full overflow-hidden bg-[#F3F4F6] m-0">
              <Image
                src={category.cover}
                alt={`${category.label} category preview`}
                fill
                unoptimized
                className="category-cover-image object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, 200px"
              />
            </figure>

            {/* Category Label & Item Count */}
            <div className="category-card-body p-3 flex flex-col justify-between flex-1">
              <h3 className="category-label font-semibold text-xs text-[#111827] leading-snug group-hover:text-black line-clamp-2">
                {category.label}
              </h3>
              <p className="category-item-count text-[11px] text-[#6B7280] font-medium mt-1">
                {category.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
