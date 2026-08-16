"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Portfolio } from "@/lib/types";
import { Bookmark, ExternalLink, Github, Share2, Check } from "lucide-react";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState(portfolio.coverImage);

  useEffect(() => {
    setImgSrc(portfolio.coverImage);
  }, [portfolio.coverImage]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wop_bookmarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.includes(portfolio.id)) {
          setIsBookmarked(true);
        }
      }
    } catch {
      // ignore
    }
  }, [portfolio.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("wop_bookmarks");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (isBookmarked) {
        list = list.filter((id) => id !== portfolio.id);
        setIsBookmarked(false);
      } else {
        list.push(portfolio.id);
        setIsBookmarked(true);
      }
      localStorage.setItem("wop_bookmarks", JSON.stringify(list));
      window.dispatchEvent(new Event("wop_bookmarks_updated"));
    } catch {
      // ignore
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${portfolio.owner.displayName} Portfolio`,
          url: portfolio.url,
        });
      } else {
        await navigator.clipboard.writeText(portfolio.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback clipboard
      await navigator.clipboard.writeText(portfolio.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const githubUrl = portfolio.owner.githubUsername
    ? `https://github.com/${portfolio.owner.githubUsername}`
    : `https://github.com/${portfolio.owner.username}`;

  return (
    <div className="relative group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#9CA3AF] shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between">
      {/* Top Floating Controls (Status, Bookmark & Share) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        {/* Status Badge with Live Pulse Dot */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{portfolio.status === "LIVE" ? "LIVE" : portfolio.status}</span>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        {/* Share Button with Copied Tooltip */}
        <div className="relative">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share portfolio link"
            title="Share portfolio"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-xs border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black transition-all hover:scale-105 cursor-pointer"
          >
            {copied ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <Share2 size={13} />
            )}
          </button>
          {copied && (
            <div className="absolute -bottom-7 right-0 px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-bold shadow-md whitespace-nowrap animate-in fade-in zoom-in-95">
              Link copied!
            </div>
          )}
        </div>

        {/* Bookmark Toggle Button */}
        <button
          type="button"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark portfolio"}
          title={isBookmarked ? "Bookmarked" : "Bookmark"}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-xs border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black transition-all hover:scale-105 cursor-pointer"
        >
          <Bookmark
            size={14}
            className={isBookmarked ? "fill-black text-black" : "text-[#4B5563]"}
          />
        </button>
      </div>

      {/* Large Preview Thumbnail */}
      <a
        href={portfolio.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-16/10 w-full overflow-hidden bg-[#F3F4F6] group/preview"
        title={`Visit ${portfolio.owner.displayName}'s live portfolio`}
      >
        <Image
          src={imgSrc}
          alt={portfolio.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover/preview:scale-105 transition-transform duration-300"
          onError={() => {
            setImgSrc(
              "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
            );
          }}
        />

        {/* Hover Overlay with Live Link CTA */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-bold shadow-xl backdrop-blur-xs">
            <span>Visit Live Portfolio</span>
            <ExternalLink size={13} />
          </span>
        </div>
      </a>

      {/* Card Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Developer Name & Style Category */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-base text-[#111827] group-hover:text-black leading-tight truncate">
              {portfolio.owner.displayName}
            </h3>

            {portfolio.styleCategory && (
              <span className="text-[10px] font-semibold text-[#4B5563] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full shrink-0">
                {portfolio.styleCategory}
              </span>
            )}
          </div>

          {/* Technology Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            {portfolio.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech.id}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB]"
              >
                {tech.name}
              </span>
            ))}
            {portfolio.technologies.length > 3 && (
              <span className="text-[10px] text-[#6B7280] font-medium">
                +{portfolio.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Action Links (GitHub Link & Portfolio Live Link) */}
        <div className="pt-3 border-t border-[#F0F1F3] flex items-center justify-between gap-2">
          {/* GitHub Profile Link */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View ${portfolio.owner.displayName}'s GitHub`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] hover:text-black p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <Github size={15} />
            <span className="text-[11px] font-semibold">GitHub</span>
          </a>

          {/* Direct Live Link Button */}
          <a
            href={portfolio.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open live portfolio in new tab"
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-black hover:bg-[#27272A] px-3.5 py-1.5 rounded-full shadow-2xs transition-all hover:scale-102 active:scale-98"
          >
            <span>Live site</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
