"use client";

import { motion } from "framer-motion";
import { ViewRoadmapButton } from "./ViewRoadmapButton";

export function MatchCard({
  rank,
  title,
  fitScore,
  rationale,
  highlights,
  roadmapLink,
  selectable,
  selected,
  onToggleSelect,
}: {
  rank: number;
  title: string;
  fitScore: number;
  rationale: string;
  highlights?: string[];
  roadmapLink?: { sessionId: string; occupationId: string };
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
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
          : selected
            ? "border-quadrant-b bg-quadrant-b/[0.06]"
            : "border-border-subtle bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {selectable && (
            <button
              type="button"
              onClick={onToggleSelect}
              aria-pressed={selected}
              aria-label={selected ? "Remove from comparison" : "Add to comparison"}
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                selected ? "border-quadrant-b bg-quadrant-b text-white" : "border-border-strong bg-transparent"
              }`}
            >
              {selected && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}
          <div>
            <span className={`text-xs font-medium uppercase tracking-wide ${isTop ? "text-accent" : "text-foreground/40"}`}>
              {isTop ? "Top match" : `Match #${rank}`}
            </span>
            <h3 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">{title}</h3>
          </div>
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
      {highlights && highlights.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">Where you did well</span>
          {highlights.map((h) => (
            <span
              key={h}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isTop ? "bg-accent/10 text-accent" : "bg-surface-2 text-foreground/70"
              }`}
            >
              {h}
            </span>
          ))}
        </div>
      )}
      {roadmapLink && !isTop && (
        <ViewRoadmapButton sessionId={roadmapLink.sessionId} occupationId={roadmapLink.occupationId} variant="compact" />
      )}
    </motion.div>
  );
}
