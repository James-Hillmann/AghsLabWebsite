import Image from 'next/image'

import { leaveSite } from '@/app/actions/auth'
import { HeroGrid } from '@/components/HeroGrid'
import { requireSession } from '@/lib/auth-guard'
import { getHeroes } from '@/lib/heroes'

export default async function HeroesPage() {
  await requireSession()

  const total = getHeroes().length

  return (
    <main className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-5 border-b border-[var(--edge)] bg-[color-mix(in_srgb,var(--ice-void)_78%,transparent)] px-6 py-3 backdrop-blur-md">
        <Image src="/logo.png" alt="Aghanim's Labyrinth" width={405} height={164} className="w-28" />
        <span aria-hidden className="hidden h-6 w-px bg-[var(--edge)] sm:block" />
        <p className="label hidden text-[0.6rem] text-muted sm:block">Compendium</p>

        <form action={leaveSite} className="ml-auto">
          <button
            type="submit"
            className="label text-[0.6rem] text-muted transition-colors duration-200 hover:text-frost"
          >
            Sign out
          </button>
        </form>
      </header>

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
