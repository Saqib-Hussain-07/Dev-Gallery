"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, FolderGit2, LayoutDashboard } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Portfolios",
      icon: Compass,
      isActive: pathname === "/",
    },
    {
      href: "/#categories",
      label: "Categories",
      icon: FolderGit2,
      isActive: false,
    },
    {
      href: "/portfolio/paco-coursey/admin",
      label: "Sync / Admin",
      icon: LayoutDashboard,
      isActive: pathname.includes("/admin"),
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center w-16 shrink-0 py-6 border-r border-[#E5E7EB] bg-[#FFFFFF] sticky top-[68px] h-[calc(100vh-68px)] z-30">
      <nav className="flex flex-col items-center gap-5 w-full px-1.5" aria-label="App Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={`flex flex-col items-center gap-1 w-full py-2 px-1 rounded-xl text-center transition-all group ${
                item.isActive
                  ? "text-[#111827] font-semibold"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  item.isActive
                    ? "bg-[#111827] text-white shadow-xs"
                    : "text-[#6B7280] hover:bg-[#F4F4F5] hover:text-black group-hover:scale-105"
                }`}
              >
                <Icon size={17} />
              </div>
              <span className="text-[10px] font-medium leading-none tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
