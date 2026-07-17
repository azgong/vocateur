"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function PaywallCTA({ sessionId }: { sessionId: string }) {
  const [stage, setStage] = useState<"cta" | "email" | "sent" | "error">("cta");
  const [email, setEmail] = useState("");

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 rounded-2xl bg-zinc-900 p-8 text-center text-white dark:bg-zinc-100 dark:text-zinc-900"
    >
      <h3 className="text-2xl font-semibold tracking-tight">See the rest of your matches</h3>
      <p className="max-w-md text-sm text-zinc-300 dark:text-zinc-600">
        Unlock all 10 matches with full rationale, your personalized roadmap with concrete next steps, and AI
        conversation access to ask about your results.
      </p>

      <AnimatePresence mode="popLayout">
        {stage === "cta" && (
          <motion.button
            key="cta"
            whileTap={{ scale: 0.97 }}
            onClick={() => setStage("email")}
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-white"
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
              className="flex-1 rounded-full border border-zinc-600 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-white dark:border-zinc-400 dark:text-zinc-900 dark:focus:border-zinc-900"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-white"
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

        {stage === "error" && (
          <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-300">
            Something went wrong sending that link. Try again.
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-xs text-zinc-400 dark:text-zinc-500">or $79/yr — save ~30%</p>
    </motion.div>
  );
}
