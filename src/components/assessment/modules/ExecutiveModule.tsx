"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { QUADRANT_META } from "@/lib/assessment/quadrantStyle";

const Q = QUADRANT_META.c;

type Approach = {
  id: string;
  label: string;
  traitContribution: Partial<TraitVector>;
};

const APPROACHES: Approach[] = [
  {
    id: "private_listen",
    label: "Meet with each of them privately first, before deciding anything.",
    traitContribution: { quadrant_a: 0.3, quadrant_b: 0.3, quadrant_c: 0.85, quadrant_d: 0.2, pace_preference: 0.3, risk_tolerance: 0.35 },
  },
  {
    id: "immediate_compromise",
    label: "Bring them together right now and propose a compromise on the spot.",
    traitContribution: { quadrant_a: 0.15, quadrant_b: 0.2, quadrant_c: 0.75, quadrant_d: 0.45, pace_preference: 0.8, risk_tolerance: 0.65 },
  },
  {
    id: "feelings_first",
    label: "Focus on how each person is feeling before touching the actual disagreement.",
    traitContribution: { quadrant_a: 0.1, quadrant_b: 0.15, quadrant_c: 0.95, quadrant_d: 0.25, pace_preference: 0.25, risk_tolerance: 0.3 },
  },
  {
    id: "escalate",
    label: "Escalate to their manager — you don't have the full picture.",
    traitContribution: { quadrant_a: 0.25, quadrant_b: 0.6, quadrant_c: 0.35, quadrant_d: 0.1, pace_preference: 0.5, risk_tolerance: 0.15 },
  },
];

export function ExecutiveModule({ onComplete }: { onComplete: (log: ModuleLog) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revisions, setRevisions] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const startRef = useRef(0);
  const firstSelectRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  function handleSelect(id: string) {
    if (confirmed) return;
    if (firstSelectRef.current && selected !== id) {
      setRevisions((r) => r + 1);
    }
    firstSelectRef.current = true;
    setSelected(id);
  }

  function finish() {
    if (!selected) return;
    setConfirmed(true);
    const timeTakenMs = Date.now() - startRef.current;
    const approach = APPROACHES.find((a) => a.id === selected)!;

    onComplete({
      moduleId: "executive",
      timeTakenMs,
      choiceSelected: selected,
      revisionsMade: revisions,
      extra: { traitContribution: approach.traitContribution },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="flex w-full max-w-lg flex-col gap-6"
    >
      <div>
        <p className={`text-sm font-medium ${Q.text}`}>{Q.label}</p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
          Mediate the conflict
        </h2>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-surface-2 p-4 text-sm">
        <p>
          <span className="font-semibold">Alex (Slack DM):</span> &ldquo;Jordan keeps rewriting my work without
          telling me. I found out about it in a client meeting. I look incompetent.&rdquo;
        </p>
        <p>
          <span className="font-semibold">Jordan (Slack DM):</span> &ldquo;Alex&rsquo;s draft had errors that
          would&rsquo;ve gone to the client. I fixed it under deadline — there wasn&rsquo;t time to loop back.&rdquo;
        </p>
      </div>

      <p className="text-sm text-foreground/60">You only have these two messages. What do you do?</p>

      <div className="flex flex-col gap-2">
        {APPROACHES.map((a) => {
          const isSelected = selected === a.id;
          return (
            <motion.button
              key={a.id}
              type="button"
              disabled={confirmed}
              onClick={() => handleSelect(a.id)}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? `${Q.border} bg-quadrant-c/10 ${Q.text} ${Q.ring}`
                  : "border-border-subtle bg-surface hover:border-border-strong"
              }`}
            >
              {a.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && !confirmed && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            whileTap={{ scale: 0.97 }}
            onClick={finish}
            className={`self-center rounded-full px-8 py-3 text-sm font-medium text-white ${Q.bg} ${Q.ring}`}
          >
            Go with this
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
