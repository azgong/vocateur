"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInPanel } from "@/components/auth/SignInPanel";

type Plan = "monthly" | "annual";

export function HomeProCheckout({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
  userEmail: string | null;
}) {
  const [stage, setStage] = useState<"cta" | "auth" | "error">("cta");
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<Plan | null>(null);

  async function startCheckout(plan: Plan) {
    if (!isAuthenticated) {
      setPendingPlan(plan);
      setStage("auth");
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

  if (isAuthenticated) {
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
        {userEmail && <p className="text-center text-xs text-foreground/40">Signed in as {userEmail}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="wait">
        {stage === "cta" && (
          <motion.div
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startCheckout("monthly")}
              className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)]"
            >
              Get Pro: $9/mo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startCheckout("annual")}
              className="flex-1 rounded-full border-2 border-accent/40 px-6 py-3 text-sm font-semibold text-accent"
            >
              Get Pro: $89/yr
            </motion.button>
          </motion.div>
        )}

        {stage === "auth" && pendingPlan && (
          <motion.div
            key="auth-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <SignInPanel
              next={`/api/checkout/redirect?plan=${pendingPlan}`}
              note="Sign in once and you go straight to secure card payment."
            />
          </motion.div>
        )}
      </AnimatePresence>
      {stage === "error" && <p className="text-center text-sm text-quadrant-c">Something went wrong. Try again.</p>}
    </div>
  );
}
