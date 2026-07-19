import Image from 'next/image'
import Link from 'next/link'

import { leaveSite } from '@/app/actions/auth'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-5 border-b border-[var(--edge)] bg-[color-mix(in_srgb,var(--ice-void)_78%,transparent)] px-6 py-3 backdrop-blur-md">
      <Link href="/heroes" className="shrink-0">
        <Image src="/logo.png" alt="Aghanim's Labyrinth" width={405} height={164} className="w-28" />
      </Link>
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
  )
}
