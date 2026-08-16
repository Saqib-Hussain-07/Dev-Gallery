import Link from "next/link";
import { Terminal, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E4E4E7] bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center">
            <Terminal size={11} className="text-violet-400" />
          </div>
          <span className="font-bold text-[#09090B]">DevGallery</span>
          <span>© {new Date().getFullYear()} — Curated Index for Builders &amp; Designers.</span>
        </div>

        {/* Center/Right: Links */}
        <div className="flex items-center gap-5 font-medium">
          <Link href="/#categories" className="hover:text-black transition-colors">
            Categories
          </Link>
          <Link href="/#wall" className="hover:text-black transition-colors">
            Explore All
          </Link>
          <Link href="/submit" className="hover:text-black transition-colors">
            Submit Portfolio
          </Link>
          <a
            href="https://github.com/Saqib-Hussain-07/Dev-Gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
