"use client";

import { motion } from "framer-motion";

export function MatchCard({
  rank,
  title,
  fitScore,
  rationale,
}: {
  rank: number;
  title: string;
  fitScore: number;
  rationale: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.1 }}
      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Match #{rank}</span>
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-center justify-center rounded-full bg-zinc-900 px-3 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
          <span className="text-lg font-bold leading-none">{fitScore}%</span>
          <span className="text-[10px] leading-none opacity-70">fit</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{rationale}</p>
    </motion.div>
  );
}
