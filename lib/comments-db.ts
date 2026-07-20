import 'server-only'

import { isAuthor, type Author } from './authors'
import { isCommentKind, type Comment, type CommentKind } from './comments'
import { isDatabaseConfigured, sql } from './db'

/** snake_case rows stop at this file; the rest of the app only sees Comment. */
type Row = {
  subject_kind: string
  subject_slug: string
  author: string
  body: string | null
  updated_at: string | Date
}

function toComment(row: Row): Comment | null {
  // A row whose author or kind no longer parses is data from an older shape. Skipping it
  // beats rendering a card attributed to nobody.
  if (!isAuthor(row.author) || !isCommentKind(row.subject_kind)) return null
  if (!row.body) return null

  return {
    kind: row.subject_kind,
    slug: row.subject_slug,
    author: row.author,
    body: row.body,
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

export async function getComments(
  kind: CommentKind,
  slug: string,
): Promise<Partial<Record<Author, Comment>>> {
  if (!isDatabaseConfigured()) return {}

  const rows = (await sql()`
    select * from comments where subject_kind = ${kind} and subject_slug = ${slug}
  `) as Row[]

  const comments: Partial<Record<Author, Comment>> = {}
  for (const row of rows) {
    const comment = toComment(row)
    if (comment) comments[comment.author] = comment
  }
  return comments
}

/** Every comment of one kind, for the coverage dots on the browse grids. */
export async function getAllComments(kind: CommentKind): Promise<Comment[]> {
  if (!isDatabaseConfigured()) return []

  const rows = (await sql()`select * from comments where subject_kind = ${kind}`) as Row[]
  return rows.map(toComment).filter((comment): comment is Comment => comment !== null)
}

export async function upsertComment(comment: Omit<Comment, 'updatedAt'>): Promise<void> {
  await sql()`
    insert into comments (subject_kind, subject_slug, author, body, updated_at)
    values (${comment.kind}, ${comment.slug}, ${comment.author}, ${comment.body}, now())
    on conflict (subject_kind, subject_slug, author) do update set
      body       = excluded.body,
      updated_at = now()
  `
}

export async function deleteComment(
  kind: CommentKind,
  slug: string,
  author: Author,
): Promise<void> {
  await sql()`
    delete from comments
    where subject_kind = ${kind} and subject_slug = ${slug} and author = ${author}
  `
}
