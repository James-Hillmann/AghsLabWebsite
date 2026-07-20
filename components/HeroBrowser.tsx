'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'

import { searchHeroes, type Hero } from '@/lib/heroes'
import { useTypeToSearch } from '@/lib/use-type-to-search'

import { HeroGrid } from './HeroGrid'

/**
 * Dota's picker doesn't make you click a search box -- you just start typing, and the
 * grid dims rather than filters. Every hero holds its position; only the best match
 * stays lit. That's the point: the tile you learned the position of never moves.
 *
 * The key handling itself lives in useTypeToSearch, shared with the artifact Archive.
 */
export function HeroBrowser({ heroes, covered }: { heroes: Hero[]; covered: string[] }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const coveredSet = useMemo(() => new Set(covered), [covered])

  const matches = useMemo(() => searchHeroes(heroes, query), [heroes, query])

  // Enter opens the best match -- matches are already sorted best-first.
  const openTopMatch = useCallback(() => {
    if (!query || !matches.length) return false
    router.push(`/heroes/${matches[0].slug}`)
    return true
  }, [router, matches, query])

  useTypeToSearch({ inputRef, setQuery, onEnter: openTopMatch })

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 2xl:mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-frost 2xl:text-4xl">
            Choose a hero
          </h1>
          <p className="mt-2 text-sm text-muted 2xl:text-base">
            {!query
              ? `${heroes.length} heroes in the roster. Start typing to find one.`
              : matches.length
                ? `Enter opens ${matches[0].name}.`
                : `No hero matches “${query}”. Press Escape to clear.`}
          </p>
        </div>

        <div className="relative w-full sm:w-64 2xl:w-80">
          <label htmlFor="hero-search" className="sr-only">
            Search heroes
          </label>
          <input
            ref={inputRef}
            id="hero-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search heroes"
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

      {/* The full roster, always. Searching dims rather than filters, so nothing moves. */}
      <HeroGrid
        heroes={heroes}
        topMatchSlug={query ? matches[0]?.slug : undefined}
        searching={Boolean(query)}
        covered={coveredSet}
      />
    </>
  )
}
