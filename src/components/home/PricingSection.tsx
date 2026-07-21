import Link from "next/link";

export function PricingSection() {
  return (
    <section className="flex flex-col gap-8">
      <div className="text-center">
        <p className="small-caps text-sm font-medium tracking-[0.2em] text-accent uppercase">Pricing</p>
        <h2 className="small-caps font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight sm:text-4xl">
          Free to start, simple to unlock
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-3xl border border-border-subtle bg-surface p-8">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight">Free</h3>
            <p className="mt-1 text-3xl font-semibold">$0</p>
          </div>
          <ul className="flex flex-1 flex-col gap-2 text-sm text-foreground/60">
            <li>Full simulation assessment</li>
            <li>Your top 3 career matches</li>
            <li>Real reasoning behind each match</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-accent bg-accent/[0.06] p-8 shadow-[0_0_40px_-16px_var(--accent)]">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight text-accent">Pro</h3>
            <p className="mt-1 text-3xl font-semibold">
              $9<span className="text-base font-normal text-foreground/50">/mo</span>
            </p>
            <p className="text-xs text-foreground/40">or $79/yr &mdash; save about 27%</p>
          </div>
          <ul className="flex flex-1 flex-col gap-2 text-sm text-foreground/70">
            <li>Everything in Free</li>
            <li>All 10 matches with full reasoning</li>
            <li>Your personalized step-by-step roadmap</li>
            <li>AI career advisor grounded in real BLS data</li>
            <li>Real mock interview practice</li>
            <li>PDF export &middot; cancel anytime</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-sm text-foreground/50">
        Take the free assessment first &mdash; you&rsquo;ll see the option to upgrade once you have real matches
        to unlock.
      </p>
      <div className="flex justify-center">
        <Link
          href="/assessment"
          className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)] transition-shadow hover:shadow-[0_0_36px_-4px_var(--accent)]"
        >
          Start your assessment
        </Link>
      </div>
    </section>
  );
}
