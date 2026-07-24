"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { DragRankSceneConfig } from "@/lib/assessment/scenes";
import { QUADRANT_META, CHAPTER_QUADRANT } from "@/lib/assessment/quadrantStyle";
import { correctnessScore } from "./RankingScene";

function DragHandleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0 opacity-40">
      <circle cx="8" cy="5" r="2" />
      <circle cx="16" cy="5" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="12" r="2" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="16" cy="19" r="2" />
    </svg>
  );
}

export function DragRankScene({
  scene,
  onComplete,
}: {
  scene: DragRankSceneConfig;
  onComplete: (log: ModuleLog) => void;
}) {
  const Q = QUADRANT_META[CHAPTER_QUADRANT[scene.chapterId]];
  const [order, setOrder] = useState<string[]>(() => scene.items.map((i) => i.id));
  const [confirmed, setConfirmed] = useState(false);
  const dragCountRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  function handleReorder(next: string[]) {
    if (confirmed) return;
    dragCountRef.current += 1;
    setOrder(next);
  }

  function finish() {
    if (confirmed) return;
    setConfirmed(true);
    const timeTakenMs = Date.now() - startRef.current;
    const score = correctnessScore(order, scene.correctOrder);

    const traitContribution: Partial<TraitVector> = {
      [scene.primaryQuadrant]: 0.5 + 0.45 * score,
      [scene.secondaryQuadrant]: 0.2 + 0.3 * score,
      pace_preference: Math.max(0.2, 1 - timeTakenMs / 60000),
      // Confirming the initial order without touching it reads as gut-call
      // confidence; rearranging reads as deliberate checking.
      risk_tolerance: dragCountRef.current === 0 ? 0.6 : 0.4,
    };

    onComplete({
      chapterId: scene.chapterId,
      sceneId: scene.id,
      timeTakenMs,
      choiceSelected: order.join(">"),
      revisionsMade: dragCountRef.current,
      extra: { correctnessScore: score, traitContribution, description: scene.description },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full max-w-2xl flex-col gap-6 lg:max-w-3xl xl:max-w-4xl"
    >
      <h2 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight lg:text-4xl">
        {scene.title}
      </h2>

      <p className="text-sm text-foreground/60">{scene.prompt}</p>

      <Reorder.Group axis="y" values={order} onReorder={handleReorder} className="flex list-none flex-col gap-2">
        {order.map((id, index) => {
          const item = scene.items.find((i) => i.id === id)!;
          return (
            <Reorder.Item
              key={id}
              value={id}
              whileDrag={{ scale: 1.02, zIndex: 10 }}
              className={`flex cursor-grab items-center gap-4 rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 select-none active:cursor-grabbing ${
                confirmed ? "pointer-events-none opacity-70" : "hover:border-border-strong"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${Q.buttonText} ${Q.bg}`}
              >
                {index + 1}
              </span>
              <span className="flex-1">
                <span className="block font-medium">{item.primaryLabel}</span>
                <span className="block text-sm text-foreground/60">{item.secondaryLabel}</span>
              </span>
              <DragHandleIcon />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {!confirmed && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={finish}
          className={`self-center rounded-full px-8 py-3 text-sm font-medium ${Q.buttonText} ${Q.bg} ${Q.ring}`}
        >
          {scene.confirmLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
