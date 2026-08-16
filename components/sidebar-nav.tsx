"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Kanban } from "lucide-react";

/**
 * Sidebar Navigation Item Configuration
 */
interface NavigationItem {
  href: string;
  label: string;
  icon: typeof Home;
  matchPrefix?: string;
}

const PRIMARY_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "/",
    label: "Portfolios",
    icon: Home,
  },
  {
    href: "/portfolio/paco-coursey/admin",
    label: "Tracker",
    icon: Kanban,
    matchPrefix: "/admin",
  },
];

/**
 * SidebarNav Component
 *
 * Fixed desktop sidebar navigation pinned to the left of the viewport.
 * Features:
 * - Direct routing to primary gallery & tracker views
 * - Active route styling with rounded backdrop pill
 * - Smooth icon hover animations
 */
export function SidebarNav() {
  const currentPathname = usePathname();

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="app-sidebar-fixed hidden lg:flex flex-col items-center w-18 shrink-0 py-4.5 bg-[#E2E4E9] fixed top-14 left-0 h-[calc(100vh-56px)] z-30 border-r border-[#D0D3DC]/40"
    >
      <nav className="sidebar-nav-container flex flex-col items-center gap-4 w-full px-1.5" aria-label="Main Navigation">
        {PRIMARY_NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.matchPrefix
            ? currentPathname.includes(item.matchPrefix)
            : currentPathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              aria-current={isItemActive ? "page" : undefined}
              className={`nav-item-link flex flex-col items-center gap-1 w-full py-2 px-1 text-center transition-all group rounded-xl ${
                isItemActive
                  ? "nav-item-active text-black font-bold bg-white/60 shadow-2xs"
                  : "nav-item-inactive text-[#4B5563] hover:text-black hover:bg-white/40"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`nav-item-icon-wrapper p-2 rounded-xl transition-all ${
                  isItemActive
                    ? "text-black"
                    : "text-[#4B5563] group-hover:text-black group-hover:scale-105"
                }`}
              >
                <Icon
                  size={20}
                  className={isItemActive ? "stroke-[2.5]" : "stroke-[1.75]"}
                  aria-hidden="true"
                />
              </div>

              {/* Label */}
              <span className="nav-item-label text-[11px] font-semibold tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
