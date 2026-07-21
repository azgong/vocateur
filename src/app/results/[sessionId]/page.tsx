import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { rankMatches, Occupation } from "@/lib/assessment/matching";
import { generateRationale } from "@/lib/assessment/rationale";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
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
      .select("id, trait_vector, life_stage, self_report")
      .eq("id", sessionId)
      .single(),
    admin.from("occupations").select("*"),
  ]);

  if (!session || !occupations) notFound();

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  let isSubscribed = false;
  if (user) {
    const { data: profile } = await admin
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();
    isSubscribed = profile?.subscription_status === "active";
  }

  const traitVector = session.trait_vector as TraitVector;
  const moduleLogs = (session.self_report?.moduleLogs ?? []) as ModuleLog[];
  const matches = rankMatches(traitVector, occupations as Occupation[]);

  const visibleMatches = isSubscribed ? matches : matches.slice(0, 3);
  const lockedMatches = isSubscribed ? [] : matches.slice(3, 10);

  const rationales = await Promise.all(
    visibleMatches.map((m) => generateRationale(m.occupation, moduleLogs)),
  );

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 lg:px-0">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Your results</p>
        <h1 className="font-[family-name:var(--font-brand)] text-4xl font-medium tracking-tight sm:text-5xl">
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
