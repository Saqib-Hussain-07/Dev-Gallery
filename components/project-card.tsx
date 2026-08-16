import Image from "next/image";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, GitFork, Github, Lock, Star } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-lift border border-rule rounded-[var(--radius-card)] overflow-hidden bg-card">
      <div className="relative aspect-[4/3] border-b border-rule overflow-hidden">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={`${project.title} preview`}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          // Generative placeholder — language-tinted gradient + initial —
          // used whenever a repo has no README image (§ repo integration
          // "fallback mechanisms" requirement).
          <div
            aria-hidden="true"
            className="w-full h-full flex items-center justify-center"
            style={{
              background: project.thumbnailFallback
                ? `linear-gradient(135deg, ${project.thumbnailFallback.colorFrom}, ${project.thumbnailFallback.colorTo})`
                : undefined,
            }}
          >
            <span className="font-display text-6xl text-paper/90">
              {project.thumbnailFallback?.initial ?? project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg leading-snug">{project.title}</h3>
          {project.language && <Badge tone="outline">{project.language}</Badge>}
          {project.isPrivate && (
            <Badge tone="outline">
              <Lock size={9} /> private repo
            </Badge>
          )}
        </div>

        <p className="text-sm text-ink-soft leading-snug line-clamp-2 mb-3">{project.description}</p>

        {project.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.topics.slice(0, 4).map((topic) => (
              <span key={topic} className="text-[10px] font-mono text-ink-faint">
                #{topic}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-rule">
          <div className="flex items-center gap-3 text-xs font-mono text-ink-faint">
            <span className="flex items-center gap-1">
              <Star size={12} /> {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={12} /> {project.forks}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source on GitHub`}
              className="text-ink-soft hover:text-ink transition-colors"
            >
              <Github size={16} />
            </a>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} live demo`}
                className="text-ink-soft hover:text-signal transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
