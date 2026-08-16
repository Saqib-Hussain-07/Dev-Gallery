import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * DEV Brand Logo
 *
 * Exact 1:1 authentic rendering of the user's original DEV logo.
 */
export function BrandLogo({
  size = "md",
  className = "",
}: BrandLogoProps) {
  const dimensions = {
    sm: { height: 22, width: 51 },
    md: { height: 28, width: 64 },
    lg: { height: 36, width: 83 },
  };

  const { height, width } = dimensions[size];

  return (
    <div className={`brand-logo-root flex items-center group select-none ${className}`}>
      <Image
        src="/dev-logo.png"
        alt="DEV Logo"
        width={width}
        height={height}
        priority
        className="object-contain transition-transform duration-200 group-hover:scale-105"
        style={{ height: `${height}px`, width: "auto" }}
      />
    </div>
  );
}
