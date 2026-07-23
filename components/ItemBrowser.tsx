'use client'

import { useMemo, useRef, useState } from 'react'

import {
  ITEM_CATEGORIES,
  ITEM_CATEGORY_BLURB,
  ITEM_CATEGORY_COLOR,
  ITEM_CATEGORY_NAME,
  itemsByCategory,
  searchItems,
  type Item,
} from '@/lib/items'
import { useTypeToSearch } from '@/lib/use-type-to-search'

import { ItemCard } from './ItemCard'

/**
 * The item shelves. Same interaction model as the relic and artifact lists -- type anywhere and
 * the list dims rather than filters -- so all three behave the same once you've learned one.
 * There's no detail route to open, so Enter isn't wired to navigate; the dimming is the answer.
 *
 * Search covers descriptions too (see scoreItem), because an item is remembered by what it does
 * as much as by its name.
 */
export function ItemBrowser({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const matches = useMemo(() => searchItems(items, query), [items, query])
  const grouped = useMemo(() => itemsByCategory(items), [items])
  const matched = useMemo(() => new Set(matches.map((item) => item.slug)), [matches])

  // No detail route to open, so Enter does nothing and never swallows the key.
  useTypeToSearch({ inputRef, setQuery, onEnter: () => false })

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-frost 2xl:text-4xl">
            Items
          </h1>
          <p className="mt-2 text-sm text-muted 2xl:text-base">
            {!query
              ? `${items.length} items the run reforges or hands out — not Dota's own shop. Start typing to find one.`
              : matches.length
                ? `${matches.length} match “${query}”. Press Escape to clear.`
                : `No item matches “${query}”. Press Escape to clear.`}
          </p>
        </div>

        <div className="relative w-full sm:w-64 2xl:w-80">
          <label htmlFor="item-search" className="sr-only">
            Search items
          </label>
          <input
            ref={inputRef}
            id="item-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search items"
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
        {ITEM_CATEGORIES.map((category) => {
          const accent = ITEM_CATEGORY_COLOR[category]
          const inGroup = grouped[category]
          if (!inGroup.length) return null

          return (
            <section key={category}>
              <header className="mb-4 border-b border-[var(--edge)] pb-2">
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className="size-2.5 rotate-45"
                    style={{ backgroundColor: accent }}
                  />
                  <h2 className="label text-[0.95rem]" style={{ color: accent }}>
                    {ITEM_CATEGORY_NAME[category]}
                  </h2>
                  <span className="ml-auto font-[family-name:var(--font-label)] text-sm text-muted tabular-nums">
                    {inGroup.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{ITEM_CATEGORY_BLURB[category]}</p>
              </header>

              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {inGroup.map((item) => (
                  <ItemCard
                    key={item.slug}
                    item={item}
                    isDimmed={Boolean(query) && !matched.has(item.slug)}
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
