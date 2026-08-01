import { createAdminClient } from "@/lib/supabase/admin";
import { rankMatches, Occupation } from "./matching";
import { TraitVector } from "./types";
import { SkillScores } from "./games";

export type ConsistencySignal = { matchCount: number; totalAttempts: number };

/**
 * How often the current session's top match was ALSO the top match across
 * the same user's other linked assessment attempts. Requires 2+ total
 * attempts to mean anything; returns null otherwise (anonymous sessions,
 * first-time takers, or a session that isn't linked to an account).
 */
export async function computeConsistencySignal(
  userId: string | null,
  currentSessionId: string,
  currentTopOccupationId: string,
  occupations: Occupation[],
): Promise<ConsistencySignal | null> {
  if (!userId) return null;

  const admin = createAdminClient();
  const { data: otherSessions } = await admin
    .from("assessment_sessions")
    .select("trait_vector, self_report")
    .eq("user_id", userId)
    .neq("id", currentSessionId);

  if (!otherSessions || otherSessions.length === 0) return null;

  let matchCount = 1;
  for (const s of otherSessions) {
    const traitVector = s.trait_vector as TraitVector;
    const skillScores = (s.self_report?.skillScores ?? null) as SkillScores | null;
    const values = (s.self_report?.values ?? null) as string[] | null;
    const currentFocus = (s.self_report?.currentFocus ?? null) as string | null;
    const otherTop = rankMatches(traitVector, occupations, skillScores, values, currentFocus)[0];
    if (otherTop?.occupation.id === currentTopOccupationId) matchCount++;
  }

  return { matchCount, totalAttempts: otherSessions.length + 1 };
}
