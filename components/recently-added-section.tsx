import Image from "next/image";
import Link from "next/link";
import { Portfolio } from "@/lib/types";
import { relativeTime, isNew, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/mock-data";

function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function RecentlyAddedSection({ portfolios }: { portfolios: Portfolio[] }) {
  if (portfolios.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="pb-20">
      <div className="flex items-baseline justify-between mb-5">
        <h2 id="recent-heading" className="font-display text-2xl">
          Recently added
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
          Scroll for more →
        </span>
      </div>

      <div className="scroll-rail flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
        {portfolios.map((p) => (
          <Link
            key={p.id}
            href={`/portfolio/${p.slug}`}
            className="card-lift group relative shrink-0 w-64 border border-rule rounded-[var(--radius-card)] overflow-hidden bg-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden border-b border-rule">
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                sizes="256px"
                className="object-cover"
              />
              {isNew(p.createdAt) && (
                <span
                  className={cn(
                    "absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider",
                    "bg-signal text-signal-ink rounded-sm"
                  )}
                >
                  New
                </span>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Image
                  src={p.owner.avatarUrl}
                  alt=""
                  width={18}
                  height={18}
                  className="rounded-full border border-rule"
                />
                <span className="text-xs text-ink-soft truncate">{p.owner.displayName}</span>
              </div>
              <h3 className="font-display text-base leading-snug truncate mb-1.5">{p.title}</h3>
              <div className="flex items-center justify-between">
                <Badge tone="outline">{categoryLabel(p.primaryCategory)}</Badge>
                <span className="text-[10px] font-mono text-ink-faint">{relativeTime(p.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
