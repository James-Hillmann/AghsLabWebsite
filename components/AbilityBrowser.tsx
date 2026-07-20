'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'

import {
  abilitiesByHero,
  abilityHeroes,
  heroAttribute,
  heroName,
  searchAbilities,
  type HeroAbility,
} from '@/lib/abilities'
import { ATTRIBUTES, ATTRIBUTE_COLOR, type Attribute } from '@/lib/heroes'
import { useTypeToSearch } from '@/lib/use-type-to-search'

import { AbilityList } from './AbilityList'

/** Heroes the game has abilities for that the roster doesn't list, and so have no attribute. */
const UNLISTED = 'unlisted'

const RAIL_COLOR: Record<string, string> = { ...ATTRIBUTE_COLOR, [UNLISTED]: '#8aa4b8' }
const RAIL_NAME: Record<string, string> = {
  strength: 'Strength',
  agility: 'Agility',
  intelligence: 'Intelligence',
  universal: 'Universal',
  [UNLISTED]: 'Not on the roster',
}

/**
 * Abilities, laid out like the Archive: a rail down the left, the kits on the right. The rail
 * scrolls to a hero rather than filtering to one -- same reasoning as the roster's
 * dim-don't-filter search. Nothing on this page ever moves.
 *
 * The rail is grouped by attribute because sixty-nine flat hero links is a wall. Unlike the
 * Archive's four eras it can outrun the viewport, so it scrolls within its own sticky column
 * rather than pushing the page.
 */
export function AbilityBrowser({ abilities }: { abilities: HeroAbility[] }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const matches = useMemo(() => searchAbilities(abilities, query), [abilities, query])
  const heroes = useMemo(() => abilityHeroes(abilities), [abilities])
  const counts = useMemo(() => abilitiesByHero(abilities), [abilities])

  const rail = useMemo(() => {
    const groups: { key: string; heroes: string[] }[] = [
      ...ATTRIBUTES.map((attribute: Attribute) => ({
        key: attribute as string,
        heroes: heroes.filter((hero) => heroAttribute(hero) === attribute),
      })),
      { key: UNLISTED, heroes: heroes.filter((hero) => !heroAttribute(hero)) },
    ]
    return groups.filter((group) => group.heroes.length)
  }, [heroes])

  // The sections follow the rail, so scrolling down passes the heroes in the order the rail
  // lists them. A rail that jumps somewhere the page doesn't otherwise go reads as broken.
  const orderedHeroes = useMemo(() => rail.flatMap((group) => group.heroes), [rail])

  const openTopMatch = useCallback(() => {
    if (!query || !matches.length) return false
    router.push(`/abilities/${matches[0].slug}`)
    return true
  }, [router, matches, query])

  useTypeToSearch({ inputRef, setQuery, onEnter: openTopMatch })

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-frost 2xl:text-4xl">
            Abilities
          </h1>
          <p className="mt-2 text-sm text-muted 2xl:text-base">
            {!query
              ? `${abilities.length} abilities across ${heroes.length} heroes. Start typing to find one.`
              : matches.length
                ? `Enter opens ${matches[0].name}.`
                : `No ability matches “${query}”. Press Escape to clear.`}
          </p>
        </div>

        <div className="relative w-full sm:w-64 2xl:w-80">
          <label htmlFor="ability-search" className="sr-only">
            Search abilities
          </label>
          <input
            ref={inputRef}
            id="ability-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search abilities"
            autoComplete="off"
            className="shard shard-edge w-full bg-[color-mix(in_srgb,var(--ice-deep)_55%,transparent)] px-4 py-2.5 text-sm text-frost outline-none placeholder:text-muted focus:bg-[color-mix(in_srgb,var(--ice-deep)_80%,transparent)] 2xl:py-3 2xl:text-base"
            style={{ '--cut': '8px' } as React.CSSProperties}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="absolute inset-y-0 right-3 text-muted transition-colors duration-200 hover:text-frost"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        {/* Anchor links, not state: the rail jumps you to a hero and stays useful with
            JavaScript off. Below lg it wraps rather than scrolling sideways. */}
        <nav
          aria-label="Heroes"
          className="lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
        >
          {rail.map((group) => (
            <div key={group.key} className="mb-4 last:mb-0">
              <h2
                className="label mb-1.5 text-[0.6rem]"
                style={{ color: RAIL_COLOR[group.key] }}
              >
                {RAIL_NAME[group.key]}
              </h2>
              <ul className="flex flex-wrap gap-1 lg:flex-col lg:flex-nowrap">
                {group.heroes.map((hero) => (
                  <li key={hero}>
                    <a
                      href={`#hero-${hero}`}
                      className="flex items-baseline gap-2 px-1.5 py-1 text-sm text-muted transition-colors duration-200 hover:text-frost"
                    >
                      <span className="truncate">{heroName(hero)}</span>
                      <span className="ml-auto pl-2 font-[family-name:var(--font-label)] text-xs text-muted tabular-nums">
                        {counts[hero]?.length ?? 0}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <AbilityList
          abilities={abilities}
          heroes={orderedHeroes}
          topMatchSlug={query ? matches[0]?.slug : undefined}
          searching={Boolean(query)}
        />
      </div>
    </>
  )
}
