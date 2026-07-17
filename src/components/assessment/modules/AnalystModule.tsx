"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { QUADRANT_META } from "@/lib/assessment/quadrantStyle";

const Q = QUADRANT_META.a;

const TIME_LIMIT_MS = 20000;

const REGIONS = [
  { name: "North", growth: 4.2 },
  { name: "South", growth: 3.8 },
  { name: "East", growth: 4.5 },
  { name: "West", growth: 38.1 },
  { name: "Central", growth: 4.0 },
  { name: "Pacific", growth: 4.3 },
];

const ANOMALY = "West";

export function AnalystModule({ onComplete }: { onComplete: (log: ModuleLog) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revisions, setRevisions] = useState(0);
  const [msLeft, setMsLeft] = useState(TIME_LIMIT_MS);
  const [confirmed, setConfirmed] = useState(false);
  const startRef = useRef(0);
  const firstSelectRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (confirmed) return;
    const interval = setInterval(() => {
      setMsLeft((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          clearInterval(interval);
          finish(selected);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed, selected]);

  function handleSelect(region: string) {
    if (confirmed) return;
    if (firstSelectRef.current && selected !== region) {
      setRevisions((r) => r + 1);
    }
    firstSelectRef.current = true;
    setSelected(region);
  }

  function finish(finalSelection: string | null) {
    setConfirmed(true);
    const timeTakenMs = Date.now() - startRef.current;
    const correct = finalSelection === ANOMALY;

    const traitContribution: Partial<TraitVector> = {
      quadrant_a: correct ? 0.95 : 0.55,
      quadrant_b: 0.15,
      quadrant_c: 0.05,
      quadrant_d: 0.1,
      pace_preference: Math.max(0, 1 - timeTakenMs / TIME_LIMIT_MS),
      risk_tolerance: revisions === 0 ? 0.6 : 0.4,
    };

    onComplete({
      moduleId: "analyst",
      timeTakenMs,
      choiceSelected: finalSelection ?? "none",
      revisionsMade: revisions,
      extra: { correct, traitContribution },
    });
  }

  const secondsLeft = Math.ceil(msLeft / 1000);
  const urgent = msLeft < 5000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="flex w-full max-w-lg flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${Q.text}`}>{Q.label}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
            Spot the anomaly
          </h2>
        </div>
        <motion.div
          animate={urgent ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: urgent ? Infinity : 0, duration: 0.6 }}
          className={`rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${
            urgent ? "bg-quadrant-c/15 text-quadrant-c" : "bg-surface-2 text-foreground/60"
          }`}
        >
          0:{secondsLeft.toString().padStart(2, "0")}
        </motion.div>
      </div>

      <p className="text-sm text-foreground/60">
        This quarter&rsquo;s regional revenue growth just came in. One number doesn&rsquo;t belong. Find it before time runs out.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {REGIONS.map((r) => {
          const isSelected = selected === r.name;
          return (
            <motion.button
              key={r.name}
              type="button"
              disabled={confirmed}
              onClick={() => handleSelect(r.name)}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? { scale: 1.03 } : { scale: 1 }}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-5 transition-colors ${
                isSelected
                  ? `${Q.border} bg-quadrant-a/10 ${Q.text} ${Q.ring}`
                  : "border-border-subtle bg-surface hover:border-border-strong"
              }`}
            >
              <span className="text-sm font-medium opacity-70">{r.name}</span>
              <span className="text-xl font-semibold tabular-nums">+{r.growth}%</span>
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
            onClick={() => finish(selected)}
            className={`self-center rounded-full px-8 py-3 text-sm font-medium text-white ${Q.bg} ${Q.ring}`}
          >
            Lock in {selected}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
