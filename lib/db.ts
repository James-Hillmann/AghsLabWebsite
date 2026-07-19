import 'server-only'

import { neon } from '@neondatabase/serverless'

/**
 * Neon's HTTP driver rather than a pooled TCP client: each query is a one-shot fetch,
 * which is what serverless wants -- no connections to leak between invocations.
 *
 * DATABASE_URL comes from the Neon integration (`vercel env pull` to get it locally).
 */
let cached: ReturnType<typeof neon> | null = null

export function sql() {
  if (!cached) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new DatabaseNotConfiguredError()
    }
    cached = neon(url)
  }
  return cached
}

/**
 * Thrown instead of a raw driver error so the takes UI can say "the database isn't
 * hooked up yet" rather than crashing the whole hero page.
 */
export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('DATABASE_URL is not set. Add the Neon integration and run `vercel env pull .env.local`.')
    this.name = 'DatabaseNotConfiguredError'
  }
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}
