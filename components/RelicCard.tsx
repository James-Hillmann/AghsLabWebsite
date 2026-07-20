import Link from 'next/link'

import {
  RELIC_GROUP_COLOR,
  formatRoll,
  groupOf,
  tierCount,
  type Relic,
} from '@/lib/relics'

import { CatalogueIcon } from './CatalogueIcon'
import { RichText } from './RichText'

/**
 * One relic in the list.
 *
 * Relics lead with their text rather than their art -- what a relic does is the whole reason
 * you'd pick one, and the game gives them small icons that don't distinguish them well. So
 * this is a card, not a tile.
 *
 * The roll bands are the interesting part: a relic doesn't have "a value", it has a range that
 * widens by rarity tier, and seeing all four side by side is the thing you can't get in game
 * without collecting one of each.
 */
export function RelicCard({
  relic,
  isTopMatch = false,
  isDimmed = false,
}: {
  relic: Relic
  isTopMatch?: boolean
  isDimmed?: boolean
}) {
  const accent = RELIC_GROUP_COLOR[groupOf(relic)]
  const tiers = tierCount(relic)

  return (
    <Link
      href={`/relics/${relic.slug}`}
      data-top-match={isTopMatch || undefined}
      data-dimmed={isDimmed || undefined}
      className={`shard shard-edge block bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-5 py-4 transition-[opacity,box-shadow] duration-200 hover:bg-[color-mix(in_srgb,var(--ice-deep)_75%,transparent)] ${
        isTopMatch ? 'shadow-[0_0_0_2px_var(--ice-glow)]' : ''
      } ${
        isDimmed
          ? 'opacity-25 hover:opacity-100 focus-visible:opacity-100'
          : ''
      }`}
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      <div className="flex gap-3.5">
        <CatalogueIcon
          src={relic.icon}
          accent={accent}
          size={128}
          className="shard size-11 shrink-0 object-contain"
          fallbackClassName="shard size-11 shrink-0"
        />

        <div className="min-w-0">
          <h3 className="font-[family-name:var(--font-display)] text-lg leading-tight text-frost">
            {relic.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            <RichText text={relic.description} />
          </p>
        </div>
      </div>

      {relic.rolls.length > 0 && tiers > 0 && (
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {relic.rolls.map((roll) => (
            <div key={roll.key} className="flex items-baseline gap-2">
              <dt className="label text-[0.5rem] text-muted">{roll.key.replace(/_/g, ' ')}</dt>
              <dd className="font-[family-name:var(--font-label)] text-xs text-frost tabular-nums">
                {Array.from({ length: tiers }, (_, tier) => formatRoll(roll, tier)).join(' / ')}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Link>
  )
}
