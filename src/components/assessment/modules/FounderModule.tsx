"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";

type CategoryId = "product" | "marketing" | "hiring" | "runway";

const CATEGORIES: { id: CategoryId; label: string; hint: string }[] = [
  { id: "product", label: "Product", hint: "Build the next feature customers are asking for" },
  { id: "marketing", label: "Marketing & Growth", hint: "Spend to acquire more users, fast" },
  { id: "hiring", label: "Hiring", hint: "Bring on people before you're underwater" },
  { id: "runway", label: "Runway / Savings", hint: "Keep cash in the bank in case things go sideways" },
];

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}

export function FounderModule({ onComplete }: { onComplete: (log: ModuleLog) => void }) {
  const [allocations, setAllocations] = useState<Record<CategoryId, number>>({
    product: 25,
    marketing: 25,
    hiring: 25,
    runway: 25,
  });
  const startRef = useRef(0);
  const adjustmentsRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  function handleChange(category: CategoryId, newValue: number) {
    setAllocations((prev) => {
      const others = CATEGORIES.map((c) => c.id).filter((id) => id !== category);
      const remaining = 100 - newValue;
      const othersTotal = others.reduce((sum, id) => sum + prev[id], 0);

      const next = { ...prev, [category]: newValue };
      if (othersTotal === 0) {
        others.forEach((id) => (next[id] = remaining / others.length));
      } else {
        others.forEach((id) => {
          next[id] = clamp(Math.round((prev[id] / othersTotal) * remaining));
        });
      }
      // Fix rounding drift so it always sums to exactly 100.
      const drift = 100 - (Object.values(next) as number[]).reduce((a, b) => a + b, 0);
      next[others[0]] = clamp(next[others[0]] + drift);
      return next;
    });
  }

  function handleCommit() {
    adjustmentsRef.current += 1;
  }

  function finish() {
    const timeTakenMs = Date.now() - startRef.current;
    const shares = Object.values(allocations).map((v) => v / 100);
    const concentration = shares.reduce((sum, s) => sum + s * s, 0); // 0.25 (even) .. 1 (all-in)
    const runwayShare = allocations.runway / 100;

    const traitContribution: Partial<TraitVector> = {
      quadrant_a: 0.25,
      quadrant_b: 0.15 + (1 - concentration) * 0.5,
      quadrant_c: 0.15,
      quadrant_d: 0.5 + concentration * 0.45,
      pace_preference: Math.max(0, 1 - timeTakenMs / 45000),
      risk_tolerance: Math.min(1, Math.max(0, 0.3 + concentration * 0.5 - runwayShare * 0.3)),
    };

    const revisionsMade = Math.max(0, adjustmentsRef.current - CATEGORIES.length);

    onComplete({
      moduleId: "founder",
      timeTakenMs,
      choiceSelected: CATEGORIES.map((c) => `${c.id}:${allocations[c.id]}`).join(","),
      revisionsMade,
      extra: { allocations, traitContribution },
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
        <p className="text-sm font-medium text-zinc-500">Quadrant D · Experimental</p>
        <h2 className="text-2xl font-semibold tracking-tight">Allocate your runway</h2>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        You&rsquo;ve got 100 points of budget and six months of runway left. Split it however you want — there&rsquo;s no
        correct answer here.
      </p>

      <div className="flex flex-col gap-5">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-medium">{c.label}</span>
              <span className="tabular-nums text-zinc-500">{allocations[c.id]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={allocations[c.id]}
              onChange={(e) => handleChange(c.id, Number(e.target.value))}
              onPointerUp={handleCommit}
              className="w-full accent-zinc-900 dark:accent-zinc-100"
            />
            <span className="text-xs text-zinc-400">{c.hint}</span>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={finish}
        className="self-center rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Ship this plan
      </motion.button>
    </motion.div>
  );
}
