-- Field-of-study/field-of-work tags per occupation, so a user's stated major
-- or current work can act as a real signal in matching, not just LLM prompt
-- context. Backfilled by scripts/backfill_field_tags.mjs against the shared
-- taxonomy in src/lib/assessment/fieldTags.ts.
alter table occupations add column field_tags text[];
