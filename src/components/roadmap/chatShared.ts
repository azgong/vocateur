import { LifeStage } from "@/lib/assessment/types";

export type Message = { role: "user" | "assistant"; content: string };
export type ChatMode = "advisor" | "mock_interview";

export const MODE_META: Record<ChatMode, { label: string; placeholder: string; starter: string; empty: string }> = {
  advisor: {
    label: "Ask your advisor",
    placeholder: "Why didn't nursing rank higher for me?",
    starter: "",
    empty: "Ask anything about your results, this career, or how to actually reach your roadmap milestones.",
  },
  mock_interview: {
    label: "Mock interview",
    placeholder: "Type your answer…",
    starter: "I'm ready to start the mock interview.",
    empty: "Start a realistic mock interview for your matched role: one question at a time, with real feedback.",
  },
};

export type SuggestedPrompt = { label: string; fill: string };

const JOB_SEARCH_PROMPTS: SuggestedPrompt[] = [
  { label: "Review my resume", fill: "Can you review my resume for this role? Here it is: " },
  { label: "Analyze a job posting", fill: "Am I a good fit for this posting, and what should I highlight? Here it is: " },
  { label: "Help me negotiate an offer", fill: "I have an offer and want help negotiating. Here are the details: " },
  { label: "Review my LinkedIn", fill: "Can you review my LinkedIn headline and About section? Here it is: " },
];

const STILL_CHOOSING_PROMPTS: SuggestedPrompt[] = [
  { label: "Which courses matter?", fill: "Which classes or subjects should I actually prioritize for this career? " },
  { label: "Extracurriculars that help", fill: "What extracurriculars, clubs, or programs would genuinely help me here? " },
  { label: "How do I get first exposure?", fill: "How can I get real exposure to this field now, shadowing, projects, competitions? " },
  { label: "Convince my parents", fill: "How do I explain this path to parents who aren't sure about it? " },
];

export const SUGGESTED_PROMPTS: Record<LifeStage, SuggestedPrompt[]> = {
  high_school: STILL_CHOOSING_PROMPTS,
  university: STILL_CHOOSING_PROMPTS,
  early_career: JOB_SEARCH_PROMPTS,
  career_changer: JOB_SEARCH_PROMPTS,
};
