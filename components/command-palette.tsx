"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { portfolios, CATEGORIES } from "@/lib/mock-data";
import { FileText, Search, Shapes } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("[data-command-trigger]");
      if (target) setOpen(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function go(href: string) {
    router.push(href);
    close();
  }

  if (!open) return null;

  return (
    <div
      className="cmdk-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={close}
      role="presentation"
    >
      <Command
        label="Search Wall of Portfolios"
        className="w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        shouldFilter
      >
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-4">
          <Search size={16} className="text-[#9CA3AF] shrink-0" aria-hidden="true" />
          <Command.Input
            autoFocus
            placeholder="Search portfolios, categories, skills…"
            className="w-full bg-transparent py-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-[#6B7280] border border-[#E5E7EB] px-1.5 py-0.5 rounded-sm shrink-0">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-[#6B7280]">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Portfolios"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#9CA3AF] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
          >
            {portfolios
              .filter((p) => p.status === "LIVE")
              .map((p) => (
                <Command.Item
                  key={p.id}
                  value={`${p.title} ${p.owner.displayName} ${p.tagline} ${p.designation}`}
                  onSelect={() => go(`/portfolio/${p.slug}`)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-[#111827] data-[selected=true]:bg-[#F3F4F6] transition-colors"
                >
                  <FileText size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
                  <span className="flex-1 truncate font-medium">{p.title}</span>
                  <span className="text-xs text-[#6B7280] truncate">{p.owner.displayName}</span>
                </Command.Item>
              ))}
          </Command.Group>

          <Command.Group
            heading="Categories"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#9CA3AF] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
          >
            {CATEGORIES.map((c) => (
              <Command.Item
                key={c.slug}
                value={`category ${c.label}`}
                onSelect={() => go(`/?category=${c.slug}#wall`)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-[#111827] data-[selected=true]:bg-[#F3F4F6] transition-colors"
              >
                <Shapes size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
                {c.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
