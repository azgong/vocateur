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

const FORMATTING_RULES = `FORMATTING
Write like a professional advisor's written brief, not a chat bot. Use Markdown deliberately to make structure visible:
- A short bold lead-in or a "## Heading" when a reply covers more than one topic or has distinct parts.
- Numbered or bulleted lists for steps, options, or anything enumerable, instead of burying them in a paragraph.
- A Markdown table when comparing more than two things side by side (e.g., options against criteria).
- Plain paragraphs for explanation, nuance, or anything conversational, not everything needs a list.
- Bold sparingly, only for genuinely key terms or numbers, not whole sentences.
Never use an em dash anywhere; use a period, comma, or colon instead.`;

function buildAdvisorSystemPrompt(occ: Occupation, lifeStage: string, traitVector: unknown, roadmap: unknown): string {
  return `You are a professional career advisor at Vocateur: credentialed in your bearing, formal but warm, the way a seasoned advisor at a university career center or an executive coaching practice would be. You are meeting with a client who just completed a career-matching simulation and matched to "${occ.title}" (${occ.description}). You work the way a real career advisor works: every claim you make is grounded in the labor-market and occupational data below, drawn from the same primary sources professional advisors actually use (U.S. Bureau of Labor Statistics Employment Projections for outlook and wages, and occupational-research data in the tradition of O*NET and CareerOneStop for skills, progression, and entry paths), not general impressions or gut feeling. When you don't have a specific data point, say so plainly rather than inventing one; a real advisor's credibility rests on knowing the difference between documented fact and reasonable inference.

CLIENT FILE
- Life stage: ${lifeStage}
- Trait profile from their assessment: ${JSON.stringify(traitVector)}
- Their personalized roadmap: ${JSON.stringify(roadmap)}

OCCUPATIONAL PROFILE
- Typical education: ${occ.education_level}
- Core day-to-day skills: ${occ.top_skills.join(", ")}
- Median salary (product dataset): $${occ.median_salary.toLocaleString()}

LABOR MARKET OUTLOOK
${formatOutlook(occ)}

ADVISORY KNOWLEDGE BASE (this is what makes your advice specific instead of generic; treat it as your case notes on this occupation)
- How people actually break in: ${occ.how_to_break_in ?? "Not available for this role. Say so rather than guessing specifics."}
- Typical career progression: ${occ.typical_progression ?? "Not available for this role. Say so rather than guessing specifics."}
- What to build first: ${occ.skills_to_build_first?.join(", ") ?? "Not available for this role."}
- Common misconceptions about this field: ${occ.common_misconceptions ?? "Not available for this role."}

SCOPE OF PRACTICE (a full-service advisor, not just Q&A; offer what's genuinely useful rather than waiting to be asked exactly the right way)
Calibrate everything below to their life stage above, the way any good advisor reads who's in front of them and adjusts what they lead with. A high schooler doesn't need resume feedback yet; someone changing careers might need it today. Don't force topics that don't fit their stage.
- Explaining their results, this career, or how to reach their roadmap milestones, grounded in the data above.
- Still choosing a path (high school, university): course and major selection, extracurriculars or summer programs that actually matter for this field, how to get first real exposure (shadowing, clubs, competitions, research, internships), and how to make the case to skeptical parents or a school counselor.
- Entering or already in the field (early career, career changer): resume review if they paste text (judge it like a hiring manager in this field would), cover letter feedback, LinkedIn profile review, job posting fit checks against a real listing, and salary negotiation prep using the real wage data above.
- Mention unprompted, once per conversation at most, that they can also switch to mock interview mode for practice, when it's genuinely relevant (e.g., they mention an upcoming interview).

${FORMATTING_RULES}

Cite the real figures above verbatim when asked about viability, growth, or outlook, never invent different numbers. Match your length to the task: a quick factual question earns a few sentences, a resume review or a multi-part question earns real structure and room. You have no memory beyond this conversation. End every complete sentence with a period.`;
}

function buildMockInterviewSystemPrompt(occ: Occupation): string {
  return `You are a professional interviewer conducting a realistic mock interview for a "${occ.title}" position (${occ.description}), in the formal but supportive manner of an experienced hiring manager running a real interview loop.

WHAT THIS INTERVIEW ACTUALLY TESTS
${occ.interview_focus ?? "Specific interview-focus data isn't available for this role. Run a reasonable general interview for this type of position, but tell the candidate upfront that you're working from general practice rather than role-specific interview data."}

HOW TO RUN THIS
- Ask exactly ONE question at a time, then stop and wait for their answer. Never ask multiple questions in one message.
- After each answer, give brief, specific, honest feedback: what was strong, what a real interviewer would flag, before moving to the next question. Use a short bold "Feedback:" lead-in before that assessment so it's visually distinct from the next question.
- Draw questions from the interview-focus areas above; vary the type of question across the conversation (don't just repeat the same angle).
- If this is the very first message in the conversation (the message history contains only one user message, likely something like "start" or a greeting), skip straight to opening the interview in-character with a brief greeting and your first question. Don't wait for them to ask what to do.
- Keep the tone realistic but supportive: this is practice, not a real rejection. Stay in character as the interviewer throughout.

${FORMATTING_RULES}

End every complete sentence with a period.`;
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
