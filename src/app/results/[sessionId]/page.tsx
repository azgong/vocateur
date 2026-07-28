import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { rankMatches, Occupation } from "@/lib/assessment/matching";
import { generateRationale } from "@/lib/assessment/rationale";
import { matchHighlights } from "@/lib/assessment/highlights";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { SkillScores } from "@/lib/assessment/games";
import { MatchCard } from "@/components/results/MatchCard";
import { LockedMatchCard } from "@/components/results/LockedMatchCard";
import { SaveResultsForm } from "@/components/results/SaveResultsForm";
import { ViewRoadmapButton } from "@/components/results/ViewRoadmapButton";
import { ManageSubscriptionLink } from "@/components/results/ManageSubscriptionLink";
import { ResultsUpsell } from "@/components/results/ResultsUpsell";

export const metadata: Metadata = {
  title: "Your Results · Vocateur",
  robots: { index: false, follow: false },
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const admin = createAdminClient();

  const [{ data: session }, { data: occupations }] = await Promise.all([
    admin
      .from("assessment_sessions")
      .select("id, trait_vector, life_stage, self_report, user_id")
      .eq("id", sessionId)
      .single(),
    admin.from("occupations").select("*"),
  ]);

  if (!session || !occupations) notFound();

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // A Pro subscription unlocks a session's full results only for the account
  // that owns it (or an anonymous session no one has claimed yet). Without
  // this, any Pro subscriber who opened someone else's results link, easy to
  // end up with when testers share links in a group chat, would see that
  // stranger's full unlocked matches and rationale.
  let isSubscribed = false;
  if (user) {
    const ownsSession = session.user_id === null || session.user_id === user.id;
    const { data: profile } = await admin
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();
    isSubscribed = profile?.subscription_status === "active" && ownsSession;
  }

  const traitVector = session.trait_vector as TraitVector;
  const moduleLogs = (session.self_report?.moduleLogs ?? []) as ModuleLog[];
  const skillScores = (session.self_report?.skillScores ?? null) as SkillScores | null;
  const values = (session.self_report?.values ?? null) as string[] | null;
  const currentFocus = (session.self_report?.currentFocus ?? null) as string | null;
  const matches = rankMatches(traitVector, occupations as Occupation[], skillScores, values, currentFocus);

  const visibleMatches = isSubscribed ? matches : matches.slice(0, 3);
  const lockedMatches = isSubscribed ? [] : matches.slice(3, 10);

  const rationales = await Promise.all(
    visibleMatches.map((m) => generateRationale(m.occupation, moduleLogs, skillScores)),
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16 lg:px-0">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Your results</p>
        <h1 className="font-[family-name:var(--font-title)] text-5xl font-normal tracking-tight sm:text-6xl">
          Here&rsquo;s what your choices point toward
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {visibleMatches.map((m, i) => (
          <MatchCard
            key={m.occupation.id}
            rank={i + 1}
            title={m.occupation.title}
            fitScore={m.fitScore}
            rationale={rationales[i]}
            highlights={matchHighlights(traitVector, skillScores, m.occupation)}
            roadmapLink={isSubscribed ? { sessionId, occupationId: m.occupation.id } : undefined}
          />
        ))}
      </div>

      {isSubscribed ? (
        <div className="flex flex-col items-center gap-3">
          <ViewRoadmapButton sessionId={sessionId} occupationId={matches[0].occupation.id} />
          <ManageSubscriptionLink />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 opacity-90">
            {lockedMatches.map((m, i) => (
              <LockedMatchCard key={m.occupation.id} rank={i + 4} title={m.occupation.title} fitScore={m.fitScore} />
            ))}
          </div>

          <ResultsUpsell sessionId={sessionId} />

          <div className="flex justify-center">
            <SaveResultsForm sessionId={sessionId} />
          </div>
        </>
      )}
    </main>
  );
}
