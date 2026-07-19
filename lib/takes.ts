// The shape of an opinion. Deliberately free of any database import so the take cards
// and the editor -- both client components -- can share these types. Reads and writes
// live in lib/takes-db.ts, which is server-only.

import { type Author } from './authors'

/**
 * The Labyrinth difficulty ladder, hardest first. A take records the highest one that
 * run was actually won on -- a 9/10 cleared on E is a very different claim from a 9/10
 * cleared on EX, and the pair is the interesting part.
 */
export const DIFFICULTIES = ['EX', 'S++', 'S+', 'S', 'A', 'B', 'C', 'D', 'E'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && (DIFFICULTIES as readonly string[]).includes(value)
}

export type Take = {
  heroSlug: string
  author: Author
  /** 1-10, or null if they've played the hero but won't commit to a number. */
  rating: number | null
  /** Highest difficulty won on, or null if they haven't won on any yet. */
  difficulty: Difficulty | null
  /** One-line gut call. */
  verdict: string | null
  buildNotes: string | null
  /** Valve ability ids -- the abilities this build actually plays around. */
  keyAbilities: string[]
  relics: string | null
  updatedAt: string
}
