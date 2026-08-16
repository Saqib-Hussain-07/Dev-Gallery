import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * DEV Brand Logo
 *
 * Vector implementation of the bold interlocking "DEV" monogram:
 * - Bold block D
 * - E connecting smoothly from the base of D
 * - Angled V overlapping the middle E-bar with crisp negative space cut-gap
 */
export function BrandLogo({
  size = "md",
  className = "",
}: BrandLogoProps) {
  const heights = {
    sm: 22,
    md: 27,
    lg: 34,
  };

  return (
    <div className={`brand-logo-root flex items-center group select-none ${className}`}>
      {/* Pure Interlocking DEV Monogram */}
      <svg
        height={heights[size]}
        viewBox="0 0 176 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-black transition-transform duration-200 group-hover:scale-105"
        aria-label="DEV Logo"
      >
        {/* D outer & inner counter */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0H46C65 0 74 10 74 27C74 44 64 56 46 56H20V72H0V0ZM20 16V40H44C52 40 55 35 55 27C55 19 51 16 44 16H20Z"
          fill="currentColor"
        />

        {/* E Top Horizontal Bar */}
        <rect x="52" y="0" width="58" height="16" fill="currentColor" />

        {/* E Middle Horizontal Bar */}
        <rect x="52" y="27" width="46" height="15" fill="currentColor" />

        {/* E Bottom Horizontal Bar */}
        <rect x="46" y="56" width="62" height="16" fill="currentColor" />

        {/* Diagonal Negative Space Cut Gap behind the V's left arm */}
        <polygon
          points="88,20 102,20 118,72 104,72"
          fill="#E2E4E9"
        />

        {/* V Monogram Overlap */}
        <polygon
          points="106,0 128,54 150,0 174,0 138,72 118,72 84,0"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
