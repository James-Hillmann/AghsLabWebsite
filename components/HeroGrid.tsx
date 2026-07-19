import { ATTRIBUTES, ATTRIBUTE_COLOR, heroesByAttribute, type Attribute } from '@/lib/heroes'

import { HeroTile } from './HeroTile'

function AttributeColumn({ attribute }: { attribute: Attribute }) {
  const heroes = heroesByAttribute(attribute)
  const accent = ATTRIBUTE_COLOR[attribute]

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
          <HeroTile key={hero.slug} hero={hero} />
        ))}
      </div>
    </section>
  )
}

export function HeroGrid() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 2xl:grid-cols-4">
      {ATTRIBUTES.map((attribute) => (
        <AttributeColumn key={attribute} attribute={attribute} />
      ))}
    </div>
  )
}
