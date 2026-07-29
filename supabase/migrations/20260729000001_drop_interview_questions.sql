-- Mock interview feature was cut before launch in favor of a leaner core
-- feature set. Drops the now-unused static question bank column added in
-- 20260729000000; nothing reads it anymore.
alter table occupations drop column if exists interview_questions;
