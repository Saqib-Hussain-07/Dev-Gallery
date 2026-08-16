import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

/**
 * DevGallery Brand Logo
 *
 * Distinct monochrome black & white vector mark combining:
 * - Gallery viewport frame
 * - Precision developer code angle brackets (< / >)
 * - Modern geometric typography
 */
export function BrandLogo({
  size = "md",
  showText = true,
  className = "",
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={`brand-logo-root flex items-center gap-2.5 group select-none ${className}`}>
      {/* Monochrome Vector Mark */}
      <div
        className={`brand-mark flex items-center justify-center ${iconSizes[size]} bg-black rounded-[10px] p-1.5 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-md border border-black/10`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
          aria-hidden="true"
        >
          {/* Gallery Canvas Outer Frame */}
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeOpacity="0.35"
          />

          {/* Left Code Bracket: < */}
          <path
            d="M8.5 8L5.5 12L8.5 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Code Bracket: > */}
          <path
            d="M15.5 8L18.5 12L15.5 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Gallery Horizon Aperture */}
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="brand-text flex items-center tracking-tight leading-none">
          <span className={`font-black text-black ${textSizes[size]}`}>
            Dev
          </span>
          <span className={`font-semibold text-[#6B7280] ${textSizes[size]} ml-0.5`}>
            Gallery
          </span>
        </div>
      )}
    </div>
  );
}
