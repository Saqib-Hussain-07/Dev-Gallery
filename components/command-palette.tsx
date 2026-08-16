"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { FileText, Search, Shapes } from "lucide-react";
import { portfolios, CATEGORIES } from "@/lib/mock-data";

/**
 * CommandPalette Component
 *
 * Global keyboard shortcut palette triggered via ⌘K (or Ctrl+K).
 * Allows rapid navigation across:
 * - Live portfolio websites
 * - Filter categories
 */
export function CommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleClosePalette = useCallback(() => setIsOpen(false), []);

  // Global keydown listener for ⌘K / Ctrl+K and Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listener for custom click trigger buttons with [data-command-trigger]
  useEffect(() => {
    function handleTriggerClick(event: MouseEvent) {
      const triggerElement = (event.target as HTMLElement)?.closest("[data-command-trigger]");
      if (triggerElement) {
        setIsOpen(true);
      }
    }
    document.addEventListener("click", handleTriggerClick);
    return () => document.removeEventListener("click", handleTriggerClick);
  }, []);

  const handleNavigate = useCallback(
    (targetHref: string) => {
      router.push(targetHref);
      handleClosePalette();
    },
    [router, handleClosePalette]
  );

  if (!isOpen) return null;

  return (
    <div
      className="cmdk-backdrop-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-xs"
      onClick={handleClosePalette}
      role="presentation"
    >
      <Command
        label="Search DevGallery"
        className="command-palette-modal w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        shouldFilter
      >
        {/* Search Input Bar */}
        <div className="command-input-wrapper flex items-center gap-3 border-b border-[#E5E7EB] px-4">
          <Search size={16} className="text-[#9CA3AF] shrink-0" aria-hidden="true" />
          <Command.Input
            autoFocus
            placeholder="Search DevGallery portfolios, categories, skills…"
            className="command-input-field w-full bg-transparent py-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
          <kbd className="kbd-esc text-[10px] font-mono text-[#6B7280] border border-[#E5E7EB] px-1.5 py-0.5 rounded-sm shrink-0">
            ESC
          </kbd>
        </div>

        {/* Command Search Results List */}
        <Command.List className="command-results-list max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="command-empty-state py-8 text-center text-sm text-[#6B7280]">
            No results found.
          </Command.Empty>

          {/* Group: Portfolios */}
          <Command.Group
            heading="Portfolios"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#9CA3AF] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
          >
            {portfolios
              .filter((item) => item.status === "LIVE")
              .map((portfolio) => (
                <Command.Item
                  key={portfolio.id}
                  value={`${portfolio.title} ${portfolio.owner.displayName} ${portfolio.tagline || ""} ${portfolio.styleCategory || ""}`}
                  onSelect={() => {
                    if (portfolio.url) {
                      window.open(portfolio.url, "_blank", "noopener,noreferrer");
                    } else {
                      handleNavigate(`/portfolio/${portfolio.slug}`);
                    }
                  }}
                  className="command-result-item flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-[#111827] data-[selected=true]:bg-[#F3F4F6] transition-colors"
                >
                  <FileText size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
                  <span className="result-item-title flex-1 truncate font-medium">{portfolio.title}</span>
                  <span className="result-item-owner text-xs text-[#6B7280] truncate">{portfolio.owner.displayName}</span>
                </Command.Item>
              ))}
          </Command.Group>

          {/* Group: Categories */}
          <Command.Group
            heading="Categories"
            className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[#9CA3AF] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
          >
            {CATEGORIES.map((category) => (
              <Command.Item
                key={category.slug}
                value={`category ${category.label}`}
                onSelect={() => handleNavigate(`/?category=${category.slug}#wall`)}
                className="command-result-item flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-[#111827] data-[selected=true]:bg-[#F3F4F6] transition-colors"
              >
                <Shapes size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
                <span>{category.label}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
