import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "The rationale · Vocateur",
  description: "Why Vocateur scores what you actually do instead of asking how you'd describe yourself.",
};

const INSTINCTS = [
  {
    key: "a" as const,
    name: "Analytical",
    world: "An analyst call",
    description: "Logical, fact-based, data-first. Rewards rigor and evidence over gut instinct.",
  },
  {
    key: "b" as const,
    name: "Sequential",
    world: "An ER shift",
    description: "Structured, procedural, detail-oriented. Rewards process and reliability under pressure.",
  },
  {
    key: "c" as const,
    name: "Interpersonal",
    world: "A workplace conflict",
    description: "Relational, expressive, people-first. Rewards empathy and communication.",
  },
  {
    key: "d" as const,
    name: "Imaginative",
    world: "A founder's budget",
    description: "Big-picture, exploratory, comfortable with risk. Rewards novelty over convention.",
  },
  {
    key: "e" as const,
    name: "Hands-on",
    world: "A prototype deadline",
    description: "Tactile, iterative, build-to-learn. Rewards tinkering and fixing things with your hands, not just planning around them.",
  },
];

export default function SciencePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-6 py-16">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">The method</p>
        <h1 className="font-[family-name:var(--font-title)] text-5xl font-normal tracking-tight">
          Why we score what you do, not what you say about yourself
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/60">
          Most career quizzes ask you to rate yourself: are you organized, are you a people person,
          are you a risk-taker. Everyone answers those the way they want to be seen, which is exactly
          why those quizzes tend to land on whatever you already believed about yourself.
        </p>
      </ScrollReveal>

      <ScrollReveal className="flex flex-col gap-4">
        <h2 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">
          What we do instead
        </h2>
        <p className="leading-relaxed text-foreground/70">
          Vocateur puts you in an unscripted moment that actually requires being organized, or
          analytical, or hands-on, and scores what you did, not what you said you&rsquo;d do. Diagnosing a
          production outage with one shot before it escalates. Deciding whether to trust a valuation
          model over a senior analyst&rsquo;s gut call. Mediating a conflict between two people you now
          manage. Filing a part down by hand two days before a demo. Thirty-five moments like these,
          across five real job worlds, plus five quick skill games that measure reaction time, memory,
          typing, and precision directly instead of asking about them. How you actually moved is the
          signal.
        </p>
      </ScrollReveal>

      <ScrollReveal className="flex flex-col gap-5">
        <h2 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">
          Five real instincts
        </h2>
        <p className="leading-relaxed text-foreground/70">
          This is Vocateur&rsquo;s own model, built for this product, not a borrowed clinical framework.
          Every scenario blends a primary instinct with a meaningful secondary one, and nothing in the
          simulation ever tells you which trait a moment is testing, so there&rsquo;s nothing to
          reverse-engineer and answer strategically toward.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {INSTINCTS.map((q, i) => (
            <ScrollReveal
              key={q.key}
              delay={i * 0.06}
              className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-surface p-6"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--quadrant-${q.key})` }} />
                <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">{q.name}</h3>
                <span className="text-xs text-foreground/40">&middot; {q.world}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/60">{q.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="flex flex-col gap-4">
        <h2 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">
          Why we added the hands-on instinct
        </h2>
        <p className="leading-relaxed text-foreground/70">
          The first version of this simulation had no way to detect a genuine builder, someone who
          thinks by making things and fixing things with their hands rather than planning around them
          on paper. That meant engineers, makers, and science-fair-finalist types weren&rsquo;t getting
          matched to what actually fits them. The prototype-deadline chapter exists specifically to
          catch that instinct, and it now carries equal weight in matching alongside the other four.
        </p>
      </ScrollReveal>

      <ScrollReveal className="flex flex-col gap-4">
        <h2 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">
          How your final matches get ranked
        </h2>
        <p className="leading-relaxed text-foreground/70">
          Your behavior across all five worlds produces a profile, which gets compared against every
          occupation in the catalog for overall fit. Most people who take this are looking for a
          genuinely strong outcome, not just any occupation that technically fits, so when two matches
          fit about equally well, the better-paying one is ranked slightly higher by default. If you
          told us in your own words that other things, stability, creativity, autonomy, matter more to
          you than money, that pay nudge is weakened accordingly. Fit always comes first. Pay only ever
          breaks a near-tie.
        </p>
      </ScrollReveal>
    </main>
  );
}
