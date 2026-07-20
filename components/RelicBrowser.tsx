'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'

import {
  RELIC_GROUPS,
  RELIC_GROUP_COLOR,
  RELIC_GROUP_NAME,
  relicsByGroup,
  searchRelics,
  type Relic,
} from '@/lib/relics'
import { useTypeToSearch } from '@/lib/use-type-to-search'

import { RelicCard } from './RelicCard'

/**
 * The relic list. Same interaction model as the roster and the Archive -- type anywhere, the
 * list dims rather than filters, Enter opens the top match -- so all three pages behave the
 * same way once you've learned one.
 *
 * Search here also covers descriptions (see scoreRelic), because relics are remembered by what
 * they do far more than by what they're called.
 */
export function RelicBrowser({ relics }: { relics: Relic[] }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const matches = useMemo(() => searchRelics(relics, query), [relics, query])
  const grouped = useMemo(() => relicsByGroup(relics), [relics])
  const topMatch = query ? matches[0] : undefined

  const openTopMatch = useCallback(() => {
    if (!query || !matches.length) return false
    router.push(`/relics/${matches[0].slug}`)
    return true
  }, [router, matches, query])

  useTypeToSearch({ inputRef, setQuery, onEnter: openTopMatch })

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-frost 2xl:text-4xl">
            Relics
          </h1>
          <p className="mt-2 text-sm text-muted 2xl:text-base">
            {!query
              ? `${relics.length} relics. Start typing to find one — descriptions are searchable too.`
              : matches.length
                ? `Enter opens ${matches[0].name}.`
                : `No relic matches “${query}”. Press Escape to clear.`}
          </p>
        </div>

        <div className="relative w-full sm:w-64 2xl:w-80">
          <label htmlFor="relic-search" className="sr-only">
            Search relics
          </label>
          <input
            ref={inputRef}
            id="relic-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search relics"
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

      <div className="space-y-12">
        {RELIC_GROUPS.map((group) => {
          const accent = RELIC_GROUP_COLOR[group]
          const inGroup = grouped[group]

          return (
            <section key={group}>
              <header className="mb-4 flex items-baseline gap-3 border-b border-[var(--edge)] pb-2">
                <span aria-hidden className="size-2.5 rotate-45" style={{ backgroundColor: accent }} />
                <h2 className="label text-[0.95rem]" style={{ color: accent }}>
                  {RELIC_GROUP_NAME[group]}
                </h2>
                <span className="ml-auto font-[family-name:var(--font-label)] text-sm text-muted tabular-nums">
                  {inGroup.length}
                </span>
              </header>

              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {inGroup.map((relic) => (
                  <RelicCard
                    key={relic.slug}
                    relic={relic}
                    isTopMatch={relic.slug === topMatch?.slug}
                    isDimmed={Boolean(query) && relic.slug !== topMatch?.slug}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
