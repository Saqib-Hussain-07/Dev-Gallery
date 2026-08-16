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
    <aside className="hidden lg:flex flex-col items-center w-20 shrink-0 py-6 border-r border-white/[0.07] bg-[#0F1117]/80 backdrop-blur-md sticky top-[68px] h-[calc(100vh-68px)] z-30">
      <nav className="flex flex-col items-center gap-6 w-full px-2" aria-label="App Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 w-full py-2.5 px-1 rounded-2xl text-center transition-all group ${
                item.isActive
                  ? "text-[#F8FAFC] font-semibold bg-[#171922] border border-white/[0.1] shadow-md"
                  : "text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#171922]/60"
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  item.isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-[#64748B] group-hover:text-indigo-300 group-hover:scale-110"
                }`}
              >
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-medium leading-none tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
