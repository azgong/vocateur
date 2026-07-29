import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HomeProCheckout } from "@/components/home/HomeProCheckout";

const FREE_FEATURES = ["Full simulation assessment", "Your top 3 career matches", "Real reasoning behind each match"];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited assessment retakes",
  "All 10 matches with full reasoning, detailed job projections, and market analysis",
  "A highly detailed, visual roadmap for any match, with progress tracking and PDF export",
  "Major matcher: recommended, alternative, and avoid majors with real reasons",
  "One payment, unlocked forever",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`mt-0.5 shrink-0 ${className ?? ""}`}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingSection({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
  userEmail: string | null;
}) {
  return (
    <section id="pricing" className="flex flex-col gap-8 scroll-mt-24">
      <ScrollReveal className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Pricing</p>
        <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          Free to start, simple to unlock
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-foreground/50">
          Take the free assessment first, or skip the line and unlock Pro right now. One payment, yours forever.
        </p>
      </ScrollReveal>
      <div className="grid gap-6 sm:grid-cols-2">
        <ScrollReveal className="flex flex-col gap-5 rounded-3xl border border-border-subtle bg-surface p-8">
          <div>
            <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">Free</h3>
            <p className="mt-1 text-3xl font-semibold">$0</p>
          </div>
          <ul className="flex flex-1 flex-col gap-2.5 text-sm text-foreground/60">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckIcon className="text-foreground/30" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/assessment"
            className="rounded-full border-2 border-border-strong px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Start free
          </Link>
        </ScrollReveal>
        <ScrollReveal
          delay={0.1}
          className="relative flex flex-col gap-5 rounded-3xl border border-accent bg-accent/[0.06] p-8 shadow-[0_0_40px_-16px_var(--accent)]"
        >
          <span className="absolute -top-3 right-8 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Best value
          </span>
          <div>
            <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight text-accent">Pro</h3>
            <p className="mt-1 text-3xl font-semibold">
              $29<span className="text-base font-normal text-foreground/50"> once</span>
            </p>
            <p className="text-xs text-foreground/40">No subscription, nothing to cancel</p>
          </div>
          <ul className="flex flex-1 flex-col gap-2.5 text-sm text-foreground/70">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckIcon className="text-accent" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <HomeProCheckout isAuthenticated={isAuthenticated} userEmail={userEmail} />
          <Link href="/assessment" className="text-center text-xs text-foreground/40 underline underline-offset-2 hover:text-foreground/60">
            Prefer to try it free first? Take the assessment
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
