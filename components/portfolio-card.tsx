"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Portfolio } from "@/lib/types";
import { Bookmark, ExternalLink, Github, Share2, Check } from "lucide-react";

interface Props {
  portfolio: Portfolio;
  onSelectTech?: (techName: string) => void;
}

export function PortfolioCard({ portfolio, onSelectTech }: Props) {
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
      await navigator.clipboard.writeText(portfolio.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const githubUrl = portfolio.owner.githubUsername
    ? `https://github.com/${portfolio.owner.githubUsername}`
    : `https://github.com/${portfolio.owner.username}`;

  return (
    <div className="relative group rounded-2xl bg-[#0F1117] border border-white/[0.07] hover:border-white/[0.18] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between card-hover-effect">
      {/* Top Floating Controls (Status, Bookmark & Share) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        {/* Status Badge with Live Pulse Dot */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#08090C]/85 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-xs border border-white/10">
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
            className="w-8 h-8 rounded-full bg-[#1E202B]/90 backdrop-blur-md hover:bg-[#1E202B] shadow-xs border border-white/[0.1] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all hover:scale-105 cursor-pointer"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Share2 size={13} />
            )}
          </button>
          {copied && (
            <div className="absolute -bottom-7 right-0 px-2 py-0.5 rounded-md bg-[#1E202B] text-white text-[10px] font-bold shadow-md whitespace-nowrap border border-white/15 animate-in fade-in zoom-in-95">
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
          className="w-8 h-8 rounded-full bg-[#1E202B]/90 backdrop-blur-md hover:bg-[#1E202B] shadow-xs border border-white/[0.1] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all hover:scale-105 cursor-pointer"
        >
          <Bookmark
            size={14}
            className={isBookmarked ? "fill-indigo-400 text-indigo-400" : "text-[#94A3B8]"}
          />
        </button>
      </div>

      {/* Large Preview Thumbnail */}
      <a
        href={portfolio.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-16/10 w-full overflow-hidden bg-[#171922] group/preview"
        title={`Visit ${portfolio.owner.displayName}'s live portfolio`}
      >
        <Image
          src={imgSrc}
          alt={portfolio.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover/preview:scale-106 transition-transform duration-500 ease-out"
          onError={() => {
            setImgSrc(
              "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
            );
          }}
        />

        {/* Hover Overlay with Live Link CTA */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-primary-gradient text-white text-xs font-bold shadow-2xl border border-white/20 hover:scale-105 transition-transform">
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
            <h3 className="font-bold text-base text-[#F8FAFC] group-hover:text-indigo-300 transition-colors leading-tight truncate">
              {portfolio.owner.displayName}
            </h3>

            {portfolio.styleCategory && (
              <span className="text-[10px] font-semibold text-[#94A3B8] bg-[#171922] px-2.5 py-0.5 rounded-full shrink-0 border border-white/[0.05]">
                {portfolio.styleCategory}
              </span>
            )}
          </div>

          {/* Semi-Transparent Indigo Tech Stack Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            {portfolio.technologies.slice(0, 3).map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={(e) => {
                  if (onSelectTech) {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectTech(tech.name);
                  }
                }}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[rgba(99,102,241,0.08)] text-[#A5B4FC] border border-[rgba(99,102,241,0.2)] hover:bg-[rgba(99,102,241,0.15)] hover:border-[rgba(99,102,241,0.35)] transition-all cursor-pointer"
                title={`Filter by ${tech.name}`}
              >
                {tech.name}
              </button>
            ))}
            {portfolio.technologies.length > 3 && (
              <span className="text-[10px] text-[#64748B] font-medium">
                +{portfolio.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Action Links (GitHub Link & Portfolio Live Link) */}
        <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2">
          {/* GitHub Profile Link */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View ${portfolio.owner.displayName}'s GitHub`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#171922] transition-colors"
          >
            <Github size={15} />
            <span className="text-[11px] font-semibold">GitHub</span>
          </a>

          {/* Direct Live Link Button (Primary Indigo-Violet Gradient) */}
          <a
            href={portfolio.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open live portfolio in new tab"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white btn-primary-gradient px-4 py-1.5 rounded-full shadow-md transition-all hover:scale-102 active:scale-98 border border-white/20"
          >
            <span>Live site</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
