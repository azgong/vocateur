"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MatchCard } from "./MatchCard";

export type ComparableMatch = {
  id: string;
  rank: number;
  title: string;
  fitScore: number;
  rationale: string;
  highlights?: string[];
  roadmapLink?: { sessionId: string; occupationId: string };
  medianSalary: number;
  growthPct: number | null;
  educationLevel: string;
  topSkills: string[];
};

function formatSalary(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

function ComparisonTable({ entries, onClose }: { entries: ComparableMatch[]; onClose: () => void }) {
  const rows: { label: string; render: (m: ComparableMatch) => React.ReactNode }[] = [
    { label: "Fit score", render: (m) => <span className="font-semibold text-accent">{m.fitScore}%</span> },
    { label: "Median salary", render: (m) => formatSalary(m.medianSalary) },
    { label: "Projected growth", render: (m) => (m.growthPct !== null ? `${m.growthPct > 0 ? "+" : ""}${m.growthPct}%` : "No data") },
    { label: "Typical education", render: (m) => m.educationLevel },
    {
      label: "Top skills",
      render: (m) => (
        <div className="flex flex-wrap gap-1.5">
          {m.topSkills.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-foreground/70">
              {s}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-x-auto rounded-3xl border border-border-subtle bg-background p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">Compare matches</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="rounded-full p-2 text-foreground/50 transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="min-w-[560px]">
          <div
            className="grid gap-3 border-b border-border-subtle pb-4"
            style={{ gridTemplateColumns: `140px repeat(${entries.length}, 1fr)` }}
          >
            <div />
            {entries.map((m) => (
              <div key={m.id}>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">Match #{m.rank}</p>
                <p className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">{m.title}</p>
              </div>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.label}
              className="grid items-center gap-3 border-b border-border-subtle py-4 last:border-b-0"
              style={{ gridTemplateColumns: `140px repeat(${entries.length}, 1fr)` }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">{row.label}</p>
              {entries.map((m) => (
                <div key={m.id} className="text-sm text-foreground/80">
                  {row.render(m)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MatchesWithComparison({ matches, enableComparison }: { matches: ComparableMatch[]; enableComparison: boolean }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const selectedEntries = matches.filter((m) => selectedIds.includes(m.id));

  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            rank={m.rank}
            title={m.title}
            fitScore={m.fitScore}
            rationale={m.rationale}
            highlights={m.highlights}
            roadmapLink={m.roadmapLink}
            selectable={enableComparison}
            selected={selectedIds.includes(m.id)}
            onToggleSelect={() => toggle(m.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {enableComparison && selectedIds.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky bottom-6 z-30 mx-auto flex w-fit items-center gap-3 rounded-full border border-quadrant-b/40 bg-background/95 px-5 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm"
          >
            <span className="text-sm text-foreground/70">{selectedIds.length} matches selected</span>
            <button
              type="button"
              onClick={() => setShowComparison(true)}
              className="rounded-full bg-quadrant-b px-4 py-1.5 text-sm font-semibold text-white"
            >
              Compare
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComparison && selectedEntries.length >= 2 && (
          <ComparisonTable entries={selectedEntries} onClose={() => setShowComparison(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
