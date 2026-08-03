"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RoadmapMilestone } from "@/lib/assessment/roadmap";

const QUADRANT_CYCLE = [
  { color: "var(--quadrant-a)", ink: "var(--quadrant-a-ink)" },
  { color: "var(--quadrant-e)", ink: "var(--quadrant-e-ink)" },
  { color: "var(--quadrant-b)", ink: "var(--quadrant-b-ink)" },
  { color: "var(--quadrant-d)", ink: "var(--quadrant-d-ink)" },
  { color: "var(--quadrant-c)", ink: "var(--quadrant-c-ink)" },
];

export function MilestoneChecklist({
  roadmapId,
  milestones,
  initialCompleted,
}: {
  roadmapId: string;
  milestones: RoadmapMilestone[];
  initialCompleted: Record<string, boolean>;
}) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(initialCompleted);

  const totalItems = milestones.reduce((sum, m) => sum + (m.actionItems?.length ?? 0), 0);
  const doneCount = Object.values(completed).filter(Boolean).length;
  const progressPct = totalItems ? (doneCount / totalItems) * 100 : 0;

  async function toggle(key: string) {
    const next = !completed[key];
    setCompleted((prev) => ({ ...prev, [key]: next }));
    try {
      await fetch("/api/roadmap/toggle-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId, key, completed: next }),
      });
    } catch {
      setCompleted((prev) => ({ ...prev, [key]: !next }));
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {totalItems > 0 && (
        <div className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-2 p-5 print:hidden">
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border-subtle)" strokeWidth="5" />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 24}
                initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - progressPct / 100) }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">
              {doneCount} of {totalItems} steps done
            </span>
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface sm:w-56">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>
      )}

      <ol className="relative flex flex-col gap-10 pl-4 sm:pl-6">
        <div
          className="absolute top-2 bottom-2 left-[19px] w-[2px] sm:left-[23px]"
          style={{
            background: "linear-gradient(to bottom, var(--quadrant-a), var(--quadrant-e), var(--quadrant-b), var(--quadrant-d), var(--quadrant-c))",
            opacity: 0.35,
          }}
        />
        {milestones.map((m, i) => {
          const quadrant = QUADRANT_CYCLE[i % QUADRANT_CYCLE.length];
          return (
            <motion.li
              key={i}
              className="relative print:break-inside-avoid"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="absolute -left-4 top-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-[0_0_18px_-4px_var(--tw-shadow-color)] sm:-left-6 sm:h-9 sm:w-9"
                style={{
                  background: quadrant.color,
                  color: quadrant.ink,
                  ["--tw-shadow-color" as string]: quadrant.color,
                }}
              >
                {i + 1}
              </span>
              <div className="pl-8 sm:pl-10">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: quadrant.color }}>
                  {m.timeframe}
                </span>
                <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">{m.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/60">{m.description}</p>
                {m.actionItems?.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2 rounded-2xl border border-border-subtle bg-surface-2 p-4">
                    {m.actionItems.map((item, j) => {
                      const key = `${i}-${j}`;
                      const isDone = !!completed[key];
                      return (
                        <li key={j} className="flex items-start gap-2.5">
                          <motion.button
                            type="button"
                            onClick={() => toggle(key)}
                            aria-pressed={isDone}
                            whileTap={{ scale: 0.85 }}
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                              isDone ? "border-accent bg-accent text-white" : "border-border-strong bg-transparent"
                            }`}
                          >
                            {isDone && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </motion.button>
                          <span className={`text-sm leading-relaxed ${isDone ? "text-foreground/35 line-through" : "text-foreground/70"}`}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
