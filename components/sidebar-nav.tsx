"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, BookOpen, Kanban } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Portfolios",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/#categories",
      label: "Studio",
      icon: Layers,
      isActive: false,
    },
    {
      href: "/#wall",
      label: "Cases",
      icon: BookOpen,
      isActive: false,
    },
    {
      href: "/portfolio/paco-coursey/admin",
      label: "Tracker",
      icon: Kanban,
      isActive: pathname.includes("/admin"),
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center w-18 shrink-0 py-4.5 bg-[#E2E4E9] sticky top-14 h-[calc(100vh-56px)] z-30">
      <nav className="flex flex-col items-center gap-4 w-full px-1.5" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={`flex flex-col items-center gap-1 w-full py-1.5 px-1 text-center transition-all group ${
                item.isActive
                  ? "text-black font-bold"
                  : "text-[#4B5563] hover:text-black"
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  item.isActive
                    ? "text-black"
                    : "text-[#4B5563] group-hover:text-black group-hover:scale-105"
                }`}
              >
                <Icon
                  size={20}
                  className={item.isActive ? "stroke-[2.5]" : "stroke-[1.75]"}
                />
              </div>
              <span className="text-[11px] font-semibold tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
