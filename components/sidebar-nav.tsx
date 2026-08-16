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
      href: "/portfolio/asha-menon-product-design/admin",
      label: "Sync / Admin",
      icon: LayoutDashboard,
      isActive: pathname.includes("/admin"),
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center w-20 shrink-0 py-6 border-r border-[#E5E7EB] bg-white sticky top-[68px] h-[calc(100vh-68px)] z-30">
      <nav className="flex flex-col items-center gap-6 w-full px-2" aria-label="App Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 w-full py-2.5 px-1 rounded-xl text-center transition-all group ${
                item.isActive
                  ? "text-[#111827] font-semibold bg-[#F3F4F6]"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]"
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  item.isActive
                    ? "bg-[#111827] text-white shadow-xs"
                    : "text-[#4B5563] group-hover:text-black group-hover:scale-110"
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
