"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Plan = "monthly" | "annual";

export function HomeProCheckout({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
  userEmail: string | null;
}) {
  const [stage, setStage] = useState<"cta" | "error">("cta");
  const [checkoutLoading, setCheckoutLoading] = useState<Plan | null>(null);

  async function startCheckout(plan: Plan) {
    if (!isAuthenticated) {
      const next = `/api/checkout/redirect?plan=${plan}`;
      const note = "Sign in once and you go straight to secure card payment.";
      window.location.href = `/login?next=${encodeURIComponent(next)}&note=${encodeURIComponent(note)}`;
      return;
    }
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => startCheckout("monthly")}
          disabled={checkoutLoading !== null}
          className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-60"
        >
          {checkoutLoading === "monthly" ? "Redirecting…" : "Get Pro: $9/mo"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => startCheckout("annual")}
          disabled={checkoutLoading !== null}
          className="flex-1 rounded-full border-2 border-accent/40 px-6 py-3 text-sm font-semibold text-accent disabled:opacity-60"
        >
          {checkoutLoading === "annual" ? "Redirecting…" : "Get Pro: $89/yr"}
        </motion.button>
      </div>
      {stage === "error" && <p className="text-center text-sm text-quadrant-c">Something went wrong. Try again.</p>}
      {isAuthenticated && userEmail && (
        <p className="text-center text-xs text-foreground/40">Signed in as {userEmail}</p>
      )}
    </div>
  );
}
