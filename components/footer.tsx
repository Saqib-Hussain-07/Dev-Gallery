import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#D0D3DC] bg-[#E2E4E9] py-5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-black">WALL OF PORTFOLIOS</span>
          <span>© {new Date().getFullYear()} — Curated Developer &amp; Designer Directory.</span>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-5 font-semibold">
          <Link href="/#categories" className="hover:text-black transition-colors">
            Categories
          </Link>
          <Link href="/#wall" className="hover:text-black transition-colors">
            Explore All
          </Link>
          <a
            href="https://github.com/Saqib-Hussain-07/Wallfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            GitHub Repo
          </a>
        </div>
      </div>
    </footer>
  );
}
