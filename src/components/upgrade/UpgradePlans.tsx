"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Plan = "monthly" | "annual";

const FREE_FEATURES = [
  "Full simulation assessment",
  "Your top 3 career matches",
  "Real reasoning behind each match",
];

const PRO_FEATURES = [
  "All 10 matches with full reasoning",
  "A step-by-step roadmap for any match, with progress tracking",
  "Personal career advisor: resume, cover letter, LinkedIn review",
  "Role-specific mock interviews with honest feedback",
  "Job posting fit checks and salary negotiation prep",
  "Real market outlook from U.S. Bureau of Labor Statistics data",
  "Unlimited assessment retakes and PDF export",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`mt-0.5 shrink-0 ${className ?? ""}`}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UpgradePlans({
  sessionId,
  isAuthenticated,
  userEmail,
}: {
  sessionId: string;
  isAuthenticated: boolean;
  userEmail: string | null;
}) {
  const [stage, setStage] = useState<"cta" | "error">("cta");
  const [checkoutLoading, setCheckoutLoading] = useState<Plan | null>(null);

  async function startCheckout(plan: Plan) {
    if (!isAuthenticated) {
      const next = `/api/checkout/redirect?plan=${plan}&session=${sessionId}`;
      const note = "Sign in once and you go straight to secure card payment.";
      window.location.href = `/login?next=${encodeURIComponent(next)}&note=${encodeURIComponent(note)}`;
      return;
    }
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setStage("error");
        setCheckoutLoading(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setStage("error");
      setCheckoutLoading(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-5 rounded-3xl border border-border-subtle bg-surface p-8">
        <div>
          <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">Free</h3>
          <p className="mt-1 text-3xl font-semibold">$0</p>
          <p className="mt-1 text-xs text-foreground/40">What you have right now.</p>
        </div>
        <ul className="flex flex-1 flex-col gap-2.5 text-sm text-foreground/60">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <CheckIcon className="text-foreground/30" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex flex-col gap-5 rounded-3xl border border-accent bg-accent/[0.06] p-8 shadow-[0_0_40px_-16px_var(--accent)]">
        <span className="absolute -top-3 right-8 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Recommended
        </span>
        <div>
          <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight text-accent">Pro</h3>
          <p className="mt-1 text-3xl font-semibold">
            $9<span className="text-base font-normal text-foreground/50">/mo</span>
            <span className="mx-3 text-lg font-normal text-foreground/30">or</span>
            $89<span className="text-base font-normal text-foreground/50">/yr</span>
          </p>
          <p className="mt-1 text-xs text-foreground/40">Annual saves about 18%. Cancel anytime.</p>
        </div>
        <ul className="flex flex-1 flex-col gap-2.5 text-sm text-foreground/70">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <CheckIcon className="text-accent" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 sm:flex-row">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => startCheckout("monthly")}
            disabled={checkoutLoading !== null}
            className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-60"
          >
            {checkoutLoading === "monthly" ? "Opening payment…" : "Get Pro: $9/mo"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => startCheckout("annual")}
            disabled={checkoutLoading !== null}
            className="flex-1 rounded-full border-2 border-accent/40 px-6 py-3 text-sm font-semibold text-accent disabled:opacity-60"
          >
            {checkoutLoading === "annual" ? "Opening payment…" : "Get Pro: $89/yr"}
          </motion.button>
        </div>

        {stage === "error" && <p className="text-center text-sm text-quadrant-c">Something went wrong. Try again.</p>}
        {isAuthenticated && userEmail && (
          <p className="text-center text-xs text-foreground/40">Signed in as {userEmail}</p>
        )}
      </div>
    </div>
  );
}
