import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/SiteHeader'
import { TierBoard } from '@/components/TierBoard'
import { TierListPicker } from '@/components/TierListPicker'
import { requireSession } from '@/lib/auth-guard'
import { AUTHOR_COLOR, AUTHOR_NAME, AUTHORS, isAuthor } from '@/lib/authors'
import { HEROES } from '@/lib/heroes'
import { getTierList, listTierLists } from '@/lib/tierlists-db'

// slug -> name, and nothing else. The chips only ever show a portrait and a tooltip, and
// the full Hero objects carry abilities and talents that would ride along for no reason.
const HERO_NAMES: Record<string, string> = Object.fromEntries(
  HEROES.map((hero) => [hero.slug, hero.name]),
)

export default async function TiersPage({
  searchParams,
}: {
  // A Promise in this version of Next -- awaited, not destructured.
  searchParams: Promise<{ author?: string; list?: string }>
}) {
  const me = await requireSession()
  const params = await searchParams

  // Absent means "mine". Present but unknown is a typo'd URL, not a silent fallback.
  if (params.author !== undefined && !isAuthor(params.author)) notFound()
  const viewing = isAuthor(params.author) ? params.author : me
  const editable = viewing === me

  const lists = await listTierLists(viewing)

  // A list id for someone else's list, or one that's been deleted, falls back to their most
  // recent rather than erroring -- the id came from a link, and links go stale.
  const requested = Number(params.list)
  const selectedId =
    lists.find((list) => list.id === requested)?.id ?? lists[0]?.id ?? null
  const list = selectedId === null ? null : await getTierList(selectedId, viewing)

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-frost sm:text-5xl">
          Tiers
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Drag the roster into shape. Rename the tiers, add your own, and compare against each
          other&rsquo;s — you can read anyone&rsquo;s board, and edit your own.
        </p>

        {/* Whose board. Two links rather than a control, so it's shareable and the back
            button behaves. */}
        <div className="mt-6 flex items-center gap-4">
          {AUTHORS.map((author) => (
            <Link
              key={author}
              href={`/tiers?author=${author}`}
              aria-current={author === viewing ? 'page' : undefined}
              className="label flex items-center gap-2 text-[0.7rem] transition-opacity duration-200"
              style={{
                color: author === viewing ? AUTHOR_COLOR[author] : undefined,
                opacity: author === viewing ? 1 : 0.45,
              }}
            >
              <span
                aria-hidden
                className="size-2 rotate-45"
                style={{ backgroundColor: AUTHOR_COLOR[author] }}
              />
              {AUTHOR_NAME[author]}
            </Link>
          ))}
        </div>

        <div className="mt-5">
          <TierListPicker
            lists={lists}
            selectedId={selectedId}
            author={viewing}
            editable={editable}
          />
        </div>

        <div className="mt-8">
          {list ? (
            // key so switching lists remounts the board rather than reconciling one
            // unsaved draft into another.
            <TierBoard
              key={list.id}
              listId={list.id}
              initialBoard={list.board}
              initialRev={list.rev}
              heroNames={HERO_NAMES}
              editable={editable}
            />
          ) : (
            <p className="text-sm text-muted">
              {editable
                ? 'No lists yet — name one above and it starts with S through F.'
                : `${AUTHOR_NAME[viewing]} hasn’t made a tier list yet.`}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
