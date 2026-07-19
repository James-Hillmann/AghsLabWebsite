import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { SESSION_COOKIE, readSession } from '@/lib/session'

/**
 * Gates the whole site behind a passphrase. The landing page at `/` is the only public
 * route -- everything else redirects there without a valid session cookie.
 *
 * Protected pages re-check the session themselves (see lib/auth-guard). Next's docs are
 * explicit that Server Functions can fall outside the matcher, so this is the redirect
 * for humans, not the only line of defence.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') return NextResponse.next()

  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (await readSession(token)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
}
