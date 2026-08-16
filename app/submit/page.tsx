"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { submitPortfolioSchema, SubmitPortfolioInput } from "@/lib/schemas";
import { submitPortfolio } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { disciplineFacets } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function SubmitPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SubmitPortfolioInput>({
    resolver: zodResolver(submitPortfolioSchema),
    defaultValues: { url: "", title: "", discipline: [] },
  });

  // Hits POST /api/portfolios (app/api/portfolios/route.ts), which validates
  // against the *same* submitPortfolioSchema server-side — the one-schema
  // contract §1.4 calls for. In production this enqueues ingestion-worker
  // (§1.2) instead of resolving immediately.
  const mutation = useMutation({ mutationFn: submitPortfolio });

  const urlValue = watch("url");

  function onSubmit(values: SubmitPortfolioInput) {
    mutation.mutate(values);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Submit</span>
      <h1 className="font-display text-4xl mt-3 mb-3">List your work on the wall</h1>
      <p className="text-ink-soft mb-10 leading-relaxed">
        No manual gate. Automated checks confirm your link resolves and isn&apos;t parked —
        that&apos;s it. You&apos;re discoverable immediately, and quality surfaces through ranking, never exclusion.
      </p>

      {mutation.isSuccess ? (
        <div className="border border-moss/40 rounded-[var(--radius-card)] p-6 bg-card">
          <div className="flex items-center gap-2 text-moss mb-4 font-mono text-xs uppercase tracking-wider">
            <CheckCircle2 size={16} /> {mutation.data.status === "PENDING" ? "Submitted — queued for baseline checks" : "Listed"}
          </div>
          <p className="text-sm text-ink-soft mb-4">{mutation.data.message}</p>
          <ul className="space-y-2 text-sm text-ink-soft mb-6">
            <li>✓ Link resolves and responds ({mutation.data.submission.url})</li>
            <li>✓ Not a parked domain</li>
            <li>✓ Screenshot capture queued</li>
            <li>✓ Tech stack detection queued — you can confirm or correct tags on your profile</li>
          </ul>
          <div className="flex flex-wrap gap-2 mb-6">
            {mutation.data.submission.discipline.map((d) => (
              <Badge key={d} tone="outline">{d.toLowerCase()}</Badge>
            ))}
          </div>
          <p className="text-xs text-ink-faint font-mono">
            AI critique (§2.1) generates within 5 minutes and will appear on your portfolio page.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-2">
              Portfolio URL
            </label>
            <div
              className={cn(
                "flex items-center gap-2 border px-3",
                errors.url ? "border-signal" : "border-rule focus-within:border-ink"
              )}
            >
              <LinkIcon size={15} className="text-ink-faint shrink-0" />
              <input
                {...register("url")}
                type="text"
                placeholder="https://yourwork.com"
                className="w-full bg-transparent py-3 text-sm focus:outline-none"
              />
            </div>
            {errors.url && (
              <p className="flex items-center gap-1 text-xs text-signal mt-1.5 font-mono">
                <AlertCircle size={12} /> {errors.url.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-2">
              Title
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Jordan Blake — Product Design"
              className={cn(
                "w-full bg-transparent border px-3 py-3 text-sm focus:outline-none",
                errors.title ? "border-signal" : "border-rule focus:border-ink"
              )}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-signal mt-1.5 font-mono">
                <AlertCircle size={12} /> {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-2">
              Discipline (select at least one)
            </label>
            <Controller
              name="discipline"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {disciplineFacets.map((d) => {
                    const active = field.value.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() =>
                          field.onChange(
                            active ? field.value.filter((x) => x !== d) : [...field.value, d]
                          )
                        }
                        className={cn(
                          "px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors",
                          active
                            ? "bg-signal text-signal-ink border-signal"
                            : "bg-transparent text-ink-soft border-rule hover:border-ink-faint"
                        )}
                      >
                        {d.toLowerCase()}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.discipline && (
              <p className="flex items-center gap-1 text-xs text-signal mt-1.5 font-mono">
                <AlertCircle size={12} /> {errors.discipline.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="flex items-center gap-1 text-xs text-signal font-mono">
              <AlertCircle size={12} /> {(mutation.error as Error).message}
            </p>
          )}

          <Button type="submit" size="lg" disabled={mutation.isPending || !urlValue} className="w-full sm:w-auto">
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Running baseline checks
              </>
            ) : (
              "Submit for listing"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
