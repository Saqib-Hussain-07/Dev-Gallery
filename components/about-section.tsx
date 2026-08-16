import { Owner } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-reveal";

export function AboutSection({ owner }: { owner: Owner }) {
  if (!owner.bio && !owner.skills?.length) return null;

  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24">
      <ScrollReveal>
        <h2 id="about-heading" className="font-display text-2xl mb-4">
          About
        </h2>
        {owner.bio && <p className="text-ink-soft leading-relaxed mb-6 max-w-[65ch]">{owner.bio}</p>}

        {owner.skills && owner.skills.length > 0 && (
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {owner.skills.map((skill) => (
                <Badge key={skill} tone="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
