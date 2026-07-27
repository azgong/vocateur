// Shared field-of-study/field-of-work taxonomy, used both to tag occupations
// (at seed/backfill time, against title/description/education/top_skills)
// and to classify a user's free-text self-report answer (at match time), so
// the two sides are directly comparable. Keyword matching, not exhaustive,
// deliberately conservative: an occupation or answer that matches nothing
// stays untagged rather than forced into the nearest guess.
export const FIELD_TAGS = [
  "engineering",
  "computer_tech",
  "medicine_health",
  "science_research",
  "business_finance",
  "law_policy",
  "creative_arts",
  "education",
  "skilled_trades",
  "aviation_transport",
  "social_impact",
  "hospitality_service",
] as const;

export type FieldTag = (typeof FIELD_TAGS)[number];

const FIELD_KEYWORDS: Record<FieldTag, string[]> = {
  engineering: [
    "engineer", "engineering", "mechanical", "electrical engineer", "civil engineer",
    "aerospace", "industrial engineer", "chemical engineer", "manufacturing", "robotics",
    "structural engineer",
  ],
  computer_tech: [
    "computer science", "software", "programming", "developer", "data scien",
    "machine learning", "cybersecurity", "information technology", "computer engineer",
    "coding", "artificial intelligence", "web develop", "computer program",
  ],
  medicine_health: [
    "medicine", "medical", "pre-med", "premed", "physician", "doctor", "nursing", "nurse",
    "dental", "veterinary", "pharma", "biomedical", "clinical", "healthcare", "health care",
    "surgeon", "therapist", "psychiatr", "midwife", "physical therapy",
  ],
  science_research: [
    "biology", "chemistry", "physics", "environmental science", "research scientist",
    "laboratory", "biochem", "neuroscience", "astronomy", "geology", "mathematics",
    "statistics", "academia", "phd research", "biotech",
  ],
  business_finance: [
    "business", "finance", "accounting", "marketing", "economics", "mba",
    "entrepreneur", "founder", "startup founder", "sales", "consulting", "investment", "banking",
  ],
  law_policy: [
    "law", "pre-law", "prelaw", "legal", "attorney", "political science", "public policy",
    "government", "policy",
  ],
  creative_arts: [
    "designer", "graphic design", "fashion design", "industrial design", "game design",
    "interior design", "fine art", "artist", "artistic", "creative writing", "screenwrit",
    "film director", "music", "theater", "theatre", "photography", "illustration", "animation",
  ],
  education: ["education", "teaching", "teacher", "curriculum", "pedagogy"],
  skilled_trades: [
    "electrician", "plumb", "construction", "welding", "hvac", "automotive", "carpentry",
    "trade school",
  ],
  aviation_transport: [
    "pilot", "aviation", "aircraft", "air traffic", "flight", "logistics", "supply chain",
    "transportation",
  ],
  social_impact: [
    "social work", "nonprofit", "non-profit", "ngo", "public health", "counseling",
    "community organizing", "social impact",
  ],
  hospitality_service: ["culinary", "hospitality", "chef", "cosmetology", "personal care"],
};

/** Classifies a blob of free text into 0+ field tags via keyword matching. */
export function classifyFieldTags(text: string | null | undefined): FieldTag[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  return FIELD_TAGS.filter((tag) => FIELD_KEYWORDS[tag].some((kw) => lower.includes(kw)));
}
