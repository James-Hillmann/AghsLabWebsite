import Image from 'next/image'
import Link from 'next/link'

import { leaveSite } from '@/app/actions/auth'
import { AUTHOR_COLOR, AUTHOR_NAME } from '@/lib/authors'
import { getAuthor } from '@/lib/auth-guard'

export async function SiteHeader() {
  const author = await getAuthor()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-5 border-b border-[var(--edge)] bg-[color-mix(in_srgb,var(--ice-void)_78%,transparent)] px-6 py-3 backdrop-blur-md">
      <Link href="/heroes" className="shrink-0">
        <Image src="/logo.png" alt="Aghanim's Labyrinth" width={405} height={164} className="w-28" />
      </Link>
      {author && (
        <span className="ml-auto flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-2 rotate-45"
            style={{ backgroundColor: AUTHOR_COLOR[author] }}
          />
          <span className="label text-[0.85rem]" style={{ color: AUTHOR_COLOR[author] }}>
            {AUTHOR_NAME[author]}
          </span>
        </span>
      )}

      <form action={leaveSite} className={author ? 'ml-6' : 'ml-auto'}>
        <button
          type="submit"
          className="label text-[0.7rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          Sign out
        </button>
      </form>
    </header>
  )
}
