"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/mock-data";

export function CategoriesSection() {
  return (
    <section id="categories" className="py-8 border-b border-[#E5E7EB]">
      <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight mb-5">
        Explore top categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/?category=${cat.slug}#wall`}
            className="group flex flex-col rounded-xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#9CA3AF] shadow-2xs hover:shadow-md transition-all duration-200 card-hover-effect"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-[#F3F4F6]">
              <Image
                src={cat.cover}
                alt={cat.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, 200px"
              />
            </div>
            <div className="p-3 flex flex-col justify-between flex-1">
              <h3 className="font-semibold text-xs text-[#111827] leading-snug group-hover:text-black line-clamp-2">
                {cat.label}
              </h3>
              <p className="text-[11px] text-[#6B7280] font-medium mt-1">
                {cat.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
