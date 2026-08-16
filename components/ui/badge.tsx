import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Tone = "neutral" | "signal" | "moss" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-[#111827] text-white",
  signal: "bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]",
  moss: "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]",
  outline: "border border-[#E5E7EB] text-[#4B5563] bg-white",
};

export function Badge({
  children,
  tone = "outline",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium tracking-tight rounded-full",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
