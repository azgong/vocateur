-- Rationale cache: LLM-generated per (session, occupation), keyed by session
-- rather than user since results pages are shared and viewed anonymously.
-- Without this, the public results page regenerated a live LLM call on every
-- single view, which is both a cost problem and an open cost-amplification
-- vector (anyone with a session link could trigger unlimited generation).
create table rationales (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references assessment_sessions(id) on delete cascade not null,
  occupation_id uuid references occupations(id) not null,
  content text not null,
  generated_at timestamptz not null default now(),
  unique (session_id, occupation_id)
);

alter table rationales enable row level security;
