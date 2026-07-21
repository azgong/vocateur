"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { AllocationSceneConfig } from "@/lib/assessment/scenes";
import { QUADRANT_META, CHAPTER_QUADRANT } from "@/lib/assessment/quadrantStyle";

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}

export function AllocationScene({
  scene,
  onComplete,
}: {
  scene: AllocationSceneConfig;
  onComplete: (log: ModuleLog) => void;
}) {
  const Q = QUADRANT_META[CHAPTER_QUADRANT[scene.chapterId]];
  const evenShare = Math.round(100 / scene.categories.length);
  const [allocations, setAllocations] = useState<Record<string, number>>(() =>
    Object.fromEntries(scene.categories.map((c) => [c.id, evenShare])),
  );
  const startRef = useRef(0);
  const adjustmentsRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  function handleChange(categoryId: string, newValue: number) {
    setAllocations((prev) => {
      const others = scene.categories.map((c) => c.id).filter((id) => id !== categoryId);
      const remaining = 100 - newValue;
      const othersTotal = others.reduce((sum, id) => sum + prev[id], 0);

      const next = { ...prev, [categoryId]: newValue };
      if (othersTotal === 0) {
        others.forEach((id) => (next[id] = remaining / others.length));
      } else {
        others.forEach((id) => {
          next[id] = clamp(Math.round((prev[id] / othersTotal) * remaining));
        });
      }
      const drift = 100 - Object.values(next).reduce((a, b) => a + b, 0);
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
    const concentration = shares.reduce((sum, s) => sum + s * s, 0);
    const balanceShare = allocations[scene.balanceCategoryId] / 100;

    const traitContribution: Partial<TraitVector> = {
      [scene.concentrationQuadrant]: 0.5 + concentration * 0.45,
      [scene.balanceQuadrant]: 0.15 + (1 - concentration) * 0.5,
      pace_preference: Math.max(0, 1 - timeTakenMs / 45000),
      risk_tolerance: Math.min(1, Math.max(0, 0.3 + concentration * 0.5 - balanceShare * 0.3)),
    };

    const revisionsMade = Math.max(0, adjustmentsRef.current - scene.categories.length);

    onComplete({
      chapterId: scene.chapterId,
      sceneId: scene.id,
      timeTakenMs,
      choiceSelected: scene.categories.map((c) => `${c.id}:${allocations[c.id]}`).join(","),
      revisionsMade,
      extra: { allocations, traitContribution, description: scene.description },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full max-w-2xl flex-col gap-6"
    >
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">{scene.title}</h2>

      <p className="text-sm text-foreground/60">{scene.prompt}</p>

      <div className="flex flex-col gap-5">
        {scene.categories.map((c) => (
          <div key={c.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-medium">{c.label}</span>
              <span className={`tabular-nums font-semibold ${Q.text}`}>{allocations[c.id]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={allocations[c.id]}
              onChange={(e) => handleChange(c.id, Number(e.target.value))}
              onPointerUp={handleCommit}
              className="w-full"
              style={{ accentColor: `var(--quadrant-${CHAPTER_QUADRANT[scene.chapterId]})` }}
            />
            <span className="text-xs text-foreground/40">{c.hint}</span>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={finish}
        className={`self-center rounded-full px-8 py-3 text-sm font-medium ${Q.buttonText} ${Q.bg} ${Q.ring}`}
      >
        {scene.confirmLabel}
      </motion.button>
    </motion.div>
  );
}
