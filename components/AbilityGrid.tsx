import Link from 'next/link'

import { abilityIconUrl, type Ability } from '@/lib/heroes'

import { RichText } from './RichText'

/**
 * Icons and names are pre-filled from Dota as scaffolding. Labyrinth reworks a lot of
 * these, so nothing here claims to describe behaviour -- the descriptions are ours to
 * write, and each slot says so until one exists.
 *
 * Where a hero has no write-up, the page falls back to the generated catalogue instead, and
 * those rows arrive with an `href` and a description carrying RichText markers -- which is why
 * the text goes through RichText rather than being printed directly.
 */
export function AbilityGrid({ abilities }: { abilities: Ability[] }) {
  return (
    <ul className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
      {abilities.map((ability) => {
        const icon = ability.image ?? (ability.valveId ? abilityIconUrl(ability.valveId) : null)

        return (
          <li key={ability.name} className="flex gap-4">
            {icon ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={icon}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="shard size-14 shrink-0 shadow-[0_0_0_1px_var(--edge)]"
                style={{ '--cut': '6px' } as React.CSSProperties}
              />
            ) : (
              <span
                aria-hidden
                className="shard size-14 shrink-0 bg-[color-mix(in_srgb,var(--ice-deep)_70%,transparent)] shadow-[0_0_0_1px_var(--edge)]"
                style={{ '--cut': '6px' } as React.CSSProperties}
              />
            )}

            <div className="min-w-0 pt-1">
              <h3 className="text-sm font-medium text-frost">
                {ability.href ? (
                  <Link
                    href={ability.href}
                    className="transition-colors duration-200 hover:text-glow"
                  >
                    {ability.name}
                  </Link>
                ) : (
                  ability.name
                )}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {ability.description ? (
                  <RichText text={ability.description} />
                ) : (
                  'No write-up yet.'
                )}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
