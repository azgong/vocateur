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
      <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight">Your personalized roadmap</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        Not a generic checklist. Milestones built from your matched career, your life stage, your timeline, and
        the context you shared, in order, with a real reason for each step.
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

function AdvisorDemo() {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <ExampleBadge />
      <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight">A real advisor, not a chatbot</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        Grounded in real BLS wage and growth data plus curated, role-specific advisory content. Paste your resume
        and it reviews it like a hiring manager in that field would, not generic resume tips.
      </p>
      <div className="flex flex-col gap-2">
        <div className="self-end rounded-2xl rounded-br-sm bg-surface-2 px-4 py-2.5 text-sm text-foreground/80">
          Can you look at my resume for this role?
        </div>
        <div className="self-start rounded-2xl rounded-bl-sm border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-sm text-foreground/80">
          Paste it in. I&rsquo;ll tell you exactly what a hiring manager for this role checks first, and what&rsquo;s
          missing.
        </div>
      </div>
    </div>
  );
}

function MockInterviewDemo() {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <ExampleBadge />
      <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight">Real mock interviews</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        Role-specific interview questions, one at a time, with honest feedback after each answer, the same way a
        real interviewer for that job would run the conversation.
      </p>
      <div className="flex flex-col gap-2">
        <div className="self-start rounded-2xl rounded-bl-sm border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-sm text-foreground/80">
          Walk me through a time you made a call without complete information.
        </div>
        <div className="self-start rounded-2xl rounded-bl-sm bg-surface-2 px-4 py-2.5 text-sm text-foreground/70">
          Good structure. A real interviewer would want the outcome sooner, and one concrete number.
        </div>
      </div>
    </div>
  );
}

function MarketDataDemo() {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <ExampleBadge />
      <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight">Real market predictions</h3>
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
    <section className="flex flex-col gap-10">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Vocateur Pro</p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight sm:text-4xl">
          Everything unlocked once you know your match
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/60">
          Real examples of what Pro actually looks like, not a feature list. Every number and message below is
          illustrative, not a real user&rsquo;s data.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <RoadmapDemo />
        <AdvisorDemo />
        <MockInterviewDemo />
        <MarketDataDemo />
      </div>
    </section>
  );
}
