// The Path of Guidance: four tomes, each a fixed number of numbered slots. Beating a run
// unlocks one random slot in whichever tome is *activated*, and hands you a code to pass to
// the other person so the same slot opens for them. Two players trading codes therefore
// advance two slots a game instead of one.
//
// The tomes themselves never change, so they live here as static data. Which slots are
// filled, and which tome is active, are both written by us -- those live in Postgres, read
// through lib/guidance-db.ts. No database import here, so the client components can share
// these types.

import { type Author } from './authors'

export type Tome = {
  slug: string
  name: string
  /** How many slots the tome has in total. The denominator of the in-game progress bar. */
  total: number
  /** The prefix every code for this tome carries, shown as a hint on empty slots. */
  prefix?: string
}

/** In the order the game lays them out, left to right. */
export const TOMES: Tome[] = [
  { slug: 'aghanims-tome', name: "Aghanim's Tome", total: 36 },
  { slug: 'tome-of-the-fallen', name: 'Tome of the Fallen', total: 16, prefix: 'daemonomicon' },
  { slug: 'initial-guidance', name: 'Initial Guidance', total: 20, prefix: 'first_start' },
  { slug: 'manifestations-of-mana', name: 'Manifestations of Mana', total: 4 },
]

export function getTomes(): Tome[] {
  return TOMES
}

export function getTome(slug: string): Tome | undefined {
  return TOMES.find((tome) => tome.slug === slug)
}

/** One unlocked slot, and the code that opens it for the other person. */
export type GuidanceCode = {
  tomeSlug: string
  /** The in-game slot number, 1-based. */
  slot: number
  code: string
  addedBy: Author
  updatedAt: string
}

/**
 * The game shows progress as a percentage, and it is a plain slot fraction -- 9 of 16 in
 * the Tome of the Fallen reads as 56.25%, which is exactly 9/16. Kept as a function so the
 * cards and the bars can't drift apart.
 */
export function percentComplete(filled: number, total: number): number {
  if (total <= 0) return 0
  return (filled / total) * 100
}

/** Trailing zeroes look wrong next to the game's own "56.25/100%". */
export function formatPercent(value: number): string {
  return `${Number(value.toFixed(2))}`
}
