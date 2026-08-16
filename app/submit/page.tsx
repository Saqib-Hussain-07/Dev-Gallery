"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { submitPortfolioSchema, SubmitPortfolioInput } from "@/lib/schemas";
import { submitPortfolio } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Link as LinkIcon, AlertCircle, Sparkles } from "lucide-react";
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

  const mutation = useMutation({ mutationFn: submitPortfolio });
  const urlValue = watch("url");

  function onSubmit(values: SubmitPortfolioInput) {
    mutation.mutate(values);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-bold text-indigo-300 mb-4">
        <Sparkles size={12} />
        <span>Instant Indexing</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mb-3">
        Submit your portfolio to DevGallery
      </h1>
      <p className="text-sm text-[#94A3B8] mb-10 leading-relaxed">
        Zero gate. Automated verification checks that your live site resolves and captures screenshot previews immediately.
      </p>

      {mutation.isSuccess ? (
        <div className="border border-emerald-500/30 rounded-3xl p-6 sm:p-8 bg-[#0F1117] shadow-2xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-4 font-mono text-xs uppercase tracking-wider font-bold">
            <CheckCircle2 size={16} /> Listed Successfully
          </div>
          <p className="text-sm text-[#F8FAFC] mb-4 font-semibold">{mutation.data.message}</p>
          <ul className="space-y-2 text-xs text-[#94A3B8] mb-6">
            <li>✓ Link resolves and responds ({mutation.data.submission.url})</li>
            <li>✓ Automated screenshot capture initialized</li>
            <li>✓ Tech stack detection queued</li>
          </ul>
          <div className="flex flex-wrap gap-2 mb-6">
            {mutation.data.submission.discipline.map((d) => (
              <span
                key={d}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(99,102,241,0.08)] text-[#A5B4FC] border border-[rgba(99,102,241,0.2)] uppercase"
              >
                {d.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-[#0F1117] border border-white/[0.08] p-6 sm:p-8 rounded-3xl shadow-2xl"
          noValidate
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Portfolio URL
            </label>
            <div
              className={cn(
                "flex items-center gap-2 border rounded-xl px-3 bg-[#171922]",
                errors.url ? "border-rose-500" : "border-white/[0.08] focus-within:border-indigo-400"
              )}
            >
              <LinkIcon size={15} className="text-[#64748B] shrink-0" />
              <input
                {...register("url")}
                type="text"
                placeholder="https://yourwork.com"
                className="w-full bg-transparent py-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
              />
            </div>
            {errors.url && (
              <p className="flex items-center gap-1 text-xs text-rose-400 mt-1.5">
                <AlertCircle size={12} /> {errors.url.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Developer Name or Portfolio Title
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g. Alex Morgan — Design Engineer"
              className={cn(
                "w-full border rounded-xl px-3 py-3 text-sm text-[#F8FAFC] placeholder-[#64748B] bg-[#171922] focus:outline-none",
                errors.title ? "border-rose-500" : "border-white/[0.08] focus:border-indigo-400"
              )}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-rose-400 mt-1.5">
                <AlertCircle size={12} /> {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Discipline Focus
            </label>
            <Controller
              control={control}
              name="discipline"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {disciplineFacets.map((d) => {
                    const active = field.value?.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          const curr = field.value || [];
                          field.onChange(
                            active ? curr.filter((x) => x !== d) : [...curr, d]
                          );
                        }}
                        className={cn(
                          "text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer",
                          active
                            ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                            : "bg-[#171922] text-[#94A3B8] border-white/[0.08] hover:border-white/[0.18]"
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
              <p className="flex items-center gap-1 text-xs text-rose-400 mt-1.5">
                <AlertCircle size={12} /> {errors.discipline.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-primary-gradient text-white text-sm font-bold py-3 px-6 rounded-full shadow-lg transition-transform active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying link...</span>
              </>
            ) : (
              <span>Submit Portfolio</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
