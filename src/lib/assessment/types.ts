// Shared shape between a user's trait vector and an occupation's trait_profile,
// so matching is a plain cosine similarity over the same dimensions.
export type TraitVector = {
  quadrant_a: number; // analytical / quantitative
  quadrant_b: number; // sequential / structured
  quadrant_c: number; // relational / interpersonal
  quadrant_d: number; // experimental / big-picture
  pace_preference: number; // 0 = slow/deliberate, 1 = fast/urgent
  risk_tolerance: number; // 0 = risk-averse, 1 = risk-seeking
};

export type LifeStage = "high_school" | "university" | "early_career" | "career_changer";

export type ModuleLog = {
  moduleId: "analyst" | "physician" | "executive" | "founder";
  timeTakenMs: number;
  choiceSelected: string;
  revisionsMade: number;
  extra?: Record<string, unknown>;
};

export type SelfReport = {
  furtherSchooling: "yes" | "no" | "maybe";
  geographicFlexibility: "local" | "national" | "global";
  values: string[];
  lifeStage: LifeStage;
};
