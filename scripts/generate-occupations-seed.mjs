import { writeFileSync } from "node:fs";
import { occupations, alternativePaths, DATA_AS_OF } from "./occupations-data.mjs";

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

const all = [...occupations, ...alternativePaths];

const rows = all.map((o) => {
  return `  (${sqlString(o.title)}, ${sqlString(o.description)}, ${o.median_salary}, ${o.growth_pct}, ${sqlString(o.education_level)}, ${sqlArray(o.top_skills)}, ${sqlJson(o.trait_profile)}, ${sqlString(DATA_AS_OF)}::date, ${sqlStringOrNull(o.soc_code)}, ${sqlNumberOrNull(o.bls_change_pct_2024_34)}, ${sqlNumberOrNull(o.bls_median_wage_2024)}, ${sqlNumberOrNull(o.bls_annual_openings_thousands)}, ${sqlStringOrNull(o.bls_match_confidence)}, ${sqlStringOrNull(o.bls_match_note)}, ${sqlStringOrNull(o.how_to_break_in)}, ${sqlStringOrNull(o.typical_progression)}, ${sqlArrayOrNull(o.skills_to_build_first)}, ${sqlStringOrNull(o.common_misconceptions)}, ${sqlStringOrNull(o.interview_focus)})`;
});

const sql = `-- Adds real BLS employment-outlook data (2024-2034 Employment Projections, Table 1.2,
-- bls.gov/emp) and structured career-advisory content (how to break in, typical
-- progression, skills to build first, common misconceptions, interview focus) to
-- every occupation. BLS fields are null where no clean SOC-code match exists
-- (bls_match_confidence = 'no_match') rather than a fabricated number. Advisory
-- content is an LLM-assisted draft, flagged for founder review before launch —
-- same pattern as the trait_profile data. See scripts/occupations-data.mjs.
delete from occupations;

insert into occupations (
  title, description, median_salary, growth_pct, education_level, top_skills, trait_profile, data_as_of,
  soc_code, bls_change_pct_2024_34, bls_median_wage_2024, bls_annual_openings_thousands, bls_match_confidence, bls_match_note,
  how_to_break_in, typical_progression, skills_to_build_first, common_misconceptions, interview_focus
)
values
${rows.join(",\n")};
`;

writeFileSync(new URL("../supabase/migrations/20260720000001_seed_advisor_data.sql", import.meta.url), sql);
console.log(`Wrote ${all.length} occupations (${occupations.length} main + ${alternativePaths.length} alternative) to migration file.`);
