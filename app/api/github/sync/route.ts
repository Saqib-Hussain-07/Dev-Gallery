import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { githubSyncSchema } from "@/lib/schemas";
import { GithubApiError, syncGithubProjects } from "@/lib/github";
import { upsertSyncedProjects } from "@/lib/project-store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = githubSyncSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { portfolioId, githubUsername, maxRepos } = parsed.data;

  // Access token is read from the server-side session, never trusted from
  // the request body — the client cannot claim to be a different signed-in
  // user. If there's a session, this sync includes the account's PRIVATE
  // repos (OAuth scope is `read:user repo`); with no session, it falls back
  // to the public, username-based lookup (demo / unauthenticated path).
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  const effectiveUsername = githubUsername || session?.githubUsername;

  if (!effectiveUsername) {
    return NextResponse.json(
      { error: "Provide a GitHub username, or sign in with GitHub to sync your own repositories." },
      { status: 400 }
    );
  }

  try {
    const { projects, skipped } = await syncGithubProjects(
      portfolioId,
      effectiveUsername,
      maxRepos,
      accessToken
    );

    if (projects.length === 0) {
      return NextResponse.json(
        { error: `No repositories found for "${effectiveUsername}".` },
        { status: 404 }
      );
    }

    const { created, updated } = await upsertSyncedProjects(projects);
    const privateCount = projects.filter((p) => p.isPrivate).length;

    return NextResponse.json({
      synced: projects.length,
      created,
      updated,
      readmeEnrichmentSkipped: skipped,
      message: accessToken
        ? `Synced ${projects.length} repositories (${privateCount} private). New entries are unpublished — review them in the admin dashboard before they go live.`
        : `Synced ${projects.length} public repositories. New entries are unpublished — review them in the admin dashboard before they go live.`,
    });
  } catch (err) {
    if (err instanceof GithubApiError) {
      const status = err.code === "NOT_FOUND" ? 404 : err.code === "RATE_LIMITED" ? 429 : 502;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }
    return NextResponse.json({ error: "Unexpected error syncing GitHub repositories." }, { status: 500 });
  }
}
