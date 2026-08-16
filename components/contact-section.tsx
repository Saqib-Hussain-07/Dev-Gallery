"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { contactFormSchema, ContactFormInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

async function sendContact(input: ContactFormInput) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ? "Please check the form for errors" : "Send failed");
  return data as { ok: boolean; message: string };
}

export function ContactSection({
  portfolioId,
  ownerName,
  contactEmail,
}: {
  portfolioId: string;
  ownerName: string;
  contactEmail?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { portfolioId, name: "", email: "", message: "" },
  });

  const mutation = useMutation({ mutationFn: sendContact });

  function onSubmit(values: ContactFormInput) {
    mutation.mutate(values, { onSuccess: () => reset({ portfolioId, name: "", email: "", message: "" }) });
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24">
      <ScrollReveal>
        <h2 id="contact-heading" className="font-display text-2xl mb-2">
          Get in touch
        </h2>
        <p className="text-sm text-ink-soft mb-6">
          Send {ownerName.split(" ")[0]} a message directly
          {contactEmail ? " — or email them at " : "."}
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="underline-grow font-mono text-xs">
              {contactEmail}
            </a>
          )}
        </p>

        {mutation.isSuccess ? (
          <div className="flex items-center gap-2 border border-moss/40 bg-moss-soft/40 text-moss rounded-[var(--radius-card)] px-4 py-3 text-sm">
            <CheckCircle2 size={16} /> {mutation.data.message}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md" noValidate>
            <div>
              <label htmlFor="contact-name" className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-1.5">
                Name
              </label>
              <input
                id="contact-name"
                {...register("name")}
                className={cn(
                  "w-full bg-transparent border px-3 py-2.5 text-sm focus:outline-none",
                  errors.name ? "border-signal" : "border-rule focus:border-ink"
                )}
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-xs text-signal mt-1 font-mono">
                  <AlertCircle size={11} /> {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-email" className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-1.5">
                Your email
              </label>
              <input
                id="contact-email"
                type="email"
                {...register("email")}
                className={cn(
                  "w-full bg-transparent border px-3 py-2.5 text-sm focus:outline-none",
                  errors.email ? "border-signal" : "border-rule focus:border-ink"
                )}
              />
              {errors.email && (
                <p className="flex items-center gap-1 text-xs text-signal mt-1 font-mono">
                  <AlertCircle size={11} /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-message" className="block font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                {...register("message")}
                className={cn(
                  "w-full bg-transparent border px-3 py-2.5 text-sm focus:outline-none resize-y",
                  errors.message ? "border-signal" : "border-rule focus:border-ink"
                )}
              />
              {errors.message && (
                <p className="flex items-center gap-1 text-xs text-signal mt-1 font-mono">
                  <AlertCircle size={11} /> {errors.message.message}
                </p>
              )}
            </div>

            {mutation.isError && (
              <p className="flex items-center gap-1 text-xs text-signal font-mono">
                <AlertCircle size={11} /> {(mutation.error as Error).message}
              </p>
            )}

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending
                </>
              ) : (
                <>
                  <Mail size={14} /> Send message
                </>
              )}
            </Button>
          </form>
        )}
      </ScrollReveal>
    </section>
  );
}
