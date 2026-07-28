// Per-match "where you did well" highlights shown on the results page: the
// thinking style that best explains this specific match, plus a measured
// Skill Lab result when the occupation actually leans on it. Deterministic,
// not LLM-generated, so it's cheap and always available, but not a real
// statistical percentile: skill scores are hand-tuned 0-1 floor/elite curves
// (see games.ts), not benchmarked against other users, so we only ever
// describe them in tier language, never claim a percentile.
import { TraitVector } from "./types";
import { GameId, SkillScores } from "./games";
import { Occupation } from "./matching";

type ThinkingDim = "quadrant_a" | "quadrant_b" | "quadrant_c" | "quadrant_d" | "builder_instinct";

const THINKING_STYLE_LABEL: Record<ThinkingDim, string> = {
  quadrant_a: "Analytical, data-first thinking",
  quadrant_b: "Sequential, structured thinking",
  quadrant_c: "Interpersonal, relationship-first thinking",
  quadrant_d: "Big-picture, experimental thinking",
  builder_instinct: "Hands-on, build-to-learn thinking",
};

const THINKING_DIMS: ThinkingDim[] = ["quadrant_a", "quadrant_b", "quadrant_c", "quadrant_d", "builder_instinct"];

const GAME_STRENGTH_LABEL: Record<GameId, string> = {
  reaction: "Fast reflexes",
  sequence_memory: "Strong recall for ordered steps",
  visual_memory: "Sharp spatial memory",
  typing: "Fast, accurate execution",
  precision: "Steady precision and focus",
};

/** The thinking style where the user scored highest and this specific occupation weights it most, the single dimension that most explains this particular match. */
function bestThinkingStyle(userVector: TraitVector, occupation: Occupation): string | null {
  let best: ThinkingDim | null = null;
  let bestAlignment = -Infinity;
  for (const dim of THINKING_DIMS) {
    const alignment = userVector[dim] * occupation.trait_profile[dim];
    if (alignment > bestAlignment) {
      bestAlignment = alignment;
      best = dim;
    }
  }
  return best ? THINKING_STYLE_LABEL[best] : null;
}

/** The single measured Skill Lab result that both this occupation leans on distinctively and the user actually did well at. */
function bestGameStrength(skillScores: SkillScores | null | undefined, occupation: Occupation): string | null {
  if (!skillScores || !occupation.skill_demands) return null;
  let best: GameId | null = null;
  let bestValue = -Infinity;
  for (const id of Object.keys(occupation.skill_demands) as GameId[]) {
    const demand = occupation.skill_demands[id];
    const score = skillScores[id];
    if (typeof demand !== "number" || score === null || score === undefined) continue;
    const distinctiveness = Math.abs(demand - 0.5);
    if (distinctiveness < 0.15) continue; // not a distinctive demand for this role
    if (score < 0.55) continue; // don't highlight a mediocre result as a strength
    const value = score * distinctiveness;
    if (value > bestValue) {
      bestValue = value;
      best = id;
    }
  }
  return best ? GAME_STRENGTH_LABEL[best] : null;
}

/** Up to 2 short "where you did well" highlights for a specific match, or an empty array if nothing distinctive stood out. */
export function matchHighlights(
  userVector: TraitVector,
  skillScores: SkillScores | null | undefined,
  occupation: Occupation,
): string[] {
  const highlights: string[] = [];
  const style = bestThinkingStyle(userVector, occupation);
  if (style) highlights.push(style);
  const game = bestGameStrength(skillScores, occupation);
  if (game) highlights.push(game);
  return highlights;
}
