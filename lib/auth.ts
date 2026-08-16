import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

/**
 * GitHub OAuth via NextAuth (Auth.js) — requires a GitHub OAuth App and
 * three env vars this sandbox cannot generate credentials for: GITHUB_ID,
 * GITHUB_SECRET, NEXTAUTH_SECRET. See README "GitHub OAuth setup" for the
 * exact steps. Without them, sign-in will error — that's expected until
 * you've registered an OAuth App and set the env vars locally.
 *
 * Scope is intentionally `read:user repo` rather than the default
 * `read:user user:email` — `repo` grants read access to the signed-in
 * user's private repositories too, which is what lets the sync flow list
 * private repos (§ "Handle private repository permissions appropriately")
 * instead of only ever seeing public ones.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: { params: { scope: "read:user repo" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile && "login" in profile) {
        token.githubUsername = (profile as { login: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.githubUsername = token.githubUsername as string | undefined;
      return session;
    },
  },
  session: { strategy: "jwt" },
  // Falls back to a fixed, clearly-labeled insecure secret so the app never
  // hard-crashes (confirmed via live testing: `next start` throws
  // MissingSecretError without this, while `next dev` only warns) when
  // NEXTAUTH_SECRET isn't set — which is the expected state for anyone
  // running this without having done the OAuth App setup in the README yet.
  // Real deployments MUST set NEXTAUTH_SECRET; JWTs signed with this
  // fallback are not meaningfully secure.
  secret: process.env.NEXTAUTH_SECRET ?? "insecure-demo-secret-set-NEXTAUTH_SECRET-before-deploying",
};
