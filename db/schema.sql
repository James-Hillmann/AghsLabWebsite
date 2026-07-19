-- Run once against the Neon database (SQL editor in the Neon console, or psql).
--
-- One row per (hero, author). That composite primary key is the whole design: every
-- save is an upsert, there are no surrogate ids, and it's structurally impossible for
-- one person to end up with two takes on the same hero.

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
