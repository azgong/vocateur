import Link from "next/link";

const LOCKED_ACTIONS = [
  {
    title: "View your personalized roadmap",
    description: "A step-by-step plan built around your matched career and your own timeline.",
  },
  {
    title: "Chat with your AI career advisor",
    description: "Grounded in real BLS data for your field. Ask anything, or run a mock interview.",
  },
  {
    title: "See all 10 of your matches",
    description: "Not just your top 3, with full reasoning behind every one.",
  },
];

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ResultsUpsell({ sessionId }: { sessionId: string }) {
  return (
    <div
      className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl p-8 text-center text-white shadow-[0_0_60px_-16px_var(--accent)]"
      style={{ background: "linear-gradient(145deg, var(--accent), var(--accent-ink))" }}
    >
      <div>
        <h3 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight">
          Upgrade to Pro to keep going
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          Everything below unlocks the moment you upgrade. $9/mo or $89/yr, cancel anytime.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-2">
        {LOCKED_ACTIONS.map((action) => (
          <Link
            key={action.title}
            href={`/upgrade/${sessionId}`}
            className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70">
              <LockIcon />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{action.title}</span>
              <span className="block text-xs text-white/60">{action.description}</span>
            </span>
          </Link>
        ))}
      </div>

      <Link
        href={`/upgrade/${sessionId}`}
        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-accent shadow-lg transition-transform hover:scale-[1.02]"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
