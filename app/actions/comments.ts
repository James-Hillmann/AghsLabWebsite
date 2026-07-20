'use server'

import { revalidatePath } from 'next/cache'

import { getAbility } from '@/lib/abilities'
import { getArtifact } from '@/lib/artifacts'
import { requireSession } from '@/lib/auth-guard'
import { COMMENT_MAX_LENGTH, isCommentKind, type CommentKind } from '@/lib/comments'
import { deleteComment, upsertComment } from '@/lib/comments-db'
import { isDatabaseConfigured } from '@/lib/db'
import { getRelic } from '@/lib/relics'

// A 'use server' module can only export async functions, so the initial state for
// useActionState lives with the form in components/CommentCard.tsx. Only the type crosses
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

export async function saveComment(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  // First line, always. Server Functions are reachable by direct POST, so this is the only
  // thing standing between a stray request and someone else's comment.
  const author = await requireSession()

  const kindRaw = formData.get('kind')
  if (typeof kindRaw !== 'string' || !isCommentKind(kindRaw)) return fail('Unknown subject type.')

  const slugRaw = formData.get('slug')
  if (typeof slugRaw !== 'string' || !subjectExists(kindRaw, slugRaw)) {
    return fail(`Unknown ${kindRaw}.`)
  }

  const bodyRaw = formData.get('body')
  const body = typeof bodyRaw === 'string' ? bodyRaw.trim() : ''
  if (body.length > COMMENT_MAX_LENGTH) {
    return fail(`Keep it under ${COMMENT_MAX_LENGTH} characters.`)
  }

  // Checked after validation, not before: if the input is also wrong, the specific complaint
  // is the more useful of the two.
  if (!isDatabaseConfigured()) {
    return fail('The database isn’t connected yet. Add the Neon integration and pull the env.')
  }

  try {
    // Clearing the box deletes rather than storing an empty string, so "unwritten" has one
    // meaning and the coverage dots stay honest.
    if (body) {
      // Author comes from the session, never the form -- the authorization model in one line.
      await upsertComment({ kind: kindRaw, slug: slugRaw, author, body })
    } else {
      await deleteComment(kindRaw, slugRaw, author)
    }
  } catch (error) {
    console.error('Failed to save comment:', error)
    return fail("Couldn't save that. Try again in a moment.")
  }

  // Each kind is its own top-level section, and the plural is the route.
  const section = `${kindRaw}s`
  revalidatePath(`/${section}/${slugRaw}`)
  revalidatePath(`/${section}`)

  return { error: null, savedAt: Date.now() }
}
