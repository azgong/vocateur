import Link from "next/link";

export function ResultsUpsell({ sessionId }: { sessionId: string }) {
  return (
    <div
      className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl p-8 text-center text-white shadow-[0_0_60px_-16px_var(--accent)]"
      style={{ background: "linear-gradient(145deg, var(--accent), var(--accent-ink))" }}
    >
      <h3 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight">
        Upgrade to Pro to unlock your roadmap
      </h3>
      <p className="max-w-md text-sm text-white/70">
        See all 10 of your matches, get a personalized step-by-step roadmap, and talk to an AI career advisor
        grounded in real labor-market data for your matched field. Ask it anything, or run a real mock
        interview whenever you need one.
      </p>
      <Link
        href={`/upgrade/${sessionId}`}
        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-accent shadow-lg transition-transform hover:scale-[1.02]"
      >
        See what Pro unlocks
      </Link>
      <p className="text-xs text-white/50">$9/mo or $79/yr, cancel anytime</p>
    </div>
  );
}
