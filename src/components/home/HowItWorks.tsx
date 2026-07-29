import { ScrollReveal } from "@/components/ScrollReveal";

const STEPS = [
  {
    title: "Step into five real job simulations.",
    description:
      "An analyst call, an ER shift, a workplace conflict, a founder's budget, a prototype deadline: seven unscripted moments in each, then five quick skill games, about 10 minutes total. No “rate yourself 1-5” questions.",
  },
  {
    title: "Get scored on what you actually do.",
    description:
      "Not which box you checked, but how you actually move under time pressure and ambiguity. That behavior is the signal.",
  },
  {
    title: "See your top matches, free.",
    description:
      "Your top 3 career matches with real reasoning for each, no account required to see them.",
  },
  {
    title: "Unlock your roadmap and interview prep.",
    description:
      "A personalized, detailed step-by-step plan, all 10 matches with full projections, and a mock interview ready any time for your exact field.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="flex flex-col gap-10 scroll-mt-24">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">How it works</p>
        <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          Four steps, about ten minutes.
        </h2>
      </ScrollReveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <ScrollReveal key={step.title} delay={i * 0.08} className="flex gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/60">{step.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
