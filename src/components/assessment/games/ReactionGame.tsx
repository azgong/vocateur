"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GAMES, GameResult, scoreReaction } from "@/lib/assessment/games";
import { GameShell, makeSkipResult } from "./GameShell";

const ROUNDS = 3;
const GAME = GAMES.find((g) => g.id === "reaction")!;

type Phase = "ready" | "waiting" | "go" | "early" | "between" | "done";

export function ReactionGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [times, setTimes] = useState<number[]>([]);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const goAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function armRound() {
    setPhase("waiting");
    const delay = 1200 + Math.random() * 2300;
    timerRef.current = setTimeout(() => {
      goAtRef.current = performance.now();
      setPhase("go");
    }, delay);
  }

  function handlePress() {
    if (phase === "ready" || phase === "between" || phase === "early") {
      armRound();
      return;
    }
    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("early");
      return;
    }
    if (phase === "go") {
      const ms = Math.round(performance.now() - goAtRef.current);
      const next = [...times, ms];
      setTimes(next);
      setLastMs(ms);
      setPhase(next.length >= ROUNDS ? "done" : "between");
    }
  }

  function median(nums: number[]) {
    const sorted = [...nums].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }

  function finish() {
    const med = median(times);
    onComplete({ gameId: "reaction", rawMetric: med, score: scoreReaction(med) });
  }

  const medianMs = times.length > 0 ? median(times) : null;

  return (
    <GameShell game={GAME} onSkip={() => onComplete(makeSkipResult("reaction"))}>
      {phase !== "done" ? (
        <motion.button
          type="button"
          onClick={handlePress}
          whileTap={{ scale: 0.99 }}
          className={`flex h-64 w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 text-lg font-semibold transition-colors ${
            phase === "go"
              ? "border-quadrant-b bg-quadrant-b/20 text-quadrant-b"
              : phase === "early"
                ? "border-quadrant-c bg-quadrant-c/10 text-quadrant-c"
                : "border-border-strong bg-surface text-foreground/70"
          }`}
        >
          {phase === "ready" && (
            <>
              <span>Tap to start</span>
              <span className="text-xs font-normal text-foreground/40">
                Wait for green, then tap as fast as you can. {ROUNDS} rounds.
              </span>
            </>
          )}
          {phase === "waiting" && <span className="animate-pulse">Wait for it&hellip;</span>}
          {phase === "go" && <span>GO. Tap now.</span>}
          {phase === "early" && (
            <>
              <span>Too soon.</span>
              <span className="text-xs font-normal">Tap to retry the round.</span>
            </>
          )}
          {phase === "between" && (
            <>
              <span className="tabular-nums">{lastMs} ms</span>
              <span className="text-xs font-normal text-foreground/40">
                Round {times.length} of {ROUNDS} done. Tap for the next one.
              </span>
            </>
          )}
        </motion.button>
      ) : (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-accent/40 bg-accent/[0.06]">
          <p className="text-4xl font-semibold tabular-nums text-accent">{medianMs} ms</p>
          <p className="text-sm text-foreground/60">
            {medianMs !== null && medianMs < 240
              ? "Sharp. Genuinely fast hands."
              : medianMs !== null && medianMs < 330
                ? "Solid reflexes, right in the strong range."
                : "Deliberate. Plenty of careers reward that instead."}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={finish}
            className="mt-2 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white"
          >
            Next game
          </motion.button>
        </div>
      )}
    </GameShell>
  );
}
