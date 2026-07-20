-- Turn the comments table into a thread. Run once, by hand, in the Neon SQL editor.
--
-- `npm run db:push` cannot do this: every statement in db/schema.sql is
-- `create table if not exists`, which is a no-op against a table that already exists. That is
-- deliberate -- it means a routine push can never rewrite live data -- so a shape change like
-- this one is a separate, explicit step.
--
-- WHAT THIS DESTROYS
--
-- Every existing comment. This was chosen over migrating them in place; the migrating version
-- would have been `alter table ... add column id`, backfilling created_at from updated_at.
-- If you want the old rows after all, stop here and say so rather than running this.
--
-- Take a copy first if you're unsure:
--
--   create table comments_backup_001 as select * from comments;
--
-- WHAT CHANGES
--
--   * a surrogate id, so one person can post more than once per subject
--   * created_at, so the thread can order newest-first independently of edits
--   * body becomes not null -- an empty post is a delete now, not a stored blank
--   * subject_kind accepts 'ability', which the old check constraint rejected

begin;

drop table if exists comments;

create table comments (
  id           bigint generated always as identity primary key,
  subject_kind text not null check (subject_kind in ('artifact', 'relic', 'ability')),
  subject_slug text not null,
  author       text not null check (author in ('james', 'liam')),
  body         text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index comments_thread_idx
  on comments (subject_kind, subject_slug, created_at desc);

commit;
