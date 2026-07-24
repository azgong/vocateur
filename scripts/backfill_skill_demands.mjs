// Backfills occupations.skill_demands from title/skill keywords.
// Deterministic and idempotent: safe to re-run after adding occupations.
// Demands are 0-1 with 0.5 neutral; matching only uses values far from 0.5.
//
// Usage: node scripts/backfill_skill_demands.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envRaw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const NEUTRAL = { reaction: 0.5, sequence_memory: 0.5, visual_memory: 0.5, typing: 0.5, precision: 0.5 };

// Ordered rules; every matching rule applies, later rules can override
// earlier ones for more specific roles (e.g. surgeon over physician).
const RULES = [
  // Software, data, quant
  {
    match: /(software|developer|programmer|data scientist|data engineer|machine learning|ai engineer|cybersecurity|devops|web developer|game developer|quantitative)/i,
    set: { typing: 0.85, sequence_memory: 0.8 },
  },
  // Engineering (physical disciplines)
  {
    match: /(mechanical|electrical|civil|aerospace|chemical|biomedical|industrial|nuclear|petroleum|robotics|structural) engineer/i,
    set: { sequence_memory: 0.75, visual_memory: 0.7, precision: 0.65 },
  },
  // Writing-heavy
  {
    match: /(writer|journalist|editor|copywriter|technical writer|communications|content)/i,
    set: { typing: 0.85, sequence_memory: 0.6 },
  },
  // Visual and spatial fields
  {
    match: /(designer|architect|animator|illustrator|photographer|videographer|artist|ux|ui)/i,
    set: { visual_memory: 0.85, precision: 0.7 },
  },
  // Fast-market finance
  {
    match: /(trader|trading|investment banker|hedge fund)/i,
    set: { reaction: 0.8, sequence_memory: 0.7, typing: 0.65 },
  },
  // Structured analytical professions
  {
    match: /(accountant|auditor|actuary|lawyer|attorney|paralegal|compliance|underwriter|financial analyst|economist)/i,
    set: { sequence_memory: 0.75, typing: 0.7 },
  },
  // Research and academia
  {
    match: /(scientist|researcher|professor|physicist|chemist|biologist|mathematician|statistician|epidemiologist)/i,
    set: { sequence_memory: 0.75, typing: 0.65, precision: 0.6 },
  },
  // Acute-care medicine
  {
    match: /(physician|doctor|nurse|paramedic|emt|emergency|anesthesi|respiratory therapist|physician assistant)/i,
    set: { reaction: 0.8, sequence_memory: 0.8, precision: 0.7 },
  },
  // Fine-motor medicine (overrides acute-care where both match)
  {
    match: /(surgeon|surgical|dentist|orthodontist|veterinarian|optometrist|radiolog|sonographer|phlebotom)/i,
    set: { precision: 0.95, visual_memory: 0.8, sequence_memory: 0.75, reaction: 0.65 },
  },
  // Aviation and control
  {
    match: /(pilot|air traffic|drone|aviation)/i,
    set: { reaction: 0.9, visual_memory: 0.85, precision: 0.85, sequence_memory: 0.8 },
  },
  // Precision trades and lab work
  {
    match: /(electrician|machinist|technician|welder|mechanic|lab tech|laboratory|pharmacist)/i,
    set: { precision: 0.8, visual_memory: 0.65, sequence_memory: 0.65 },
  },
];

function demandsFor(title, skills) {
  const haystack = `${title} ${skills?.join(" ") ?? ""}`;
  const demands = { ...NEUTRAL };
  let matched = false;
  for (const rule of RULES) {
    if (rule.match.test(haystack)) {
      Object.assign(demands, rule.set);
      matched = true;
    }
  }
  return { demands, matched };
}

const { data: occupations, error } = await admin.from("occupations").select("id, title, top_skills");
if (error) {
  console.error(error);
  process.exit(1);
}

let matchedCount = 0;
for (const occ of occupations) {
  const { demands, matched } = demandsFor(occ.title, occ.top_skills);
  if (matched) matchedCount++;
  const { error: updateError } = await admin.from("occupations").update({ skill_demands: demands }).eq("id", occ.id);
  if (updateError) {
    console.error(`Failed for ${occ.title}:`, updateError.message);
    process.exit(1);
  }
}

console.log(`Backfilled ${occupations.length} occupations (${matchedCount} with distinctive demands, rest neutral).`);
