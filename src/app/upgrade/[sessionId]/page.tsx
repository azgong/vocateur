import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { rankMatches, Occupation } from "@/lib/assessment/matching";
import { TraitVector } from "@/lib/assessment/types";
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
    admin.from("assessment_sessions").select("trait_vector").eq("id", sessionId).single(),
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

  const topMatchTitle =
    session && occupations
      ? rankMatches(session.trait_vector as TraitVector, occupations as Occupation[])[0]?.occupation.title
      : null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Vocateur Pro</p>
        <h1 className="font-[family-name:var(--font-brand)] text-4xl font-medium tracking-tight sm:text-5xl">
          Upgrade to Pro to unlock your roadmap
        </h1>
        <p className="mx-auto mt-4 max-w-md text-foreground/60">
          {topMatchTitle
            ? `You matched with ${topMatchTitle}. Here's everything Pro unlocks for that path, plus all 10 of your matches.`
            : "Here's everything Pro unlocks, plus all 10 of your matches."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FeatureCard
          quadrant="a"
          title="Your full personalized roadmap"
          description="Step-by-step milestones built around your matched career, your life stage, your timeline, and the context you shared. Not a generic template."
        />
        <FeatureCard
          quadrant="c"
          title="A real advisor, not a chatbot"
          description="Chat with an advisor grounded in real BLS wage and growth data for your exact field. Paste your resume and it reviews it like a hiring manager in that field would."
        />
        <FeatureCard
          quadrant="d"
          title="Real mock interviews"
          description="Role-specific interview questions, one at a time, with honest feedback after each answer, any time you want a rep."
        />
        <FeatureCard
          quadrant="b"
          title="Real market predictions"
          description="Growth, wage, and openings through 2034 from the U.S. Bureau of Labor Statistics for your exact matched field. Not a made-up outlook."
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
