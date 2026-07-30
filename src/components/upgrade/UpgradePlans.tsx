"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { authSafeOrigin } from "@/lib/site";

const FREE_FEATURES = [
  "Full simulation assessment",
  "Your top 3 career matches",
  "Real reasoning behind each match",
];

const PRO_FEATURES = [
  "Unlimited assessment retakes, forever",
  "All 10 matches with full reasoning, detailed job projections, and market analysis",
  "A highly detailed, visual roadmap for any match, with checkable progress tracking and PDF export",
  "Major matcher: recommended, alternative, and avoid majors with real reasons",
  "Real market outlook from U.S. Bureau of Labor Statistics data",
  "One payment, unlocked forever, no subscription",
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
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function startCheckout() {
    if (!isAuthenticated) {
      const next = `/api/checkout/redirect?session=${sessionId}`;
      const note = "Sign in once and you go straight to secure card payment.";
      window.location.href = `${authSafeOrigin()}/login?next=${encodeURIComponent(next)}&note=${encodeURIComponent(note)}`;
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (res.status === 409) {
        window.location.href = sessionId ? `/results/${sessionId}` : "/assessment";
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.url) {
        setStage("error");
        setCheckoutLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setStage("error");
      setCheckoutLoading(false);
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
            $29<span className="text-base font-normal text-foreground/50"> once</span>
          </p>
          <p className="mt-1 text-xs text-foreground/40">One payment. No subscription, nothing to cancel.</p>
        </div>
        <ul className="flex flex-1 flex-col gap-2.5 text-sm text-foreground/70">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <CheckIcon className="text-accent" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={startCheckout}
          disabled={checkoutLoading}
          className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-60"
        >
          {checkoutLoading ? "Opening payment…" : "Get Pro: $29 once"}
        </motion.button>

        {stage === "error" && <p className="text-center text-sm text-quadrant-c">Something went wrong. Try again.</p>}
        {isAuthenticated && userEmail && (
          <p className="text-center text-xs text-foreground/40">Signed in as {userEmail}</p>
        )}
      </div>
    </div>
  );
}
