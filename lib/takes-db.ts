import 'server-only'

import { isAuthor, type Author } from './authors'
import { isDatabaseConfigured, sql } from './db'
import { isDifficulty, type Take } from './takes'

/** snake_case rows stop at this file; the rest of the app only sees Take. */
type Row = {
  hero_slug: string
  author: string
  rating: number | null
  difficulty: string | null
  verdict: string | null
  build_notes: string | null
  key_abilities: string[] | null
  relics: string | null
  updated_at: string | Date
}

function toTake(row: Row): Take | null {
  // A row whose author no longer parses is data from an older shape. Skipping it beats
  // rendering a card attributed to nobody.
  if (!isAuthor(row.author)) return null

  return {
    heroSlug: row.hero_slug,
    author: row.author,
    rating: row.rating,
    difficulty: isDifficulty(row.difficulty) ? row.difficulty : null,
    verdict: row.verdict,
    buildNotes: row.build_notes,
    keyAbilities: row.key_abilities ?? [],
    relics: row.relics,
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

export async function getTakesForHero(heroSlug: string): Promise<Partial<Record<Author, Take>>> {
  if (!isDatabaseConfigured()) return {}

  const rows = (await sql()`
    select * from takes where hero_slug = ${heroSlug}
  `) as Row[]

  const takes: Partial<Record<Author, Take>> = {}
  for (const row of rows) {
    const take = toTake(row)
    if (take) takes[take.author] = take
  }
  return takes
}

/** Every take on the site, for the coverage dots on the roster grid. */
export async function getAllTakes(): Promise<Take[]> {
  if (!isDatabaseConfigured()) return []

  const rows = (await sql()`select * from takes`) as Row[]
  return rows.map(toTake).filter((take): take is Take => take !== null)
}

export async function upsertTake(take: Omit<Take, 'updatedAt'>): Promise<void> {
  await sql()`
    insert into takes (hero_slug, author, rating, difficulty, verdict, build_notes, key_abilities, relics, updated_at)
    values (
      ${take.heroSlug}, ${take.author}, ${take.rating}, ${take.difficulty},
      ${take.verdict}, ${take.buildNotes}, ${take.keyAbilities}, ${take.relics}, now()
    )
    on conflict (hero_slug, author) do update set
      rating        = excluded.rating,
      difficulty    = excluded.difficulty,
      verdict       = excluded.verdict,
      build_notes   = excluded.build_notes,
      key_abilities = excluded.key_abilities,
      relics        = excluded.relics,
      updated_at    = now()
  `
}
