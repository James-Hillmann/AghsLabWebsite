import Link from 'next/link'

import {
  abilityHref,
  abilityIconFor,
  accentFor,
  formatValueSpan,
  type HeroAbility,
} from '@/lib/abilities'

import { CatalogueIcon } from './CatalogueIcon'
import { RichText } from './RichText'

/** Enough of the value block to tell two abilities apart without opening either. */
const PREVIEW_VALUES = 3

/**
 * One ability in a hero's kit.
 *
 * Built on RelicCard rather than ArtifactTile: like a relic, an ability is picked for what it
 * does, and Valve's ability art is too small and too samey to carry a square tile. So the text
 * leads and the icon follows it.
 *
 * The preview values are the ones that change with level, because those are what a player is
 * actually trying to remember -- a flat 0.25s hop duration tells you nothing.
 */
export function AbilityCard({ ability }: { ability: HeroAbility }) {
  const accent = accentFor(ability)

  const preview = ability.values
    .map((value) => ({ value, span: formatValueSpan(value) }))
    .filter((entry): entry is { value: (typeof ability.values)[number]; span: string } =>
      Boolean(entry.span),
    )
    .slice(0, PREVIEW_VALUES)

  return (
    <Link
      href={abilityHref(ability)}
      className="shard shard-edge block bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-5 py-4 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--ice-deep)_75%,transparent)]"
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      <div className="flex gap-3.5">
        <CatalogueIcon
          src={abilityIconFor(ability)}
          accent={accent}
          size={128}
          className="shard size-11 shrink-0 object-contain"
          fallbackClassName="shard size-11 shrink-0"
        />

        <div className="min-w-0">
          <h3 className="flex flex-wrap items-baseline gap-x-2 font-[family-name:var(--font-display)] text-lg leading-tight text-frost">
            {ability.name}
            {ability.isUltimate && (
              <span className="label text-[0.5rem]" style={{ color: accent }}>
                Ultimate
              </span>
            )}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
            <RichText text={ability.description} />
          </p>
        </div>
      </div>

      {preview.length > 0 && (
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {preview.map(({ value, span }) => (
            <div key={value.key} className="flex items-baseline gap-2">
              <dt className="label text-[0.5rem] text-muted">{value.name}</dt>
              <dd className="font-[family-name:var(--font-label)] text-xs text-frost tabular-nums">
                {span}
                {value.unit ?? ''}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Link>
  )
}
