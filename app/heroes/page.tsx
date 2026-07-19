import { HeroBrowser } from '@/components/HeroBrowser'
import { SiteHeader } from '@/components/SiteHeader'
import { requireSession } from '@/lib/auth-guard'
import { getHeroes } from '@/lib/heroes'
import { getAllTakes } from '@/lib/takes-db'

export default async function HeroesPage() {
  await requireSession()

  // "slug:author" per written take, so a tile can mark who's covered it without
  // shipping every take's prose to the client just to draw two dots.
  const takes = await getAllTakes()
  const covered = takes.map((take) => `${take.heroSlug}:${take.author}`)

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="px-6 py-10 2xl:px-10 2xl:py-8">
        <HeroBrowser heroes={getHeroes()} covered={covered} />
      </div>
    </main>
  )
}
