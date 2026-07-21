import Anthropic from "@anthropic-ai/sdk";
import { LifeStage, ResumeStatus, SelfReport, WeeklyTimeAvailable } from "./types";
import { Occupation } from "./matching";

export type RoadmapMilestone = {
  timeframe: string;
  title: string;
  description: string;
  /** Specific, concrete action items: named courses, exact grade/GPA targets, named clubs or programs, named internships. */
  actionItems: string[];
};

export type OutreachTemplate = {
  label: string;
  message: string;
};

export type RoadmapResource = {
  name: string;
  description: string;
  url?: string;
};

export type RoadmapContent = {
  headline: string;
  milestones: RoadmapMilestone[];
  networking: {
    whoToContact: string;
    howToOutreach: string;
    templates: OutreachTemplate[];
  };
  resources: RoadmapResource[];
};

const LIFE_STAGE_BRIEF: Record<LifeStage, string> = {
  high_school:
    "a middle/high school student. Cover: recommended extracurriculars specific to this career, target grade/GPA benchmarks, relevant university programs and example target schools, recommended entry-level internships, summer programs, or shadowing opportunities, and suggested course/subject focus.",
  university:
    "a university student. Cover: target GPA guidance, relevant campus activities/clubs, labs or research groups to seek out, internship targets by year, currently-relevant entry-level job types to research, and specific people/roles to network toward.",
  early_career:
    "early in their career. Cover: relevant certifications, lateral-move internships or bootcamps where applicable, realistic first moves toward this field, and specific people/roles to network toward.",
  career_changer:
    "an older career changer. Cover: relevant certifications, lateral-move internships or bootcamps where applicable, networking paths suited to their stage, and a realistic timeline for a transition into this field.",
};

