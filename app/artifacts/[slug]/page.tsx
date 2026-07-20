import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArtifactFacts } from '@/components/ArtifactFacts'
import { CatalogueIcon } from '@/components/CatalogueIcon'
import { ArtifactStats } from '@/components/ArtifactStats'
import { CommentCard } from '@/components/CommentCard'
import { EmptySlot } from '@/components/EmptySlot'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { SiteHeader } from '@/components/SiteHeader'
import { ERA_COLOR, ERA_NAME, getArtifact } from '@/lib/artifacts'
import { AUTHORS } from '@/lib/authors'
import { requireSession } from '@/lib/auth-guard'
import { getComments } from '@/lib/comments-db'

export default async function ArtifactPage({ params }: { params: Promise<{ slug: string }> }) {
  const author = await requireSession()

  const { slug } = await params
  const artifact = getArtifact(slug)
  if (!artifact) notFound()

  const accent = ERA_COLOR[artifact.era]
  const comments = await getComments('artifact', artifact.slug)

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <Link
          href="/artifacts"
          className="label text-[0.6rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          &larr; The Archive
        </Link>

        <header className="mt-6 flex items-start gap-5">
          <CatalogueIcon
            src={artifact.icon}
            accent={accent}
            size={256}
            className="shard shard-edge size-20 shrink-0 object-cover sm:size-24"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: accent }} />
              <span className="label text-[0.65rem]" style={{ color: accent }}>
                {ERA_NAME[artifact.era]}
              </span>
            </div>

            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-frost sm:text-5xl">
              {artifact.name}
            </h1>

            {artifact.heroLevel !== undefined && (
              <p className="mt-3 text-sm text-muted">
                Required hero level{' '}
                <span className="text-frost tabular-nums">{artifact.heroLevel}</span>
              </p>
            )}
          </div>
        </header>

        <Section title="Stats">
          {artifact.stats.length ? (
            <ArtifactStats stats={artifact.stats} maxLevel={artifact.maxLevel} />
          ) : (
            <EmptySlot>
              {artifact.name} has no stat block — its whole effect is the unique below.
            </EmptySlot>
          )}
        </Section>

        <Section title="Unique effect">
          {artifact.unique ? (
            <div
              className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_55%,transparent)] px-5 py-4"
              style={{ '--cut': '10px' } as React.CSSProperties}
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg" style={{ color: accent }}>
                {artifact.unique.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-frost">
                <RichText text={artifact.unique.description} />
              </p>
            </div>
          ) : (
            <EmptySlot>{artifact.name}&apos;s unique effect goes here.</EmptySlot>
          )}
        </Section>

        <Section title="Upgrades">
          {artifact.upgrades.length ? (
            <ul className="space-y-5">
              {artifact.upgrades.map((upgrade) => (
                <li key={upgrade.level} className="flex gap-4">
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-label)] text-xs text-frost tabular-nums"
                    style={{ boxShadow: `inset 0 0 0 1px ${accent}` }}
                  >
                    {upgrade.level}
                  </span>

                  <div className="min-w-0 pt-1">
                    <p className="text-sm leading-relaxed text-frost">
                      <span className="font-medium" style={{ color: accent }}>
                        [{upgrade.name}]
                      </span>{' '}
                      <RichText text={upgrade.description} />
                    </p>
                    {/* The smaller grey clarification the tooltip prints under some rows. */}
                    {upgrade.note && (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        <RichText text={upgrade.note} />
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptySlot>The level 10, 20, 30 and 40 unlocks go here.</EmptySlot>
          )}
        </Section>

        <Section title="Where it comes from">
          <ArtifactFacts artifact={artifact} />
        </Section>

        <Section title="What we think">
          <div className="grid gap-6 md:grid-cols-2">
            {AUTHORS.map((name) => (
              <CommentCard
                key={name}
                kind="artifact"
                slug={artifact.slug}
                subject={artifact.name}
                author={name}
                comment={comments[name] ?? null}
                editable={name === author}
              />
            ))}
          </div>
        </Section>

        {artifact.flavor && (
          <p className="mt-12 border-t border-[var(--edge)] pt-6 text-sm leading-relaxed text-muted italic">
            {artifact.flavor}
          </p>
        )}
      </div>
    </main>
  )
}
