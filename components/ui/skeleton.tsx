import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#E5E7EB]/80 rounded-md animate-pulse",
        className
      )}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white shadow-2xs">
      <Skeleton className="aspect-16/10 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

/**
 * Shimmering skeleton placeholder matching the exact 16:10 geometry of PortfolioCard.
 */
export function PortfolioCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
      {/* Top Floating Badge Skeleton */}
      <div className="absolute top-3 left-3 z-10">
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* 16:10 Aspect Ratio Media Box */}
      <div className="aspect-16/10 w-full bg-[#F3F4F6] relative overflow-hidden">
        <Skeleton className="h-full w-full rounded-none bg-[#E5E7EB]" />
      </div>

      {/* Card Info Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-3.5 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-14 rounded" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-3 border-t border-[#F0F1F3] flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
