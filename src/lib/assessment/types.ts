// Shared shape between a user's trait vector and an occupation's trait_profile,
// so matching is a plain cosine similarity over the same dimensions.
export type TraitVector = {
  quadrant_a: number; // analytical / quantitative
  quadrant_b: number; // sequential / structured
  quadrant_c: number; // relational / interpersonal
  quadrant_d: number; // experimental / big-picture
  builder_instinct: number; // hands-on / iterative / makes-to-think, not just plans-then-builds
  pace_preference: number; // 0 = slow/deliberate, 1 = fast/urgent
  risk_tolerance: number; // 0 = risk-averse, 1 = risk-seeking
};

export type LifeStage = "high_school" | "university" | "early_career" | "career_changer";

export type ModuleLog = {
  chapterId: "analyst" | "physician" | "executive" | "founder" | "builder";
  sceneId: string;
  timeTakenMs: number;
  choiceSelected: string;
  revisionsMade: number;
  extra?: Record<string, unknown>;
};

export type ResumeStatus = "solid" | "needs_work" | "dont_have_one";

export type SelfReport = {
  lifeStage: LifeStage;
  /** Field of study (high_school/university) or current role/field (early_career/career_changer). */
  currentFocus: string;
  furtherSchooling: "yes" | "no" | "maybe";
  geographicFlexibility: "local" | "national" | "global";
  location: string;
  values: string[];
  /** Current GPA, only meaningful for high_school/university, shown conditionally. */
  currentGPA: string;
  /** Clubs, extracurriculars, projects, or jobs they're already doing. */
  currentActivities: string;
  resumeStatus: ResumeStatus;
  additionalContext: string;
};
