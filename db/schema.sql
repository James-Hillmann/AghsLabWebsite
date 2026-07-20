-- Run once against the Neon database (SQL editor in the Neon console, or psql).
--
-- One row per (hero, author). That composite primary key is the whole design: every
-- save is an upsert, there are no surrogate ids, and it's structurally impossible for
-- one person to end up with two takes on the same hero.

-- Artifact and relic data is generated from the game files, so it's all fact and none of it
-- is ours. This is where the opinions go instead: one comment per (thing, author), same
-- composite-key upsert design as takes.
--
-- One table rather than two because an artifact comment and a relic comment are the same
-- shape, and subject_kind keeps them from colliding when a slug appears in both catalogues.
create table if not exists comments (
  subject_kind text not null check (subject_kind in ('artifact', 'relic')),
  subject_slug text not null,
  author       text not null check (author in ('james', 'liam')),
  body         text,
  updated_at   timestamptz not null default now(),
  primary key (subject_kind, subject_slug, author)
);

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
