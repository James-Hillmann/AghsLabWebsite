'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * The floors of the site. Split out of SiteHeader because marking the active link needs
 * usePathname, and SiteHeader is an async Server Component that reads the session -- keeping
 * the client boundary this small leaves the author badge on the server.
 *
 * Ordered roster, catalogues, then the two things you actually update as you play.
 *
 * Abilities deliberately aren't here. They're a facet of a hero rather than something you
 * collect, so they live at /heroes/<hero>/<ability> and are reached from the hero's page.
 */
const LINKS = [
  { href: '/heroes', label: 'Heroes' },
  { href: '/artifacts', label: 'Artifacts' },
  { href: '/relics', label: 'Relics' },
  { href: '/guidance', label: 'Guidance' },
  { href: '/tiers', label: 'Tiers' },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    // Five links no longer fit one line on a phone, so they wrap. Tighter gap below sm
    // buys back most of it; the wrap covers the rest.
    <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
      {LINKS.map((link) => {
        // startsWith so a detail page keeps its section lit, not just the index.
        const isActive = pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`label text-[0.7rem] transition-colors duration-200 hover:text-frost ${
              isActive ? 'text-frost' : 'text-muted'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
