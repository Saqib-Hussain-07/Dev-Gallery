import Link from "next/link";
import { LayoutGrid, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white text-[#111827] mt-16 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Brand Mark & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-bold text-[10px]">
            <LayoutGrid size={12} />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#111827]">
            Wall of Portfolios
          </span>
          <span className="text-[#9CA3AF] hidden sm:inline">•</span>
          <span className="text-[#6B7280] hidden sm:inline">
            Curated showcase for designers &amp; developers
          </span>
        </div>

        {/* Center/Right: Inline Links & Copyright */}
        <div className="flex items-center gap-6 font-medium text-[#4B5563]">
          <Link href="/" className="hover:text-black transition-colors">
            Portfolios
          </Link>
          <Link href="/#categories" className="hover:text-black transition-colors">
            Categories
          </Link>
          <Link href="/submit" className="hover:text-black transition-colors">
            Submit
          </Link>
          <span className="text-[#9CA3AF]">•</span>
          <p className="text-[#6B7280] flex items-center gap-1">
            © {new Date().getFullYear()} Crafted with <Heart size={11} className="text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
