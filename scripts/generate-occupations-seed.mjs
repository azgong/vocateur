import { writeFileSync } from "node:fs";
import { occupations, alternativePaths, DATA_AS_OF } from "./occupations-data.mjs";

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArray(values) {
  return `ARRAY[${values.map(sqlString).join(", ")}]::text[]`;
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const all = [...occupations, ...alternativePaths];

const rows = all.map((o) => {
  return `  (${sqlString(o.title)}, ${sqlString(o.description)}, ${o.median_salary}, ${o.growth_pct}, ${sqlString(o.education_level)}, ${sqlArray(o.top_skills)}, ${sqlJson(o.trait_profile)}, ${sqlString(DATA_AS_OF)}::date)`;
});

const sql = `-- Rebalanced 2026-07-18 per founder review: heavily weighted toward high-earning,
-- "ambitious grad" career paths (finance, tech, healthcare, law, engineering,
-- bioengineering, pharma, consulting), with a small, deliberately secondary
-- alternative-paths set (trades, aviation, hospitality, etc.) at the end.
-- Trait profiles are an LLM-assisted draft — reviewed once by the founder before
-- launch, not per-user or live. See scripts/occupations-data.mjs for the source.
delete from occupations;

insert into occupations (title, description, median_salary, growth_pct, education_level, top_skills, trait_profile, data_as_of)
values
${rows.join(",\n")};
`;

writeFileSync(new URL("../supabase/migrations/20260718000000_rebalance_occupations.sql", import.meta.url), sql);
console.log(`Wrote ${all.length} occupations (${occupations.length} main + ${alternativePaths.length} alternative) to migration file.`);
