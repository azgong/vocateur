import { ScrollReveal } from "@/components/ScrollReveal";

export const FAQS = [
  {
    q: "Is this a personality test?",
    a: "No. Personality tests ask you to self-report (“rate yourself 1-5”). Vocateur puts you into unscripted job scenarios and scores what you actually do under time pressure and ambiguity. That behavior is the signal, not a checkbox.",
  },
  {
    q: "How is this different from other personality or career-aptitude tests?",
    a: "Most ask you to self-report and hand back a personality label or a broad interest category, then leave the career part to you. Vocateur scores real simulated behavior under time pressure and ambiguity, then maps that directly to specific careers, real job titles with real government wage and growth data, not a type name you have to go research on your own.",
  },
  {
    q: "Where does the career data actually come from?",
    a: "The U.S. Bureau of Labor Statistics Employment Projections program (2024–2034 cycle). Every roadmap cites the exact figures and source, and we're upfront when a career only has an approximate occupation-code match.",
  },
  {
    q: "Is Pro a subscription?",
    a: "No. It's a single one-time payment of $29. There's no recurring charge and nothing to cancel, you keep access forever.",
  },
  {
    q: "What happens to my data?",
    a: "See our Privacy Policy for the full details on what's collected and how it's used.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="flex flex-col gap-8 scroll-mt-24">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Questions</p>
        <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          Before you start
        </h2>
      </ScrollReveal>
      <div className="grid gap-4 lg:grid-cols-2">
        {FAQS.map((item, i) => (
          <ScrollReveal key={item.q} delay={(i % 2) * 0.08} className="rounded-2xl border border-border-subtle bg-surface p-6">
            <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">{item.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">{item.a}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
