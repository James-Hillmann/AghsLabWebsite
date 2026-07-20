// The shape of a comment on an artifact, a relic or an ability. Deliberately free of any database import
// so the cards and the editor -- both client components -- can share these types. Reads and
// writes live in lib/comments-db.ts, which is server-only.
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
  kind: CommentKind
  /** The artifact or relic slug this is about. */
  slug: string
  author: Author
  body: string
  updatedAt: string
}
