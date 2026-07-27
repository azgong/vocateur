-- Revert the automatic beta-signup Pro grant from the previous migration.
-- Paywall stays exactly as it was: free assessment, free top-3 results,
-- everything else paid. Beta testers get Pro granted manually per-email
-- instead, no automatic mechanism needed.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

alter table profiles drop constraint profiles_subscription_plan_check;
alter table profiles add constraint profiles_subscription_plan_check
  check (subscription_plan in ('monthly', 'annual'));
