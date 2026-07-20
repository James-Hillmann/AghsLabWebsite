import Image from 'next/image'
import Link from 'next/link'

import { leaveSite } from '@/app/actions/auth'
import { AUTHOR_COLOR, AUTHOR_NAME } from '@/lib/authors'
import { getAuthor } from '@/lib/auth-guard'

export async function SiteHeader() {
  const author = await getAuthor()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--edge)] bg-[color-mix(in_srgb,var(--ice-void)_78%,transparent)] px-4 py-3 backdrop-blur-md sm:gap-5 sm:px-6">
      <Link href="/heroes" className="shrink-0">
        <Image
          src="/logo.png"
          alt="Aghanim's Labyrinth"
          width={405}
          height={164}
          className="w-20 sm:w-28"
        />
      </Link>

      <nav className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/heroes"
          className="label text-[0.62rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          Heroes
        </Link>
        <Link
          href="/guidance"
          className="label text-[0.62rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          Guidance
        </Link>
      </nav>

      {author && (
        <span className="ml-auto flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-2 rotate-45"
            style={{ backgroundColor: AUTHOR_COLOR[author] }}
          />
          {/* The diamond alone carries whose session it is once space runs short. */}
          <span
            className="label hidden text-[0.85rem] sm:inline"
            style={{ color: AUTHOR_COLOR[author] }}
          >
            {AUTHOR_NAME[author]}
          </span>
        </span>
      )}

      <form action={leaveSite} className={author ? 'ml-3 shrink-0 sm:ml-6' : 'ml-auto shrink-0'}>
        <button
          type="submit"
          className="label text-[0.7rem] whitespace-nowrap text-muted transition-colors duration-200 hover:text-frost"
        >
          Sign out
        </button>
      </form>
    </header>
  )
}
