import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Your Results & Roadmaps · Vocateur",
  robots: { index: false, follow: false },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function MyResultsPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login?next=%2Fmy-results");

  const admin = createAdminClient();
  const [{ data: roadmaps }, { data: sessions }] = await Promise.all([
    admin
      .from("roadmaps")
      .select("id, life_stage, generated_at, occupations(title)")
      .eq("user_id", user.id)
      .order("generated_at", { ascending: false }),
    admin
      .from("assessment_sessions")
      .select("id, life_stage, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-6 py-16 lg:px-0">
      <div>
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Your account</p>
        <h1 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          Results &amp; roadmaps
        </h1>
        <p className="mt-3 text-foreground/60">
          Everything you&rsquo;ve already unlocked, no need to retake the assessment to get back to it.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">Your roadmaps</h2>
        {roadmaps && roadmaps.length > 0 ? (
          <div className="flex flex-col gap-3">
            {roadmaps.map((r) => {
              const occupation = r.occupations as unknown as { title: string } | null;
              return (
                <Link
                  key={r.id}
                  href={`/roadmap/${r.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-5 transition-colors hover:border-accent"
                >
                  <div>
                    <p className="font-medium">{occupation?.title ?? "Untitled match"}</p>
                    <p className="text-sm text-foreground/50">Generated {formatDate(r.generated_at)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-accent">View roadmap &rarr;</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-border-subtle bg-surface p-5 text-sm text-foreground/50">
            No roadmaps yet. View a set of results below and generate one for any match.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">
          Your assessment results
        </h2>
        {sessions && sessions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/results/${s.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-5 transition-colors hover:border-accent"
              >
                <div>
                  <p className="font-medium">Assessment taken {formatDate(s.created_at)}</p>
                  <p className="text-sm text-foreground/50 capitalize">{s.life_stage.replace(/_/g, " ")}</p>
                </div>
                <span className="shrink-0 text-sm font-medium text-accent">View matches &rarr;</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border-subtle bg-surface p-5 text-sm text-foreground/50">
            You haven&rsquo;t taken the assessment on this account yet.
          </p>
        )}
      </div>

      <Link
        href="/assessment"
        className="self-start rounded-full border-2 border-border-strong px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
      >
        Take the assessment again
      </Link>
    </main>
  );
}
