"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ExternalLink, Heart, User } from "lucide-react";
import { Portfolio } from "@/lib/types";

interface Props {
  portfolios: Portfolio[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function MostLikedModal({
  portfolios,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}: Props) {
  if (!isOpen || portfolios.length === 0) return null;

  const current = portfolios[currentIndex] || portfolios[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + portfolios.length) % portfolios.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % portfolios.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 transition-all"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-colors cursor-pointer"
      >
        <X size={20} />
      </button>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous portfolio"
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center z-50 transition-all hover:scale-105 cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next portfolio"
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center z-50 transition-all hover:scale-105 cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>

      {/* Story Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#18181B] text-white p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden flex flex-col justify-between"
      >
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        <div>
          {/* Header with Rank & Likes */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
                <Image
                  src={current.owner.avatarUrl}
                  alt={current.owner.displayName}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex items-baseline gap-1 text-white font-bold">
                <span className="text-xl text-white/50">#</span>
                <span className="text-3xl font-extrabold">{currentIndex + 1}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-semibold text-rose-300">
              <Heart size={13} className="fill-rose-400 text-rose-400" />
              <span>{current.likes.allTime.toLocaleString()} Likes</span>
            </div>
          </div>

          {/* Name & Role */}
          <div className="mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {current.owner.displayName}
            </h3>
            <p className="text-sm font-medium text-white/70 mt-0.5">
              {current.designation || current.tagline} {current.country ? `· ${current.country}` : ""}
            </p>
          </div>

          {/* Style Category & Tags */}
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              {current.styleCategory || current.primaryCategory}
            </span>
            {current.yearsOfExperience && (
              <span className="text-xs font-medium text-white/70 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                {current.yearsOfExperience} yrs experience
              </span>
            )}
          </div>

          {/* Cover Preview — clickable to live site */}
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-16/10 w-full rounded-2xl overflow-hidden border border-white/10 mb-6 group cursor-pointer"
          >
            <Image
              src={current.coverImage}
              alt={current.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="480px"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-bold shadow-xl">
                <span>Visit Live Portfolio</span>
                <ExternalLink size={13} />
              </span>
            </div>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 px-6 rounded-2xl bg-white text-black hover:bg-[#F4F4F5] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={16} />
          </a>

          <Link
            href={`/portfolio/${current.slug}`}
            onClick={onClose}
            className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
          >
            <User size={16} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
