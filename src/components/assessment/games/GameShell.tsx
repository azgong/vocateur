"use client";

import { motion } from "framer-motion";
import { GameConfig, GameResult } from "@/lib/assessment/games";

/**
 * Shared frame around each Skill Lab game: name, tagline, what it measures,
 * and a skip escape hatch so a broken or unwanted game never blocks the
 * assessment (skips score null and are excluded from matching).
 */
export function GameShell({
  game,
  onSkip,
  children,
}: {
  game: GameConfig;
  onSkip: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full max-w-2xl flex-col gap-5 lg:max-w-3xl"
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Skill Lab</span>
        <h2 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight lg:text-4xl">
          {game.name}
        </h2>
        <p className="mt-1.5 text-sm text-foreground/60">{game.tagline}</p>
      </div>

      {children}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs leading-relaxed text-foreground/40">{game.measures}</p>
        <button
          type="button"
          onClick={onSkip}
          className="shrink-0 text-xs text-foreground/40 underline underline-offset-2 hover:text-foreground/60"
        >
          Skip this game
        </button>
      </div>
    </motion.div>
  );
}

export function makeSkipResult(gameId: GameResult["gameId"]): GameResult {
  return { gameId, rawMetric: 0, score: null };
}
