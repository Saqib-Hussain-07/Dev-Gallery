import { cn } from "@/lib/utils";

export function QualityStamp({ score, className }: { score: number; className?: string }) {
  const tier = score >= 90 ? "Exceptional" : score >= 75 ? "Strong" : score >= 50 ? "Emerging" : "New";
  return (
    <div
      title="AI-generated quality signal — affects default sort only, never search visibility"
      className={cn(
        "flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-ink bg-paper rotate-[-6deg] shrink-0",
        className
      )}
    >
      <span className="font-display text-lg leading-none">{score}</span>
      <span className="font-mono text-[8px] uppercase tracking-wider text-ink-soft">{tier}</span>
    </div>
  );
}
