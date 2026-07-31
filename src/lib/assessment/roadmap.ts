import Anthropic from "@anthropic-ai/sdk";
import { LifeStage, ResumeStatus, SelfReport } from "./types";
import { Occupation } from "./matching";
import { SkillScores, describeSkillScores } from "./games";

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

export type MajorStatus = "recommended" | "alternative" | "avoid";

export type MajorMatch = {
  name: string;
  status: MajorStatus;
  note: string;
};

export type RoadmapContent = {
  headline: string;
  majors: MajorMatch[];
  milestones: RoadmapMilestone[];
  networking: {
    whoToContact: string;
    howToOutreach: string;
    templates: OutreachTemplate[];
  };
  resources: RoadmapResource[];
};

const HIGH_SCHOOL_GRADE_ORDER = [
  "6th grade or earlier",
  "7th grade",
  "8th grade",
  "9th grade (Freshman)",
  "10th grade (Sophomore)",
  "11th grade (Junior)",
  "12th grade (Senior)",
];

const UNIVERSITY_YEAR_ORDER = [
  "1st year (Freshman)",
  "2nd year (Sophomore)",
  "3rd year (Junior)",
  "4th year (Senior)",
  "5th+ year / Graduate",
];

/**
 * The exact ordered list of milestone labels to use, computed in code rather
 * than left to the model to count grades correctly. Returns null when the
 * life stage has no grade/year concept, or the stored grade is unrecognized
 * (e.g. a pre-existing session from before this field existed), in which
 * case the prompt falls back to non-mechanical guidance.
 */
function yearByYearPlan(lifeStage: LifeStage, currentGradeOrYear: string): string[] | null {
  if (lifeStage === "high_school") {
    const freshmanIdx = HIGH_SCHOOL_GRADE_ORDER.indexOf("9th grade (Freshman)");
    const idx = HIGH_SCHOOL_GRADE_ORDER.indexOf(currentGradeOrYear);
    if (idx === -1) return null;
    if (idx < freshmanIdx) return ["Middle school (now through 8th grade)", ...HIGH_SCHOOL_GRADE_ORDER.slice(freshmanIdx)];
    return HIGH_SCHOOL_GRADE_ORDER.slice(idx);
  }
  if (lifeStage === "university") {
    const idx = UNIVERSITY_YEAR_ORDER.indexOf(currentGradeOrYear);
    if (idx === -1) return null;
    return [...UNIVERSITY_YEAR_ORDER.slice(idx), "After graduation: landing the role"];
  }
  return null;
}

