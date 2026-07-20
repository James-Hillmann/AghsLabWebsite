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

/**
 * The catalogue icons are excluded for a non-obvious reason: next/image optimises a local file
 * by fetching it back over HTTP from this same server, and that internal request carries no
 * session cookie. Gated, it gets redirected, and the optimiser reports "isn't a valid image".
 *
 * The patterns deliberately end in `\.png` rather than matching the folders. `artifacts/`
 * alone would also match `/artifacts/eden-anvil`, silently taking every artifact detail page
 * out from behind the passphrase -- and the same for relics.
 *
 * The art itself is game assets with nothing private in it -- the same reasoning that already
 * makes logo.png public.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|artifacts/.*\\.png|relics/.*\\.png).*)',
  ],
}
