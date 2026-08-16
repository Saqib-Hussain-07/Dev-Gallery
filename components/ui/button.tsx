import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-[#111827] text-white hover:bg-black border border-transparent shadow-xs hover:shadow-md",
  secondary: "bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB] border border-transparent",
  ghost: "bg-transparent text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border border-transparent",
  outline: "bg-white text-[#111827] border border-[#E5E7EB] hover:border-[#9CA3AF] shadow-2xs hover:shadow-xs",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3.5 py-1.5 rounded-full",
  md: "text-xs sm:text-sm px-4 py-2 sm:py-2.5 rounded-full",
  lg: "text-sm sm:text-base px-6 py-3 rounded-full",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-tight transition-all duration-150 active:scale-[0.98] cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: BaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-tight transition-all duration-150 active:scale-[0.98] cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
