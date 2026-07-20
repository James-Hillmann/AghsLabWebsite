-- Run once against the Neon database (SQL editor in the Neon console, or psql).
--
-- `npm run db:push` applies this file, and every statement is `create ... if not exists`, so
-- it only ever fills in what's missing. Changing the shape of a table that already exists is
-- a separate, deliberate step -- see db/migrations/.
--
-- Most tables here key on a composite primary key: one row per (hero, author), one per (tome,
-- slot). That's the design, not an accident -- every save is an upsert and duplicates are
-- structurally impossible. `comments` is the exception, and says why on itself.

-- Catalogue data is generated from the game files, so it's all fact and none of it is ours.
-- This is where the opinions go instead: a thread per thing, newest post first, either of us
-- posting as often as we like.
--
-- Unlike takes and guidance_codes above, this one does *not* key on (thing, author). A thread
-- is a conversation, so the same person posting twice is the point rather than a mistake --
-- hence a surrogate id, and inserts rather than upserts. Editing keys on that id, with the
-- author checked in the query so a stray id can't rewrite someone else's post.
--
-- One table rather than three because an artifact, relic and ability comment are the same
-- shape, and subject_kind keeps them from colliding when a slug appears in two catalogues.
create table if not exists comments (
  id           bigint generated always as identity primary key,
  subject_kind text not null check (subject_kind in ('artifact', 'relic', 'ability')),
  subject_slug text not null,
  author       text not null check (author in ('james', 'liam')),
  -- not null here, unlike the old shape: an empty post is a delete, not a row.
  body         text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- The only read the site makes: one subject's thread, newest first.
create index if not exists comments_thread_idx
  on comments (subject_kind, subject_slug, created_at desc);

create table if not exists takes (
  hero_slug     text not null,
  author        text not null check (author in ('james', 'liam')),
  rating        int check (rating between 1 and 10),
  difficulty    text check (difficulty in ('EX', 'S++', 'S+', 'S', 'A', 'B', 'C', 'D', 'E')),
  verdict       text,
  build_notes   text,
  key_abilities text[] not null default '{}',
  relics        text,
  updated_at    timestamptz not null default now(),
  primary key (hero_slug, author)
);

-- Path of Guidance.
--
-- One row per (tome, slot), for the same reason takes keys on (hero, author): the composite
-- primary key makes it structurally impossible to record two different codes for the one
-- slot, and every save is an upsert.

create table if not exists guidance_codes (
  tome_slug  text not null,
  slot       int not null check (slot >= 1),
  code       text not null,
  added_by   text not null check (added_by in ('james', 'liam')),
  updated_at timestamptz not null default now(),
  primary key (tome_slug, slot)
);

-- Exactly one tome is activated at a time -- it's the only one that gains a slot when you
-- win a run. `check (id = 1)` makes "there is one row" a database invariant rather than
-- something the application has to remember, so activating a tome can't leave two active.

create table if not exists guidance_state (
  id          int primary key default 1 check (id = 1),
  active_tome text not null,
  updated_at  timestamptz not null default now()
);

insert into guidance_state (id, active_tome)
values (1, 'tome-of-the-fallen')
on conflict (id) do nothing;
