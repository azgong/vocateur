import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { rankMatches, Occupation } from "@/lib/assessment/matching";
import { TraitVector } from "@/lib/assessment/types";
import { SkillScores } from "@/lib/assessment/games";
import { QUADRANT_META, Quadrant } from "@/lib/assessment/quadrantStyle";
import { UpgradePlans } from "@/components/upgrade/UpgradePlans";

export const metadata: Metadata = {
  title: "Upgrade to Pro · Vocateur",
  robots: { index: false, follow: false },
};

export default async function UpgradePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const admin = createAdminClient();

  const [{ data: session }, { data: occupations }] = await Promise.all([
    admin.from("assessment_sessions").select("trait_vector, self_report").eq("id", sessionId).single(),
    admin.from("occupations").select("*"),
  ]);

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (user) {
    const { data: profile } = await admin
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();
    if (profile?.subscription_status === "active") {
      redirect(`/results/${sessionId}`);
    }
  }

  // Must rank identically to the results page (same skillScores + values
  // inputs), or this page can tease a different "top match" than the one
  // actually shown on /results for the same session, a jarring inconsistency
  // for anyone bouncing between the two.
  const topMatchTitle =
    session && occupations
      ? rankMatches(
          session.trait_vector as TraitVector,
          occupations as Occupation[],
          (session.self_report?.skillScores ?? null) as SkillScores | null,
          (session.self_report?.values ?? null) as string[] | null,
        )[0]?.occupation.title
      : null;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-6 py-16 lg:px-0">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Vocateur Pro</p>
        <h1 className="font-[family-name:var(--font-title)] text-5xl font-normal tracking-tight sm:text-6xl">
          Upgrade to Pro to keep this working for you
        </h1>
        <p className="mx-auto mt-4 max-w-md text-foreground/60">
          {topMatchTitle
            ? `You matched with ${topMatchTitle}. Pro isn't a one-time unlock, it's a career advisor and roadmap for all 10 of your matches, there whenever something real comes up.`
            : "Pro isn't a one-time unlock, it's a career advisor and roadmap for all 10 of your matches, there whenever something real comes up."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          quadrant="a"
          title="A roadmap for every match, that tracks progress"
          description="Step-by-step milestones for any of your 10 matches, not just the top one, with checkable progress you can come back to over months."
        />
        <FeatureCard
          quadrant="c"
          title="A full-service advisor, not a chatbot"
          description="Resume, cover letter, and LinkedIn review, job posting fit checks, and salary negotiation prep, all grounded in real BLS data for your field. Come back whenever something real comes up."
        />
        <FeatureCard
          quadrant="d"
          title="Real mock interviews"
          description="Role-specific interview questions, one at a time, with honest feedback after each answer, any time you want a rep before a real one."
        />
        <FeatureCard
          quadrant="b"
          title="Real market predictions"
          description="Growth, wage, and openings through 2034 from the U.S. Bureau of Labor Statistics for any of your matched fields. Not a made-up outlook."
        />
      </div>

      <UpgradePlans sessionId={sessionId} isAuthenticated={!!user} userEmail={user?.email ?? null} />

      <p className="text-center text-xs text-foreground/40">
        Cancel anytime from your account. By subscribing you agree to our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-foreground/60">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-foreground/60">
          Privacy Policy
        </a>
        .
      </p>
    </main>
  );
}

function FeatureCard({
  quadrant,
  title,
  description,
}: {
  quadrant: Quadrant;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-surface p-5">
      <span className={`h-1.5 w-8 rounded-full ${QUADRANT_META[quadrant].bg}`} />
      <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/60">{description}</p>
    </div>
  );
}
