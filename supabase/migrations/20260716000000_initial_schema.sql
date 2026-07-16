-- Occupations: seeded once from O*NET/BLS, public read-only.
create table occupations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  median_salary integer not null,
  growth_pct numeric not null,
  education_level text not null,
  top_skills text[] not null default '{}',
  trait_profile jsonb not null,
  data_as_of date not null,
  created_at timestamptz not null default now()
);

alter table occupations enable row level security;

create policy "occupations are publicly readable"
  on occupations for select
  using (true);

-- Assessment sessions: anonymous until email capture / signup links user_id.
create table assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  trait_vector jsonb not null,
  self_report jsonb not null default '{}',
  life_stage text not null check (life_stage in ('high_school', 'university', 'early_career', 'career_changer')),
  created_at timestamptz not null default now()
);

alter table assessment_sessions enable row level security;

create policy "anyone can insert an assessment session"
  on assessment_sessions for insert
  with check (true);

create policy "users can read their own linked sessions"
  on assessment_sessions for select
  using (auth.uid() = user_id);

create policy "users can update their own linked sessions"
  on assessment_sessions for update
  using (auth.uid() = user_id);

-- Email captures: retargeting list, kept regardless of conversion.
create table email_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  session_id uuid references assessment_sessions(id) on delete set null,
  converted boolean not null default false,
  created_at timestamptz not null default now()
);

alter table email_captures enable row level security;

create policy "anyone can insert an email capture"
  on email_captures for insert
  with check (true);

-- Roadmaps: static after generation, tied to a session's matched occupation.
create table roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  session_id uuid references assessment_sessions(id) on delete set null,
  occupation_id uuid references occupations(id) not null,
  life_stage text not null,
  content jsonb not null,
  generated_at timestamptz not null default now()
);

alter table roadmaps enable row level security;

create policy "users can read their own roadmaps"
  on roadmaps for select
  using (auth.uid() = user_id);

-- Profiles: one row per auth user, tracks subscription state synced from Stripe.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text not null default 'none' check (subscription_status in ('none', 'active', 'past_due', 'canceled')),
  subscription_plan text check (subscription_plan in ('monthly', 'annual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users can read their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
