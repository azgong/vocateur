"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function UpgradePlans({
  sessionId,
  isAuthenticated,
  userEmail,
}: {
  sessionId: string;
  isAuthenticated: boolean;
  userEmail: string | null;
}) {
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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/upgrade/${sessionId}`,
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
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-subtle bg-surface p-8 text-center">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold">
          $9<span className="text-sm font-normal text-foreground/50">/mo</span>
          <span className="mx-3 text-foreground/30">or</span>
          $79<span className="text-sm font-normal text-foreground/50">/yr</span>
        </p>
        <p className="text-xs text-foreground/40">Annual saves about 27%. Cancel anytime.</p>
      </div>

      {isAuthenticated ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCheckout("monthly")}
            disabled={checkoutLoading !== null}
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-60"
          >
            {checkoutLoading === "monthly" ? "Redirecting…" : "Upgrade: $9/mo"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCheckout("annual")}
            disabled={checkoutLoading !== null}
            className="rounded-full border-2 border-border-strong px-8 py-3 text-sm font-semibold text-foreground disabled:opacity-60"
          >
            {checkoutLoading === "annual" ? "Redirecting…" : "Upgrade: $79/yr"}
          </motion.button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {stage === "cta" && (
            <motion.button
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStage("email")}
              className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)]"
            >
              Upgrade to Pro
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
                className="flex-1 rounded-full border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              />
              <button type="submit" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
                Continue
              </button>
            </motion.form>
          )}

          {stage === "sent" && (
            <motion.p key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-foreground/70">
              Check your email for a sign-in link. It&rsquo;ll bring you right back here to finish upgrading.
            </motion.p>
          )}
        </AnimatePresence>
      )}

      {stage === "error" && <p className="text-sm text-quadrant-c">Something went wrong. Try again.</p>}

      {isAuthenticated && userEmail && (
        <p className="text-xs text-foreground/40">Signed in as {userEmail}</p>
      )}
    </div>
  );
}