function templatedRoadmap(occupation: Occupation, lifeStage: LifeStage): RoadmapContent {
  const skill1 = occupation.top_skills[0]?.toLowerCase() ?? "core skills";
  const titleLower = occupation.title.toLowerCase();

  const breakInMilestone: RoadmapMilestone | null = occupation.how_to_break_in
    ? {
        timeframe: "How people actually get in",
        title: "Real entry path",
        description: occupation.how_to_break_in,
        actionItems: occupation.skills_to_build_first?.length
          ? occupation.skills_to_build_first.map((s) => `Build: ${s}`)
          : [],
      }
    : null;

  const base: Record<LifeStage, RoadmapContent> = {
    high_school: {
      headline: `Your path toward ${occupation.title} starts with the right foundation now.`,
      milestones: [
        {
          timeframe: "This year",
          title: "Course & GPA focus",
          description: `Prioritize classes that build toward ${titleLower} fundamentals (${occupation.top_skills.slice(0, 2).join(", ")}).`,
          actionItems: [
            "Target a 3.7+ unweighted GPA, prioritizing math, science, and any relevant electives",
            "Take the most advanced version of relevant courses your school offers (AP, IB, or honors)",
            "Keep at least one core skill area (writing, math, or a lab science) as a consistent strength",
          ],
        },
        {
          timeframe: "Next 1-2 years",
          title: "Extracurriculars & shadowing",
          description: `Look for clubs, competitions, or shadowing opportunities related to ${titleLower}.`,
          actionItems: [
            "Join or start a club directly related to this field",
            "Ask a teacher or family connection for a half-day shadowing opportunity",
            "Apply to one relevant summer program or pre-college course",
          ],
        },
        {
          timeframe: "Before applying",
          title: "Target programs",
          description: `Research university programs with strong ${occupation.education_level} tracks relevant to this field.`,
          actionItems: [
            "Build a list of 6-8 target schools with strong programs in this area",
            "Note each school's specific application deadlines and required tests",
          ],
        },
      ],
      networking: {
        whoToContact: `People currently working as ${titleLower}s, especially ones a few years into their career, plus any teachers or family friends adjacent to the field.`,
        howToOutreach: "A short, polite email or a warm introduction through a teacher or parent works best at this stage. Keep the ask small: 15 minutes, one or two questions.",
        templates: [
          {
            label: "Cold email to a professional",
            message: `Hi [Name], I'm a high school student exploring ${titleLower} as a career path and came across your background. Would you be open to a brief 15-minute call so I could ask a couple questions about what the work is actually like?`,
          },
        ],
      },
      resources: [],
    },
    university: {
      headline: `Here's how to build toward ${occupation.title} while you're still in school.`,
      milestones: [
        {
          timeframe: "This year",
          title: "Coursework & GPA",
          description: `Keep your GPA competitive and prioritize courses tied to ${occupation.top_skills.slice(0, 2).join(" and ")}.`,
          actionItems: [
            "Target a 3.5+ major GPA",
            "Declare or lean into a major directly relevant to this field",
            "Take at least one course beyond the minimum requirement in your strongest relevant skill area",
          ],
        },
        {
          timeframe: "This year",
          title: "Campus involvement",
          description: `Join clubs or research groups adjacent to ${titleLower}.`,
          actionItems: [
            "Join one relevant student organization and aim for a leadership role within a year",
            "Email one professor doing relevant research to ask about open positions",
          ],
        },
        {
          timeframe: "Next summer",
          title: "Internship target",
          description: `Aim for an internship that touches ${skill1} directly.`,
          actionItems: [
            "Apply broadly: aim for 15-20 relevant internship applications, not 3-4",
            "Get your resume reviewed by your school's career center before applying",
          ],
        },
        {
          timeframe: "Ongoing",
          title: "Network toward the role",
          description: `Reach out to people currently working as ${titleLower}s for informational conversations.`,
          actionItems: ["Aim for one informational conversation per month", "Follow up within a week of every conversation"],
        },
      ],
      networking: {
        whoToContact: `Alumni from your school now working as ${titleLower}s, plus junior-to-mid level professionals in the field (they remember being where you are).`,
        howToOutreach: "Your school's alumni database or LinkedIn alumni filter is the highest-conversion channel. Keep messages short and specific.",
        templates: [
          {
            label: "Alumni LinkedIn message",
            message: `Hi [Name], I'm a student at [Your School] interested in ${titleLower} and came across your profile through the alumni network. Would you be open to a brief 15-minute call so I could learn more about your path into the field?`,
          },
        ],
      },
      resources: [],
    },
    early_career: {
      headline: `A realistic first-move plan toward ${occupation.title}.`,
      milestones: [
        {
          timeframe: "Next 3 months",
          title: "Skill gap check",
          description: `Compare your current experience against what ${titleLower}s typically need: ${occupation.top_skills.slice(0, 2).join(", ")}.`,
          actionItems: ["List your 3 strongest transferable skills and your 2 biggest gaps", "Ask someone already in the role what they'd prioritize first"],
        },
        {
          timeframe: "Next 6 months",
          title: "Certification or bootcamp",
          description: "Look into a focused certification or bootcamp that closes the biggest gap.",
          actionItems: ["Pick one credential with real industry recognition, not just a certificate of completion"],
        },
        {
          timeframe: "Ongoing",
          title: "Lateral-move networking",
          description: `Connect with people who made a similar move into ${titleLower}.`,
          actionItems: ["Find 3-5 people who made a similar transition and ask how they did it"],
        },
      ],
      networking: {
        whoToContact: `People who made a similar lateral move into ${titleLower} within the last few years; their path is more comparable to yours than a lifelong specialist's.`,
        howToOutreach: "LinkedIn search filtered by 'previously [your current field]' plus a short, direct message works well here.",
        templates: [
          {
            label: "LinkedIn message to someone who made the same switch",
            message: `Hi [Name], I noticed you moved into ${titleLower} from a background similar to mine. I'm exploring the same move and would value 15 minutes to hear how you approached it, if you're open to it.`,
          },
        ],
      },
      resources: [],
    },
    career_changer: {
      headline: `A realistic transition timeline into ${occupation.title}.`,
      milestones: [
        {
          timeframe: "Next 3 months",
          title: "Skill gap check",
          description: `Identify which of your existing skills already transfer, and which of ${occupation.top_skills.slice(0, 2).join(", ")} need building.`,
          actionItems: ["Map your existing skills against this role's top requirements", "Identify the single biggest gap to close first"],
        },
        {
          timeframe: "Next 6-12 months",
          title: "Certification or bootcamp",
          description: "Consider a structured program suited to career changers rather than a full second degree where possible.",
          actionItems: ["Look for programs explicitly designed for career changers, they teach differently than traditional degree tracks"],
        },
        {
          timeframe: "Ongoing",
          title: "Networking at your stage",
          description: `Seek out other career changers who moved into ${titleLower}, not just traditional entrants. Their path is more comparable to yours.`,
          actionItems: ["Find a career-changer-specific community or group in this field"],
        },
      ],
      networking: {
        whoToContact: `Other career changers who moved into ${titleLower}, not lifelong specialists. Their path and concerns are much closer to yours.`,
        howToOutreach: "Career-changer-focused communities (Reddit, Slack groups, local meetups) tend to be more receptive than cold LinkedIn outreach at this stage.",
        templates: [
          {
            label: "Message to a fellow career changer",
            message: `Hi [Name], I'm transitioning into ${titleLower} from a different field and saw you made a similar move. Would you be open to a short call about what surprised you most in the transition?`,
          },
        ],
      },
      resources: [],
    },
  };
  const content = base[lifeStage];
  if (breakInMilestone) {
    content.milestones = [...content.milestones, breakInMilestone];
  }
  return content;
}

