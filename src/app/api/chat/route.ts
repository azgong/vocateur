import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const { roadmapId, messages } = (await req.json()) as { roadmapId: string; messages: ChatMessage[] };

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
    .select("content, life_stage, session_id, occupations(title, description), user_id")
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

  const occupation = roadmap.occupations as unknown as { title: string; description: string } | null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 503 });
  }

  const systemPrompt = `You are helping someone understand their own career assessment results on Vocateur. Their top match is "${occupation?.title}" (${occupation?.description}). Their trait profile: ${JSON.stringify(session?.trait_vector)}. Their life stage: ${roadmap.life_stage}. Their roadmap: ${JSON.stringify(roadmap.content)}.

Answer their follow-up questions about their results or roadmap directly and specifically, referencing their actual data. Keep answers conversational and under 150 words unless they ask for more detail. You have no memory beyond this conversation.`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
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
