// The shape of a tier list, and the two pure functions that operate on one.
//
// Deliberately not 'server-only', like lib/authors.ts: the board is edited in the browser,
// so the drag island needs the types, the default rows and moveHero. sanitizeBoard is only
// ever called on the server, but it lives here so the rules it enforces sit next to the
// shape they describe.

import { getHero, HEROES } from './heroes'
import { type Author } from './authors'

export type TierRow = {
  /** Stable across renames and reorders, so React keys and drag targets survive an edit. */
  id: string
  label: string
  color: string
  heroes: string[]
}

export type TierBoard = TierRow[]

/** What the picker needs. The board itself is only fetched for the list being shown. */
export type TierListMeta = {
  id: number
  author: Author
  name: string
  updatedAt: string
}

export type TierList = TierListMeta & { board: TierBoard; rev: number }

/** Where a hero is going. A null rowId is the unassigned tray. */
export type Loc = { rowId: string | null; index: number }

export const MAX_ROWS = 12
export const ROW_LABEL_MAX = 24
export const LIST_NAME_MAX = 60

/**
 * Six swatches rather than <input type="color">.
 *
 * A free colour picker is two taps and a gradient on touch, and lets you pick something
 * that fights the ice palette. These are warm-to-cold, which is what makes a tier list
 * readable at a glance before you've read the letters.
 */
export const ROW_COLORS = [
  '#e0654a',
  '#e0a35a',
  '#d8c85a',
  '#7fc06a',
  '#7dd3fc',
  '#9d8fd8',
] as const

const DEFAULT_LABELS = ['S', 'A', 'B', 'C', 'D', 'F']

/** A fresh list: the classic ladder, one colour each, everything still in the tray. */
export function defaultBoard(): TierBoard {
  return DEFAULT_LABELS.map((label, index) => ({
    id: newRowId(),
    label,
    color: ROW_COLORS[index % ROW_COLORS.length],
    heroes: [],
  }))
}

export function newRowId(): string {
  return crypto.randomUUID().slice(0, 8)
}

/**
 * The trust boundary.
 *
 * saveBoard takes a whole board from the client, so this is the only thing standing between
 * a hand-rolled POST and the stored document. It never rejects -- it returns the largest
 * valid board contained in the input, because a save that silently drops a bad slug is a
 * better outcome than one that 400s and loses the user's other twenty placements.
 */
export function sanitizeBoard(input: unknown): TierBoard {
  if (!Array.isArray(input)) return []

  // Deduped across the WHOLE board, not per row: the same hero in S and in C is the one
  // corruption the jsonb shape makes possible, so it's the one this has to catch.
  const seen = new Set<string>()
  const rows: TierBoard = []

  for (const raw of input.slice(0, MAX_ROWS)) {
    if (typeof raw !== 'object' || raw === null) continue
    const row = raw as Partial<TierRow>

    const id = typeof row.id === 'string' ? row.id.slice(0, 32) : newRowId()
    const label = typeof row.label === 'string' ? row.label.trim().slice(0, ROW_LABEL_MAX) : ''
    const color = ROW_COLORS.includes(row.color as (typeof ROW_COLORS)[number])
      ? (row.color as string)
      : ROW_COLORS[rows.length % ROW_COLORS.length]

    const heroes: string[] = []
    if (Array.isArray(row.heroes)) {
      for (const slug of row.heroes) {
        if (typeof slug !== 'string' || seen.has(slug) || !getHero(slug)) continue
        seen.add(slug)
        heroes.push(slug)
      }
    }

    rows.push({ id, label, color, heroes })
  }

  return rows
}

/** Slugs in no row. Derived rather than stored, so a hero can't be in two places. */
export function trayHeroes(board: TierBoard): string[] {
  const placed = new Set(board.flatMap((row) => row.heroes))
  return HEROES.filter((hero) => !placed.has(hero.slug)).map((hero) => hero.slug)
}

/**
 * Move one hero to one place. Pure, and shared by the drop handler and the keyboard
 * fallback -- two implementations of "insert at index N" would drift within a week.
 *
 * `to.index` is measured against the row as it looks on screen, which during a drag still
 * includes the chip being dragged. Removing first shifts everything after it left by one,
 * so a move rightwards within its own row has to compensate -- otherwise dropping a chip
 * one slot to the right does nothing at all.
 */
export function moveHero(board: TierBoard, slug: string, to: Loc): TierBoard {
  const from = board.find((row) => row.id === to.rowId)?.heroes.indexOf(slug) ?? -1
  const index = from !== -1 && from < to.index ? to.index - 1 : to.index

  const stripped = board.map((row) => ({
    ...row,
    heroes: row.heroes.filter((entry) => entry !== slug),
  }))

  // The tray isn't a row, so "moving to the tray" is just leaving it out of every row.
  if (to.rowId === null) return stripped

  return stripped.map((row) => {
    if (row.id !== to.rowId) return row
    const heroes = [...row.heroes]
    heroes.splice(Math.max(0, Math.min(index, heroes.length)), 0, slug)
    return { ...row, heroes }
  })
}
