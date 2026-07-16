"use client";

import { motion } from "framer-motion";

export function PaywallCTA() {
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
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-white"
      >
        Unlock full results — $9/mo
      </motion.button>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">or $79/yr — save ~30%</p>
    </motion.div>
  );
}
