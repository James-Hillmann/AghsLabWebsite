'use server'

import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { AUTHORS, type Author } from '@/lib/authors'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '@/lib/session'

export type GateState = { error: string | null }

const ATTEMPT_LIMIT = 8
const ATTEMPT_WINDOW_MS = 60_000

// Fixed-window limiter so the shared password can't be brute forced from one address.
// This lives in module memory, so it resets whenever a serverless instance recycles and
// isn't shared across instances -- good enough for a small private site. Move it to
// Vercel KV if the site ever gets real traffic.
const attempts = new Map<string, { count: number; resetAt: number }>()

function rateLimit(key: string): boolean {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS })
    return true
  }

  entry.count += 1
  return entry.count <= ATTEMPT_LIMIT
}

/**
 * One passphrase each, so the site knows whose take it's saving.
 *
 * SITE_PASSWORD is the old single shared passphrase, kept working as James's so an
 * existing deployment doesn't lock itself out mid-migration. Set SITE_PASSWORD_JAMES
 * and drop it.
 */
function credentials(): Record<Author, string> | null {
  const james = process.env.SITE_PASSWORD_JAMES ?? process.env.SITE_PASSWORD
  const liam = process.env.SITE_PASSWORD_LIAM

  if (!james || !liam) return null
  if (james === liam) return null

  return { james, liam }
}

/** Length-independent constant-time comparison. */
function matches(input: string, expected: string): boolean {
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

/**
 * Checks every passphrase without stopping at the first hit, so how long the answer
 * takes doesn't reveal which of the two was entered. The passphrases are required to
 * differ, so at most one can match.
 */
function identify(password: string, expected: Record<Author, string>): Author | null {
  let found: Author | null = null
  for (const author of AUTHORS) {
    if (matches(password, expected[author])) found = author
  }
  return found
}

export async function enterSite(_prev: GateState, formData: FormData): Promise<GateState> {
  const password = formData.get('password')
  const expected = credentials()

  if (!expected) {
    console.error(
      'SITE_PASSWORD_JAMES and SITE_PASSWORD_LIAM must both be set, and must differ -- refusing every attempt.',
    )
    return { error: 'The site is not configured yet. Set both passphrases and redeploy.' }
  }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'

  if (!rateLimit(ip)) {
    return { error: 'Too many attempts. Wait a minute and try again.' }
  }

  const author = typeof password === 'string' ? identify(password, expected) : null

  if (!author) {
    // Deliberately vague: don't confirm whether the passphrase merely had a typo.
    return { error: "That passphrase doesn't open the door." }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(author), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  // redirect() throws internally, so it must not sit inside a try/catch.
  redirect('/heroes')
}

export async function leaveSite() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/')
}
