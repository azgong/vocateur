// Backfills occupations.field_tags from title/description/education/top_skills
// keywords. Deterministic and idempotent: safe to re-run after adding
// occupations. Keyword list is kept in sync by hand with
// src/lib/assessment/fieldTags.ts (that file can't be imported directly from
// a plain .mjs script without a TS loader).
//
// Usage: node scripts/backfill_field_tags.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envRaw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const FIELD_KEYWORDS = {
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

function classify(text) {
  const lower = text.toLowerCase();
  return Object.keys(FIELD_KEYWORDS).filter((tag) => FIELD_KEYWORDS[tag].some((kw) => lower.includes(kw)));
}

const { data: occupations, error } = await admin
  .from("occupations")
  .select("id, title");
if (error) throw error;

console.log(`Classifying ${occupations.length} occupations...`);

let tagged = 0;
let untagged = 0;
const tagCounts = {};

// Title only, deliberately: the free-text description is prose that
// incidentally name-drops adjacent concepts, employers, and skills (e.g.
// "a wave of chip startups", "requires strong management") which caused
// false positives when tried. A short, deliberately-worded title is much
// lower-noise, worth the recall we give up for the precision we get back.
for (const occ of occupations) {
  const blob = occ.title;
  const tags = classify(blob);
  if (tags.length === 0) untagged++;
  else tagged++;
  for (const t of tags) tagCounts[t] = (tagCounts[t] ?? 0) + 1;

  const { error: updateErr } = await admin.from("occupations").update({ field_tags: tags }).eq("id", occ.id);
  if (updateErr) {
    console.error(`Failed to update ${occ.title}:`, updateErr.message);
  }
}

console.log(`Done. Tagged: ${tagged}, untagged: ${untagged}`);
console.log("Tag distribution:", JSON.stringify(tagCounts, null, 2));
