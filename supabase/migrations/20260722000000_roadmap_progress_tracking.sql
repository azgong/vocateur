-- Tracks which roadmap action items a user has checked off, keyed by
-- "{milestoneIndex}-{itemIndex}" -> boolean. Lets subscribers return over
-- time and see visible progress instead of a static one-time document.
alter table roadmaps add column completed_items jsonb not null default '{}'::jsonb;

create policy "users can update their own roadmaps"
  on roadmaps for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
