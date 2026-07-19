import { AUTHORS } from '@/lib/authors'
import { ATTRIBUTES, ATTRIBUTE_COLOR, type Attribute, type Hero } from '@/lib/heroes'

import { HeroTile } from './HeroTile'

function AttributeColumn({
  attribute,
  heroes,
  topMatchSlug,
  searching,
  covered,
}: {
  attribute: Attribute
  heroes: Hero[]
  topMatchSlug?: string
  searching: boolean
  covered: Set<string>
}) {
  const accent = ATTRIBUTE_COLOR[attribute]

  return (
    <section className="min-w-0">
      <header className="mb-4 flex items-baseline gap-3 border-b border-[var(--edge)] pb-2 2xl:mb-5">
        <span aria-hidden className="size-2.5 rotate-45 2xl:size-3" style={{ backgroundColor: accent }} />
        <h2 className="label text-[0.95rem] 2xl:text-[1.05rem]" style={{ color: accent }}>
          {attribute}
        </h2>
        <span className="ml-auto font-[family-name:var(--font-label)] text-sm text-muted tabular-nums 2xl:text-base">
          {heroes.length}
        </span>
      </header>

      {/* The floor grows with the viewport -- on a wide monitor a fixed 60px leaves the
          art unreadable and the page mostly empty below the fold. */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-1.5 xl:grid-cols-[repeat(auto-fill,minmax(74px,1fr))] xl:gap-2 2xl:grid-cols-[repeat(auto-fill,minmax(88px,1fr))] 2xl:gap-2">
        {heroes.map((hero) => (
          <HeroTile
            key={hero.slug}
            hero={hero}
            isTopMatch={hero.slug === topMatchSlug}
            isDimmed={searching && hero.slug !== topMatchSlug}
            authors={AUTHORS.filter((author) => covered.has(`${hero.slug}:${author}`))}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * Always renders the whole roster. Searching never removes a hero or collapses a column
 * -- it only dims, so every tile keeps the position you learned it at.
 */
export function HeroGrid({
  heroes,
  topMatchSlug,
  searching = false,
  covered,
}: {
  heroes: Hero[]
  topMatchSlug?: string
  searching?: boolean
  covered: Set<string>
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 2xl:grid-cols-4">
      {ATTRIBUTES.map((attribute) => (
        <AttributeColumn
          key={attribute}
          attribute={attribute}
          heroes={heroes.filter((hero) => hero.attribute === attribute)}
          topMatchSlug={topMatchSlug}
          searching={searching}
          covered={covered}
        />
      ))}
    </div>
  )
}
