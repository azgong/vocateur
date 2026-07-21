"use client";

import { useState } from "react";
import { RoadmapMilestone } from "@/lib/assessment/roadmap";

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
    <div className="flex flex-col gap-6">
      {totalItems > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${totalItems ? (doneCount / totalItems) * 100 : 0}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-foreground/50">
            {doneCount} of {totalItems} steps done
          </span>
        </div>
      )}

      <ol className="relative flex flex-col gap-8 border-l-2 border-border-subtle pl-6">
        {milestones.map((m, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_-2px_var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-accent/70">{m.timeframe}</span>
            <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">{m.title}</h3>
            <p className="text-sm leading-relaxed text-foreground/60">{m.description}</p>
            {m.actionItems?.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {m.actionItems.map((item, j) => {
                  const key = `${i}-${j}`;
                  const isDone = !!completed[key];
                  return (
                    <li key={j} className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        aria-pressed={isDone}
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          isDone ? "border-accent bg-accent text-white" : "border-border-strong bg-transparent"
                        }`}
                      >
                        {isDone && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <span className={`text-sm leading-relaxed ${isDone ? "text-foreground/35 line-through" : "text-foreground/60"}`}>
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
