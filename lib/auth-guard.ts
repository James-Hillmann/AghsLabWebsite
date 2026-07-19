import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SESSION_COOKIE, isValidSessionToken } from './session'

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies()
  return isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

/**
 * Call at the top of every protected page and Server Function. The proxy already
 * redirects unauthenticated browsers, but Server Functions can sit outside its matcher,
 * so each entry point verifies for itself.
 */
export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect('/')
}
