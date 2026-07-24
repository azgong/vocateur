"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GAMES, GameResult, scoreTyping } from "@/lib/assessment/games";
import { GameShell, makeSkipResult } from "./GameShell";

const GAME = GAMES.find((g) => g.id === "typing")!;

const SENTENCES = [
  "The best career advice is specific, timely, and grounded in what you actually do well.",
  "Strong teams hire for judgment first and teach the tools once people are in the door.",
  "A clear plan beats a perfect one, because a clear plan actually gets executed this week.",
];

type Phase = "ready" | "playing" | "done";

export function TypingGame({ onComplete }: { onComplete: (result: GameResult) => void }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [sentence] = useState(() => SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
  const [typed, setTyped] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(1);
  const startRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  function start() {
    setPhase("playing");
    startRef.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleChange(value: string) {
    if (phase !== "playing") return;
    setTyped(value);
    if (value.length >= sentence.length) {
      const minutes = (Date.now() - startRef.current) / 60000;
      let correct = 0;
      for (let i = 0; i < sentence.length; i++) {
        if (value[i] === sentence[i]) correct++;
      }
      const acc = correct / sentence.length;
      const grossWpm = value.length / 5 / Math.max(minutes, 1 / 60);
      setWpm(Math.round(grossWpm));
      setAccuracy(acc);
      setPhase("done");
    }
  }

  function finish() {
    onComplete({ gameId: "typing", rawMetric: wpm, score: scoreTyping(wpm, accuracy) });
  }

  return (
    <GameShell game={GAME} onSkip={() => onComplete(makeSkipResult("typing"))}>
      {phase === "ready" ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-border-strong bg-surface">
          <p className="max-w-sm text-center text-sm text-foreground/60">
            One sentence. The clock starts the moment you begin. Accuracy counts as much as speed.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={start}
            className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white"
          >
            Show me the sentence
          </motion.button>
        </div>
      ) : phase === "done" ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-accent/40 bg-accent/[0.06]">
          <p className="text-4xl font-semibold tabular-nums text-accent">{wpm} wpm</p>
          <p className="text-sm text-foreground/60">
            {Math.round(accuracy * 100)}% accuracy.{" "}
            {wpm * accuracy >= 65
              ? "Serious throughput."
              : wpm * accuracy >= 40
                ? "Comfortably quick and clean."
                : "Speed grows fast with practice. Accuracy matters more."}
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
        <div className="flex w-full flex-col gap-3">
          <p className="rounded-2xl border border-border-subtle bg-surface-2 p-4 font-[family-name:var(--font-mono)] text-sm leading-relaxed">
            {sentence.split("").map((ch, i) => (
              <span
                key={i}
                className={
                  i < typed.length
                    ? typed[i] === ch
                      ? "text-quadrant-b"
                      : "bg-quadrant-c/30 text-quadrant-c"
                    : "text-foreground/60"
                }
              >
                {ch}
              </span>
            ))}
          </p>
          <textarea
            ref={inputRef}
            value={typed}
            onChange={(e) => handleChange(e.target.value)}
            rows={3}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Type here…"
            className="resize-none rounded-2xl border-2 border-border-strong bg-background p-4 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-foreground outline-none focus:border-accent"
          />
        </div>
      )}
    </GameShell>
  );
}
