import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AbilityValues } from '@/components/AbilityValues'
import { CatalogueIcon } from '@/components/CatalogueIcon'
import { CommentThread } from '@/components/CommentThread'
import { EmptySlot } from '@/components/EmptySlot'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { SiteHeader } from '@/components/SiteHeader'
import {
  abilityIconFor,
  accentFor,
  formatCast,
  formatShardEffect,
  getHeroAbility,
  heroInRoster,
  heroName,
} from '@/lib/abilities'
import { requireSession } from '@/lib/auth-guard'
import { getComments } from '@/lib/comments-db'

/** The tooltip footer, in the order the game prints it. */
const CAST_ROWS = [
  ['cooldown', 'Cooldown'],
  ['manaCost', 'Mana'],
  ['castRange', 'Cast Range'],
  ['duration', 'Duration'],
  ['channelTime', 'Channel'],
  ['charges', 'Charges'],
  ['chargeRestore', 'Charge Restore'],
] as const

export default async function AbilityPage({
  params,
}: {
  // `slug` is the hero, `ability` the segment under it -- /heroes/ursa/earthshock.
  params: Promise<{ slug: string; ability: string }>
}) {
  const author = await requireSession()

  const { slug, ability: abilityPath } = await params
  const ability = getHeroAbility(slug, abilityPath)
  if (!ability) notFound()

  const accent = accentFor(ability)
  const comments = await getComments('ability', ability.slug)

  const cast = CAST_ROWS.map(([key, label]) => ({
    label: label as string,
    value: formatCast(ability.cast[key]),
  })).filter((row): row is { label: string; value: string } => row.value !== null)

  const hero = heroName(ability.hero)

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        {/* Back to the hero this belongs to -- except for the few heroes the game has and
            the roster doesn't, whose page would 404. Those fall back to the roster itself. */}
        <Link
          href={heroInRoster(ability.hero) ? `/heroes/${ability.hero}` : '/heroes'}
          className="label text-[0.6rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          &larr; {heroInRoster(ability.hero) ? hero : 'All heroes'}
        </Link>

        <header className="mt-6 flex items-start gap-5">
          <CatalogueIcon
            src={abilityIconFor(ability)}
            accent={accent}
            size={256}
            className="shard shard-edge size-20 shrink-0 object-cover sm:size-24"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: accent }} />
              {/* Plain text, not a link: the back link immediately above already goes there,
                  and two links to the same hero a line apart reads as an accident. */}
              <span className="label text-[0.65rem]" style={{ color: accent }}>
                {hero}
              </span>
              {ability.isUltimate && (
                <span className="label text-[0.65rem] text-muted">Ultimate</span>
              )}
            </div>

            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-frost sm:text-5xl">
              {ability.name}
            </h1>

            {ability.requiredLevel > 0 && (
              <p className="mt-3 text-sm text-muted">
                Unlocks at hero level{' '}
                <span className="text-frost tabular-nums">{ability.requiredLevel}</span>
              </p>
            )}
          </div>
        </header>

        {/* The strip the game prints under a tooltip: cooldown, mana, and the rest. */}
        {cast.length > 0 && (
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-[var(--edge)] py-3">
            {cast.map((row) => (
              <div key={row.label} className="flex items-baseline gap-2">
                <dt className="label text-[0.55rem] text-muted">{row.label}</dt>
                <dd className="font-[family-name:var(--font-label)] text-sm text-frost tabular-nums">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <Section title="What it does">
          {ability.description ? (
            <div
              className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_55%,transparent)] px-5 py-4"
              style={{ '--cut': '10px' } as React.CSSProperties}
            >
              <p className="text-sm leading-relaxed text-frost">
                <RichText text={ability.description} />
              </p>
              {/* The smaller grey clarification the tooltip prints underneath. */}
              {ability.note && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  <RichText text={ability.note} />
                </p>
              )}
            </div>
          ) : (
            <EmptySlot>The game ships no description for {ability.name}.</EmptySlot>
          )}
        </Section>

        <Section title="Values">
          {ability.values.length ? (
            <AbilityValues
              values={ability.values}
              maxLevel={ability.maxLevel}
              talents={ability.talents}
            />
          ) : (
            <EmptySlot>{ability.name} has no numbers of its own.</EmptySlot>
          )}
        </Section>

        <Section title="Epic upgrades">
          {ability.epics.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {ability.epics.map((epic) => (
                <div
                  key={epic.gameId}
                  className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-5 py-4"
                  style={{ '--cut': '10px' } as React.CSSProperties}
                >
                  <h3
                    className="font-[family-name:var(--font-display)] text-base leading-tight"
                    style={{ color: accent }}
                  >
                    {epic.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-frost">
                    <RichText text={epic.description} />
                  </p>
                  {epic.simple && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      <RichText text={epic.simple} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptySlot>No epic upgrade rolls for {ability.name}.</EmptySlot>
          )}
        </Section>

        <Section title="Shard upgrades">
          {ability.shards.length ? (
            <>
              <ul className="space-y-2">
                {ability.shards.map((shard) => (
                  <li
                    key={shard.gameId}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
                  >
                    <span className="text-frost tabular-nums">
                      {shard.effects.map(formatShardEffect).join(' · ')}
                    </span>
                    {shard.countLimit !== undefined && (
                      <span className="label text-[0.5rem] text-muted">
                        up to {shard.countLimit}&times;
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {/* Shards carry no text in the game files at all -- see ARTIFACTS.md. Saying so
                  is better than letting a derived label pass for a quoted one. */}
              <p className="mt-4 text-xs leading-relaxed text-muted">
                The game ships no wording for shards, so these lines are read off the values they
                change.
              </p>
            </>
          ) : (
            <EmptySlot>No shard upgrades for {ability.name}.</EmptySlot>
          )}
        </Section>

        <Section title="What we think">
          <CommentThread
            kind="ability"
            slug={ability.slug}
            subject={ability.name}
            author={author}
            comments={comments}
          />
        </Section>

        {ability.flavor && (
          <p className="mt-12 border-t border-[var(--edge)] pt-6 text-sm leading-relaxed text-muted italic">
            {ability.flavor}
          </p>
        )}
      </div>
    </main>
  )
}
