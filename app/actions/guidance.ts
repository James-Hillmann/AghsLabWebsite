'use server'

import { revalidatePath } from 'next/cache'

import { requireSession } from '@/lib/auth-guard'
import { isDatabaseConfigured } from '@/lib/db'
import { getTome, type Tome } from '@/lib/guidance'
import { deleteCode, isMissingTableError, setActiveTome, upsertCode } from '@/lib/guidance-db'

// A 'use server' module can only export async functions, so the initial state for
// useActionState lives with the form in components/CodeSlot.tsx. Only the type crosses
// over, and types are erased.
export type CodeState = { error: string | null; savedAt: number | null }

const CODE_MAX = 64

function fail(error: string): CodeState {
  return { error, savedAt: null }
}

/** "Try again" is bad advice when the tables simply aren't there yet. */
function failFromError(error: unknown, verb: string): CodeState {
  if (isMissingTableError(error)) {
    return fail('The guidance tables don’t exist yet. Run db/schema.sql against the database.')
  }
  return fail(`Couldn't ${verb} that. Try again in a moment.`)
}

/** Both actions take the same (tome, slot) pair, and both have to distrust it equally. */
function readSlot(formData: FormData): { error: string } | { tome: Tome; slot: number } {
  const tomeSlug = formData.get('tomeSlug')
  const tome = typeof tomeSlug === 'string' ? getTome(tomeSlug) : undefined
  if (!tome) return { error: 'Unknown tome.' }

  const slot = Number(formData.get('slot'))
  // Bounded by the tome's own size, so the form can't invent slot 900 of a 16-slot tome.
  if (!Number.isInteger(slot) || slot < 1 || slot > tome.total) {
    return { error: `${tome.name} only has slots 1 to ${tome.total}.` }
  }

  return { tome, slot }
}

function revalidate(tomeSlug: string) {
  revalidatePath('/guidance')
  revalidatePath(`/guidance/${tomeSlug}`)
}

export async function saveGuidanceCode(_prev: CodeState, formData: FormData): Promise<CodeState> {
  // First line, always. Server Functions are reachable by direct POST, so this is the only
  // thing standing between a stray request and our code list.
  const author = await requireSession()

  const parsed = readSlot(formData)
  if ('error' in parsed) return fail(parsed.error)

  const raw = formData.get('code')
  // Codes get pasted out of chat, so strip surrounding whitespace rather than rejecting it.
  const code = typeof raw === 'string' ? raw.trim() : ''
  if (!code) return fail('Paste the code first.')
  if (code.length > CODE_MAX) return fail(`That's longer than a code should be (${CODE_MAX} max).`)
  if (/\s/.test(code)) return fail("Codes don't contain spaces — check the paste.")

  // Checked after validation, not before: if the code is also wrong, "paste the code first"
  // is the more useful of the two complaints.
  if (!isDatabaseConfigured()) {
    return fail('The database isn’t connected yet. Add the Neon integration and pull the env.')
  }

  try {
    await upsertCode({
      tomeSlug: parsed.tome.slug,
      slot: parsed.slot,
      code,
      // From the session, never from the form -- the whole authorization model in one line.
      addedBy: author,
    })
  } catch (error) {
    console.error('Failed to save guidance code:', error)
    return failFromError(error, 'save')
  }

  revalidate(parsed.tome.slug)

  return { error: null, savedAt: Date.now() }
}

/** For clearing a mistyped code, so a bad transcription isn't stuck there. */
export async function deleteGuidanceCode(_prev: CodeState, formData: FormData): Promise<CodeState> {
  await requireSession()

  const parsed = readSlot(formData)
  if ('error' in parsed) return fail(parsed.error)

  if (!isDatabaseConfigured()) {
    return fail('The database isn’t connected yet.')
  }

  try {
    await deleteCode(parsed.tome.slug, parsed.slot)
  } catch (error) {
    console.error('Failed to delete guidance code:', error)
    return failFromError(error, 'remove')
  }

  revalidate(parsed.tome.slug)

  return { error: null, savedAt: Date.now() }
}

/**
 * Switch which tome the next win feeds. Posted from a plain <form action>, the way
 * SiteHeader handles sign-out -- no client component needed for a single button.
 */
export async function activateTome(formData: FormData): Promise<void> {
  await requireSession()

  const tomeSlug = formData.get('tomeSlug')
  const tome = typeof tomeSlug === 'string' ? getTome(tomeSlug) : undefined
  if (!tome) return

  if (!isDatabaseConfigured()) return

  try {
    await setActiveTome(tome.slug)
  } catch (error) {
    console.error('Failed to activate tome:', error)
    return
  }

  revalidate(tome.slug)
}
