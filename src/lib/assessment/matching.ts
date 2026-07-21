import { TraitVector } from "./types";
import { cosineSimilarity } from "./scoring";

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

export function rankMatches(userVector: TraitVector, occupations: Occupation[]): Match[] {
  const scored = occupations.map((occupation) => ({
    occupation,
    rawSimilarity: cosineSimilarity(userVector, occupation.trait_profile),
  }));

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
