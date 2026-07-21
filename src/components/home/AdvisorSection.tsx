export function AdvisorSection() {
  return (
    <section className="grid items-center gap-10 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <p className="small-caps text-sm font-medium tracking-[0.2em] text-accent uppercase">Your AI career advisor</p>
        <h2 className="small-caps font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight sm:text-4xl">
          Not just another chatbot
        </h2>
        <p className="text-foreground/60">
          Your advisor is grounded in the same real BLS wage and growth numbers shown on your roadmap, plus
          curated, role-specific content: how people actually break into the field, typical career progression,
          and common misconceptions. Ask it anything about your results or your matched career.
        </p>
        <p className="text-foreground/60">
          Want to practice? Switch to mock interview mode for real, role-specific interview questions for your
          exact matched career, any time you want a rep. Conversations aren&rsquo;t saved after you leave the page.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-6">
        <div className="flex gap-2">
          <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white">Ask your advisor</span>
          <span className="rounded-full border border-border-subtle px-4 py-1.5 text-xs font-medium text-foreground/50">
            Mock interview
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-xl bg-surface-2 p-4">
          <p className="text-xs font-medium text-foreground/40">You</p>
          <p className="text-sm text-foreground/80">Why did I match with this career, and what&rsquo;s the real outlook?</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-accent/20 bg-accent/[0.06] p-4">
          <p className="text-xs font-medium text-accent">Advisor</p>
          <p className="text-sm text-foreground/80">
            BLS projects +15.2% growth and a $171,200 median wage for this field through 2034 &mdash; here&rsquo;s
            why your choices point that way, and what to build toward first&hellip;
          </p>
        </div>
      </div>
    </section>
  );
}
