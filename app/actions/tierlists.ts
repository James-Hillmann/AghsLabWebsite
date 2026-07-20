'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireSession } from '@/lib/auth-guard'
import { isDatabaseConfigured, isMissingTableError } from '@/lib/db'
import { defaultBoard, LIST_NAME_MAX, sanitizeBoard, type TierBoard } from '@/lib/tierlists'
import {
  createTierList,
  deleteTierList,
  isDuplicateNameError,
  renameTierList,
  saveTierBoard,
} from '@/lib/tierlists-db'

// A 'use server' module can only export async functions, so the initial state for
// useActionState lives with the form in components/TierListPicker.tsx.
export type ListState = { error: string | null }

function fail(error: string): ListState {
  return { error }
}

/** "Try again" is bad advice when the table simply isn't there yet. */
function failFromError(error: unknown, verb: string): ListState {
  if (isMissingTableError(error)) {
    return fail('The tier_lists table doesn’t exist yet. Run `npm run db:push`.')
  }
  return fail(`Couldn't ${verb} that. Try again in a moment.`)
}

function readName(formData: FormData): { error: string } | { name: string } {
  const raw = formData.get('name')
  const name = typeof raw === 'string' ? raw.trim() : ''
  if (!name) return { error: 'Give the list a name first.' }
  if (name.length > LIST_NAME_MAX) return { error: `Keep it under ${LIST_NAME_MAX} characters.` }
  return { name }
}

function readId(formData: FormData): number | null {
  const id = Number(formData.get('id'))
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function createList(_prev: ListState, formData: FormData): Promise<ListState> {
  // First line, always. Server Functions are reachable by direct POST, so this is the only
  // thing standing between a stray request and someone else's lists.
  const author = await requireSession()

  const parsed = readName(formData)
  if ('error' in parsed) return fail(parsed.error)

  if (!isDatabaseConfigured()) {
    return fail('The database isn’t connected yet. Add the Neon integration and pull the env.')
  }

  let id: number
  try {
    id = await createTierList(author, parsed.name, defaultBoard())
  } catch (error) {
    if (isDuplicateNameError(error)) return fail(`You already have a list called “${parsed.name}”.`)
    console.error('Failed to create tier list:', error)
    return failFromError(error, 'create')
  }

  // Revalidate before redirecting -- redirect() throws, so anything after it never runs.
  revalidatePath('/tiers')
  redirect(`/tiers?list=${id}`)
}

export async function renameList(_prev: ListState, formData: FormData): Promise<ListState> {
  const author = await requireSession()

  const id = readId(formData)
  if (id === null) return fail('Unknown list.')

  const parsed = readName(formData)
  if ('error' in parsed) return fail(parsed.error)

  if (!isDatabaseConfigured()) return fail('The database isn’t connected yet.')

  try {
    // The author is in the WHERE, so a false here means "not yours" as much as "not there".
    if (!(await renameTierList(id, author, parsed.name))) return fail('Unknown list.')
  } catch (error) {
    if (isDuplicateNameError(error)) return fail(`You already have a list called “${parsed.name}”.`)
    console.error('Failed to rename tier list:', error)
    return failFromError(error, 'rename')
  }

  revalidatePath('/tiers')
  return { error: null }
}

export async function deleteList(_prev: ListState, formData: FormData): Promise<ListState> {
  const author = await requireSession()

  const id = readId(formData)
  if (id === null) return fail('Unknown list.')

  if (!isDatabaseConfigured()) return fail('The database isn’t connected yet.')

  try {
    if (!(await deleteTierList(id, author))) return fail('Unknown list.')
  } catch (error) {
    console.error('Failed to delete tier list:', error)
    return failFromError(error, 'delete')
  }

  revalidatePath('/tiers')
  redirect('/tiers')
}

export type SaveResult =
  | { ok: true; rev: number; savedAt: number }
  | { ok: false; error: string; conflict?: true }

/**
 * Save the whole board.
 *
 * Not one action per drop, for three reasons. Next dispatches Server Actions one at a time
 * per client, so a burst of drags would queue as serial round trips and the last would land
 * seconds after the gesture ended. A per-drop action is also a *partial* mutation, so a
 * failure mid-burst leaves the database matching neither the client nor anything the user
 * saw. And it would need server-side "insert at index N" logic, which is the ordering
 * problem all over again. A whole-board save is idempotent and retry-safe: the last payload
 * always describes a complete valid board, so a dropped save costs nothing.
 *
 * Takes a plain object rather than FormData because there's no form here -- the caller is a
 * debounce timer, not a submit button.
 */
export async function saveBoard(input: {
  id: number
  rev: number
  board: TierBoard
}): Promise<SaveResult> {
  const author = await requireSession()

  if (!Number.isInteger(input?.id) || input.id < 1) return { ok: false, error: 'Unknown list.' }
  if (!Number.isInteger(input.rev) || input.rev < 0) return { ok: false, error: 'Unknown revision.' }

  // Never trust the shape: caps rows, clamps labels, forces palette colours, drops unknown
  // slugs and dedupes across the whole board. Ownership isn't in here -- that's the author
  // in the WHERE clause.
  const board = sanitizeBoard(input.board)

  if (!isDatabaseConfigured()) {
    return { ok: false, error: 'The database isn’t connected yet.' }
  }

  try {
    const rev = await saveTierBoard(input.id, author, board, input.rev)
    if (rev === null) {
      // Either not yours or this tab is behind. The remedy is the same either way, and
      // saying which would tell a prober whether the id exists.
      return { ok: false, conflict: true, error: 'This list changed elsewhere — reload to catch up.' }
    }

    // Deliberately no revalidatePath. It would re-render the route and commit a fresh RSC
    // payload in this same response, dropping server state into a board the user may have
    // dragged again since. The client already holds the truth; there is nothing to refresh.
    return { ok: true, rev, savedAt: Date.now() }
  } catch (error) {
    console.error('Failed to save tier list:', error)
    if (isMissingTableError(error)) {
      return { ok: false, error: 'The tier_lists table doesn’t exist yet. Run `npm run db:push`.' }
    }
    return { ok: false, error: "Couldn't save that — retrying." }
  }
}
