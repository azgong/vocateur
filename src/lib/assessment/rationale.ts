import Anthropic from "@anthropic-ai/sdk";
import { ModuleLog } from "./types";
import { Occupation } from "./matching";

function descriptionFor(log: ModuleLog): string {
  return (log.extra?.description as string) ?? "one of the scenario decisions";
}

function topAllocation(log: ModuleLog): string {
  const allocations = log.extra?.allocations as Record<string, number> | undefined;
  if (!allocations) return "one category over the others";
  const [top] = Object.entries(allocations).sort((a, b) => b[1] - a[1]);
  return top[0];
}

function templatedRationale(occupation: Occupation, logs: ModuleLog[]): string {
  // Keep the rationale readable: highlight one representative moment per chapter
  // rather than all 12 scenes.
  const seenChapters = new Set<string>();
  const highlighted = logs.filter((log) => {
    if (seenChapters.has(log.chapterId)) return false;
    seenChapters.add(log.chapterId);
    return true;
  });

  const highlights = highlighted
    .map((log) => {
      const desc = descriptionFor(log);
      if (log.extra && "correct" in log.extra) {
        const correct = log.extra.correct;
        return `When ${desc}, you locked in your answer in ${(log.timeTakenMs / 1000).toFixed(1)}s${correct ? " and got it right" : ""}.`;
      }
      if (log.extra && "allocations" in log.extra) {
        return `When ${desc}, you leaned hardest into ${topAllocation(log)}.`;
      }
      return `When ${desc}, you went with "${log.choiceSelected.replace(/_/g, " ")}."`;
    })
    .join(" ");

  const skills = occupation.top_skills.slice(0, 2).join(" and ");
  return `${highlights} That combination maps closely onto ${occupation.title.toLowerCase()}, where ${skills.toLowerCase()} are exactly what get used day to day.`;
}

async function callClaude(occupation: Occupation, logs: ModuleLog[]): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const choiceSummary = logs
    .map((l) => `- ${descriptionFor(l)}: chose "${l.choiceSelected}", took ${(l.timeTakenMs / 1000).toFixed(1)}s, ${l.revisionsMade} revisions`)
    .join("\n");

  const prompt = `A user just completed 12 short behavioral simulation scenarios across 4 job-world chapters (not a personality quiz) and matched to the occupation "${occupation.title}" (${occupation.description}).

Their behavior across the scenarios:
${choiceSummary}

Write a 2-3 sentence rationale explaining why this behavior pattern points toward "${occupation.title}". Reference their specific choices concretely (not generic trait labels), picking 2-3 of the most telling moments rather than listing all of them. Write directly to the user ("you"). No preamble, just the rationale text. Never use an em dash; use a period, comma, or colon instead. Plain text only, no markdown. End every complete sentence with a period.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });
      const text = response.content.find((b) => b.type === "text")?.text;
      if (text && text.trim().length > 0) return text.trim();
    } catch {
      // fall through to retry, then to template fallback
    }
  }
  return null;
}

export async function generateRationale(occupation: Occupation, logs: ModuleLog[]): Promise<string> {
  const llmResult = await callClaude(occupation, logs);
  return llmResult ?? templatedRationale(occupation, logs);
}
