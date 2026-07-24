import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreAssessment } from "@/lib/assessment/scoring";
import { ModuleLog, SelfReport } from "@/lib/assessment/types";
import { TOTAL_SCENES } from "@/lib/assessment/scenes";
import { GAMES, GameResult, TOTAL_GAMES, toSkillScores } from "@/lib/assessment/games";

const VALID_GAME_IDS = new Set(GAMES.map((g) => g.id));

function sanitizeGameResults(raw: unknown): GameResult[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const results: GameResult[] = [];
  for (const item of raw as GameResult[]) {
    if (!item || !VALID_GAME_IDS.has(item.gameId) || seen.has(item.gameId)) continue;
    if (item.score !== null && (typeof item.score !== "number" || item.score < 0 || item.score > 1)) continue;
    if (typeof item.rawMetric !== "number" || !Number.isFinite(item.rawMetric)) continue;
    seen.add(item.gameId);
    results.push({ gameId: item.gameId, rawMetric: item.rawMetric, score: item.score });
    if (results.length >= TOTAL_GAMES) break;
  }
  return results;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const logs: ModuleLog[] = body.logs;
  const selfReport: SelfReport = body.selfReport;
  const gameResults = sanitizeGameResults(body.gameResults);

  if (!Array.isArray(logs) || logs.length !== TOTAL_SCENES || !selfReport) {
    return NextResponse.json({ error: "Incomplete assessment data." }, { status: 400 });
  }

  const skillScores = toSkillScores(gameResults);
  const traitVector = scoreAssessment(logs, selfReport, skillScores);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("assessment_sessions")
    .insert({
      trait_vector: traitVector,
      self_report: { ...selfReport, moduleLogs: logs, gameResults, skillScores },
      life_stage: selfReport.lifeStage,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save your results. Try again." }, { status: 500 });
  }

  return NextResponse.json({ sessionId: data.id });
}
