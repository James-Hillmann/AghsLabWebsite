import 'server-only'

import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'agl_session'

/** 30 days, in seconds. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30

function secret(): Uint8Array {
  const value = process.env.SESSION_SECRET
  if (!value) {
    throw new Error('SESSION_SECRET is not set. Add it to .env.local and to the Vercel project.')
  }
  return new TextEncoder().encode(value)
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ scope: 'compendium' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret())
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  try {
    await jwtVerify(token, secret())
    return true
  } catch {
    // Expired, tampered with, or signed by an old SESSION_SECRET.
    return false
  }
}
