'use server'

import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

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

/** Length-independent constant-time comparison. */
function matches(input: string, expected: string): boolean {
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export async function enterSite(_prev: GateState, formData: FormData): Promise<GateState> {
  const password = formData.get('password')
  const expected = process.env.SITE_PASSWORD

  if (!expected) {
    console.error('SITE_PASSWORD is not set -- refusing every attempt.')
    return { error: 'The site is not configured yet. Set SITE_PASSWORD and redeploy.' }
  }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'

  if (!rateLimit(ip)) {
    return { error: 'Too many attempts. Wait a minute and try again.' }
  }

  if (typeof password !== 'string' || !matches(password, expected)) {
    // Deliberately vague: don't confirm whether the passphrase merely had a typo.
    return { error: "That passphrase doesn't open the door." }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
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
