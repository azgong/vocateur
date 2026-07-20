import Anthropic from "@anthropic-ai/sdk";
import { LifeStage } from "./types";
import { Occupation } from "./matching";

export type RoadmapContent = {
  headline: string;
  milestones: { timeframe: string; title: string; description: string }[];
  networkingScript?: string;
};

const LIFE_STAGE_BRIEF: Record<LifeStage, string> = {
  high_school:
    "a middle/high school student. Cover: recommended extracurriculars specific to this career, target grade/GPA benchmarks, relevant university programs and example target schools, recommended entry-level internships or shadowing opportunities, and suggested course/subject focus.",
  university:
    "a university student. Cover: target GPA guidance, relevant campus activities/clubs, labs or research groups to seek out, internship targets by year, currently-relevant entry-level job types to research, and specific people/roles to network toward.",
  early_career:
    "early in their career. Cover: relevant certifications, lateral-move internships or bootcamps where applicable, realistic first moves toward this field, and specific people/roles to network toward.",
  career_changer:
    "an older career changer. Cover: relevant certifications, lateral-move internships or bootcamps where applicable, networking paths suited to their stage, and a realistic timeline for a transition into this field.",
};

function templatedRoadmap(occupation: Occupation, lifeStage: LifeStage): RoadmapContent {
  const breakInMilestone = occupation.how_to_break_in
    ? { timeframe: "How people actually get in", title: "Real entry path", description: occupation.how_to_break_in }
    : null;

  const base: Record<LifeStage, RoadmapContent> = {
    high_school: {
      headline: `Your path toward ${occupation.title} starts with the right foundation now.`,
      milestones: [
        { timeframe: "This year", title: "Course & GPA focus", description: `Prioritize classes that build toward ${occupation.title.toLowerCase()} fundamentals (${occupation.top_skills.slice(0, 2).join(", ")}). Aim for a strong, consistent GPA rather than one standout grade.` },
        { timeframe: "Next 1-2 years", title: "Extracurriculars & shadowing", description: `Look for clubs, competitions, or shadowing opportunities related to ${occupation.title.toLowerCase()}.` },
        { timeframe: "Before applying", title: "Target programs", description: `Research university programs with strong ${occupation.education_level} tracks relevant to this field.` },
      ],
    },
    university: {
      headline: `Here's how to build toward ${occupation.title} while you're still in school.`,
      milestones: [
        { timeframe: "This year", title: "Coursework & GPA", description: `Keep your GPA competitive and prioritize courses tied to ${occupation.top_skills.slice(0, 2).join(" and ")}.` },
        { timeframe: "This year", title: "Campus involvement", description: `Join clubs or research groups adjacent to ${occupation.title.toLowerCase()}.` },
        { timeframe: "Next summer", title: "Internship target", description: `Aim for an internship that touches ${occupation.top_skills[0]?.toLowerCase() ?? "core skills"} directly.` },
        { timeframe: "Ongoing", title: "Network toward the role", description: `Reach out to people currently working as ${occupation.title.toLowerCase()}s for informational conversations.` },
      ],
      networkingScript: `Hi [Name], I'm a student interested in ${occupation.title.toLowerCase()} and came across your background. Would you be open to a brief 15-minute call so I could learn more about your path into the field?`,
    },
    early_career: {
      headline: `A realistic first-move plan toward ${occupation.title}.`,
      milestones: [
        { timeframe: "Next 3 months", title: "Skill gap check", description: `Compare your current experience against what ${occupation.title.toLowerCase()}s typically need: ${occupation.top_skills.slice(0, 2).join(", ")}.` },
        { timeframe: "Next 6 months", title: "Certification or bootcamp", description: `Look into a focused certification or bootcamp that closes the biggest gap.` },
        { timeframe: "Ongoing", title: "Lateral-move networking", description: `Connect with people who made a similar move into ${occupation.title.toLowerCase()}.` },
      ],
    },
    career_changer: {
      headline: `A realistic transition timeline into ${occupation.title}.`,
      milestones: [
        { timeframe: "Next 3 months", title: "Skill gap check", description: `Identify which of your existing skills already transfer, and which of ${occupation.top_skills.slice(0, 2).join(", ")} need building.` },
        { timeframe: "Next 6-12 months", title: "Certification or bootcamp", description: `Consider a structured program suited to career changers rather than a full second degree where possible.` },
        { timeframe: "Ongoing", title: "Networking at your stage", description: `Seek out other career changers who moved into ${occupation.title.toLowerCase()}, not just traditional entrants — their path is more comparable to yours.` },
      ],
    },
  };
  const content = base[lifeStage];
  if (breakInMilestone) {
    content.milestones = [...content.milestones, breakInMilestone];
  }
  return content;
}

async function callClaude(occupation: Occupation, lifeStage: LifeStage): Promise<RoadmapContent | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const advisoryContext = [
    occupation.how_to_break_in ? `How people actually break in: ${occupation.how_to_break_in}` : null,
    occupation.typical_progression ? `Typical career progression: ${occupation.typical_progression}` : null,
    occupation.skills_to_build_first?.length
      ? `Skills to prioritize before/while breaking in: ${occupation.skills_to_build_first.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `Write a personalized career roadmap for someone who matched to "${occupation.title}" (${occupation.description}, top skills: ${occupation.top_skills.join(", ")}, typical education: ${occupation.education_level}).
${advisoryContext ? `\nReal advisory context for this specific role — ground your milestones in this rather than generic advice:\n${advisoryContext}\n` : ""}
They are ${LIFE_STAGE_BRIEF[lifeStage]}

Respond with ONLY valid JSON matching this exact shape, no markdown fences, no preamble:
{"headline": string, "milestones": [{"timeframe": string, "title": string, "description": string}], "networkingScript": string (optional, only include for university/early_career/career_changer stages)}

Include 3-5 milestones ordered chronologically.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      });
      const text = response.content.find((b) => b.type === "text")?.text;
      if (!text) continue;
      const jsonText = text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(jsonText);
      if (parsed.headline && Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
        return parsed as RoadmapContent;
      }
    } catch {
      // fall through to retry, then to template fallback
    }
  }
  return null;
}

export async function generateRoadmap(occupation: Occupation, lifeStage: LifeStage): Promise<RoadmapContent> {
  const llmResult = await callClaude(occupation, lifeStage);
  return llmResult ?? templatedRoadmap(occupation, lifeStage);
}