function lifeStageGuidance(selfReport: SelfReport): string {
  const plan = yearByYearPlan(selfReport.lifeStage, selfReport.currentGradeOrYear);

  if (plan) {
    const list = plan.map((label, i) => `${i + 1}. "${label}"`).join("\n");
    return `${selfReport.lifeStage === "high_school" ? "a middle/high school student" : "a university student"}, currently in: ${selfReport.currentGradeOrYear || "an unspecified year"}.

This roadmap MUST be structured year-by-year, not generic. Produce EXACTLY one milestone per entry below, in this exact order, using the entry text as that milestone's "timeframe" verbatim, one-to-one, no skipping, no combining two entries into one milestone, no adding extra milestones outside this list:
${list}

Each grade/year builds on the last: earlier entries should be foundational and exploratory (join, try, take the intro course), middle entries should escalate into real involvement and competition (compete, seek a research role, take on responsibility), and the final 1-2 entries should be about converting that foundation into the actual outcome (apply, ship a capstone, land the specific target). Don't repeat the same generic advice ("join a club", "network") at every level, each grade's actions should be a clear escalation from the one before it.`;
  }

  const STAGE_FALLBACK: Record<LifeStage, string> = {
    high_school:
      "a middle/high school student whose exact grade wasn't provided. Structure this by rough phase (now, next 1-2 years, before applying) but still be maximally specific within each phase: recommended extracurriculars specific to this career, target grade/GPA benchmarks, relevant university programs and example target schools, recommended entry-level internships, summer programs, or shadowing opportunities, and suggested course/subject focus.",
    university:
      "a university student whose exact year wasn't provided. Structure this by rough phase (this year, next year, before graduating) but still be maximally specific within each phase: target GPA guidance, relevant campus activities/clubs, labs or research groups to seek out, internship targets by year, currently-relevant entry-level job types to research, and specific people/roles to network toward.",
    early_career:
      "early in their career. Structure this as a granular near-term plan across the next 12-18 months (not just 3 broad chunks): relevant certifications, lateral-move internships or bootcamps where applicable, realistic first moves toward this field, and specific people/roles to network toward.",
    career_changer:
      "an older career changer. Structure this as a granular, realistic transition timeline across the next 12-24 months (not just 3 broad chunks): relevant certifications, lateral-move internships or bootcamps where applicable, networking paths suited to their stage, and a realistic timeline for a transition into this field.",
  };
  return STAGE_FALLBACK[selfReport.lifeStage];
}

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
      majors: [],
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
      majors: [],
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
      majors: [],
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
      majors: [],
      resources: [],
    },
  };
  const content = base[lifeStage];
  if (breakInMilestone) {
    content.milestones = [...content.milestones, breakInMilestone];
  }
  return content;
}

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
    `Resume/LinkedIn status: ${RESUME_BRIEF[selfReport.resumeStatus]}`,
    selfReport.geographicFlexibility === "local" ? "They want to stay local. Don't suggest relocating." : null,
    selfReport.furtherSchooling === "no" ? "They do not want more formal schooling. Favor certifications, self-study, and on-the-job paths over degree programs." : null,
    selfReport.values.length ? `What matters most to them at work: ${selfReport.values.join(", ")}. Let this shape which milestones you emphasize.` : null,
    selfReport.additionalContext ? `Additional context they shared directly: ${selfReport.additionalContext}` : null,
    skillLine(selfReport),
  ].filter(Boolean);
  return lines.join("\n");
}

