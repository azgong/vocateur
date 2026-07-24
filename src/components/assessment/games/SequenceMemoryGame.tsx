"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GAMES, GameResult, scoreSequence } from "@/lib/assessment/games";
import { GameShell, makeSkipResult } from "./GameShell";

const GAME = GAMES.find((g) => g.id === "sequence_memory")!;
const GRID = 9;
const START_LEN = 3;
const MAX_LEN = 9;
const FLASH_MS = 520;
const GAP_MS = 200;

type Phase = "ready" | "showing" | "input" | "done";

export function SequenceMemoryGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [sequence, setSequence] = useState<number[]>([]);
  const [litTile, setLitTile] = useState<number | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const [bestLen, setBestLen] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  function playSequence(seq: number[]) {
    setPhase("showing");
    setLitTile(null);
    seq.forEach((tile, i) => {
      timersRef.current.push(
        setTimeout(() => setLitTile(tile), i * (FLASH_MS + GAP_MS)),
        setTimeout(() => setLitTile(null), i * (FLASH_MS + GAP_MS) + FLASH_MS),
      );
    });
    timersRef.current.push(
      setTimeout(() => {
        setInputIndex(0);
        setPhase("input");
      }, seq.length * (FLASH_MS + GAP_MS) + 150),
    );
  }

  function startRound(len: number) {
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * GRID));
    setSequence(seq);
    playSequence(seq);
  }

  function handleTile(tile: number) {
    if (phase !== "input") return;
    if (tile === sequence[inputIndex]) {
      const next = inputIndex + 1;
      if (next >= sequence.length) {
        const completedLen = sequence.length;
        setBestLen(completedLen);
        if (completedLen >= MAX_LEN) {
          setPhase("done");
          return;
        }
        timersRef.current.push(setTimeout(() => startRound(completedLen + 1), 550));
        setPhase("showing");
      } else {
        setInputIndex(next);
      }
    } else {
      setWrongTile(tile);
      timersRef.current.push(setTimeout(() => setWrongTile(null), 450));
      setPhase("done");
    }
  }

  function finish() {
    const level = Math.max(bestLen, START_LEN - 1);
    onComplete({ gameId: "sequence_memory", rawMetric: level, score: scoreSequence(level) });
  }

  return (
    <GameShell game={GAME} onSkip={() => onComplete(makeSkipResult("sequence_memory"))}>
      {phase === "ready" ? (
        <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-border-strong bg-surface">
          <p className="text-sm text-foreground/60">
            Tiles light up in order. Repeat the order. Starts at {START_LEN}, grows each round.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => startRound(START_LEN)}
            className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white"
          >
            Start
          </motion.button>
        </div>
      ) : phase === "done" ? (
        <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-accent/40 bg-accent/[0.06]">
          <p className="text-4xl font-semibold tabular-nums text-accent">
            {bestLen > 0 ? `${bestLen} in a row` : "Warmed up"}
          </p>
          <p className="text-sm text-foreground/60">
            {bestLen >= 7
              ? "Elite ordered recall. Protocol-heavy work would suit you."
              : bestLen >= 5
                ? "Strong working memory, comfortably above typical."
                : "Sequences are one channel. The scenarios carry more weight."}
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
            {phase === "showing" ? "Watch the pattern…" : `Your turn: ${inputIndex} of ${sequence.length}`}
          </p>
          <div className="grid w-full max-w-sm grid-cols-3 gap-2.5">
            {Array.from({ length: GRID }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleTile(i)}
                disabled={phase !== "input"}
                className={`aspect-square rounded-2xl border-2 transition-colors duration-150 ${
                  litTile === i
                    ? "border-accent bg-accent shadow-[0_0_24px_-6px_var(--accent)]"
                    : wrongTile === i
                      ? "border-quadrant-c bg-quadrant-c/40"
                      : "border-border-subtle bg-surface hover:border-border-strong"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </GameShell>
  );
}
