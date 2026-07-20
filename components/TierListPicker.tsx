'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'

import { createList, deleteList, renameList, type ListState } from '@/app/actions/tierlists'
import { type Author } from '@/lib/authors'
import { LIST_NAME_MAX, type TierListMeta } from '@/lib/tierlists'

// A 'use server' module can only export async functions, so the initial state lives here
// with the forms that use it.
const EMPTY: ListState = { error: null }

export function TierListPicker({
  lists,
  selectedId,
  author,
  editable,
}: {
  lists: TierListMeta[]
  selectedId: number | null
  author: Author
  editable: boolean
}) {
  const [renaming, setRenaming] = useState(false)

  const [createState, create, creating] = useActionState(createList, EMPTY)
  const [renameState, rename, renamingPending] = useActionState(renameList, EMPTY)
  const [deleteState, remove, deleting] = useActionState(deleteList, EMPTY)

  const error = createState.error ?? renameState.error ?? deleteState.error
  const selected = lists.find((list) => list.id === selectedId) ?? null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {lists.map((list) => (
          <Link
            key={list.id}
            // Selection lives only in the URL: back and forward work, and the address bar
            // is a shareable link to exactly this board, with no client state involved.
            href={`/tiers?author=${author}&list=${list.id}`}
            aria-current={list.id === selectedId ? 'page' : undefined}
            className={`shard shard-edge px-3 py-1.5 text-[0.8rem] transition-colors duration-200 ${
              list.id === selectedId
                ? 'bg-[color-mix(in_srgb,var(--ice-glow)_14%,transparent)] text-frost'
                : 'text-muted hover:text-frost'
            }`}
            style={{ '--cut': '7px' } as React.CSSProperties}
          >
            {list.name}
          </Link>
        ))}

        {editable && (
          <form action={create} className="flex items-center gap-1.5">
            <input
              name="name"
              required
              maxLength={LIST_NAME_MAX}
              placeholder="New list…"
              aria-label="New list name"
              className="shard shard-edge w-36 bg-[color-mix(in_srgb,var(--ice-deep)_50%,transparent)] px-2.5 py-1.5 text-[0.8rem] outline-none placeholder:text-muted/60"
              style={{ '--cut': '7px' } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={creating}
              className="label text-[0.65rem] text-muted transition-colors hover:text-frost disabled:opacity-40"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </form>
        )}
      </div>

      {editable && selected && (
        <div className="flex flex-wrap items-center gap-3">
          {renaming ? (
            <form action={rename} className="flex items-center gap-1.5">
              <input type="hidden" name="id" value={selected.id} />
              <input
                name="name"
                required
                autoFocus
                defaultValue={selected.name}
                maxLength={LIST_NAME_MAX}
                aria-label="List name"
                className="shard shard-edge w-44 bg-[color-mix(in_srgb,var(--ice-deep)_50%,transparent)] px-2.5 py-1.5 text-[0.8rem] outline-none"
                style={{ '--cut': '7px' } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={renamingPending}
                className="label text-[0.65rem] text-muted transition-colors hover:text-frost"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setRenaming(false)}
                className="label text-[0.65rem] text-muted transition-colors hover:text-frost"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setRenaming(true)}
              className="label text-[0.65rem] text-muted transition-colors hover:text-frost"
            >
              Rename “{selected.name}”
            </button>
          )}

          <form action={remove}>
            <input type="hidden" name="id" value={selected.id} />
            <button
              type="submit"
              disabled={deleting}
              // A native confirm rather than a modal: deleting a list is rare, and a
              // dialog component would be more machinery than the risk deserves.
              onClick={(event) => {
                if (!confirm(`Delete “${selected.name}”? This can't be undone.`)) {
                  event.preventDefault()
                }
              }}
              className="label text-[0.65rem] text-muted transition-colors hover:text-[#e0654a]"
            >
              {deleting ? 'Deleting…' : 'Delete list'}
            </button>
          </form>
        </div>
      )}

      {error && <p className="text-[0.75rem] text-[#e0654a]">{error}</p>}
    </div>
  )
}
