"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GAMES, GameResult, scoreVisual } from "@/lib/assessment/games";
import { GameShell, makeSkipResult } from "./GameShell";

const GAME = GAMES.find((g) => g.id === "visual_memory")!;
const SIZE = 16; // 4x4
const START_TILES = 3;
const MAX_TILES = 8;
const SHOW_MS = 1200;
const LIVES = 3;

type Phase = "ready" | "showing" | "input" | "done";

function pickTargets(count: number): Set<number> {
  const picks = new Set<number>();
  while (picks.size < count) picks.add(Math.floor(Math.random() * SIZE));
  return picks;
}

export function VisualMemoryGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [targets, setTargets] = useState<Set<number>>(new Set());
  const [found, setFound] = useState<Set<number>>(new Set());
  const [misses, setMisses] = useState<Set<number>>(new Set());
  const [tileCount, setTileCount] = useState(START_TILES);
  const [lives, setLives] = useState(LIVES);
  const [bestCount, setBestCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  function startRound(count: number) {
    setTargets(pickTargets(count));
    setFound(new Set());
    setMisses(new Set());
    setPhase("showing");
    timersRef.current.push(setTimeout(() => setPhase("input"), SHOW_MS));
  }

  function handleTile(i: number) {
    if (phase !== "input" || found.has(i) || misses.has(i)) return;
    if (targets.has(i)) {
      const nextFound = new Set(found).add(i);
      setFound(nextFound);
      if (nextFound.size >= targets.size) {
        const completed = targets.size;
        setBestCount(completed);
        if (completed >= MAX_TILES) {
          setPhase("done");
          return;
        }
        const nextCount = completed + 1;
        setTileCount(nextCount);
        setPhase("showing");
        timersRef.current.push(setTimeout(() => startRound(nextCount), 600));
      }
    } else {
      const nextMisses = new Set(misses).add(i);
      setMisses(nextMisses);
      const remaining = lives - 1;
      setLives(remaining);
      if (remaining <= 0) setPhase("done");
      else {
        // Failed round: retry the same tile count with a new layout.
        setPhase("showing");
        timersRef.current.push(setTimeout(() => startRound(tileCount), 700));
      }
    }
  }

  function finish() {
    const level = Math.max(bestCount, START_TILES - 1);
    onComplete({ gameId: "visual_memory", rawMetric: level, score: scoreVisual(level) });
  }

  return (
    <GameShell game={GAME} onSkip={() => onComplete(makeSkipResult("visual_memory"))}>
      {phase === "ready" ? (
        <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-border-strong bg-surface">
          <p className="max-w-sm text-center text-sm text-foreground/60">
            Some tiles flash for about a second. Tap every tile that was lit. Three lives.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => startRound(START_TILES)}
            className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white"
          >
            Start
          </motion.button>
        </div>
      ) : phase === "done" ? (
        <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-accent/40 bg-accent/[0.06]">
          <p className="text-4xl font-semibold tabular-nums text-accent">
            {bestCount > 0 ? `${bestCount} tiles` : "Warmed up"}
          </p>
          <p className="text-sm text-foreground/60">
            {bestCount >= 7
              ? "Excellent spatial recall. Visual-heavy fields would use this daily."
              : bestCount >= 5
                ? "Strong visual memory, above the typical range."
                : "Visual recall is one channel of many. Keep going."}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={finish}
            className="mt-2 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white"
          >
            Next game
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="h-5 text-sm font-medium text-foreground/60">
            {phase === "showing" ? "Memorize the lit tiles…" : `Recall them. Lives: ${"●".repeat(lives)}`}
          </p>
          <div className="grid w-full max-w-sm grid-cols-4 gap-2">
            {Array.from({ length: SIZE }, (_, i) => {
              const lit = phase === "showing" && targets.has(i);
              const hit = found.has(i);
              const missed = misses.has(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTile(i)}
                  disabled={phase !== "input"}
                  className={`aspect-square rounded-xl border-2 transition-colors duration-150 ${
                    lit || hit
                      ? "border-accent bg-accent shadow-[0_0_20px_-6px_var(--accent)]"
                      : missed
                        ? "border-quadrant-c bg-quadrant-c/40"
                        : "border-border-subtle bg-surface hover:border-border-strong"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </GameShell>
  );
}
