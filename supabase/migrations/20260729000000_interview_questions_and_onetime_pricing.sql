-- Static, per-occupation mock-interview question bank (replaces the LLM-based
-- mock interview: authored once offline via scripts/generate-interview-questions.mjs,
-- read at request time with zero per-user API cost).
alter table occupations add column interview_questions jsonb;

-- Switch billing from monthly/annual subscriptions to a single one-time
-- "lifetime" payment. No existing rows use 'monthly' or 'annual' (verified
-- before this migration), so this is a clean swap, not a backfill.
alter table profiles drop constraint profiles_subscription_plan_check;
alter table profiles add constraint profiles_subscription_plan_check
  check (subscription_plan in ('lifetime'));
