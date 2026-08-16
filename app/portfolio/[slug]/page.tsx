import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPortfolioBySlug, getSimilarPortfolios, portfolios } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { QualityStamp } from "@/components/quality-stamp";
import { PortfolioCard } from "@/components/portfolio-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BadgeCheck, ExternalLink, FileText, PlayCircle, Sparkles } from "lucide-react";

export function generateStaticParams() {
  return portfolios.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = getPortfolioBySlug(slug);
  if (!portfolio) return {};

  const title = `${portfolio.title} | Ledger`;
  const description = portfolio.tagline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [{ url: portfolio.coverImage, width: 1200, height: 630, alt: portfolio.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [portfolio.coverImage],
    },
  };
}

const sectionNav = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "case-studies", label: "Case studies" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = getPortfolioBySlug(slug);
  if (!portfolio) notFound();

  const similar = getSimilarPortfolios(portfolio);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: portfolio.createdAt,
    mainEntity: {
      "@type": "Person",
      name: portfolio.owner.displayName,
      description: portfolio.owner.bio,
      url: `https://ledger.example.com/portfolio/${portfolio.slug}`,
      image: portfolio.owner.avatarUrl,
      jobTitle: portfolio.discipline.join(", "),
      knowsAbout: portfolio.owner.skills,
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Browse", href: "/" },
          { label: portfolio.discipline[0]?.toLowerCase() ?? "portfolio", href: "/" },
          { label: portfolio.owner.displayName },
        ]}
      />

      {/* In-page section nav — sticky on desktop, scrollable strip on mobile */}
      <nav
        aria-label="Portfolio sections"
        className="flex gap-4 overflow-x-auto pb-3 mb-8 border-b border-rule font-mono text-xs uppercase tracking-wider text-ink-faint"
      >
        {sectionNav.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="underline-grow hover:text-ink whitespace-nowrap shrink-0">
            {s.label}
          </a>
        ))}
      </nav>

      {/* Header */}
      <div id="overview" className="scroll-mt-24 grid md:grid-cols-[1fr_auto] gap-6 items-start border-b border-rule pb-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {portfolio.discipline.map((d) => (
              <Badge key={d} tone="outline">{d.toLowerCase()}</Badge>
            ))}
            {portfolio.verifiedAt && (
              <Badge tone="moss">
                <BadgeCheck size={12} /> Verified
              </Badge>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">{portfolio.title}</h1>
          <p className="text-lg text-ink-soft max-w-[60ch] mb-4">{portfolio.tagline}</p>

          <div className="flex items-center gap-3">
            <Image
              src={portfolio.owner.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="rounded-full border border-ink"
            />
            <div className="text-sm">
              <Link href={`/profile/${portfolio.owner.username}`} className="font-semibold underline-grow">
                {portfolio.owner.displayName}
              </Link>
              <p className="text-ink-faint font-mono text-xs">{portfolio.owner.location}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <QualityStamp score={portfolio.qualityScore} />
          <a
            href={portfolio.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-wide transition-colors duration-150 bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper text-sm px-4 py-2.5"
          >
            Visit live site <ExternalLink size={14} />
          </a>
          <Link
            href={`/portfolio/${portfolio.slug}/admin`}
            className="text-xs font-mono text-ink-faint underline-grow hover:text-ink"
          >
            Curate projects →
          </Link>
        </div>
      </div>

      {/* Cover */}
      <div className="relative aspect-[16/8] border border-rule rounded-[var(--radius-card)] overflow-hidden mb-10">
        <Image
          src={portfolio.coverImage}
          alt={portfolio.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-12">
        <div className="space-y-14">
          {/* AI summary */}
          <ScrollReveal>
            <div className="bg-card border border-rule rounded-[var(--radius-card)] p-5">
              <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-signal">
                <Sparkles size={13} /> AI portfolio summary
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{portfolio.aiSummary}</p>
            </div>
          </ScrollReveal>

          <section id="overview-detail" aria-labelledby="overview-heading" className="scroll-mt-24">
            <h2 id="overview-heading" className="font-display text-2xl mb-4">
              Overview
            </h2>
            <p className="text-ink-soft leading-relaxed max-w-[65ch]">{portfolio.description}</p>
          </section>

          <AboutSection owner={portfolio.owner} />

          <section id="case-studies" aria-labelledby="case-studies-heading" className="scroll-mt-24">
            <h2 id="case-studies-heading" className="font-display text-2xl mb-4">
              Case studies
            </h2>
            <div className="space-y-3">
              {portfolio.caseStudies.map((cs) => (
                <div
                  key={cs.id}
                  className="flex items-center justify-between border border-rule rounded-[var(--radius-card)] px-4 py-3 hover:border-ink-faint transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {cs.format === "VIDEO" ? (
                      <PlayCircle size={18} className="text-signal" aria-hidden="true" />
                    ) : (
                      <FileText size={18} className="text-ink-faint" aria-hidden="true" />
                    )}
                    <span className="text-sm font-medium">{cs.title}</span>
                  </div>
                  <Badge tone="outline">{cs.format.replace("_", " ").toLowerCase()}</Badge>
                </div>
              ))}
            </div>
          </section>

          <ProjectsSection portfolioId={portfolio.id} />

          <TestimonialsSection testimonials={portfolio.testimonials} />

          <ContactSection
            portfolioId={portfolio.id}
            ownerName={portfolio.owner.displayName}
            contactEmail={portfolio.owner.contactEmail}
          />
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-3">
            Technology
          </h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {portfolio.technologies.map((t) => (
              <Badge key={t.id} tone={t.source === "VERIFIED" ? "moss" : "outline"}>
                {t.name}
              </Badge>
            ))}
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mb-3">
            Stats
          </h3>
          <ul className="text-sm text-ink-soft space-y-1.5 font-mono">
            <li>{portfolio.viewCount.toLocaleString()} views</li>
            <li>{portfolio.bookmarkCount.toLocaleString()} bookmarks</li>
            <li>Listed {new Date(portfolio.createdAt).toLocaleDateString()}</li>
          </ul>
        </aside>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-16 pt-10 border-t border-rule" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="font-display text-2xl mb-6">
            More like this
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((p) => (
              <PortfolioCard key={p.id} portfolio={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
