import { abilitiesByHero, accentFor, heroName, type HeroAbility } from '@/lib/abilities'

import { AbilityCard } from './AbilityCard'

/**
 * One section per hero, in rail order. Like the roster and the Archive, searching dims rather
 * than filters, so every ability keeps the position you learned it at.
 *
 * Abilities within a hero stay in skill-bar order -- the order they unlock, ultimates last --
 * because that's the order a player already has in their head.
 */
export function AbilityList({
  abilities,
  heroes,
  topMatchSlug,
  searching = false,
}: {
  abilities: HeroAbility[]
  heroes: string[]
  topMatchSlug?: string
  searching?: boolean
}) {
  const byHero = abilitiesByHero(abilities)

  return (
    <div className="space-y-12">
      {heroes.map((hero) => {
        const kit = byHero[hero] ?? []
        if (!kit.length) return null
        const accent = accentFor(kit[0])

        return (
          <section key={hero} id={`hero-${hero}`} className="scroll-mt-24">
            <header className="mb-4 flex items-baseline gap-3 border-b border-[var(--edge)] pb-2">
              <span aria-hidden className="size-2.5 rotate-45" style={{ backgroundColor: accent }} />
              <h2 className="label text-[0.95rem]" style={{ color: accent }}>
                {heroName(hero)}
              </h2>
              <span className="ml-auto font-[family-name:var(--font-label)] text-sm text-muted tabular-nums">
                {kit.length}
              </span>
            </header>

            <div className="grid gap-3 md:grid-cols-2">
              {kit.map((ability) => (
                <AbilityCard
                  key={ability.slug}
                  ability={ability}
                  isTopMatch={ability.slug === topMatchSlug}
                  isDimmed={searching && ability.slug !== topMatchSlug}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
