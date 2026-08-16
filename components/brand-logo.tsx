import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

/**
 * DEV GALLERY Brand Logo
 *
 * Exact 1:1 authentic rendering of the user's DEV logo paired with GALLERY wordmark,
 * optically balanced and shifted slightly down for optimal vertical alignment.
 */
export function BrandLogo({
  size = "md",
  showText = true,
  className = "",
}: BrandLogoProps) {
  const dimensions = {
    sm: { height: 20, width: 46, text: "text-xs tracking-[0.16em]" },
    md: { height: 25, width: 57, text: "text-sm tracking-[0.18em]" },
    lg: { height: 32, width: 73, text: "text-base tracking-[0.2em]" },
  };

  const current = dimensions[size];

  return (
    <div className={`brand-logo-root flex items-center gap-2 group select-none cursor-pointer translate-y-[2px] ${className}`}>
      {/* Authentic DEV Logo Mark */}
      <Image
        src="/dev-logo.png"
        alt="DEV Logo"
        width={current.width}
        height={current.height}
        priority
        className="object-contain transition-transform duration-200 group-hover:scale-105"
        style={{ height: `${current.height}px`, width: "auto" }}
      />

      {/* GALLERY Wordmark */}
      {showText && (
        <span className={`font-black text-[#09090B] uppercase font-sans select-none leading-none pt-0.5 ${current.text}`}>
          GALLERY
        </span>
      )}
    </div>
  );
}
