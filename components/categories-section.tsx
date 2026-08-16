"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/mock-data";

export function CategoriesSection() {
  return (
    <section id="categories" className="py-8 border-b border-white/[0.07]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
          Explore Top Categories
        </h2>
        <span className="text-xs font-semibold text-[#64748B]">Curated Styles</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/?category=${cat.slug}#wall`}
            className="group flex flex-col rounded-2xl overflow-hidden bg-[#0F1117] border border-white/[0.07] hover:border-white/[0.18] shadow-xs hover:shadow-xl transition-all duration-300 card-hover-effect"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-[#171922]">
              <Image
                src={cat.cover}
                alt={cat.label}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 50vw, 200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117]/80 via-transparent to-transparent" />
            </div>
            <div className="p-3 flex flex-col justify-between flex-1">
              <h3 className="font-semibold text-xs text-[#F8FAFC] leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                {cat.label}
              </h3>
              <p className="text-[11px] text-[#64748B] font-medium mt-1">
                {cat.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
