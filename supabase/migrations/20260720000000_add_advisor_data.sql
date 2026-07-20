-- Adds real BLS employment-outlook data and structured career-advisory content
-- to occupations, so the AI advisor chat and roadmap can ground answers in
-- real, sourced data instead of general model knowledge. Nullable throughout:
-- not every occupation has a clean BLS match (see bls_match_confidence).

alter table occupations
  add column soc_code text,
  add column bls_change_pct_2024_34 numeric,
  add column bls_median_wage_2024 numeric,
  add column bls_annual_openings_thousands numeric,
  add column bls_match_confidence text check (bls_match_confidence in ('exact', 'close', 'approximate', 'no_match')),
  add column bls_match_note text,
  add column how_to_break_in text,
  add column typical_progression text,
  add column skills_to_build_first text[],
  add column common_misconceptions text,
  add column interview_focus text;

comment on column occupations.bls_change_pct_2024_34 is 'Real U.S. Bureau of Labor Statistics Employment Projections, 2024-2034 cycle, Table 1.2. Source: bls.gov/emp/tables/occupational-projections-and-characteristics.htm';
comment on column occupations.bls_match_confidence is 'How well this occupation maps to a single BLS detailed occupation code — exact/close/approximate/no_match. Null BLS fields when no_match.';
