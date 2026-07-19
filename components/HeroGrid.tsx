import { AUTHORS } from '@/lib/authors'
import { ATTRIBUTES, ATTRIBUTE_COLOR, type Attribute, type Hero } from '@/lib/heroes'

import { HeroTile } from './HeroTile'

function AttributeColumn({
  attribute,
  heroes,
  topMatchSlug,
  covered,
}: {
  attribute: Attribute
  heroes: Hero[]
  topMatchSlug?: string
  covered: Set<string>
}) {
  const accent = ATTRIBUTE_COLOR[attribute]

  // A column with nothing left in it is noise while searching.
  if (!heroes.length) return null

  return (
    <section className="min-w-0">
      <header className="mb-4 flex items-baseline gap-3 border-b border-[var(--edge)] pb-2">
        <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: accent }} />
        <h2 className="label text-[0.7rem]" style={{ color: accent }}>
          {attribute}
        </h2>
        <span className="ml-auto font-[family-name:var(--font-label)] text-xs text-muted tabular-nums">
          {heroes.length}
        </span>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1.5">
        {heroes.map((hero) => (
          <HeroTile
            key={hero.slug}
            hero={hero}
            isTopMatch={hero.slug === topMatchSlug}
            authors={AUTHORS.filter((author) => covered.has(`${hero.slug}:${author}`))}
          />
        ))}
      </div>
    </section>
  )
}

export function HeroGrid({
  heroes,
  topMatchSlug,
  covered,
}: {
  heroes: Hero[]
  topMatchSlug?: string
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
          covered={covered}
        />
      ))}
    </div>
  )
}
