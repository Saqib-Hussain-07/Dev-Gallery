import Image from "next/image";
import { Testimonial } from "@/lib/types";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Quote } from "lucide-react";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="scroll-mt-24">
      <h2 id="testimonials-heading" className="font-display text-2xl mb-6">
        What people say
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.id} delay={i * 0.08}>
            <figure className="h-full border border-rule rounded-[var(--radius-card)] p-5 bg-card">
              <Quote size={18} className="text-signal mb-3" aria-hidden="true" />
              <blockquote className="text-sm text-ink leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-2">
                {t.authorAvatarUrl ? (
                  <Image
                    src={t.authorAvatarUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full border border-ink"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="w-7 h-7 rounded-full border border-ink flex items-center justify-center text-[11px] font-mono bg-paper"
                  >
                    {t.authorName.charAt(0)}
                  </span>
                )}
                <span className="text-xs">
                  <span className="font-semibold">{t.authorName}</span>
                  <span className="text-ink-faint"> — {t.authorRole}</span>
                </span>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
