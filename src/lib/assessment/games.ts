// Skill Lab: five quick human-benchmark-style games appended to the simulation.
// Each game reports a raw metric plus a normalized 0-1 score; a skipped game
// scores null and is simply excluded from matching, never penalized.

export type GameId = "reaction" | "sequence_memory" | "visual_memory" | "typing" | "precision";

export type GameResult = {
  gameId: GameId;
  /** Game-specific raw number: ms for reaction/precision, level for memory, wpm for typing. */
  rawMetric: number;
  /** Normalized 0-1, null when the game was skipped. */
  score: number | null;
};

export type SkillScores = Record<GameId, number | null>;

export type GameConfig = {
  id: GameId;
  name: string;
  tagline: string;
  measures: string;
};

export const GAMES: GameConfig[] = [
  {
    id: "reaction",
    name: "Reaction",
    tagline: "Wait for the flash. Tap the instant it turns.",
    measures: "Speed under pressure, the reflex layer behind ER medicine, trading floors, and live operations.",
  },
  {
    id: "sequence_memory",
    name: "Sequence",
    tagline: "Watch the pattern. Repeat it back. It grows every round.",
    measures: "Working memory for ordered steps, the muscle behind protocols, procedures, and code.",
  },
  {
    id: "visual_memory",
    name: "Snapshot",
    tagline: "Tiles flash for a second. Rebuild the picture from memory.",
    measures: "Spatial recall, what architects, surgeons, and designers lean on all day.",
  },
  {
    id: "typing",
    name: "Sprint",
    tagline: "One sentence. Type it fast, type it clean.",
    measures: "Execution speed with accuracy, the throughput behind writing-heavy and detail-heavy work.",
  },
  {
    id: "precision",
    name: "Precision",
    tagline: "Targets appear. Hit each one dead center, quickly.",
    measures: "Fine motor control and focus, the steadiness behind surgery, dentistry, and lab work.",
  },
];

export const TOTAL_GAMES = GAMES.length;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** Median reaction over rounds; 160ms is elite, 420ms is the floor. */
export function scoreReaction(medianMs: number): number {
  return clamp01((420 - medianMs) / 260);
}

/** Longest sequence correctly repeated; 3 is the entry bar, 9 is elite. */
export function scoreSequence(level: number): number {
  return clamp01((level - 2) / 7);
}

/** Highest tile count recalled; 3 is the entry bar, 8 is elite. */
export function scoreVisual(level: number): number {
  return clamp01((level - 2) / 6);
}

/** Accuracy-weighted words per minute; 25 effective wpm is the floor, 80 elite. */
export function scoreTyping(wpm: number, accuracy: number): number {
  return clamp01((wpm * accuracy - 25) / 55);
}

/** Average time to hit; 500ms is elite, 1500ms the floor, misses cost 10% each. */
export function scorePrecision(avgHitMs: number, misses: number): number {
  return clamp01((1500 - avgHitMs) / 1000) * clamp01(1 - misses * 0.1);
}

export function toSkillScores(results: GameResult[]): SkillScores {
  const scores: SkillScores = {
    reaction: null,
    sequence_memory: null,
    visual_memory: null,
    typing: null,
    precision: null,
  };
  for (const r of results) {
    if (r.gameId in scores) scores[r.gameId] = r.score;
  }
  return scores;
}

/** Human-readable summary of notable game results, for LLM prompt context. */
export function describeSkillScores(scores: SkillScores | null | undefined): string | null {
  if (!scores) return null;
  const parts: string[] = [];
  const label = (id: GameId) => GAMES.find((g) => g.id === id)?.name ?? id;
  for (const id of Object.keys(scores) as GameId[]) {
    const s = scores[id];
    if (s === null || s === undefined) continue;
    const tier = s >= 0.75 ? "strong" : s >= 0.45 ? "solid" : "developing";
    parts.push(`${label(id)} (${id.replace(/_/g, " ")}): ${tier} (${Math.round(s * 100)}/100)`);
  }
  return parts.length > 0 ? parts.join("; ") : null;
}
