// The shape of a comment on an artifact, a relic or an ability. Deliberately free of any
// database import so the thread and its composer -- both client components -- can share these
// types. Reads and writes live in lib/comments-db.ts, which is server-only.
//
// This exists because the catalogue is generated: everything in lib/artifacts.generated.ts is
// the game's own fact, regenerated wholesale on every game update. Anything James or Liam
// writes has to live somewhere a regeneration can't reach.

import { type Author } from './authors'

export const COMMENT_KINDS = ['artifact', 'relic', 'ability'] as const

export type CommentKind = (typeof COMMENT_KINDS)[number]

export function isCommentKind(value: unknown): value is CommentKind {
  return typeof value === 'string' && (COMMENT_KINDS as readonly string[]).includes(value)
}

/** Long enough for a real opinion, short enough that the column stays sane. */
export const COMMENT_MAX_LENGTH = 2000

export type Comment = {
  /** Surrogate key. A thread can hold several posts by the same person, so this is what
   *  editing and deleting address -- there's no natural key any more. */
  id: number
  kind: CommentKind
  /** The artifact, relic or ability slug this is about. */
  slug: string
  author: Author
  body: string
  /** Orders the thread. Independent of updatedAt, so editing an old post doesn't move it. */
  createdAt: string
  updatedAt: string
}

/** True once a post has been edited since it was written, to a second's tolerance. */
export function wasEdited(comment: Comment): boolean {
  return new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 1000
}