const TIMELINE_BRIEF: Record<SelfReport["timeline"], string> = {
  already_committed: "They're already committed to making this move. Treat the first milestone as something to act on immediately, not someday.",
  within_a_year: "They want real progress within the next year. Keep milestones concrete and near-term.",
  one_to_three_years: "They're working on a 1-3 year horizon. It's fine to include milestones that build over that longer window.",
  just_exploring: "They're still just exploring this path. Keep early milestones low-commitment (research, conversations, small projects) before anything that requires a big leap.",
};

const TIME_BRIEF: Record<WeeklyTimeAvailable, string> = {
  "1_3_hours": "They only have 1-3 hours a week for this. Keep action items small and specific enough to fit in short sessions, not open-ended projects.",
  "4_7_hours": "They have 4-7 hours a week. Milestones can include a real ongoing commitment (a club, a part-time project) alongside smaller tasks.",
  "8_plus_hours": "They have 8+ hours a week. You can include more ambitious action items: real internships, substantial side projects, structured coursework.",
};

const RESUME_BRIEF: Record<ResumeStatus, string> = {
  solid: "Their resume/LinkedIn is already solid. Focus outreach and application advice on targeting it to this specific field rather than rebuilding it.",
  needs_work: "Their resume/LinkedIn exists but needs work. Include at least one action item about reworking it toward this specific field's expectations.",
  dont_have_one: "They don't have a resume or LinkedIn yet. Include an early action item about building a first version, even a rough one, before they start reaching out to people.",
};