function skillLine(selfReport: SelfReport): string | null {
  const scores = (selfReport as SelfReport & { skillScores?: SkillScores }).skillScores;
  const summary = describeSkillScores(scores);
  return summary
    ? `Measured Skill Lab results (objective quick-game measurements of reflexes, memory, typing, precision): ${summary}. Where a milestone leans on one of these, acknowledge a measured strength or coach the gap concretely instead of ignoring it.`
    : null;
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

  const plan = yearByYearPlan(selfReport.lifeStage, selfReport.currentGradeOrYear);
  const milestoneCountInstruction = plan
    ? `Produce EXACTLY ${plan.length} milestones, one per entry in the year-by-year list above, in that exact order.`
    : `Produce 6-8 milestones ordered chronologically.`;

  const prompt = `Write a highly detailed, personalized career roadmap for someone who matched to "${occupation.title}" (${occupation.description}, top skills: ${occupation.top_skills.join(", ")}, typical education: ${occupation.education_level}).
${advisoryContext ? `\nReal advisory context for this specific role. Ground your milestones in this rather than generic advice:\n${advisoryContext}\n` : ""}
They are ${lifeStageGuidance(selfReport)}

PERSONAL CONTEXT, use this to make milestones genuinely specific to this person, not generic:
${personalContextBlock(selfReport)}

Give the single most direct, complete path into this exact field, don't hedge or soften it into a slower plan. Assume they'll make time for whatever it actually takes to get in; a simpler, dumbed-down version isn't needed here, be as clear and self-contained as possible since this is the only guidance they'll get, and it can also be exported as a PDF.

BE AS SPECIFIC AND CONCRETE AS POSSIBLE. This is the whole point of the product, and the main way it fails is being too generic. A bad milestone says "join a club related to your major and network with professionals." A good milestone says something like: "Join the Aerospace Club and aim for a leadership role by next year. Email one professor running a propulsion or fluid dynamics lab and ask to shadow for an afternoon, most say yes to a specific, low-commitment ask like this. Enter the school's engineering fair with a project that touches ${occupation.top_skills[0] ?? "this field's core skill"}, even a rough one, since having entered at all matters more than winning." Every milestone should read like the second example, not the first: name the actual club, competition, lab type, or program, and give a reason to do it now rather than later.
- Use exact numbers where they'd realistically apply: specific GPA targets, specific test score ranges, specific timeframes.
- Name real, specific courses (e.g. "AP Computer Science A", "Linear Algebra", not just "math classes").
- Name real, specific extracurriculars, competitions, or clubs relevant to this exact field, not generic "join a club." Where a real named national competition or club exists for this field (e.g. a specific olympiad, a specific student org), name it.
- Name real internship programs, fellowships, summer programs, research opportunities, or bootcamps that actually exist for this field and this life stage. Only include a URL for a named program if you are confident it is a real, stable, well-known URL (like a program's own official site). If you are not confident of the exact URL, give the program name only and leave url out rather than guessing.
- Escalate responsibility over time instead of repeating the same advice at every stage: earlier milestones are about exploring and joining, middle milestones are about competing, deepening, or seeking out a real research/work role (e.g. "by this stage, stop shadowing and try to actually join a lab's research team, even in a small capacity"), and the final milestones are about converting all of it into the actual outcome (applications, a capstone project, a portfolio, a specific target).
- Every milestone's description must include a one-clause justification tying it to THIS person specifically: something they're measurably good at (a Skill Lab result), something they already do (their listed activities), or something they said matters to them, not a generic reason that would apply to anyone.
- For each milestone, write a description of 2-4 sentences (short paragraph, not one line) that both explains the milestone AND its personal justification, plus a list of specific, concrete actionItems (4-6 bullet-style items each, each one a complete, named, actionable instruction, not a vague theme).
- Include a dedicated networking section: who specifically to reach out to (roles, seniority, where to find them), how to actually reach out (which channel/platform works best for this field and life stage), and 2-3 real outreach message templates they could send with minimal editing (use [Name] as a placeholder for the recipient's name).
- Include a resources list of 3-6 real, named programs, communities, or tools relevant to this specific field and life stage (internships, fellowships, certifications, communities, notable newsletters or publications). Only include a URL when you're confident it's correct.
- Include a major-matching section: 4-7 real, specific college/university majors relevant to this field, each tagged "recommended" (the most direct, common path in), "alternative" (works but is a less direct path, or a hybrid/adjacent field), or "avoid" (a major people mistakenly assume helps but doesn't actually prepare someone for this role, or is a common wrong turn). Include at least one "avoid" entry if a genuine common misconception exists for this field; omit it only if none does. Each entry needs a one-sentence "note" explaining why, specific to this field, not generic.

Respond with ONLY valid JSON matching this exact shape, no markdown fences, no preamble:
{
  "headline": string,
  "majors": [{"name": string, "status": "recommended" | "alternative" | "avoid", "note": string}],
  "milestones": [{"timeframe": string, "title": string, "description": string, "actionItems": string[]}],
  "networking": {"whoToContact": string, "howToOutreach": string, "templates": [{"label": string, "message": string}]},
  "resources": [{"name": string, "description": string, "url": string (optional, omit if not confident)}]
}

${milestoneCountInstruction} Include 4-7 majors, 2-3 networking templates, and 3-6 resources. Never use an em dash anywhere in your response; use a period, comma, or colon instead. Plain text only in every field, no markdown (no asterisks, no bold, no headers). End every complete sentence with a period.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 10000,
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
        return { ...parsed, majors: Array.isArray(parsed.majors) ? parsed.majors : [] } as RoadmapContent;
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
