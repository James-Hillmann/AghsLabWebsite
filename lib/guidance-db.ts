import 'server-only'

import { isAuthor } from './authors'
import { isDatabaseConfigured, sql } from './db'
import { type GuidanceCode } from './guidance'

/** snake_case rows stop at this file; the rest of the app only sees GuidanceCode. */
type Row = {
  tome_slug: string
  slot: number
  code: string
  added_by: string
  updated_at: string | Date
}

function toCode(row: Row): GuidanceCode | null {
  // Same reasoning as takes: a row whose author no longer parses is from an older shape,
  // and skipping it beats attributing a code to nobody.
  if (!isAuthor(row.added_by)) return null

  return {
    tomeSlug: row.tome_slug,
    slot: Number(row.slot),
    code: row.code,
    addedBy: row.added_by,
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

/**
 * Postgres 42P01, `undefined_table`. Means the migration hasn't been run -- distinct from a
 * transient failure, because retrying will never fix it.
 */
export function isMissingTableError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '42P01'
}

/**
 * Reads degrade to empty instead of throwing.
 *
 * DATABASE_URL being set doesn't mean the tables exist -- between deploying this and
 * running db/schema.sql, every guidance query raises `relation does not exist` (42P01),
 * and an uncaught throw in a Server Component takes the whole route down with a 500. An
 * empty page is a far better failure than a dead one, and the cause goes to the server log.
 *
 * Writes deliberately do NOT use this: if a save fails, the person needs to be told.
 */
async function read<T>(what: string, fallback: T, run: () => Promise<T>): Promise<T> {
  if (!isDatabaseConfigured()) return fallback

  try {
    return await run()
  } catch (error) {
    console.error(`Failed to read ${what} -- has db/schema.sql been run?`, error)
    return fallback
  }
}

/** Every code on the site, for the progress bars on the index. */
export async function getAllCodes(): Promise<GuidanceCode[]> {
  return read('guidance codes', [], async () => {
    const rows = (await sql()`select * from guidance_codes`) as Row[]
    return rows.map(toCode).filter((code): code is GuidanceCode => code !== null)
  })
}

/** Slot-keyed so the detail page can look up each row of the list in one step. */
export async function getCodesForTome(tomeSlug: string): Promise<Map<number, GuidanceCode>> {
  return read(`guidance codes for ${tomeSlug}`, new Map<number, GuidanceCode>(), async () => {
    const rows = (await sql()`
      select * from guidance_codes where tome_slug = ${tomeSlug}
    `) as Row[]

    const codes = new Map<number, GuidanceCode>()
    for (const row of rows) {
      const code = toCode(row)
      if (code) codes.set(code.slot, code)
    }
    return codes
  })
}

export async function upsertCode(code: Omit<GuidanceCode, 'updatedAt'>): Promise<void> {
  await sql()`
    insert into guidance_codes (tome_slug, slot, code, added_by, updated_at)
    values (${code.tomeSlug}, ${code.slot}, ${code.code}, ${code.addedBy}, now())
    on conflict (tome_slug, slot) do update set
      code       = excluded.code,
      added_by   = excluded.added_by,
      updated_at = now()
  `
}

export async function deleteCode(tomeSlug: string, slot: number): Promise<void> {
  await sql()`
    delete from guidance_codes where tome_slug = ${tomeSlug} and slot = ${slot}
  `
}

/**
 * Only the activated tome gains slots when you win a run, so the whole page is oriented
 * around this one value. Null when the database isn't wired up yet.
 */
export async function getActiveTome(): Promise<string | null> {
  return read('the activated tome', null, async () => {
    const rows = (await sql()`
      select active_tome from guidance_state where id = 1
    `) as { active_tome: string }[]

    return rows[0]?.active_tome ?? null
  })
}

export async function setActiveTome(tomeSlug: string): Promise<void> {
  // The single-row constraint does the deactivating for us -- there is only ever one row,
  // so pointing it somewhere else is the whole operation.
  await sql()`
    insert into guidance_state (id, active_tome, updated_at)
    values (1, ${tomeSlug}, now())
    on conflict (id) do update set
      active_tome = excluded.active_tome,
      updated_at  = now()
  `
}
