import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RoadmapList } from "@/components/my-results/RoadmapList";
import { SessionList } from "@/components/my-results/SessionList";

export const metadata: Metadata = {
  title: "Your Results & Roadmaps · Vocateur",
  robots: { index: false, follow: false },
};

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
        <RoadmapList
          initial={(roadmaps ?? []).map((r) => ({
            id: r.id,
            occupationTitle: (r.occupations as unknown as { title: string } | null)?.title ?? "Untitled match",
            generatedAt: r.generated_at,
          }))}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">
          Your assessment results
        </h2>
        <SessionList
          initial={(sessions ?? []).map((s) => ({ id: s.id, lifeStage: s.life_stage, createdAt: s.created_at }))}
        />
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