function personalContextBlock(selfReport: SelfReport): string {
  const lines = [
    selfReport.currentFocus ? `Current focus: ${selfReport.currentFocus}` : null,
    selfReport.currentGPA ? `Current GPA: ${selfReport.currentGPA}. Set grade targets relative to this, not generic advice.` : null,
    selfReport.currentActivities
      ? `Already doing: ${selfReport.currentActivities}. Build on this directly instead of suggesting they start from zero.`
      : null,
    selfReport.location ? `Location: ${selfReport.location}. Tailor examples (programs, employers, cost of living) to this where it genuinely helps.` : null,
    `Timeline: ${TIMELINE_BRIEF[selfReport.timeline]}`,
    `Time available: ${TIME_BRIEF[selfReport.weeklyTimeAvailable]}`,
    `Resume/LinkedIn status: ${RESUME_BRIEF[selfReport.resumeStatus]}`,
    selfReport.geographicFlexibility === "local" ? "They want to stay local. Don't suggest relocating." : null,
    selfReport.furtherSchooling === "no" ? "They do not want more formal schooling. Favor certifications, self-study, and on-the-job paths over degree programs." : null,
    selfReport.values.length ? `What matters most to them at work: ${selfReport.values.join(", ")}. Let this shape which milestones you emphasize.` : null,
    selfReport.additionalContext ? `Additional context they shared directly: ${selfReport.additionalContext}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

async function callClaude(occupation: Occupation, selfReport: SelfReport): Promise<RoadmapContent | null> {
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

  const prompt = `Write a highly detailed, personalized career roadmap for someone who matched to "${occupation.title}" (${occupation.description}, top skills: ${occupation.top_skills.join(", ")}, typical education: ${occupation.education_level}).
${advisoryContext ? `\nReal advisory context for this specific role. Ground your milestones in this rather than generic advice:\n${advisoryContext}\n` : ""}
They are ${LIFE_STAGE_BRIEF[selfReport.lifeStage]}

PERSONAL CONTEXT, use this to make milestones genuinely specific to this person, not generic:
${personalContextBlock(selfReport)}

BE AS SPECIFIC AND CONCRETE AS POSSIBLE. This is the whole point of the product: no generic advice.
- Use exact numbers where they'd realistically apply: specific GPA targets, specific test score ranges, specific timeframes.
- Name real, specific courses (e.g. "AP Computer Science A", "Linear Algebra", not just "math classes").
- Name real, specific extracurriculars, competitions, or clubs relevant to this exact field, not generic "join a club."
- Name real internship programs, fellowships, summer programs, or bootcamps that actually exist for this field and this life stage. Only include a URL for a named program if you are confident it is a real, stable, well-known URL (like a program's own official site). If you are not confident of the exact URL, give the program name only and leave url out rather than guessing.
- For each milestone, write a short 1-2 sentence description AND a list of specific, concrete actionItems (3-5 bullet-style items each). Mix short paragraphs with bullet points, don't make everything one style.
- Include a dedicated networking section: who specifically to reach out to (roles, seniority, where to find them), how to actually reach out (which channel/platform works best for this field and life stage), and 2-3 real outreach message templates they could send with minimal editing (use [Name] as a placeholder for the recipient's name).
- Include a resources list of 3-6 real, named programs, communities, or tools relevant to this specific field and life stage (internships, fellowships, certifications, communities, notable newsletters or publications). Only include a URL when you're confident it's correct.

Respond with ONLY valid JSON matching this exact shape, no markdown fences, no preamble:
{
  "headline": string,
  "milestones": [{"timeframe": string, "title": string, "description": string, "actionItems": string[]}],
  "networking": {"whoToContact": string, "howToOutreach": string, "templates": [{"label": string, "message": string}]},
  "resources": [{"name": string, "description": string, "url": string (optional, omit if not confident)}]
}

Include 4-6 milestones ordered chronologically, 2-3 networking templates, and 3-6 resources. Never use an em dash anywhere in your response; use a period, comma, or colon instead. Plain text only in every field, no markdown (no asterisks, no bold, no headers).`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 6000,
        messages: [{ role: "user", content: prompt }],
      });
      const text = response.content.find((b) => b.type === "text")?.text;
      if (!text) continue;
      const jsonText = text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(jsonText);
      if (
        parsed.headline &&
        Array.isArray(parsed.milestones) &&
        parsed.milestones.length > 0 &&
        parsed.networking &&
        Array.isArray(parsed.resources)
      ) {
        return parsed as RoadmapContent;
      }
      console.error("Roadmap generation: response missing expected fields", parsed);
    } catch (err) {
      console.error("Roadmap generation attempt failed:", err);
    }
  }
  return null;
}

export async function generateRoadmap(occupation: Occupation, selfReport: SelfReport): Promise<RoadmapContent> {
  const llmResult = await callClaude(occupation, selfReport);
  return llmResult ?? templatedRoadmap(occupation, selfReport.lifeStage);
}
