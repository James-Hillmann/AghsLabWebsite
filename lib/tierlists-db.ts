import 'server-only'

import { isAuthor, type Author } from './authors'
import { read, sql } from './db'
import { sanitizeBoard, type TierBoard, type TierList, type TierListMeta } from './tierlists'

/** snake_case rows stop at this file; the rest of the app only sees TierList. */
type Row = {
  id: number | string
  author: string
  name: string
  board: unknown
  rev: number | string
  updated_at: string | Date
}

function toMeta(row: Row): TierListMeta | null {
  // A row whose author no longer parses is data from an older shape, same as takes.
  if (!isAuthor(row.author)) return null

  return {
    id: Number(row.id),
    author: row.author,
    name: row.name,
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

export async function listTierLists(author: Author): Promise<TierListMeta[]> {
  return read(`tier lists for ${author}`, [] as TierListMeta[], async () => {
    const rows = (await sql()`
      select id, author, name, rev, updated_at
        from tier_lists
       where author = ${author}
       order by created_at desc
    `) as Row[]

    return rows.map(toMeta).filter((meta): meta is TierListMeta => meta !== null)
  })
}

/**
 * The author is part of the query rather than a check on the result: ownership then can't
 * be forgotten at a call site, and a guessed id for someone else's list reads as "missing".
 */
export async function getTierList(id: number, author: Author): Promise<TierList | null> {
  return read(`tier list ${id}`, null, async () => {
    const rows = (await sql()`
      select id, author, name, board, rev, updated_at
        from tier_lists
       where id = ${id} and author = ${author}
    `) as Row[]

    const row = rows[0]
    if (!row) return null

    const meta = toMeta(row)
    if (!meta) return null

    // Sanitized on the way out as well as in. The column is jsonb, so a hand-edited row or
    // a hero deleted from lib/heroes.ts would otherwise render as a broken portrait.
    return { ...meta, board: sanitizeBoard(row.board), rev: Number(row.rev) }
  })
}

export async function createTierList(
  author: Author,
  name: string,
  board: TierBoard,
): Promise<number> {
  // JSON.stringify plus an explicit ::jsonb cast: handed the array directly, the driver
  // infers a Postgres array literal and the insert fails on type.
  const rows = (await sql()`
    insert into tier_lists (author, name, board)
    values (${author}, ${name}, ${JSON.stringify(board)}::jsonb)
    returning id
  `) as { id: number | string }[]

  return Number(rows[0].id)
}

/** False means the list isn't this author's -- the caller turns that into "unknown list". */
export async function renameTierList(id: number, author: Author, name: string): Promise<boolean> {
  const rows = (await sql()`
    update tier_lists
       set name = ${name}, updated_at = now()
     where id = ${id} and author = ${author}
    returning id
  `) as { id: number }[]

  return rows.length > 0
}

export async function deleteTierList(id: number, author: Author): Promise<boolean> {
  const rows = (await sql()`
    delete from tier_lists where id = ${id} and author = ${author} returning id
  `) as { id: number }[]

  return rows.length > 0
}

/**
 * Save the whole board, returning the new rev -- or null if the row isn't this author's or
 * the rev it was loaded at has since moved.
 *
 * `rev = ${rev}` in the where clause is the entire concurrency story: two tabs on one list
 * can't interleave, because the second one's update matches no row and it gets told to
 * reload instead of silently winning.
 */
export async function saveTierBoard(
  id: number,
  author: Author,
  board: TierBoard,
  rev: number,
): Promise<number | null> {
  const rows = (await sql()`
    update tier_lists
       set board      = ${JSON.stringify(board)}::jsonb,
           rev        = rev + 1,
           updated_at = now()
     where id = ${id} and author = ${author} and rev = ${rev}
    returning rev
  `) as { rev: number | string }[]

  return rows[0] ? Number(rows[0].rev) : null
}

/** Postgres 23505, `unique_violation`. Here it only ever means a duplicate list name. */
export function isDuplicateNameError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'
}
