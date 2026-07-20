"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { TimedSelectSceneConfig } from "@/lib/assessment/scenes";
import { QUADRANT_META, CHAPTER_QUADRANT } from "@/lib/assessment/quadrantStyle";

export function TimedSelectScene({
  scene,
  onComplete,
}: {
  scene: TimedSelectSceneConfig;
  onComplete: (log: ModuleLog) => void;
}) {
  const Q = QUADRANT_META[CHAPTER_QUADRANT[scene.chapterId]];
  const [selected, setSelected] = useState<string | null>(null);
  const [revisions, setRevisions] = useState(0);
  const [msLeft, setMsLeft] = useState(scene.timeLimitMs);
  const [confirmed, setConfirmed] = useState(false);
  const startRef = useRef(0);
  const firstSelectRef = useRef(false);
  const selectedRef = useRef<string | null>(null);

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
          finish(selectedRef.current);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed]);

  function handleSelect(id: string) {
    if (confirmed) return;
    if (firstSelectRef.current && selected !== id) {
      setRevisions((r) => r + 1);
    }
    firstSelectRef.current = true;
    selectedRef.current = id;
    setSelected(id);
  }

  function finish(finalSelection: string | null) {
    setConfirmed(true);
    const timeTakenMs = Date.now() - startRef.current;
    const item = scene.items.find((i) => i.id === finalSelection);
    const correct = item?.correct ?? false;
    const base = correct ? scene.correctContribution : scene.incorrectContribution;

    const traitContribution: Partial<TraitVector> = {
      ...base,
      pace_preference: Math.max(0, 1 - timeTakenMs / scene.timeLimitMs),
      risk_tolerance: revisions === 0 ? 0.6 : 0.4,
    };

    onComplete({
      chapterId: scene.chapterId,
      sceneId: scene.id,
      timeTakenMs,
      choiceSelected: finalSelection ?? "none",
      revisionsMade: revisions,
      extra: { correct, traitContribution, description: scene.description },
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
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">{scene.title}</h2>
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

      <p className="text-sm text-foreground/60">{scene.prompt}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {scene.items.map((item) => {
          const isSelected = selected === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              disabled={confirmed}
              onClick={() => handleSelect(item.id)}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? { scale: 1.03 } : { scale: 1 }}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-5 text-center transition-colors ${
                isSelected
                  ? `${Q.border} ${Q.bgSoft} ${Q.text} ${Q.ring}`
                  : "border-border-subtle bg-surface hover:border-border-strong"
              }`}
            >
              <span className="text-sm font-medium opacity-70">{item.primaryLabel}</span>
              {item.secondaryLabel && <span className="text-xl font-semibold tabular-nums">{item.secondaryLabel}</span>}
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
            className={`self-center rounded-full px-8 py-3 text-sm font-medium ${Q.buttonText} ${Q.bg} ${Q.ring}`}
          >
            {scene.confirmVerb} {scene.items.find((i) => i.id === selected)?.primaryLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
