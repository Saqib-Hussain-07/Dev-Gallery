import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

/**
 * DevGallery Brand Logo
 *
 * Direct rendering of the user's uploaded "DEV" brand identity asset
 * using next/image with seamless blend and responsive scaling.
 */
export function BrandLogo({
  size = "md",
  showText = false,
  className = "",
}: BrandLogoProps) {
  const dimensions = {
    sm: { height: 24, width: 62 },
    md: { height: 32, width: 82 },
    lg: { height: 42, width: 108 },
  };

  const current = dimensions[size];

  return (
    <div className={`brand-logo-root flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Uploaded DEV Logo Asset */}
      <div
        style={{ height: `${current.height}px`, width: `${current.width}px` }}
        className="relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <Image
          src="/dev-logo.png"
          alt="DevGallery Logo"
          fill
          unoptimized
          priority
          className="object-contain mix-blend-multiply"
        />
      </div>

      {/* Optional Subtext */}
      {showText && (
        <span className="font-mono font-bold tracking-[0.2em] text-[10px] sm:text-[11px] text-[#09090B] uppercase">
          GALLERY
        </span>
      )}
    </div>
  );
}
