"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GAMES, GameResult, scorePrecision } from "@/lib/assessment/games";
import { GameShell, makeSkipResult } from "./GameShell";

const GAME = GAMES.find((g) => g.id === "precision")!;
const TARGETS = 8;
const TARGET_SIZE = 44; // px

type Phase = "ready" | "playing" | "done";

type TargetPos = { xPct: number; yPct: number };

function randomTarget(): TargetPos {
  return { xPct: 8 + Math.random() * 84, yPct: 10 + Math.random() * 80 };
}

export function PrecisionGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [target, setTarget] = useState<TargetPos>(randomTarget);
  const [hits, setHits] = useState<number[]>([]);
  const [missCount, setMissCount] = useState(0);
  const shownAtRef = useRef(0);

  function start() {
    setPhase("playing");
    setTarget(randomTarget());
    shownAtRef.current = performance.now();
  }

  function handleHit(e: React.MouseEvent) {
    e.stopPropagation();
    const ms = Math.round(performance.now() - shownAtRef.current);
    const next = [...hits, ms];
    setHits(next);
    if (next.length >= TARGETS) {
      setPhase("done");
    } else {
      setTarget(randomTarget());
      shownAtRef.current = performance.now();
    }
  }

  function handleMiss() {
    if (phase !== "playing") return;
    setMissCount((m) => m + 1);
  }

  const avgMs = hits.length > 0 ? Math.round(hits.reduce((a, b) => a + b, 0) / hits.length) : 0;

  function finish() {
    onComplete({ gameId: "precision", rawMetric: avgMs, score: scorePrecision(avgMs, missCount) });
  }

  return (
    <GameShell game={GAME} onSkip={() => onComplete(makeSkipResult("precision"))}>
      {phase === "ready" ? (
        <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-border-strong bg-surface">
          <p className="max-w-sm text-center text-sm text-foreground/60">
            {TARGETS} targets, one at a time. Hit each as fast as you can. Stray clicks count against you.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={start}
            className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white"
          >
            Start
          </motion.button>
        </div>
      ) : phase === "done" ? (
        <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-accent/40 bg-accent/[0.06]">
          <p className="text-4xl font-semibold tabular-nums text-accent">{avgMs} ms</p>
          <p className="text-sm text-foreground/60">
            Average per target, {missCount} stray {missCount === 1 ? "click" : "clicks"}.{" "}
            {avgMs < 700 && missCount <= 1
              ? "Surgeon-steady."
              : avgMs < 1000
                ? "Quick and controlled."
                : "Control beats speed here, and yours held up."}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={finish}
            className="mt-2 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white"
          >
            Finish the lab
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground/60">
            Target {hits.length + 1} of {TARGETS}
          </p>
          <div
            onClick={handleMiss}
            className="relative h-72 w-full cursor-crosshair overflow-hidden rounded-3xl border-2 border-border-strong bg-surface"
          >
            <button
              type="button"
              onClick={handleHit}
              aria-label="target"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-accent bg-accent/30 shadow-[0_0_20px_-4px_var(--accent)] transition-none hover:bg-accent/50"
              style={{
                left: `${target.xPct}%`,
                top: `${target.yPct}%`,
                width: TARGET_SIZE,
                height: TARGET_SIZE,
              }}
            />
          </div>
        </div>
      )}
    </GameShell>
  );
}
