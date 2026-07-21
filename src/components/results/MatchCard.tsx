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
  const isTop = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: rank * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-3 rounded-2xl border p-6 ${
        isTop
          ? "border-accent bg-accent/[0.06] shadow-[0_0_40px_-12px_var(--accent)]"
          : "border-border-subtle bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`text-xs font-medium uppercase tracking-wide ${isTop ? "text-accent" : "text-foreground/40"}`}>
            {isTop ? "Top match" : `Match #${rank}`}
          </span>
          <h3 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">{title}</h3>
        </div>
        <div
          className={`flex shrink-0 flex-col items-center justify-center rounded-full px-3 py-2 ${
            isTop ? "bg-accent text-white shadow-[0_0_20px_-4px_var(--accent)]" : "bg-surface-2 text-foreground"
          }`}
        >
          <span className="text-lg font-bold leading-none">{fitScore}%</span>
          <span className="text-[10px] leading-none opacity-70">fit</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground/60">{rationale}</p>
    </motion.div>
  );
}
