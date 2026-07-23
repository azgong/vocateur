import { ScrollReveal } from "@/components/ScrollReveal";

const QUADRANTS = [
  {
    key: "a" as const,
    name: "Analytical",
    description: "Logical, fact-based, data-first. Rewards rigor and evidence over gut instinct.",
  },
  {
    key: "b" as const,
    name: "Sequential",
    description: "Structured, procedural, detail-oriented. Rewards process and reliability under pressure.",
  },
  {
    key: "c" as const,
    name: "Interpersonal",
    description: "Relational, expressive, people-first. Rewards empathy and communication.",
  },
  {
    key: "d" as const,
    name: "Imaginative",
    description: "Big-picture, exploratory, comfortable with risk. Rewards novelty over convention.",
  },
];

export function ScienceSection() {
  return (
    <section id="science" className="flex flex-col gap-10 scroll-mt-24">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">The framework</p>
        <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          Built on a real thinking-style model
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/60">
          Vocateur is grounded in the Herrmann Whole Brain® Model, a four-quadrant thinking-style framework
          widely used in organizational psychology and career coaching. It&rsquo;s a conceptual model for how people
          approach problems, not a clinical or neuroscientific diagnosis.
        </p>
      </ScrollReveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUADRANTS.map((q, i) => (
          <ScrollReveal key={q.key} delay={i * 0.08} className="flex flex-col gap-2 rounded-2xl border border-border-subtle bg-surface p-6">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--quadrant-${q.key})` }} />
              <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">{q.name}</h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground/60">{q.description}</p>
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal>
        <p className="mx-auto max-w-xl text-center text-sm text-foreground/50">
          Instead of asking &ldquo;are you organized?&rdquo;, we put you in an unscripted moment that requires being
          organized (or not) and score what you actually did.
        </p>
      </ScrollReveal>
    </section>
  );
}
