-- Tracks when a profile's Pro access came from the free beta link (not a
-- real purchase), so a cron can auto-expire it after the trial window.
alter table profiles add column beta_granted_at timestamptz;
