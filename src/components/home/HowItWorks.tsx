const STEPS = [
  {
    title: "Step into four real job simulations",
    description:
      "An analyst call, an ER shift, a workplace conflict, a founder's budget — three unscripted moments in each, about 10 minutes total. No “rate yourself 1-5” questions.",
  },
  {
    title: "Get scored on what you actually do",
    description:
      "Not which box you checked — how you actually move under time pressure and ambiguity. That behavior is the signal.",
  },
  {
    title: "See your top matches, free",
    description:
      "Your top 3 career matches with real reasoning for each, no account required to see them.",
  },
  {
    title: "Unlock your roadmap and advisor",
    description:
      "A personalized step-by-step plan, all 10 matches, and an AI career advisor grounded in real labor-market data for your exact field.",
  },
];

export function HowItWorks() {
  return (
    <section className="flex flex-col gap-10">
      <div className="text-center">
        <p className="small-caps text-sm font-medium tracking-[0.2em] text-accent uppercase">How it works</p>
        <h2 className="small-caps font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight sm:text-4xl">
          Four steps, about ten minutes
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/60">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
