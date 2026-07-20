import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreAssessment } from "@/lib/assessment/scoring";
import { ModuleLog, SelfReport } from "@/lib/assessment/types";
import { TOTAL_SCENES } from "@/lib/assessment/scenes";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const logs: ModuleLog[] = body.logs;
  const selfReport: SelfReport = body.selfReport;

  if (!Array.isArray(logs) || logs.length !== TOTAL_SCENES || !selfReport) {
    return NextResponse.json({ error: "Incomplete assessment data." }, { status: 400 });
  }

  const traitVector = scoreAssessment(logs, selfReport);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("assessment_sessions")
    .insert({
      trait_vector: traitVector,
      self_report: { ...selfReport, moduleLogs: logs },
      life_stage: selfReport.lifeStage,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save your results. Try again." }, { status: 500 });
  }

  return NextResponse.json({ sessionId: data.id });
}
