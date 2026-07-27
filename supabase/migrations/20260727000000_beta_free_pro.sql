-- Beta launch: the first 50 accounts created before the cutoff get free Pro
-- automatically, no Stripe checkout involved. Uses an explicit
-- subscription_plan value ('beta_free') rather than inferring from
-- subscription_status alone, since at least one pre-existing test profile
-- already has subscription_status = 'active' with no Stripe subscription,
-- and that account must not be counted against the beta pool.

alter table profiles drop constraint profiles_subscription_plan_check;
alter table profiles add constraint profiles_subscription_plan_check
  check (subscription_plan in ('monthly', 'annual', 'beta_free'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  beta_cutoff timestamptz := '2026-08-03 23:59:59+00';
  beta_max_testers int := 50;
  granted_count int;
begin
  if now() < beta_cutoff then
    select count(*) into granted_count from public.profiles where subscription_plan = 'beta_free';
    if granted_count < beta_max_testers then
      insert into public.profiles (id, subscription_status, subscription_plan) values (new.id, 'active', 'beta_free');
      return new;
    end if;
  end if;
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;
