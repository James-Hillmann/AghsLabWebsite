'use client'

import { useActionState, useState } from 'react'

import { saveComment, type CommentState } from '@/app/actions/comments'
import { AUTHOR_COLOR, AUTHOR_NAME, type Author } from '@/lib/authors'
import { COMMENT_MAX_LENGTH, type Comment, type CommentKind } from '@/lib/comments'

const initialCommentState: CommentState = { error: null, savedAt: null }

/**
 * One person's take on one artifact or relic.
 *
 * Simpler than TakeCard on purpose -- a hero take has a rating, a difficulty and a build, but
 * an artifact either works for you or it doesn't, and that's prose. Read-only unless it's your
 * own card; the Server Action ignores whatever the form claims and files the comment under the
 * session's author regardless.
 */
export function CommentCard({
  kind,
  slug,
  subject,
  author,
  comment,
  editable,
}: {
  kind: CommentKind
  slug: string
  /** Display name of the artifact or relic, for the empty-state copy. */
  subject: string
  author: Author
  comment: Comment | null
  editable: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [state, formAction, pending] = useActionState(saveComment, initialCommentState)
  const accent = AUTHOR_COLOR[author]

  // Close the editor once the write actually lands, not when the button is pressed.
  //
  // Adjusted during render rather than in an effect: the editor closing is derived from the
  // save having succeeded, so an effect would render the form one extra time before removing
  // it. Tracking the timestamp we've already reacted to keeps this from firing on every
  // render after a save.
  const [closedFor, setClosedFor] = useState<number | null>(null)
  if (state.savedAt && state.savedAt !== closedFor) {
    setClosedFor(state.savedAt)
    setEditing(false)
  }

  return (
    <article
      className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-6 py-5"
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      <header className="flex items-center gap-2.5 border-b border-[var(--edge)] pb-3">
        <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: accent }} />
        <h3 className="label text-[0.65rem]" style={{ color: accent }}>
          {AUTHOR_NAME[author]}
        </h3>

        {editable && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="label ml-auto text-[0.58rem] text-muted transition-colors duration-200 hover:text-frost"
          >
            {comment ? 'Edit' : 'Write one'}
          </button>
        )}
      </header>

      {editing ? (
        <form action={formAction} className="mt-4">
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="slug" value={slug} />

          <label className="block">
            <span className="sr-only">Your comment on {subject}</span>
            <textarea
              name="body"
              rows={6}
              maxLength={COMMENT_MAX_LENGTH}
              defaultValue={comment?.body ?? ''}
              placeholder={`What's ${subject} actually like to play with?`}
              className="w-full resize-y border-b border-[var(--edge)] bg-transparent pb-1.5 text-sm leading-relaxed text-frost outline-none transition-colors duration-200 placeholder:text-[color-mix(in_srgb,var(--ice-muted)_55%,transparent)] focus:border-[var(--edge-lit)]"
            />
          </label>

          <p className="mt-2 text-xs text-muted">Clearing the box deletes the comment.</p>

          {state.error && (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 text-xs text-[color-mix(in_srgb,var(--ice-glow)_70%,#fff)]"
            >
              {state.error}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="shard label px-5 py-2 text-[0.62rem] text-frost transition-colors duration-200 disabled:cursor-wait disabled:text-muted"
              style={
                {
                  '--cut': '7px',
                  backgroundColor: `color-mix(in srgb, ${accent} 18%, transparent)`,
                } as React.CSSProperties
              }
            >
              {pending ? 'Saving' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="label px-3 py-2 text-[0.62rem] text-muted transition-colors duration-200 hover:text-frost"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : comment ? (
        <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-frost">
          {comment.body}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {editable
            ? `You haven't written about ${subject} yet.`
            : `${AUTHOR_NAME[author]} hasn't written about ${subject} yet.`}
        </p>
      )}
    </article>
  )
}
