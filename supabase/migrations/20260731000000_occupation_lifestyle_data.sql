-- Day-in-the-life texture per occupation: the stuff people actually weigh
-- when choosing a career (hours, remote-friendliness, real tradeoffs) that
-- neither a personality test nor an IQ test touches. LLM-authored like the
-- rest of the advisory content (how_to_break_in, typical_progression, etc),
-- same review process, null until authored per occupation.
alter table occupations
  add column typical_hours text,
  add column remote_friendliness text,
  add column lifestyle_intensity text check (lifestyle_intensity in ('low', 'moderate', 'high', 'extreme')),
  add column lifestyle_reality text;
