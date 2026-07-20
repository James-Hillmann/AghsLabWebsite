import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AbilityGrid } from '@/components/AbilityGrid'
import { EmptySlot } from '@/components/EmptySlot'
import { HeroModel } from '@/components/HeroModel'
import { HeroTabs } from '@/components/HeroTabs'
import { Section } from '@/components/Section'
import { SiteHeader } from '@/components/SiteHeader'
import { TakeCard } from '@/components/TakeCard'
import { TalentTree } from '@/components/TalentTree'
import { abilitiesByHero } from '@/lib/abilities'
import { AUTHORS } from '@/lib/authors'
import { requireSession } from '@/lib/auth-guard'
import { ATTRIBUTE_COLOR, getHero } from '@/lib/heroes'
import { getTakesForHero } from '@/lib/takes-db'

export default async function HeroPage({ params }: { params: Promise<{ slug: string }> }) {
  const author = await requireSession()

  const { slug } = await params
  const hero = getHero(slug)
  if (!hero) notFound()

  const accent = ATTRIBUTE_COLOR[hero.attribute]
  const takes = await getTakesForHero(hero.slug)

  // The write-ups here are ours and stay the source of truth. What the generated catalogue adds
  // is a link: about three quarters of the hand-written entries name an ability that exists in
  // the game files too, and those get a route through to its real numbers. The rest are Dota
  // abilities Labyrinth doesn't use, and stay plain text.
  const generated = abilitiesByHero()[hero.slug] ?? []
  const normalise = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const abilities = (hero.abilities ?? []).map((ability) => {
    const match = generated.find((other) => normalise(other.name) === normalise(ability.name))
    return match ? { ...ability, href: `/abilities/${match.slug}` } : ability
  })

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <Link
          href="/heroes"
          className="label text-[0.6rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          &larr; All heroes
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* The model leads -- it's the most characteristic thing about a hero. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <HeroModel hero={hero} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: accent }} />
              <span className="label text-[0.65rem]" style={{ color: accent }}>
                {hero.attribute}
              </span>
            </div>

            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-frost sm:text-5xl">
              {hero.name}
            </h1>

            <HeroTabs
              codex={
                <>
                  <Section title="Abilities">
                    {abilities.length ? (
                      <AbilityGrid abilities={abilities} />
                    ) : (
                      <EmptySlot>No abilities recorded for {hero.name} yet.</EmptySlot>
                    )}
                  </Section>

                  <Section title="Talents">
                    {hero.talents?.length ? (
                      <TalentTree talents={hero.talents} />
                    ) : (
                      <EmptySlot>
                        {hero.name}&apos;s talent unlocks go here, level by level.
                      </EmptySlot>
                    )}
                  </Section>

                </>
              }
              takes={
                <Section title="What we think">
                  <div className="grid gap-6 md:grid-cols-2">
                    {AUTHORS.map((name) => (
                      <TakeCard
                        key={name}
                        hero={hero}
                        author={name}
                        take={takes[name] ?? null}
                        editable={name === author}
                      />
                    ))}
                  </div>
                </Section>
              }
            />
          </div>
        </div>
      </div>
    </main>
  )
}
