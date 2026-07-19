import Image from 'next/image'
import Link from 'next/link'

import { AUTHOR_COLOR, AUTHOR_NAME, type Author } from '@/lib/authors'
import { portraitUrl, type Hero } from '@/lib/heroes'

export function HeroTile({
  hero,
  isTopMatch = false,
  authors = [],
}: {
  hero: Hero
  isTopMatch?: boolean
  /** Who has written a take on this hero. Drawn as a dot each. */
  authors?: readonly Author[]
}) {
  return (
    <Link
      href={`/heroes/${hero.slug}`}
      title={
        authors.length
          ? `${hero.name} — written up by ${authors.map((a) => AUTHOR_NAME[a]).join(' and ')}`
          : hero.name
      }
      // The attribute columns reorder results, so the best match isn't necessarily the
      // first tile on screen. Mark it, or pressing Enter goes somewhere unexpected.
      data-top-match={isTopMatch || undefined}
      // Tailwind's scale-* sets the `scale` property, not `transform` -- transition that
      // property by name or the hover snaps instead of easing.
      className="group relative block aspect-[235/272] overflow-visible transition-[scale] duration-200 ease-out hover:z-20 hover:scale-[1.18] focus-visible:z-20 focus-visible:scale-[1.18] motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100"
    >
      <span
        className={`absolute inset-0 overflow-hidden bg-[color-mix(in_srgb,var(--ice-deep)_60%,transparent)] transition-shadow duration-200 group-hover:shadow-[0_0_0_1px_var(--edge-lit),0_10px_30px_-6px_color-mix(in_srgb,var(--ice-glow)_45%,transparent)] group-focus-visible:shadow-[0_0_0_1px_var(--edge-lit),0_10px_30px_-6px_color-mix(in_srgb,var(--ice-glow)_45%,transparent)] ${
          isTopMatch
            ? 'shadow-[0_0_0_2px_var(--ice-glow),0_8px_24px_-6px_color-mix(in_srgb,var(--ice-glow)_55%,transparent)]'
            : 'shadow-[0_0_0_1px_var(--edge)]'
        }`}
      >
        <Image
          src={portraitUrl(hero.slug)}
          alt=""
          width={235}
          height={272}
          // Valve already serves these at tile size (235x272, ~18KB). Running 127 of them
          // through the optimizer adds a round-trip each and buys nothing.
          unoptimized
          loading="lazy"
          className="h-full w-full object-cover brightness-[0.82] saturate-[0.85] transition duration-200 group-hover:brightness-110 group-hover:saturate-100 group-focus-visible:brightness-110"
        />

        {/* Coverage at a glance: one dot per person who's written this hero up. Sits
            inside the clipped frame so it rides along with the hover scale. */}
        {authors.length > 0 && (
          <span className="pointer-events-none absolute top-1 right-1 flex gap-1">
            {authors.map((author) => (
              <span
                key={author}
                className="size-[5px] rounded-full shadow-[0_0_0_1px_var(--ice-void)]"
                style={{ backgroundColor: AUTHOR_COLOR[author] }}
              />
            ))}
          </span>
        )}

        {/* Name reveals on the scrim rather than reserving layout space -- except on the
            top match, which stays labelled so you can see what Enter will open. */}
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,var(--ice-void),transparent)] px-1.5 pt-5 pb-1 text-center text-[0.6rem] leading-tight font-medium text-frost transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
            isTopMatch ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {hero.name}
        </span>
      </span>
    </Link>
  )
}
