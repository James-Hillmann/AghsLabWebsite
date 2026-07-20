'use server'

import { revalidatePath } from 'next/cache'

import { abilityHref, getAbility } from '@/lib/abilities'
import { getArtifact } from '@/lib/artifacts'
import { requireSession } from '@/lib/auth-guard'
import { COMMENT_MAX_LENGTH, isCommentKind, type CommentKind } from '@/lib/comments'
import { addComment, deleteComment, editComment } from '@/lib/comments-db'
import { isDatabaseConfigured } from '@/lib/db'
import { getRelic } from '@/lib/relics'

// A 'use server' module can only export async functions, so the initial state for
// useActionState lives with the form in components/CommentThread.tsx. Only the type crosses
// over, and types are erased.
export type CommentState = { error: string | null; savedAt: number | null }

function fail(error: string): CommentState {
  return { error, savedAt: null }
}

/** The subject has to exist in the generated catalogue, or the row is orphaned on write. */
function subjectExists(kind: CommentKind, slug: string): boolean {
  if (kind === 'artifact') return Boolean(getArtifact(slug))
  if (kind === 'relic') return Boolean(getRelic(slug))
  return Boolean(getAbility(slug))
}

/**
 * Refreshes the pages a comment appears on.
 *
 * Spelled out per kind rather than pluralising the kind name. That shortcut worked for
 * artifacts and relics and produced `/abilitys` for the third, so ability threads silently
 * never refreshed -- and abilities don't sit at a top-level route at all any more, so there
 * was no string transformation that could have been right.
 */
function revalidateSubject(kind: CommentKind, slug: string) {
  if (kind === 'ability') {
    const ability = getAbility(slug)
    if (!ability) return
    revalidatePath(abilityHref(ability))
    revalidatePath(`/heroes/${ability.hero}`)
    return
  }

  const section = kind === 'artifact' ? 'artifacts' : 'relics'
  revalidatePath(`/${section}/${slug}`)
  revalidatePath(`/${section}`)
}

/**
 * The checks every write shares: a real session, a subject that exists, a body within limits,
 * and a database to write to.
 *
 * Returns either the validated values or the complaint to show. Kept as one function so the
 * three actions below can't drift apart on which of these they remember to do.
 */
async function validate(formData: FormData) {
  // First line, always. Server Functions are reachable by direct POST, so this is the only
  // thing standing between a stray request and someone else's thread.
  const author = await requireSession()

  const kindRaw = formData.get('kind')
  if (typeof kindRaw !== 'string' || !isCommentKind(kindRaw)) {
    return { ok: false, state: fail('Unknown subject type.') } as const
  }

  const slugRaw = formData.get('slug')
  if (typeof slugRaw !== 'string' || !subjectExists(kindRaw, slugRaw)) {
    return { ok: false, state: fail(`Unknown ${kindRaw}.`) } as const
  }

  const bodyRaw = formData.get('body')
  const body = typeof bodyRaw === 'string' ? bodyRaw.trim() : ''
  if (body.length > COMMENT_MAX_LENGTH) {
    return { ok: false, state: fail(`Keep it under ${COMMENT_MAX_LENGTH} characters.`) } as const
  }

  // Checked after validation, not before: if the input is also wrong, the specific complaint
  // is the more useful of the two.
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      state: fail('The database isn’t connected yet. Add the Neon integration and pull the env.'),
    } as const
  }

  return { ok: true, author, kind: kindRaw, slug: slugRaw, body } as const
}

/** The id of the post being edited or deleted. Absent or malformed is a rejection, not a 0. */
function postId(formData: FormData): number | null {
  const raw = formData.get('id')
  if (typeof raw !== 'string') return null
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

/** Adds a post to the thread. */
export async function postComment(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const checked = await validate(formData)
  if (!checked.ok) return checked.state

  const { author, kind, slug, body } = checked
  if (!body) return fail('Write something first.')

  try {
    // Author comes from the session, never the form -- the authorization model in one line.
    await addComment({ kind, slug, author, body })
  } catch (error) {
    console.error('Failed to post comment:', error)
    return fail("Couldn't post that. Try again in a moment.")
  }

  revalidateSubject(kind, slug)
  return { error: null, savedAt: Date.now() }
}

/**
 * Rewrites one of your own posts. An empty body deletes it, which is how the old single-comment
 * editor behaved and is still the least surprising thing for someone clearing the box.
 */
export async function updateComment(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const checked = await validate(formData)
  if (!checked.ok) return checked.state

  const { author, kind, slug, body } = checked
  const id = postId(formData)
  if (id === null) return fail('That post no longer exists.')

  try {
    // Both queries carry the author, so someone else's id matches no row rather than being
    // rejected after the fact.
    const changed = body ? await editComment(id, author, body) : await deleteComment(id, author)
    if (!changed) return fail('That post is no longer yours to edit.')
  } catch (error) {
    console.error('Failed to update comment:', error)
    return fail("Couldn't save that. Try again in a moment.")
  }

  revalidateSubject(kind, slug)
  return { error: null, savedAt: Date.now() }
}

