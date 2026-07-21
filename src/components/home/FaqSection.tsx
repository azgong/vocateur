export const FAQS = [
  {
    q: "Is this a personality test?",
    a: "No. Personality tests ask you to self-report (“rate yourself 1-5”). Vocateur puts you into unscripted job scenarios and scores what you actually do under time pressure and ambiguity. That behavior is the signal, not a checkbox.",
  },
  {
    q: "How is this different from things like 16Personalities or CliftonStrengths?",
    a: "Those score self-reported preferences and hand back a personality label. Vocateur scores real simulated behavior and maps it to real government labor-market data for specific careers, not a type name.",
  },
  {
    q: "Where does the career data actually come from?",
    a: "The U.S. Bureau of Labor Statistics Employment Projections program (2024–2034 cycle). Every roadmap cites the exact figures and source, and we're upfront when a career only has an approximate occupation-code match.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Subscriptions are self-serve and cancel anytime from your account, no email required.",
  },
  {
    q: "What happens to my data?",
    a: "See our Privacy Policy for the full details on what's collected and how it's used.",
  },
];

export function FaqSection() {
  return (
    <section className="flex flex-col gap-8">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Questions</p>
        <h2 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight sm:text-4xl">
          Before you start
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {FAQS.map((item) => (
          <div key={item.q} className="rounded-2xl border border-border-subtle bg-surface p-6">
            <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">{item.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
