-- Per-occupation demand (0-1) for each Skill Lab dimension:
-- reaction, sequence_memory, visual_memory, typing, precision.
-- 0.5 is neutral; values are set by scripts/backfill_skill_demands.mjs
-- from occupation titles and skills, and only distinctive values
-- (far from 0.5) influence matching.
alter table public.occupations
  add column if not exists skill_demands jsonb;
