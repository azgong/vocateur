import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Occupation } from "@/lib/assessment/matching";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatMode = "advisor" | "mock_interview";

function formatOutlook(occ: Occupation): string {
  if (occ.bls_match_confidence === "no_match" || occ.bls_change_pct_2024_34 === null) {
    return "No direct U.S. Bureau of Labor Statistics occupation match exists for this specific role. Don't cite a specific growth percentage or wage figure as if it were official BLS data. You can speak generally about the field's trajectory, but say plainly that you don't have an official government projection for this exact title.";
  }
  const confidenceNote =
    occ.bls_match_confidence === "approximate"
      ? ` (approximate match: ${occ.bls_match_note ?? "closest available BLS category, not an exact title match"})`
      : "";
  const parts = [
    `Real U.S. Bureau of Labor Statistics Employment Projections, 2024–2034${confidenceNote}:`,
    occ.bls_change_pct_2024_34 !== null
      ? `projected employment change ${occ.bls_change_pct_2024_34 > 0 ? "+" : ""}${occ.bls_change_pct_2024_34}% over the decade`
      : null,
    occ.bls_median_wage_2024 !== null ? `median annual wage $${occ.bls_median_wage_2024.toLocaleString()} (2024)` : null,
    occ.bls_annual_openings_thousands !== null
      ? `~${occ.bls_annual_openings_thousands}k projected annual openings`
      : null,
  ].filter(Boolean);
  return parts.join(" ") + ". (Source: BLS Employment Projections, Table 1.2.) Cite these real figures when asked about viability, growth, or outlook. Don't invent different numbers.";
}

function buildAdvisorSystemPrompt(occ: Occupation, lifeStage: string, traitVector: unknown, roadmap: unknown): string {
  return `You are a career advisor at Vocateur, meeting with a client who just completed a career-matching simulation and matched to "${occ.title}" (${occ.description}). Talk to them the way a real, knowledgeable advisor in this specific field would: direct, specific, practically useful. Not a generic assistant giving generic advice.

CLIENT CONTEXT
- Life stage: ${lifeStage}
- Trait profile from their assessment: ${JSON.stringify(traitVector)}
- Their personalized roadmap: ${JSON.stringify(roadmap)}

ROLE FACTS
- Typical education: ${occ.education_level}
- Core day-to-day skills: ${occ.top_skills.join(", ")}
- Median salary (product dataset): $${occ.median_salary.toLocaleString()}

REAL MARKET OUTLOOK
${formatOutlook(occ)}

ADVISORY KNOWLEDGE (use this, it's what makes you useful instead of generic)
- How people actually break in: ${occ.how_to_break_in ?? "Not available for this role. Say so rather than guessing specifics."}
- Typical career progression: ${occ.typical_progression ?? "Not available for this role. Say so rather than guessing specifics."}
- What to build first: ${occ.skills_to_build_first?.join(", ") ?? "Not available for this role."}
- Common misconceptions about this field: ${occ.common_misconceptions ?? "Not available for this role."}

WHAT YOU CAN HELP WITH (this is a full-service advisor, not just Q&A, proactively offer these when relevant rather than waiting to be asked exactly the right way)
- Explaining their results, this career, or how to reach their roadmap milestones, grounded in the real data above.
- Resume review: if they paste resume text, review it like a hiring manager in this field would: what's strong, what's missing, what to change, judged against what this role actually needs.
- Cover letter feedback: if they paste a draft, tell them if it actually makes the case for this specific role or reads generic, and what to sharpen.
- LinkedIn profile review: if they paste their headline/About section/experience bullets, tell them what would and wouldn't catch a recruiter's eye for this field.
- Job posting fit check: if they paste a real job posting, assess how well it matches their profile and roadmap stage, and what to highlight or address in an application.
- Salary negotiation prep: if they mention an offer or upcoming negotiation, use the real BLS wage data above to help them figure out a reasonable range and how to make the case, practically, not generic "know your worth" advice.
- Mention unprompted, once per conversation at most, that they can also switch to mock interview mode for practice, when it's genuinely relevant (e.g., they mention an upcoming interview).

INSTRUCTIONS
When asked about job security, growth, or "will this still be a good field," cite the real BLS figures given above verbatim rather than a vague gut-feel answer. If something isn't covered by the data you were given, say you don't have that specific detail rather than inventing it. Keep answers conversational and under 150 words unless they ask for more depth or the task genuinely needs it (a resume review, cover letter review, or negotiation prep can run longer). You have no memory beyond this conversation. Never use an em dash anywhere in your reply; use a period, comma, or colon instead. Reply in plain text only, no markdown: no asterisks, no bold, no headers, no bullet-point dashes. If you need to list things, write them as a plain sentence or use numbers like "1)". End every complete sentence with a period.`;
}

function buildMockInterviewSystemPrompt(occ: Occupation): string {
  return `You are conducting a realistic mock interview for a "${occ.title}" position (${occ.description}). You are the interviewer.

WHAT THIS INTERVIEW ACTUALLY TESTS
${occ.interview_focus ?? "Specific interview-focus data isn't available for this role. Run a reasonable general interview for this type of position, but tell the candidate upfront that you're working from general practice rather than role-specific interview data."}

HOW TO RUN THIS
- Ask exactly ONE question at a time, then stop and wait for their answer. Never ask multiple questions in one message.
- After each answer, give brief, specific, honest feedback (2-3 sentences): what was strong, what a real interviewer would flag, before moving to the next question.
- Draw questions from the interview-focus areas above; vary the type of question across the conversation (don't just repeat the same angle).
- If this is the very first message in the conversation (the message history contains only one user message, likely something like "start" or a greeting), skip straight to opening the interview in-character with a brief greeting and your first question. Don't wait for them to ask what to do.
- Keep the tone realistic but supportive: this is practice, not a real rejection. Stay in character as the interviewer throughout.
- Never use an em dash anywhere in your reply; use a period, comma, or colon instead.
- Reply in plain text only, no markdown: no asterisks, no bold, no headers, no bullet-point dashes.
- End every complete sentence with a period.`;
}

export async function POST(req: NextRequest) {
  const { roadmapId, messages, mode } = (await req.json()) as {
    roadmapId: string;
    messages: ChatMessage[];
    mode?: ChatMode;
  };
  const chatMode: ChatMode = mode === "mock_interview" ? "mock_interview" : "advisor";

  if (typeof roadmapId !== "string" || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Missing roadmapId or messages." }, { status: 400 });
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

  const { data: roadmap } = await admin
    .from("roadmaps")
    .select("content, life_stage, session_id, occupations(*), user_id")
    .eq("id", roadmapId)
    .single();
  if (!roadmap || roadmap.user_id !== user.id) {
    return NextResponse.json({ error: "Roadmap not found." }, { status: 404 });
  }

  const { data: session } = await admin
    .from("assessment_sessions")
    .select("trait_vector")
    .eq("id", roadmap.session_id)
    .single();

  const occupation = roadmap.occupations as unknown as Occupation | null;
  if (!occupation) {
    return NextResponse.json({ error: "Occupation data missing for this roadmap." }, { status: 500 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 503 });
  }

  const systemPrompt =
    chatMode === "mock_interview"
      ? buildMockInterviewSystemPrompt(occupation)
      : buildAdvisorSystemPrompt(occupation, roadmap.life_stage, session?.trait_vector, roadmap.content);

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const text = response.content.find((b) => b.type === "text")?.text;
    if (!text) throw new Error("Empty response");
    return NextResponse.json({ reply: text });
  } catch {
    return NextResponse.json({ error: "Message failed. Try again." }, { status: 500 });
  }
}
