-- Explicit, permanent exemption from the beta-expiry cron, independent of
-- beta_granted_at. Needed for accounts that should keep Pro forever
-- regardless of how they got it or whether they later touch the beta claim
-- link (which would otherwise stamp/refresh beta_granted_at).
alter table profiles add column beta_exempt boolean not null default false;
