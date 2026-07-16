"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";

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
          <p className="text-sm font-medium text-zinc-500">Quadrant A · Analytical</p>
          <h2 className="text-2xl font-semibold tracking-tight">Spot the anomaly</h2>
        </div>
        <motion.div
          animate={urgent ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: urgent ? Infinity : 0, duration: 0.6 }}
          className={`rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${
            urgent
              ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          0:{secondsLeft.toString().padStart(2, "0")}
        </motion.div>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
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
            className="self-center rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Lock in {selected}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
