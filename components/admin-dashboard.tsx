"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectCardSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  Github,
  Loader2,
  Lock,
  Pencil,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";

async function fetchAdminProjects(portfolioId: string): Promise<Project[]> {
  const res = await fetch(`/api/admin/projects?portfolioId=${encodeURIComponent(portfolioId)}`);
  if (!res.ok) throw new Error("Failed to load projects");
  const data = await res.json();
  return data.projects;
}

async function syncGithub(input: { portfolioId: string; githubUsername: string }) {
  const res = await fetch("/api/github/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Sync failed");
  return data as { synced: number; created: number; updated: number; message: string };
}

async function patchProject(id: string, patch: Partial<Project>) {
  const res = await fetch(`/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data.project as Project;
}

async function removeProject(id: string) {
  const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}

async function persistOrder(portfolioId: string, orderedIds: string[]) {
  const res = await fetch("/api/admin/projects/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ portfolioId, orderedIds }),
  });
  if (!res.ok) throw new Error("Reorder failed");
}

export function AdminDashboard({
  portfolioId,
  defaultGithubUsername,
}: {
  portfolioId: string;
  defaultGithubUsername?: string;
}) {
  const queryClient = useQueryClient();
  const [githubUsername, setGithubUsername] = useState(defaultGithubUsername ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["admin-projects", portfolioId],
    queryFn: () => fetchAdminProjects(portfolioId),
  });

  const syncMutation = useMutation({
    mutationFn: syncGithub,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-projects", portfolioId] }),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Project> }) => patchProject(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["projects", portfolioId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-projects", portfolioId] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => persistOrder(portfolioId, orderedIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-projects", portfolioId] }),
  });

  function move(index: number, direction: -1 | 1) {
    if (!projects) return;
    const next = [...projects];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    reorderMutation.mutate(next.map((p) => p.id));
  }

  return (
    <div>
      {/* Sync panel */}
      <div className="border border-[#E5E7EB] rounded-2xl p-6 mb-10 bg-white shadow-xs">
        <h2 className="text-xs uppercase tracking-wider font-bold text-[#6B7280] mb-3">
          Sync repositories from GitHub
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!githubUsername.trim()) return;
            syncMutation.mutate({ portfolioId, githubUsername: githubUsername.trim() });
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex items-center gap-2.5 border border-[#E5E7EB] rounded-xl focus-within:border-black px-3.5 flex-1 bg-[#FAFAFB]">
            <Github size={16} className="text-[#9CA3AF] shrink-0" />
            <input
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds)"
              className="w-full bg-transparent py-2.5 text-sm focus:outline-none text-[#111827]"
            />
          </div>
          <Button type="submit" disabled={syncMutation.isPending || !githubUsername.trim()}>
            {syncMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Syncing
              </>
            ) : (
              <>
                <RefreshCw size={14} /> Sync repositories
              </>
            )}
          </Button>
        </form>

        {syncMutation.isSuccess && (
          <p className="flex items-center gap-1.5 text-xs text-[#059669] font-medium mt-3">
            <CheckCircle2 size={14} /> {syncMutation.data.message}
          </p>
        )}
        {syncMutation.isError && (
          <p className="flex items-center gap-1.5 text-xs text-[#DC2626] font-medium mt-3">
            <AlertCircle size={14} /> {(syncMutation.error as Error).message}
          </p>
        )}
        <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">
          Repositories sync as draft project cards. Review, reorder, or edit titles and demo links below before publishing to the public showcase.
        </p>
      </div>

      {/* Queue */}
      <h2 className="text-xs uppercase tracking-wider font-bold text-[#6B7280] mb-4">
        Projects ({projects?.length ?? 0})
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-xs text-rose-500 font-mono">Failed to load projects.</p>
      ) : projects?.length === 0 ? (
        <div className="border border-dashed border-[#D1D5DB] rounded-2xl p-12 text-center text-[#6B7280] bg-[#F9FAFB]">
          <p className="text-sm font-semibold text-[#111827]">No projects synced yet.</p>
          <p className="text-xs mt-1">Use the field above to sync public repositories from GitHub.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects?.map((project, index) => {
            const isEditing = editingId === project.id;
            return (
              <div
                key={project.id}
                className={cn(
                  "border rounded-2xl p-5 transition-all bg-white shadow-2xs",
                  project.published
                    ? "border-[#E5E7EB]"
                    : "border-dashed border-[#D1D5DB] bg-[#FAFAFB]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-base text-[#111827] truncate">
                        {project.title}
                      </span>
                      {project.isPrivate && (
                        <Badge tone="signal" className="gap-1">
                          <Lock size={10} /> Private
                        </Badge>
                      )}
                      <Badge tone={project.published ? "moss" : "outline"}>
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                      {project.language && <Badge tone="outline">{project.language}</Badge>}
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1 text-xs text-[#6B7280] font-medium">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          {project.stars}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#4B5563] line-clamp-2 mt-1">
                      {project.description || "No description provided."}
                    </p>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#111827] font-semibold hover:underline mt-2"
                      >
                        Demo <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === (projects?.length ?? 0) - 1}
                      aria-label="Move down"
                      className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : project.id)}
                      aria-label="Edit project"
                      className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors"
                    >
                      {isEditing ? <X size={14} /> : <Pencil size={14} />}
                    </button>
                    <Button
                      size="sm"
                      variant={project.published ? "outline" : "primary"}
                      onClick={() =>
                        patchMutation.mutate({
                          id: project.id,
                          patch: { published: !project.published },
                        })
                      }
                    >
                      {project.published ? "Unpublish" : "Publish"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(project.id)}
                      aria-label="Delete project"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Inline edit drawer */}
                {isEditing && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                      const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
                      const demoUrl = (form.elements.namedItem("demoUrl") as HTMLInputElement).value;
                      patchMutation.mutate({
                        id: project.id,
                        patch: {
                          title,
                          description,
                          demoUrl: demoUrl.trim() || null,
                        },
                      });
                      setEditingId(null);
                    }}
                    className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">Title</label>
                      <input
                        name="title"
                        defaultValue={project.title}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-black bg-[#FAFAFB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">Description</label>
                      <textarea
                        name="description"
                        defaultValue={project.description}
                        rows={2}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-black bg-[#FAFAFB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">Live Demo URL</label>
                      <input
                        name="demoUrl"
                        defaultValue={project.demoUrl ?? ""}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-black bg-[#FAFAFB]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" type="button" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" type="submit">
                        Save changes
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
