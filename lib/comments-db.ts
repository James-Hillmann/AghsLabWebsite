import 'server-only'

import { isAuthor, type Author } from './authors'
import { isCommentKind, type Comment, type CommentKind } from './comments'
import { read, sql } from './db'

/** snake_case rows stop at this file; the rest of the app only sees Comment. */
type Row = {
  id: number | string
  subject_kind: string
  subject_slug: string
  author: string
  body: string | null
  created_at: string | Date
  updated_at: string | Date
}

function toComment(row: Row): Comment | null {
  // A row whose author or kind no longer parses is data from an older shape. Skipping it
  // beats rendering a post attributed to nobody.
  if (!isAuthor(row.author) || !isCommentKind(row.subject_kind)) return null
  if (!row.body) return null

  return {
    // bigint arrives as a string from the driver; the ids here stay far short of 2^53.
    id: Number(row.id),
    kind: row.subject_kind,
    slug: row.subject_slug,
    author: row.author,
    body: row.body,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

/**
 * One subject's thread, newest first -- the order the page renders.
 *
 * Wrapped in `read` so a thread that can't be fetched renders empty instead of taking the
 * whole page down with it. That matters most in the window between a deploy and its
 * migration: the columns this query names don't exist until db/migrations has been run, and
 * three detail routes call it directly from a Server Component.
 */
export async function getComments(kind: CommentKind, slug: string): Promise<Comment[]> {
  return read(`comments on ${kind} ${slug}`, [], async () => {
    const rows = (await sql()`
      select * from comments
      where subject_kind = ${kind} and subject_slug = ${slug}
      order by created_at desc, id desc
    `) as Row[]

    return rows.map(toComment).filter((comment): comment is Comment => comment !== null)
  })
}

/** Every comment of one kind, for the coverage dots on the browse grids. */
export async function getAllComments(kind: CommentKind): Promise<Comment[]> {
  return read(`all ${kind} comments`, [], async () => {
    const rows = (await sql()`select * from comments where subject_kind = ${kind}`) as Row[]
    return rows.map(toComment).filter((comment): comment is Comment => comment !== null)
  })
}

/** Adds a post to a thread. Always an insert -- posting twice is the point here. */
export async function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) {
  await sql()`
    insert into comments (subject_kind, subject_slug, author, body)
    values (${comment.kind}, ${comment.slug}, ${comment.author}, ${comment.body})
  `
}

/**
 * Rewrites one post.
 *
 * `author` is part of the where clause rather than checked beforehand, so the ownership test
 * and the write are the same statement -- there's no window between them, and an id belonging
 * to someone else simply matches nothing.
 *
 * created_at is deliberately untouched: an edit shouldn't jump a post to the top of the thread.
 */
export async function editComment(id: number, author: Author, body: string): Promise<boolean> {
  const rows = (await sql()`
    update comments set body = ${body}, updated_at = now()
    where id = ${id} and author = ${author}
    returning id
  `) as { id: number }[]

  return rows.length > 0
}

/** Deletes one post, with the same single-statement ownership check as editComment. */
export async function deleteComment(id: number, author: Author): Promise<boolean> {
  const rows = (await sql()`
    delete from comments where id = ${id} and author = ${author} returning id
  `) as { id: number }[]

  return rows.length > 0
}
