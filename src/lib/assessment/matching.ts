import { TraitVector } from "./types";
import { cosineSimilarity } from "./scoring";
import { GameId, SkillScores } from "./games";

/** Per-occupation demand (0-1) for each measured Skill Lab dimension; 0.5 is neutral. */
export type SkillDemands = Partial<Record<GameId, number>>;

export type Occupation = {
  id: string;
  title: string;
  description: string;
  median_salary: number;
  growth_pct: number;
  education_level: string;
  top_skills: string[];
  trait_profile: TraitVector;
  data_as_of: string;
  // Real U.S. Bureau of Labor Statistics Employment Projections (2024-2034 cycle),
  // Table 1.2; null when this occupation has no clean BLS match (see bls_match_confidence).
  soc_code: string | null;
  bls_change_pct_2024_34: number | null;
  bls_median_wage_2024: number | null;
  bls_annual_openings_thousands: number | null;
  bls_match_confidence: "exact" | "close" | "approximate" | "no_match" | null;
  bls_match_note: string | null;
  // Structured career-advisory content, grounds the AI advisor chat and mock interviews.
  how_to_break_in: string | null;
  typical_progression: string | null;
  skills_to_build_first: string[] | null;
  common_misconceptions: string | null;
  interview_focus: string | null;
  skill_demands: SkillDemands | null;
};

export type Match = {
  occupation: Occupation;
  fitScore: number; // 0-100
};

// Raw cosine similarity between two mostly-positive 6-dim vectors is mathematically
// compressed into a narrow high range for anything remotely aligned; displaying it
// directly makes every reasonable match look like 97-98%. We rank by raw similarity,
// but *display* a rescaled score. Anchoring the low end to the full catalog's worst
// match wastes most of the display range on occupations nobody ever sees (only the
// top 10 are shown), so instead we anchor the floor to the similarity at the
// FLOOR_RANK_FRACTION percentile down the full ranked list (a genuinely mediocre,
// but not absurd, fit). That stretches the top-10 window, the only part of the
// scale a user ever sees, across most of the display range, giving real separation
// between e.g. a 1st and 10th place match instead of both reading ~97%.
const DISPLAY_MIN = 40;
const DISPLAY_MAX = 99;
const FLOOR_RANK_FRACTION = 0.35;

// Skill Lab results influence ranking as a secondary term: the quadrant/trait
// cosine stays dominant, measured skills act as a tiebreaker-strength signal.
const SKILL_WEIGHT = 0.15;

// Most users are looking for a higher-paying outcome among their well-fitting
// matches, so pay nudges the ranking by default. Users who explicitly picked
// "Money" among their top values get a stronger nudge; users who filled their
// 3 picks with other values and left Money out get a much weaker one, since
// that's a real signal they're optimizing for something else.
const PAY_WEIGHT_BASE = 0.08;

/**
 * Agreement between what an occupation demands and what the games measured,
 * weighted by how distinctive each demand is (a 0.5 "neutral" demand says
 * nothing and is ignored). Null when there is nothing meaningful to compare,
 * so users who skip games are matched purely on the simulation.
 */
function skillFit(demands: SkillDemands | null | undefined, scores: SkillScores | null | undefined): number | null {
  if (!demands || !scores) return null;
  let weighted = 0;
  let weightSum = 0;
  for (const id of Object.keys(demands) as GameId[]) {
    const demand = demands[id];
    const score = scores[id];
    if (typeof demand !== "number" || score === null || score === undefined) continue;
    const distinctiveness = Math.abs(demand - 0.5);
    if (distinctiveness < 0.1) continue;
    weighted += (1 - Math.abs(demand - score)) * distinctiveness;
    weightSum += distinctiveness;
  }
  return weightSum > 0 ? weighted / weightSum : null;
}

function paySkewWeight(values: string[] | undefined | null): number {
  if (!values || values.length === 0) return PAY_WEIGHT_BASE;
  if (values.includes("Money")) return PAY_WEIGHT_BASE * 1.5;
  return PAY_WEIGHT_BASE * 0.3;
}

export function rankMatches(
  userVector: TraitVector,
  occupations: Occupation[],
  skillScores?: SkillScores | null,
  values?: string[] | null,
): Match[] {
  const payWeight = paySkewWeight(values);
  const salaries = occupations.map((o) => o.median_salary);
  const minSalary = Math.min(...salaries);
  const maxSalary = Math.max(...salaries);
  const salaryRange = maxSalary - minSalary || 1;

  const scored = occupations.map((occupation) => {
    const cosine = cosineSimilarity(userVector, occupation.trait_profile);
    const fit = skillFit(occupation.skill_demands, skillScores);
    const traitScore = fit === null ? cosine : cosine * (1 - SKILL_WEIGHT) + fit * SKILL_WEIGHT;
    const salaryNorm = (occupation.median_salary - minSalary) / salaryRange;
    return {
      occupation,
      rawSimilarity: traitScore * (1 - payWeight) + salaryNorm * payWeight,
    };
  });

  const sortedSimilarities = scored.map((s) => s.rawSimilarity).sort((a, b) => b - a);
  const max = sortedSimilarities[0] ?? 0;
  const floorIndex = Math.min(sortedSimilarities.length - 1, Math.floor(sortedSimilarities.length * FLOOR_RANK_FRACTION));
  const floor = sortedSimilarities[floorIndex] ?? 0;
  const range = max - floor || 1;

  return scored
    .map(({ occupation, rawSimilarity }) => ({
      occupation,
      fitScore: Math.max(1, Math.round(DISPLAY_MIN + Math.min(1, (rawSimilarity - floor) / range) * (DISPLAY_MAX - DISPLAY_MIN))),
    }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 10);
}
