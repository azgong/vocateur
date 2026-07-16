import { writeFileSync } from "node:fs";
import { occupations, DATA_AS_OF } from "./occupations-data.mjs";

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArray(values) {
  return `ARRAY[${values.map(sqlString).join(", ")}]::text[]`;
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const rows = occupations.map((o) => {
  return `  (${sqlString(o.title)}, ${sqlString(o.description)}, ${o.median_salary}, ${o.growth_pct}, ${sqlString(o.education_level)}, ${sqlArray(o.top_skills)}, ${sqlJson(o.trait_profile)}, ${sqlString(DATA_AS_OF)}::date)`;
});

const sql = `-- Seeded once from a manual O*NET + BLS-informed draft pass (see scripts/occupations-data.mjs).
-- Trait profiles are an LLM-assisted draft — reviewed once by the founder before launch, not per-user or live.
insert into occupations (title, description, median_salary, growth_pct, education_level, top_skills, trait_profile, data_as_of)
values
${rows.join(",\n")};
`;

writeFileSync(new URL("../supabase/migrations/20260716000001_seed_occupations.sql", import.meta.url), sql);
console.log(`Wrote ${occupations.length} occupations to migration file.`);
