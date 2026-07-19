import { HeroGrid } from '@/components/HeroGrid'
import { SiteHeader } from '@/components/SiteHeader'
import { requireSession } from '@/lib/auth-guard'
import { getHeroes } from '@/lib/heroes'

export default async function HeroesPage() {
  await requireSession()

  const total = getHeroes().length

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="px-6 py-10">
        <div className="mb-10 max-w-2xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-frost">
            Choose a hero
          </h1>
          <p className="mt-2 text-sm text-muted">
            {total} heroes in the roster. Pick one to read its abilities, relics and review.
          </p>
        </div>

        <HeroGrid />
      </div>
    </main>
  )
}
