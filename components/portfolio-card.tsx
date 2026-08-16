"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Bookmark, ExternalLink, Github, Share2, Check } from "lucide-react";
import { Portfolio } from "@/lib/types";

/**
 * Props for the PortfolioCard component.
 */
interface PortfolioCardProps {
  portfolio: Portfolio;
}

/**
 * Fallback preview image in case external website screenshot fails to load.
 */
const FALLBACK_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80";

/**
 * PortfolioCard Component
 *
 * Displays a showcase card for an individual developer/designer portfolio.
 * Features:
 * - Live screenshot preview with 16:10 aspect ratio and zoom on hover
 * - Real-time pulse status badge (LIVE)
 * - Bookmark toggle with localStorage persistence and header sync
 * - Quick link share with clipboard copy feedback
 * - Developer info & style category
 * - Technology stack badges
 * - External GitHub profile and Live Portfolio links
 */
export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  /* -------------------------------------------------------------------------- */
  /* State & Hooks                                                              */
  /* -------------------------------------------------------------------------- */
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<string>(portfolio.coverImage);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Sync image source if portfolio data updates
  useEffect(() => {
    setImageSource(portfolio.coverImage);
    setIsImageLoaded(false);
  }, [portfolio.coverImage]);

  // Load bookmark status from localStorage on mount
  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem("wop_bookmarks");
      if (storedBookmarks) {
        const parsedIds: string[] = JSON.parse(storedBookmarks);
        if (
          Array.isArray(parsedIds) &&
          (parsedIds.includes(portfolio.id) ||
            parsedIds.includes(portfolio.slug) ||
            parsedIds.includes(portfolio.url))
        ) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      }
    } catch (error) {
      console.warn("Failed to load bookmark state:", error);
    }
  }, [portfolio.id, portfolio.slug, portfolio.url]);

  /* -------------------------------------------------------------------------- */
  /* Event Handlers                                                             */
  /* -------------------------------------------------------------------------- */

  /**
   * Toggles bookmark state and dispatches a global update event for the navbar counter.
   */
  const handleToggleBookmark = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        const stored = localStorage.getItem("wop_bookmarks");
        let bookmarkList: string[] = stored ? JSON.parse(stored) : [];

        if (isBookmarked) {
          bookmarkList = bookmarkList.filter(
            (key) =>
              key !== portfolio.id &&
              key !== portfolio.slug &&
              key !== portfolio.url
          );
          setIsBookmarked(false);
        } else {
          if (!bookmarkList.includes(portfolio.id)) {
            bookmarkList.push(portfolio.id);
          }
          if (!bookmarkList.includes(portfolio.slug)) {
            bookmarkList.push(portfolio.slug);
          }
          setIsBookmarked(true);
        }

        localStorage.setItem("wop_bookmarks", JSON.stringify(bookmarkList));
        window.dispatchEvent(new Event("wop_bookmarks_updated"));
      } catch (error) {
        console.warn("Failed to update bookmark state:", error);
      }
    },
    [isBookmarked, portfolio.id, portfolio.slug, portfolio.url]
  );

  /**
   * Handles sharing the portfolio URL via Web Share API or clipboard copy fallback.
   */
  const handleSharePortfolio = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        if (navigator.share) {
          await navigator.share({
            title: `${portfolio.owner.displayName} — Portfolio`,
            url: portfolio.url,
          });
        } else {
          await navigator.clipboard.writeText(portfolio.url);
          setIsLinkCopied(true);
          setTimeout(() => setIsLinkCopied(false), 2000);
        }
      } catch {
        // Clipboard fallback if native share is dismissed or unsupported
        await navigator.clipboard.writeText(portfolio.url);
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
      }
    },
    [portfolio.owner.displayName, portfolio.url]
  );

  // Derive developer GitHub URL (uses confirmed profile or search fallback to avoid 404s)
  const developerGithubUrl = portfolio.owner.githubUsername
    ? `https://github.com/${portfolio.owner.githubUsername}`
    : `https://github.com/search?q=${encodeURIComponent(portfolio.owner.displayName)}&type=users`;

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <article
      data-testid={`portfolio-card-${portfolio.id}`}
      className="portfolio-card group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#9CA3AF] shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* --- Floating Overlay: Status Badge (Top-Left) --- */}
      <div className="status-badge-container absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs shadow-xs"
          aria-label={`Portfolio Status: ${portfolio.status}`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
            aria-hidden="true"
          />
          <span>{portfolio.status}</span>
        </div>
      </div>

      {/* --- Floating Overlay: Quick Actions (Top-Right) --- */}
      <div className="quick-actions-container absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {/* Share Button */}
        <div className="relative">
          <button
            type="button"
            onClick={handleSharePortfolio}
            aria-label="Share portfolio link"
            title="Share portfolio"
            className="action-button-share flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#4B5563] hover:text-black border border-[#E5E7EB] shadow-xs backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
          >
            {isLinkCopied ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <Share2 size={13} />
            )}
          </button>

          {/* Copy Tooltip Confirmation */}
          {isLinkCopied && (
            <div
              role="status"
              className="copy-tooltip absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-black px-2 py-0.5 text-[10px] font-bold text-white shadow-md animate-in fade-in zoom-in-95"
            >
              Link copied!
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark portfolio"}
          title={isBookmarked ? "Bookmarked" : "Bookmark"}
          className="action-button-bookmark flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#4B5563] hover:text-black border border-[#E5E7EB] shadow-xs backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
        >
          <Bookmark
            size={14}
            className={isBookmarked ? "fill-black text-black" : "text-[#4B5563]"}
          />
        </button>
      </div>

      {/* --- Media: Large Preview Image with Progressive Loading Shimmer --- */}
      <figure className="preview-figure relative aspect-16/10 w-full overflow-hidden bg-[#F3F4F6] m-0">
        {/* Placeholder Shimmer while image is generating */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-r from-[#F3F4F6] via-[#E5E7EB] to-[#F3F4F6] animate-pulse">
            <span className="text-xs font-bold text-[#9CA3AF] tracking-wider uppercase">
              {portfolio.owner.displayName.slice(0, 2)}
            </span>
          </div>
        )}

        <a
          href={portfolio.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Visit ${portfolio.owner.displayName}'s live portfolio`}
          className="preview-link block h-full w-full group/preview"
        >
          <Image
            src={imageSource}
            alt={`${portfolio.owner.displayName} portfolio screenshot preview`}
            fill
            unoptimized
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            className={`preview-image object-cover group-hover/preview:scale-105 transition-all duration-500 ease-out ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => {
              setImageSource(FALLBACK_PREVIEW_IMAGE);
              setIsImageLoaded(true);
            }}
          />

          {/* Hover CTA Overlay */}
          <div className="preview-hover-overlay absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover/preview:opacity-100 transition-opacity backdrop-blur-[1px]">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-bold shadow-xl backdrop-blur-xs hover:scale-105 transition-transform">
              <span>Visit Live Portfolio</span>
              <ExternalLink size={13} />
            </span>
          </div>
        </a>
      </figure>

      {/* --- Content: Developer Information & Actions --- */}
      <div className="card-content-body p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Developer Header & Style Category */}
        <header className="developer-header">
          <div className="flex items-center justify-between gap-2">
            <h3 className="developer-name text-base font-bold text-[#111827] group-hover:text-black leading-tight truncate">
              {portfolio.owner.displayName}
            </h3>

            {portfolio.styleCategory && (
              <span className="style-category-badge shrink-0 rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[10px] font-semibold text-[#4B5563]">
                {portfolio.styleCategory}
              </span>
            )}
          </div>

          {/* Technology Badges */}
          <div
            className="tech-badges-list flex items-center gap-1.5 flex-wrap mt-2.5"
            aria-label="Technologies used"
          >
            {portfolio.technologies.slice(0, 3).map((technology) => (
              <span
                key={technology.id}
                className="tech-badge rounded-md bg-[#F9FAFB] border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-semibold text-[#374151]"
              >
                {technology.name}
              </span>
            ))}
            {portfolio.technologies.length > 3 && (
              <span className="tech-overflow-count text-[10px] font-medium text-[#6B7280]">
                +{portfolio.technologies.length - 3}
              </span>
            )}
          </div>
        </header>

        {/* Action Footer: GitHub Link & Direct Live Link */}
        <footer className="card-action-footer pt-3 border-t border-[#F0F1F3] flex items-center justify-between gap-2">
          {/* Developer GitHub Profile Link */}
          <a
            href={developerGithubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View ${portfolio.owner.displayName}'s GitHub Profile`}
            className="action-link-github inline-flex items-center gap-1.5 rounded-lg p-1.5 text-xs font-semibold text-[#4B5563] hover:text-black hover:bg-[#F3F4F6] transition-colors"
          >
            <Github size={15} />
            <span className="text-[11px]">GitHub</span>
          </a>

          {/* Direct Live Site Launch Button */}
          <a
            href={portfolio.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${portfolio.owner.displayName}'s portfolio in a new tab`}
            className="action-btn-live inline-flex items-center gap-1.5 rounded-full bg-black hover:bg-[#27272A] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-all hover:scale-102 active:scale-98"
          >
            <span>Live site</span>
            <ExternalLink size={12} />
          </a>
        </footer>
      </div>
    </article>
  );
}
