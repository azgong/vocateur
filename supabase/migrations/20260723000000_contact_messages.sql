create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Only the service role reads or writes; no client-facing policies.
alter table public.contact_messages enable row level security;
