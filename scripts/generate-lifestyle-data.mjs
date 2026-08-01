// One-time content-authoring script: drafts day-in-the-life data (typical
// hours, remote-friendliness, intensity, an honest reality-check paragraph)
// per occupation. Run once, review, re-run with --only to backfill/redo
// specific occupations. LLM-assisted first draft, same review process as
// the rest of the advisory content (how_to_break_in, typical_progression).
//
// Usage: node scripts/generate-lifestyle-data.mjs [--only=<title substring>]

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";

const envRaw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const onlyFilter = process.argv.find((a) => a.startsWith("--only="))?.slice("--only=".length);

function buildPrompt(occ) {
  return `You are writing honest "day in the life" reality-check content for the occupation "${occ.title}" (${occ.description}). This is shown to people, often students, deciding whether to actually pursue this career, so it needs to be candid, not a recruiting pitch.

TASK
Write:
1. typical_hours: one short sentence on realistic weekly hours, including any seasonal/cyclical spikes (e.g. "45-55 hrs/week, spikes to 70+ during close periods").
2. remote_friendliness: one short sentence on how remote-friendly this actually is in practice, not in theory.
3. lifestyle_intensity: one of exactly "low", "moderate", "high", "extreme", reflecting overall demands on personal time/stress, not prestige or difficulty of the work itself.
4. lifestyle_reality: 2-3 sentences of the honest, specific texture of this job day to day, the kind of thing someone only learns after actually doing it. Name a real tradeoff, not a generic "it's rewarding but challenging."

Respond with ONLY valid JSON, no markdown fences, no preamble:
{"typical_hours": string, "remote_friendliness": string, "lifestyle_intensity": "low" | "moderate" | "high" | "extreme", "lifestyle_reality": string}`;
}

function parseResult(text) {
  const cleaned = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!["low", "moderate", "high", "extreme"].includes(parsed.lifestyle_intensity)) {
    throw new Error("Invalid lifestyle_intensity: " + parsed.lifestyle_intensity);
  }
  return parsed;
}

async function main() {
  let query = admin.from("occupations").select("id, title, description");
  if (onlyFilter) query = query.ilike("title", `%${onlyFilter}%`);
  const { data: occupations, error } = await query;
  if (error) throw error;

  console.log(`Generating lifestyle data for ${occupations.length} occupation(s)...`);

  let done = 0;
  let failed = 0;
  for (const occ of occupations) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        messages: [{ role: "user", content: buildPrompt(occ) }],
      });
      const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
      const result = parseResult(text);

      const { error: updateError } = await admin.from("occupations").update(result).eq("id", occ.id);
      if (updateError) throw updateError;

      done += 1;
      console.log(`[${done}/${occupations.length}] ${occ.title}: ${result.lifestyle_intensity}`);
    } catch (e) {
      failed += 1;
      console.error(`FAILED: ${occ.title}:`, e.message);
    }
  }
  console.log(`Done. ${done} succeeded, ${failed} failed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
