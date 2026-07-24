import { writeFileSync } from "node:fs";
import { occupationsBatch2, DATA_AS_OF } from "./occupations-batch2-data.mjs";

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlStringOrNull(value) {
  return value === null || value === undefined ? "null" : sqlString(value);
}

function sqlNumberOrNull(value) {
  return value === null || value === undefined ? "null" : String(value);
}

function sqlArray(values) {
  return `ARRAY[${values.map(sqlString).join(", ")}]::text[]`;
}

function sqlArrayOrNull(values) {
  return values === null || values === undefined ? "null" : sqlArray(values);
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const rows = occupationsBatch2.map((o) => {
  return `  (${sqlString(o.title)}, ${sqlString(o.description)}, ${o.median_salary}, ${o.growth_pct}, ${sqlString(o.education_level)}, ${sqlArray(o.top_skills)}, ${sqlJson(o.trait_profile)}, ${sqlString(DATA_AS_OF)}::date, ${sqlStringOrNull(o.soc_code)}, ${sqlNumberOrNull(o.bls_change_pct_2024_34)}, ${sqlNumberOrNull(o.bls_median_wage_2024)}, ${sqlNumberOrNull(o.bls_annual_openings_thousands)}, ${sqlStringOrNull(o.bls_match_confidence)}, ${sqlStringOrNull(o.bls_match_note)}, ${sqlStringOrNull(o.how_to_break_in)}, ${sqlStringOrNull(o.typical_progression)}, ${sqlArrayOrNull(o.skills_to_build_first)}, ${sqlStringOrNull(o.common_misconceptions)}, ${sqlStringOrNull(o.interview_focus)})`;
});

const sql = `-- Batch 2 occupation expansion (2026-07-23): 32 additions deepening coverage
-- for ambitious students: space/aerospace (propulsion, GNC, flight test,
-- satellite systems, mission ops, astronaut), missing medical specialties
-- (neurosurgery, plastics, ophthalmology, OB/GYN, CRNA, optometry, MD-PhD),
-- research/academia (neuroscience, quantum, math, climate, national labs,
-- policy), tech (chip design, AI safety, engineering management, quant dev,
-- embedded), government prestige tracks (air traffic control, FBI,
-- intelligence), corporate (strategy, sales engineering), and creative
-- outliers (industrial design, fashion, screenwriting).
--
-- BLS fields reuse programmatically verified batch-1 numbers where the SOC
-- code already existed in the catalog; SOC codes NEW in this batch carry
-- best-effort values from the same 2024-34 Employment Projections cycle,
-- marked bls_match_confidence 'approximate' with a note, and are flagged for
-- founder verification against Table 1.2. Additive only: no existing rows
-- are touched. See scripts/occupations-batch2-data.mjs.

insert into occupations (
  title, description, median_salary, growth_pct, education_level, top_skills, trait_profile, data_as_of,
  soc_code, bls_change_pct_2024_34, bls_median_wage_2024, bls_annual_openings_thousands, bls_match_confidence, bls_match_note,
  how_to_break_in, typical_progression, skills_to_build_first, common_misconceptions, interview_focus
)
values
${rows.join(",\n")};
`;

writeFileSync(new URL("../supabase/migrations/20260723000002_seed_occupations_batch2.sql", import.meta.url), sql);
console.log(`Wrote ${occupationsBatch2.length} batch-2 occupations to migration file.`);
