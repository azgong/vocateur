-- Tracks whether a milestone check-in email has already gone out for a
-- roadmap, so the daily cron job never double-sends. Null = not sent yet.
alter table roadmaps
  add column reminder_30d_sent_at timestamptz,
  add column reminder_90d_sent_at timestamptz;
