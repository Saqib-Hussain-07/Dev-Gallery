"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "@/components/project-card";
import { ProjectCardSkeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Project } from "@/lib/types";
import { FolderGit2 } from "lucide-react";

async function fetchProjects(portfolioId: string): Promise<Project[]> {
  const res = await fetch(`/api/projects?portfolioId=${encodeURIComponent(portfolioId)}`);
  if (!res.ok) throw new Error("Failed to load projects");
  const data = await res.json();
  return data.projects;
}

export function ProjectsSection({ portfolioId }: { portfolioId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", portfolioId],
    queryFn: () => fetchProjects(portfolioId),
  });

  // No published projects yet and nothing loading — the section simply
  // doesn't render rather than showing an empty shell (this is the demo
  // dataset's default state until someone runs a GitHub sync + approves
  // entries in /portfolio/[slug]/admin).
  if (!isLoading && !isError && (data?.length ?? 0) === 0) return null;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-6">
        <FolderGit2 size={18} className="text-ink-faint" />
        <h2 id="projects-heading" className="font-display text-2xl">
          Projects
        </h2>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading projects">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-ink-faint">Couldn&apos;t load synced projects right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data!.map((project, i) => (
            <ScrollReveal key={project.id} delay={Math.min(i * 0.06, 0.3)}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
