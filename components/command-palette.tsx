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
      className="cmdk-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/75 backdrop-blur-md"
      onClick={close}
      role="presentation"
    >
      <Command
        label="Search DevGallery"
        className="w-full max-w-xl bg-[#1E202B] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden text-[#94A3B8]"
        onClick={(e) => e.stopPropagation()}
        shouldFilter
      >
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 bg-[#171922]/50">
          <Search size={16} className="text-indigo-400 shrink-0" aria-hidden="true" />
          <Command.Input
            autoFocus
            placeholder="Search portfolios, categories, skills…"
            className="w-full bg-transparent py-4 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-[#94A3B8] border border-white/[0.1] bg-[#171922] px-2 py-0.5 rounded-md shrink-0">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-[#64748B]">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Portfolios"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#64748B] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
          >
            {portfolios
              .filter((p) => p.status === "LIVE")
              .map((p) => (
                <Command.Item
                  key={p.id}
                  value={`${p.title} ${p.owner.displayName} ${p.tagline || ""} ${p.styleCategory || ""}`}
                  onSelect={() => {
                    if (p.url) {
                      window.open(p.url, "_blank", "noopener,noreferrer");
                    } else {
                      go(`/portfolio/${p.slug}`);
                    }
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer text-sm text-[#F8FAFC] data-[selected=true]:bg-[#171922] data-[selected=true]:text-white transition-colors"
                >
                  <FileText size={14} className="shrink-0 text-indigo-400" aria-hidden="true" />
                  <span className="flex-1 truncate font-medium">{p.title}</span>
                  <span className="text-xs text-[#64748B] truncate">{p.owner.displayName}</span>
                </Command.Item>
              ))}
          </Command.Group>

          <Command.Group
            heading="Categories"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#64748B] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
          >
            {CATEGORIES.map((c) => (
              <Command.Item
                key={c.slug}
                value={`category ${c.label}`}
                onSelect={() => go(`/?category=${c.slug}#wall`)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer text-sm text-[#F8FAFC] data-[selected=true]:bg-[#171922] data-[selected=true]:text-white transition-colors"
              >
                <Shapes size={14} className="shrink-0 text-indigo-400" aria-hidden="true" />
                {c.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
