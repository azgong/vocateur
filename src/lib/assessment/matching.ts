import { TraitVector } from "./types";
import { cosineSimilarity } from "./scoring";

export type Occupation = {
  id: string;
  title: string;
  description: string;
  median_salary: number;
  growth_pct: number;
  education_level: string;
  top_skills: string[];
  trait_profile: TraitVector;
  data_as_of: string;
};

export type Match = {
  occupation: Occupation;
  fitScore: number; // 0-100
};

export function rankMatches(userVector: TraitVector, occupations: Occupation[]): Match[] {
  return occupations
    .map((occupation) => ({
      occupation,
      fitScore: Math.round(cosineSimilarity(userVector, occupation.trait_profile) * 100),
    }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 10);
}
