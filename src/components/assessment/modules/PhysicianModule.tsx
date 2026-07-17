"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { QUADRANT_META } from "@/lib/assessment/quadrantStyle";

const Q = QUADRANT_META.b;

type Case = { id: string; complaint: string; vitals: string };

const CASES: Case[] = [
  { id: "allergic", complaint: "Severe allergic reaction", vitals: "Face and throat swelling, difficulty breathing" },
  { id: "chest_pain", complaint: "Chest pain and shortness of breath", vitals: "Sweating, pain radiating to left arm" },
  { id: "meningitis", complaint: "High fever, confusion", vitals: "104°F, stiff neck, disoriented" },
  { id: "wrist", complaint: "Wrist injury after a fall", vitals: "Visible deformity, pain 6/10, alert" },
  { id: "ankle", complaint: "Twisted ankle", vitals: "Mild swelling, able to bear some weight" },
];

// Most urgent first — used only for scoring, never shown to the user.
const CORRECT_ORDER = ["allergic", "chest_pain", "meningitis", "wrist", "ankle"];

// Deterministic shuffle so the display order isn't the correct order.
const DISPLAY_ORDER = [CASES[3], CASES[1], CASES[4], CASES[0], CASES[2]];

function correctnessScore(order: string[]): number {
  let inversions = 0;
  for (let i = 0; i < order.length; i++) {
    for (let j = i + 1; j < order.length; j++) {
      const correctI = CORRECT_ORDER.indexOf(order[i]);
      const correctJ = CORRECT_ORDER.indexOf(order[j]);
      if (correctI > correctJ) inversions++;
    }
  }
  const maxInversions = (order.length * (order.length - 1)) / 2;
  return 1 - inversions / maxInversions;
}

export function PhysicianModule({ onComplete }: { onComplete: (log: ModuleLog) => void }) {
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
    if (next.length === CASES.length) {
      finishedRef.current = true;
      finish(next);
    }
  }

  function finish(finalOrder: string[]) {
    // eslint-disable-next-line react-hooks/purity -- final timestamp for a user-triggered completion, not render output
    const timeTakenMs = Date.now() - startRef.current;
    const score = correctnessScore(finalOrder);

    const gaps = clickTimesRef.current.map((t, i) =>
      i === 0 ? t - startRef.current : t - clickTimesRef.current[i - 1],
    );
    const avgGapMs = gaps.reduce((a, b) => a + b, 0) / gaps.length;

    const traitContribution: Partial<TraitVector> = {
      quadrant_a: 0.2,
      quadrant_b: 0.5 + 0.45 * score,
      quadrant_c: 0.15,
      quadrant_d: 0.05,
      pace_preference: Math.max(0, 1 - avgGapMs / 6000),
      risk_tolerance: avgGapMs < 2000 ? 0.55 : 0.35,
    };

    onComplete({
      moduleId: "physician",
      timeTakenMs,
      choiceSelected: finalOrder.join(">"),
      revisionsMade: 0,
      extra: { correctnessScore: score, traitContribution },
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
        <div>
          <p className={`text-sm font-medium ${Q.text}`}>{Q.label}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
            Triage the incoming cases
          </h2>
        </div>
        <div className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold tabular-nums text-foreground/60">
          {(elapsedMs / 1000).toFixed(1)}s
        </div>
      </div>

      <p className="text-sm text-foreground/60">
        Five patients just arrived. Tap them in the order you&rsquo;d see them, most urgent first. Once you place a case, it&rsquo;s locked — no undo.
      </p>

      <div className="flex flex-col gap-2">
        {DISPLAY_ORDER.map((c) => {
          const position = placed.indexOf(c.id);
          const isPlaced = position !== -1;
          return (
            <motion.button
              key={c.id}
              type="button"
              disabled={isPlaced}
              onClick={() => handlePlace(c.id)}
              whileTap={{ scale: 0.98 }}
              animate={isPlaced ? { opacity: 0.5, x: 8, borderColor: "var(--quadrant-b)" } : { opacity: 1, x: 0 }}
              className="flex items-center gap-4 rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 text-left transition-colors disabled:cursor-not-allowed hover:border-border-strong"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${Q.bg}`}>
                {isPlaced ? position + 1 : ""}
              </span>
              <span>
                <span className="block font-medium">{c.complaint}</span>
                <span className="block text-sm text-foreground/60">{c.vitals}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
