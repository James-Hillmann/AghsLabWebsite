'use client'

import { useActionState, useState } from 'react'

import { postComment, updateComment, type CommentState } from '@/app/actions/comments'
import { AUTHOR_COLOR, AUTHOR_NAME, type Author } from '@/lib/authors'
import {
  COMMENT_MAX_LENGTH,
  wasEdited,
  type Comment,
  type CommentKind,
} from '@/lib/comments'

const initialCommentState: CommentState = { error: null, savedAt: null }

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * "4h", "3d", or a date once it's old enough that elapsed time stops being the useful framing.
 *
 * Computed on the server and again on the client, so a post written seconds ago can render
 * "just now" on the server and "1m" on the client -- suppressHydrationWarning on the element
 * covers that rather than freezing the value or pushing it into an effect.
 */
function relativeTime(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime()

  if (elapsed < MINUTE) return 'just now'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d`

  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

/** Shared textarea styling, so the composer and the inline editor stay the same object. */
const FIELD =
  'w-full resize-y border-b border-[var(--edge)] bg-transparent pb-1.5 text-sm leading-relaxed text-frost outline-none transition-colors duration-200 placeholder:text-[color-mix(in_srgb,var(--ice-muted)_55%,transparent)] focus:border-[var(--edge-lit)]'

function AuthorMark({ author }: { author: Author }) {
  const accent = AUTHOR_COLOR[author]
  return (
    <>
      <span aria-hidden className="size-2 shrink-0 rotate-45" style={{ backgroundColor: accent }} />
      <span className="label text-[0.65rem]" style={{ color: accent }}>
        {AUTHOR_NAME[author]}
      </span>
    </>
  )
}

/** The box at the top of the thread. Always open -- posting is the primary action here. */
function Composer({
  kind,
  slug,
  subject,
  author,
}: {
  kind: CommentKind
  slug: string
  subject: string
  author: Author
}) {
  const [state, formAction, pending] = useActionState(postComment, initialCommentState)
  const accent = AUTHOR_COLOR[author]

  // Clearing the box after a successful post, without an effect: keying the textarea on the
  // save timestamp makes React build a fresh one, which is exactly "reset to defaultValue".
  return (
    <form action={formAction} className="border-b border-[var(--edge)] pb-6">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="slug" value={slug} />

      <div className="flex items-center gap-2.5">
        <AuthorMark author={author} />
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Add a comment on {subject}</span>
        <textarea
          key={state.savedAt ?? 'new'}
          name="body"
          rows={3}
          maxLength={COMMENT_MAX_LENGTH}
          placeholder={`What's ${subject} actually like to play with?`}
          className={FIELD}
        />
      </label>

      {state.error && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-xs text-[color-mix(in_srgb,var(--ice-glow)_70%,#fff)]"
        >
          {state.error}
        </p>
      )}

      <div className="mt-4">
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
          {pending ? 'Posting' : 'Post'}
        </button>
      </div>
    </form>
  )
}

/** One post, with an inline editor when it's yours. */
function Post({
  comment,
  kind,
  slug,
  editable,
}: {
  comment: Comment
  kind: CommentKind
  slug: string
  editable: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [state, formAction, pending] = useActionState(updateComment, initialCommentState)
  const accent = AUTHOR_COLOR[comment.author]

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
    <article className="border-b border-[var(--edge)] py-5 last:border-b-0">
      <header className="flex items-center gap-2.5">
        <AuthorMark author={comment.author} />

        <span
          suppressHydrationWarning
          title={new Date(comment.createdAt).toLocaleString()}
          className="font-[family-name:var(--font-label)] text-xs text-muted tabular-nums"
        >
          {relativeTime(comment.createdAt)}
        </span>
        {wasEdited(comment) && <span className="label text-[0.5rem] text-muted">edited</span>}

        {editable && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="label ml-auto text-[0.58rem] text-muted transition-colors duration-200 hover:text-frost"
          >
            Edit
          </button>
        )}
      </header>

      {editing ? (
        <form action={formAction} className="mt-3">
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="id" value={comment.id} />

          <label className="block">
            <span className="sr-only">Edit your comment</span>
            <textarea name="body" rows={4} maxLength={COMMENT_MAX_LENGTH} defaultValue={comment.body} className={FIELD} />
          </label>

          <p className="mt-2 text-xs text-muted">Clearing the box deletes this post.</p>

          {state.error && (
            <p
              role="status"
              aria-live="polite"
              className="mt-3 text-xs text-[color-mix(in_srgb,var(--ice-glow)_70%,#fff)]"
            >
              {state.error}
            </p>
          )}

          <div className="mt-4 flex gap-2">
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
      ) : (
        <p className="mt-2.5 text-sm leading-relaxed whitespace-pre-line text-frost">
          {comment.body}
        </p>
      )}
    </article>
  )
}

/**
 * The conversation about one artifact, relic or ability: a box to post in, then every post
 * newest first.
 *
 * Replaced a pair of fixed per-author cards. Those made "what we think" a two-slot form, where
 * a second thought meant overwriting the first; a thread lets either of us come back after
 * twenty runs and say the opposite without deleting what we said the first time.
 *
 * Read-only unless a post is yours. The Server Action ignores whatever the form claims and
 * files the post under the session's author regardless.
 */
export function CommentThread({
  kind,
  slug,
  subject,
  author,
  comments,
}: {
  kind: CommentKind
  slug: string
  /** Display name of the subject, for the placeholder and empty-state copy. */
  subject: string
  /** Who's signed in -- the one person who can post, and edit their own. */
  author: Author
  /** Newest first; the order comes from the query, not from here. */
  comments: Comment[]
}) {
  return (
    <div>
      <Composer kind={kind} slug={slug} subject={subject} author={author} />

      {comments.length ? (
        <div>
          {comments.map((comment) => (
            <Post
              key={comment.id}
              comment={comment}
              kind={kind}
              slug={slug}
              editable={comment.author === author}
            />
          ))}
        </div>
      ) : (
        <p className="py-6 text-sm leading-relaxed text-muted">
          Nothing about {subject} yet. Say the first thing.
        </p>
      )}
    </div>
  )
}
