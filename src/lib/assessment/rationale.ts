import Anthropic from "@anthropic-ai/sdk";
import { ModuleLog } from "./types";
import { Occupation } from "./matching";

const MODULE_DESCRIPTIONS: Record<ModuleLog["moduleId"], string> = {
  analyst: "spotting the anomaly in a revenue dataset under a countdown",
  physician: "sequencing five ER patients by urgency with no undo",
  executive: "choosing how to mediate a conflict between two coworkers from partial information",
  founder: "allocating a startup's budget across product, marketing, hiring, and runway",
};

function templatedRationale(occupation: Occupation, logs: ModuleLog[]): string {
  const highlights = logs
    .map((log) => {
      const desc = MODULE_DESCRIPTIONS[log.moduleId];
      if (log.moduleId === "analyst") {
        const correct = log.extra?.correct;
        return `In ${desc}, you locked in your answer in ${(log.timeTakenMs / 1000).toFixed(1)}s${correct ? " and got it right" : ""}.`;
      }
      if (log.moduleId === "founder") {
        return `When ${desc}, you leaned hardest into ${topAllocation(log)}.`;
      }
      return `When ${desc}, you went with "${log.choiceSelected.replace(/_/g, " ")}."`;
    })
    .join(" ");

  const skills = occupation.top_skills.slice(0, 2).join(" and ");
  return `${highlights} That combination maps closely onto ${occupation.title.toLowerCase()}, where ${skills.toLowerCase()} are exactly what get used day to day.`;
}

function topAllocation(log: ModuleLog): string {
  const allocations = log.extra?.allocations as Record<string, number> | undefined;
  if (!allocations) return "one category over the others";
  const [top] = Object.entries(allocations).sort((a, b) => b[1] - a[1]);
  return top[0];
}

async function callClaude(occupation: Occupation, logs: ModuleLog[]): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const choiceSummary = logs
    .map((l) => `- ${MODULE_DESCRIPTIONS[l.moduleId]}: chose "${l.choiceSelected}", took ${(l.timeTakenMs / 1000).toFixed(1)}s, ${l.revisionsMade} revisions`)
    .join("\n");

  const prompt = `A user just completed 4 behavioral simulation modules (not a personality quiz) and matched to the occupation "${occupation.title}" (${occupation.description}).

Their behavior across the 4 modules:
${choiceSummary}

Write a 2-3 sentence rationale explaining why this behavior pattern points toward "${occupation.title}". Reference their specific choices concretely (not generic trait labels). Write directly to the user ("you"). No preamble, just the rationale text.`;

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
