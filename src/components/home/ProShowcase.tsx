import { ScrollReveal } from "@/components/ScrollReveal";

function ExampleBadge() {
  return (
    <span className="absolute right-4 top-4 rounded-full border border-border-subtle bg-background/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground/40">
      Illustrative example
    </span>
  );
}

function RoadmapDemo() {
  const milestones = [
    { timeframe: "Next 3 months", title: "Close the skill gap that actually matters" },
    { timeframe: "Next 6 months", title: "Build one project a hiring manager would ask about" },
    { timeframe: "Ongoing", title: "Network toward the specific people doing this job" },
  ];
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <ExampleBadge />
      <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">A roadmap for every match, that tracks your progress</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        Not a generic checklist, and not just one. Pro unlocks a roadmap for any of your 10 matches, with checkable
        milestones that track your real progress over time, not a document you read once and forget.
      </p>
      <ol className="relative flex flex-col gap-4 border-l-2 border-border-subtle pl-5">
        {milestones.map((m) => (
          <li key={m.title} className="relative">
            <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_-2px_var(--accent)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-accent/70">{m.timeframe}</span>
            <p className="text-sm font-medium">{m.title}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MockInterviewDemo() {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <ExampleBadge />
      <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">A mock interview, ready any time</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        Real, role-specific interview questions for your matched field, one at a time. Answer at your own pace,
        then see what a strong answer covers to check yourself against it.
      </p>
      <div className="flex flex-col gap-2">
        <div className="self-start rounded-2xl rounded-bl-sm border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-sm text-foreground/80">
          Walk me through a time you made a call without complete information.
        </div>
        <div className="self-start rounded-2xl rounded-bl-sm bg-surface-2 px-4 py-2.5 text-sm text-foreground/70">
          What a strong answer covers: a specific example, the constraint you were under, and a measurable
          outcome.
        </div>
      </div>
    </div>
  );
}

function MarketDataDemo() {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <ExampleBadge />
      <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">Real market predictions</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        Every match comes with real U.S. Bureau of Labor Statistics projections through 2034: growth, wage, and
        openings, not a made-up outlook.
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xl font-semibold tabular-nums text-accent">+15.2%</p>
          <p className="text-[11px] text-foreground/50">Projected growth</p>
        </div>
        <div>
          <p className="text-xl font-semibold tabular-nums">$171.2k</p>
          <p className="text-[11px] text-foreground/50">Median wage</p>
        </div>
        <div>
          <p className="text-xl font-semibold tabular-nums">55.6k</p>
          <p className="text-[11px] text-foreground/50">Annual openings</p>
        </div>
      </div>
      <p className="text-[11px] text-foreground/40">Source: BLS Employment Projections, Table 1.2</p>
    </div>
  );
}

export function ProShowcase() {
  return (
    <section id="pro" className="flex flex-col gap-10 scroll-mt-24">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Vocateur Pro</p>
        <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          One payment, unlocked forever
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/60">
          Real examples of what Pro actually looks like, not a feature list. Every number and message below is
          illustrative, not a real user&rsquo;s data.
        </p>
      </ScrollReveal>
      <div className="grid gap-4 sm:grid-cols-3">
        <ScrollReveal delay={0}><RoadmapDemo /></ScrollReveal>
        <ScrollReveal delay={0.08}><MockInterviewDemo /></ScrollReveal>
        <ScrollReveal delay={0.16}><MarketDataDemo /></ScrollReveal>
      </div>
    </section>
  );
}
