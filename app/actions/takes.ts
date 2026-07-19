'use server'

import { revalidatePath } from 'next/cache'

import { requireSession } from '@/lib/auth-guard'
import { isDatabaseConfigured } from '@/lib/db'
import { getHero } from '@/lib/heroes'
import { isDifficulty } from '@/lib/takes'
import { upsertTake } from '@/lib/takes-db'

// A 'use server' module can only export async functions, so the initial state for
// useActionState lives with the form in components/TakeCard.tsx. Only the type crosses
// over, and types are erased.
export type TakeState = { error: string | null; savedAt: number | null }

const VERDICT_MAX = 160
const NOTES_MAX = 4000
const RELICS_MAX = 500

function fail(error: string): TakeState {
  return { error, savedAt: null }
}

/** Empty and whitespace-only inputs are stored as NULL, so "unwritten" has one meaning. */
function text(formData: FormData, field: string, max: number): string | null | undefined {
  const raw = formData.get(field)
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  return trimmed.length > max ? undefined : trimmed
}

export async function saveTake(_prev: TakeState, formData: FormData): Promise<TakeState> {
  // First line, always. Server Functions are reachable by direct POST, so this is the
  // only thing standing between a stray request and someone else's take.
  const author = await requireSession()

  const heroSlug = formData.get('heroSlug')
  const hero = typeof heroSlug === 'string' ? getHero(heroSlug) : undefined
  if (!hero) return fail('Unknown hero.')

  const ratingRaw = formData.get('rating')
  let rating: number | null = null
  if (typeof ratingRaw === 'string' && ratingRaw.trim()) {
    rating = Number(ratingRaw)
    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      return fail('Rating has to be a whole number from 1 to 10.')
    }
  }

  const difficultyRaw = formData.get('difficulty')
  const difficulty =
    typeof difficultyRaw === 'string' && difficultyRaw.trim()
      ? difficultyRaw.trim()
      : null
  if (difficulty !== null && !isDifficulty(difficulty)) {
    return fail('That difficulty is not on the ladder.')
  }

  const verdict = text(formData, 'verdict', VERDICT_MAX)
  if (verdict === undefined) return fail(`Keep the verdict under ${VERDICT_MAX} characters.`)

  const buildNotes = text(formData, 'buildNotes', NOTES_MAX)
  if (buildNotes === undefined) return fail(`Keep the build notes under ${NOTES_MAX} characters.`)

  const relics = text(formData, 'relics', RELICS_MAX)
  if (relics === undefined) return fail(`Keep the relics under ${RELICS_MAX} characters.`)

  // Only ids that belong to this hero survive, so the checkbox list can't be used to
  // stash arbitrary strings in the array column.
  const known = new Set(hero.abilities?.map((ability) => ability.valveId).filter(Boolean))
  const keyAbilities = formData
    .getAll('keyAbilities')
    .filter((value): value is string => typeof value === 'string' && known.has(value))

  // Checked after validation, not before: if the input is also wrong, "rating has to be
  // 1-10" is the more useful of the two complaints.
  if (!isDatabaseConfigured()) {
    return fail('The database isn’t connected yet. Add the Neon integration and pull the env.')
  }

  try {
    await upsertTake({
      heroSlug: hero.slug,
      // From the session, never from the form -- the whole authorization model in one line.
      author,
      rating,
      difficulty,
      verdict,
      buildNotes,
      keyAbilities,
      relics,
    })
  } catch (error) {
    console.error('Failed to save take:', error)
    return fail("Couldn't save that. Try again in a moment.")
  }

  revalidatePath(`/heroes/${hero.slug}`)
  revalidatePath('/heroes')

  return { error: null, savedAt: Date.now() }
}
