"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function PaywallCTA({ sessionId, isAuthenticated }: { sessionId: string; isAuthenticated: boolean }) {
  const [stage, setStage] = useState<"cta" | "email" | "sent" | "error">("cta");
  const [email, setEmail] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState<"monthly" | "annual" | null>(null);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setStage("sent");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/results/${sessionId}`,
      },
    });
    if (error) setStage("error");
  }

  async function handleCheckout(plan: "monthly" | "annual") {
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl p-8 text-center text-white shadow-[0_0_60px_-16px_var(--accent)]"
      style={{ background: "linear-gradient(145deg, var(--accent), var(--accent-ink))" }}
    >
      <h3 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
        See the rest of your matches
      </h3>
      <p className="max-w-md text-sm text-white/70">
        Unlock all 10 matches, your personalized roadmap, and a personal AI career advisor for your matched
        field &mdash; ask it anything, or run a real mock interview whenever you need one.
      </p>

      <AnimatePresence mode="popLayout">
        {isAuthenticated ? (
          <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCheckout("monthly")}
              disabled={checkoutLoading !== null}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-accent disabled:opacity-60"
            >
              {checkoutLoading === "monthly" ? "Redirecting…" : "Monthly — $9/mo"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCheckout("annual")}
              disabled={checkoutLoading !== null}
              className="rounded-full border-2 border-white/70 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {checkoutLoading === "annual" ? "Redirecting…" : "Annual — $79/yr"}
            </motion.button>
          </motion.div>
        ) : (
          <>
            {stage === "cta" && (
              <motion.button
                key="cta"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStage("email")}
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-accent"
              >
                Unlock full results — $9/mo
              </motion.button>
            )}

            {stage === "email" && (
              <motion.form
                key="email-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSendLink}
                className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full border border-white/40 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-white"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-accent"
                >
                  Continue
                </button>
              </motion.form>
            )}

            {stage === "sent" && (
              <motion.p key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium">
                Check your email for a sign-in link to finish unlocking.
              </motion.p>
            )}
          </>
        )}

        {stage === "error" && (
          <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-200">
            Something went wrong. Try again.
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-xs text-white/50">or $79/yr — save ~30%</p>
      <p className="text-[11px] text-white/40">
        By subscribing you agree to our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-white/70">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-white/70">
          Privacy Policy
        </a>
        . Cancel anytime.
      </p>
    </motion.div>
  );
}
