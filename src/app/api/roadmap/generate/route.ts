import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateRoadmap } from "@/lib/assessment/roadmap";
import { SelfReport } from "@/lib/assessment/types";
import { Occupation } from "@/lib/assessment/matching";

export async function POST(req: NextRequest) {
  const { sessionId, occupationId } = await req.json();
  if (typeof sessionId !== "string" || typeof occupationId !== "string") {
    return NextResponse.json({ error: "Missing sessionId or occupationId." }, { status: 400 });
  }

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  if (profile?.subscription_status !== "active") {
    return NextResponse.json({ error: "Paid subscription required." }, { status: 403 });
  }

  const { data: existing } = await admin
    .from("roadmaps")
    .select("id")
    .eq("user_id", user.id)
    .eq("occupation_id", occupationId)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ roadmapId: existing.id });
  }

  const [{ data: session }, { data: occupation }] = await Promise.all([
    admin.from("assessment_sessions").select("life_stage, self_report").eq("id", sessionId).single(),
    admin.from("occupations").select("*").eq("id", occupationId).single(),
  ]);

  if (!session || !occupation) {
    return NextResponse.json({ error: "Session or occupation not found." }, { status: 404 });
  }

  // self_report is stored as { ...selfReport, moduleLogs }; pull out just the SelfReport shape.
  const storedReport = (session.self_report ?? {}) as Partial<SelfReport> & { moduleLogs?: unknown };
  const selfReport: SelfReport = {
    lifeStage: session.life_stage,
    currentFocus: storedReport.currentFocus ?? "",
    furtherSchooling: storedReport.furtherSchooling ?? "maybe",
    geographicFlexibility: storedReport.geographicFlexibility ?? "national",
    location: storedReport.location ?? "",
    timeline: storedReport.timeline ?? "just_exploring",
    values: storedReport.values ?? [],
    currentGPA: storedReport.currentGPA ?? "",
    currentActivities: storedReport.currentActivities ?? "",
    weeklyTimeAvailable: storedReport.weeklyTimeAvailable ?? "4_7_hours",
    resumeStatus: storedReport.resumeStatus ?? "needs_work",
    additionalContext: storedReport.additionalContext ?? "",
  };

  const content = await generateRoadmap(occupation as Occupation, selfReport);

  const { data: roadmap, error } = await admin
    .from("roadmaps")
    .insert({
      user_id: user.id,
      session_id: sessionId,
      occupation_id: occupationId,
      life_stage: session.life_stage,
      content,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not generate roadmap." }, { status: 500 });
  }

  return NextResponse.json({ roadmapId: roadmap.id });
}
