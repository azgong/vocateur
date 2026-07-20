"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { RankingSceneConfig } from "@/lib/assessment/scenes";
import { QUADRANT_META, CHAPTER_QUADRANT } from "@/lib/assessment/quadrantStyle";

function correctnessScore(order: string[], correctOrder: string[]): number {
  let inversions = 0;
  for (let i = 0; i < order.length; i++) {
    for (let j = i + 1; j < order.length; j++) {
      const correctI = correctOrder.indexOf(order[i]);
      const correctJ = correctOrder.indexOf(order[j]);
      if (correctI > correctJ) inversions++;
    }
  }
  const maxInversions = (order.length * (order.length - 1)) / 2;
  return 1 - inversions / maxInversions;
}

export function RankingScene({
  scene,
  onComplete,
}: {
  scene: RankingSceneConfig;
  onComplete: (log: ModuleLog) => void;
}) {
  const Q = QUADRANT_META[CHAPTER_QUADRANT[scene.chapterId]];
  const [placed, setPlaced] = useState<string[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(0);
  const clickTimesRef = useRef<number[]>([]);
  const finishedRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
    const interval = setInterval(() => setElapsedMs(Date.now() - startRef.current), 100);
    return () => clearInterval(interval);
  }, []);

  function handlePlace(id: string) {
    if (placed.includes(id) || finishedRef.current) return;
    // eslint-disable-next-line react-hooks/purity -- timestamp for a user click, not render output
    clickTimesRef.current.push(Date.now());
    const next = [...placed, id];
    setPlaced(next);
    if (next.length === scene.displayOrder.length) {
      finishedRef.current = true;
      finish(next);
    }
  }

  function finish(finalOrder: string[]) {
    // eslint-disable-next-line react-hooks/purity -- final timestamp for a user-triggered completion, not render output
    const timeTakenMs = Date.now() - startRef.current;
    const score = correctnessScore(finalOrder, scene.correctOrder);

    const gaps = clickTimesRef.current.map((t, i) =>
      i === 0 ? t - startRef.current : t - clickTimesRef.current[i - 1],
    );
    const avgGapMs = gaps.reduce((a, b) => a + b, 0) / gaps.length;

    const traitContribution: Partial<TraitVector> = {
      [scene.primaryQuadrant]: 0.5 + 0.45 * score,
      [scene.secondaryQuadrant]: 0.2 + 0.3 * score,
      pace_preference: Math.max(0, 1 - avgGapMs / 6000),
      risk_tolerance: avgGapMs < 2000 ? 0.55 : 0.35,
    };

    onComplete({
      chapterId: scene.chapterId,
      sceneId: scene.id,
      timeTakenMs,
      choiceSelected: finalOrder.join(">"),
      revisionsMade: 0,
      extra: { correctnessScore: score, traitContribution, description: scene.description },
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
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">{scene.title}</h2>
        <div className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold tabular-nums text-foreground/60">
          {(elapsedMs / 1000).toFixed(1)}s
        </div>
      </div>

      <p className="text-sm text-foreground/60">{scene.prompt}</p>

      <div className="flex flex-col gap-2">
        {scene.displayOrder.map((item) => {
          const position = placed.indexOf(item.id);
          const isPlaced = position !== -1;
          return (
            <motion.button
              key={item.id}
              type="button"
              disabled={isPlaced}
              onClick={() => handlePlace(item.id)}
              whileTap={{ scale: 0.98 }}
              animate={isPlaced ? { opacity: 0.5, x: 8 } : { opacity: 1, x: 0 }}
              className="flex items-center gap-4 rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 text-left transition-colors disabled:cursor-not-allowed hover:border-border-strong"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${Q.buttonText} ${Q.bg}`}>
                {isPlaced ? position + 1 : ""}
              </span>
              <span>
                <span className="block font-medium">{item.primaryLabel}</span>
                <span className="block text-sm text-foreground/60">{item.secondaryLabel}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
