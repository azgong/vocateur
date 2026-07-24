import { ModuleLog, SelfReport, TraitVector } from "./types";
import { SkillScores } from "./games";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Weighted-sum trait scoring, no ML. Each module contributes a partial
 * trait delta (set by the module itself based on the specific choice made,
 * see each module's CHOICE_TRAITS map) plus a behavioral adjustment derived
 * from time taken and revisions. Self-report and Skill Lab results nudge
 * pace/risk slightly; the games' main influence on matching happens through
 * occupation skill_demands in matching.ts, not here.
 */
export function scoreAssessment(logs: ModuleLog[], selfReport: SelfReport, skillScores?: SkillScores): TraitVector {
  const totals: TraitVector = {
    quadrant_a: 0,
    quadrant_b: 0,
    quadrant_c: 0,
    quadrant_d: 0,
    pace_preference: 0,
    risk_tolerance: 0,
  };

  for (const log of logs) {
    const contribution = (log.extra?.traitContribution as Partial<TraitVector>) ?? {};
    for (const key of Object.keys(totals) as (keyof TraitVector)[]) {
      totals[key] += contribution[key] ?? 0;
    }

    // Fewer revisions + faster completion nudges pace_preference up;
    // more revisions nudges risk_tolerance down (double-checking reads as caution).
    const revisionPenalty = Math.min(log.revisionsMade * 0.05, 0.2);
    totals.risk_tolerance -= revisionPenalty;
  }

  const moduleCount = logs.length || 1;
  const vector: TraitVector = {
    quadrant_a: clamp01(totals.quadrant_a / moduleCount),
    quadrant_b: clamp01(totals.quadrant_b / moduleCount),
    quadrant_c: clamp01(totals.quadrant_c / moduleCount),
    quadrant_d: clamp01(totals.quadrant_d / moduleCount),
    pace_preference: clamp01(totals.pace_preference / moduleCount),
    risk_tolerance: clamp01(totals.risk_tolerance / moduleCount),
  };

  if (selfReport.geographicFlexibility === "global") {
    vector.risk_tolerance = clamp01(vector.risk_tolerance + 0.1);
  }
  if (selfReport.furtherSchooling === "no") {
    vector.pace_preference = clamp01(vector.pace_preference + 0.05);
  }

  // Skill Lab nudges: measured reflexes shift pace slightly in either
  // direction. Deliberately small; skill fit is handled in matching.ts.
  if (skillScores) {
    if (skillScores.reaction !== null && skillScores.reaction >= 0.7) {
      vector.pace_preference = clamp01(vector.pace_preference + 0.07);
    } else if (skillScores.reaction !== null && skillScores.reaction <= 0.25) {
      vector.pace_preference = clamp01(vector.pace_preference - 0.05);
    }
  }

  return vector;
}

export function cosineSimilarity(a: TraitVector, b: TraitVector): number {
  const keys = Object.keys(a) as (keyof TraitVector)[];
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const k of keys) {
    dot += a[k] * b[k];
    magA += a[k] * a[k];
    magB += b[k] * b[k];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
