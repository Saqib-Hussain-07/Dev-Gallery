import { notFound } from "next/navigation";
import { getPortfolioBySlug } from "@/lib/mock-data";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function PortfolioAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = getPortfolioBySlug(slug);
  if (!portfolio) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "Browse", href: "/" },
          { label: portfolio.owner.displayName, href: `/portfolio/${portfolio.slug}` },
          { label: "Admin" },
        ]}
      />

      <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Project curation &amp; sync</h1>
      <p className="text-[#4B5563] text-sm mb-8">
        Sync public repositories from GitHub, then review, customize, and publish them to{" "}
        <span className="font-semibold text-[#111827]">{portfolio.owner.displayName}</span>&apos;s public
        portfolio showcase.
      </p>

      <AdminDashboard portfolioId={portfolio.id} defaultGithubUsername={portfolio.owner.githubUsername} />
    </div>
  );
}
