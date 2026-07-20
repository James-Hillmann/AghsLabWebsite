import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CatalogueIcon } from '@/components/CatalogueIcon'
import { CommentThread } from '@/components/CommentThread'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { SiteHeader } from '@/components/SiteHeader'
import { requireSession } from '@/lib/auth-guard'
import { getComments } from '@/lib/comments-db'
import {
  RELIC_GROUP_COLOR,
  RELIC_GROUP_NAME,
  formatRoll,
  getRelic,
  groupOf,
  tierCount,
} from '@/lib/relics'

export default async function RelicPage({ params }: { params: Promise<{ slug: string }> }) {
  const author = await requireSession()

  const { slug } = await params
  const relic = getRelic(slug)
  if (!relic) notFound()

  const group = groupOf(relic)
  const accent = RELIC_GROUP_COLOR[group]
  const tiers = tierCount(relic)
  const comments = await getComments('relic', relic.slug)

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <Link
          href="/relics"
          className="label text-[0.6rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          &larr; All relics
        </Link>

        <header className="mt-6 flex items-start gap-5">
          <CatalogueIcon
            src={relic.icon}
            accent={accent}
            size={128}
            className="shard shard-edge size-20 shrink-0 object-contain"
            fallbackClassName="shard shard-edge size-20 shrink-0"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: accent }} />
              <span className="label text-[0.65rem]" style={{ color: accent }}>
                {RELIC_GROUP_NAME[group]}
              </span>
            </div>

            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-frost sm:text-5xl">
              {relic.name}
            </h1>
          </div>
        </header>

        <p className="mt-5 text-sm leading-relaxed text-frost">
          <RichText text={relic.description} />
        </p>

        {relic.special && (
          <div
            className="shard shard-edge mt-5 bg-[color-mix(in_srgb,var(--ice-deep)_55%,transparent)] px-5 py-4"
            style={{ '--cut': '10px' } as React.CSSProperties}
          >
            <h2 className="label text-[0.55rem]" style={{ color: accent }}>
              At higher tiers
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-frost">
              <RichText text={relic.special} />
            </p>
          </div>
        )}

        {relic.rolls.length > 0 && tiers > 0 && (
          <Section title="Roll ranges by tier">
            {/* Wide tables scroll inside their own box rather than pushing the page sideways. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-md text-sm">
                <thead>
                  <tr className="border-b border-[var(--edge)]">
                    <th className="label pb-2 text-left text-[0.55rem] text-muted">Value</th>
                    {Array.from({ length: tiers }, (_, tier) => (
                      <th
                        key={tier}
                        className="label pb-2 text-right text-[0.55rem] text-muted tabular-nums"
                      >
                        Tier {tier + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {relic.rolls.map((roll) => (
                    <tr key={roll.key} className="border-b border-[var(--edge)] last:border-0">
                      <td className="py-2.5 text-frost">{roll.key.replace(/_/g, ' ')}</td>
                      {Array.from({ length: tiers }, (_, tier) => (
                        <td key={tier} className="py-2.5 text-right text-frost tabular-nums">
                          {formatRoll(roll, tier)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-muted">
              A relic rolls somewhere inside its band when you pick it up. Higher tiers roll
              from a better band, not a fixed number.
            </p>
          </Section>
        )}

        <Section title="What we think">
          <CommentThread
            kind="relic"
            slug={relic.slug}
            subject={relic.name}
            author={author}
            comments={comments}
          />
        </Section>
      </div>
    </main>
  )
}
