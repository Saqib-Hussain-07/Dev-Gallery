import Image from "next/image";
import { notFound } from "next/navigation";
import { portfolios } from "@/lib/mock-data";
import { PortfolioCard } from "@/components/portfolio-card";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, MapPin } from "lucide-react";

export function generateStaticParams() {
  return portfolios.map((p) => ({ username: p.owner.username }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const owned = portfolios.filter((p) => p.owner.username === username);
  if (owned.length === 0) notFound();

  const owner = owned[0].owner;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-5 mb-4">
        <Image
          src={owner.avatarUrl}
          alt={owner.displayName}
          width={72}
          height={72}
          className="rounded-full border-2 border-ink"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl">{owner.displayName}</h1>
            {owner.role === "VERIFIED" && <BadgeCheck size={20} className="text-moss" />}
          </div>
          {owner.location && (
            <p className="flex items-center gap-1 text-sm text-ink-faint font-mono mt-1">
              <MapPin size={13} /> {owner.location}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-12">
        <Badge tone={owner.role === "VERIFIED" ? "moss" : "outline"}>{owner.role.toLowerCase()}</Badge>
      </div>

      <h2 className="font-display text-2xl mb-6">Listed work</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {owned.map((p) => (
          <PortfolioCard key={p.id} portfolio={p} />
        ))}
      </div>
    </div>
  );
}
