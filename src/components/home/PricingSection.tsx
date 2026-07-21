import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export function PricingSection() {
  return (
    <section className="flex flex-col gap-8">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Pricing</p>
        <h2 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight sm:text-4xl">
          Free to start, simple to unlock
        </h2>
      </ScrollReveal>
      <div className="grid gap-6 sm:grid-cols-2">
        <ScrollReveal className="flex flex-col gap-4 rounded-3xl border border-border-subtle bg-surface p-8">
          <div>
            <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">Free</h3>
            <p className="mt-1 text-3xl font-semibold">$0</p>
          </div>
          <ul className="flex flex-1 flex-col gap-2 text-sm text-foreground/60">
            <li>Full simulation assessment</li>
            <li>Your top 3 career matches</li>
            <li>Real reasoning behind each match</li>
          </ul>
          <Link
            href="/assessment"
            className="rounded-full border-2 border-border-strong px-6 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Start free
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="flex flex-col gap-4 rounded-3xl border border-accent bg-accent/[0.06] p-8 shadow-[0_0_40px_-16px_var(--accent)]">
          <div>
            <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight text-accent">Pro</h3>
            <p className="mt-1 text-3xl font-semibold">
              $9<span className="text-base font-normal text-foreground/50">/mo</span>
            </p>
            <p className="text-xs text-foreground/40">or $79/yr, save about 27%, best for a full job search</p>
          </div>
          <ul className="flex flex-1 flex-col gap-2 text-sm text-foreground/70">
            <li>Everything in Free</li>
            <li>All 10 matches with full reasoning</li>
            <li>A roadmap for any of your matches, with checkable progress tracking</li>
            <li>Resume, cover letter, and LinkedIn review, whenever you have a new draft</li>
            <li>Job posting fit checks and salary negotiation prep, grounded in real BLS data</li>
            <li>Real, role-specific mock interview practice, any time you want a rep</li>
            <li>PDF export &middot; cancel anytime</li>
          </ul>
          <Link
            href="/assessment"
            className="rounded-full bg-accent px-6 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)] transition-shadow hover:shadow-[0_0_36px_-4px_var(--accent)]"
          >
            Start assessment to unlock Pro
          </Link>
        </ScrollReveal>
      </div>
      <ScrollReveal className="text-center">
        <p className="text-sm text-foreground/50">
          You take the free assessment first. The option to upgrade appears once you have real matches to
          unlock.
        </p>
      </ScrollReveal>
    </section>
  );
}
