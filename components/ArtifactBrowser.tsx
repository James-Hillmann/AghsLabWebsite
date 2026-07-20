'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'

import {
  ERAS,
  ERA_COLOR,
  ERA_NAME,
  artifactsByEra,
  searchArtifacts,
  type Artifact,
} from '@/lib/artifacts'
import { useTypeToSearch } from '@/lib/use-type-to-search'

import { ArtifactGrid } from './ArtifactGrid'

/**
 * The Archive, laid out the way the game does it: era rail down the left, pedestals on the
 * right. The rail scrolls to an era rather than filtering to it -- same reasoning as the
 * roster's dim-don't-filter search. Nothing on this page ever moves.
 */
export function ArtifactBrowser({ artifacts }: { artifacts: Artifact[] }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const matches = useMemo(() => searchArtifacts(artifacts, query), [artifacts, query])
  const counts = useMemo(() => artifactsByEra(artifacts), [artifacts])

  const openTopMatch = useCallback(() => {
    if (!query || !matches.length) return false
    router.push(`/artifacts/${matches[0].slug}`)
    return true
  }, [router, matches, query])

  useTypeToSearch({ inputRef, setQuery, onEnter: openTopMatch })

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-frost 2xl:text-4xl">
            The Archive
          </h1>
          <p className="mt-2 text-sm text-muted 2xl:text-base">
            {!query
              ? `${artifacts.length} artifacts recorded. Start typing to find one.`
              : matches.length
                ? `Enter opens ${matches[0].name}.`
                : `No artifact matches “${query}”. Press Escape to clear.`}
          </p>
        </div>

        <div className="relative w-full sm:w-64 2xl:w-80">
          <label htmlFor="artifact-search" className="sr-only">
            Search artifacts
          </label>
          <input
            ref={inputRef}
            id="artifact-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search artifacts"
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

      <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
        {/* Anchor links, not state: the rail jumps you down the floor and stays useful with
            JavaScript off. Below lg it wraps to two rows rather than scrolling sideways --
            four eras is few enough to show at once, and a scrollbar here hides half of them
            behind a gesture. */}
        <nav
          aria-label="Eras"
          className="flex flex-wrap gap-2 lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:flex-nowrap"
        >
          {ERAS.map((era) => (
            <a
              key={era}
              href={`#era-${era}`}
              className="shard shard-edge flex shrink-0 items-center gap-2.5 bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-3 py-2.5 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--ice-deep)_80%,transparent)]"
              style={{ '--cut': '8px' } as React.CSSProperties}
            >
              <span
                aria-hidden
                className="size-2 shrink-0 rotate-45"
                style={{ backgroundColor: ERA_COLOR[era] }}
              />
              <span className="label text-[0.7rem]" style={{ color: ERA_COLOR[era] }}>
                {ERA_NAME[era]}
              </span>
              <span className="ml-auto pl-2 font-[family-name:var(--font-label)] text-xs text-muted tabular-nums">
                {counts[era].length}
              </span>
            </a>
          ))}
        </nav>

        <ArtifactGrid
          artifacts={artifacts}
          topMatchSlug={query ? matches[0]?.slug : undefined}
          searching={Boolean(query)}
        />
      </div>
    </>
  )
}
