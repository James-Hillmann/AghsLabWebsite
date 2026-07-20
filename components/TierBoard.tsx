'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react'

import { saveBoard } from '@/app/actions/tierlists'
import { portraitUrl } from '@/lib/heroes'
import {
  MAX_ROWS,
  ROW_COLORS,
  moveHero,
  newRowId,
  trayHeroes,
  type Loc,
  type TierBoard as Board,
  type TierRow,
} from '@/lib/tierlists'
import { usePointerDrag } from '@/lib/use-pointer-drag'

import { TierLane } from './TierLane'
import { TierRowStrip } from './TierRowStrip'

/** Idle debounce, and the ceiling that forces a checkpoint during a long fiddle. */
const SAVE_IDLE_MS = 700
const SAVE_MAX_MS = 4000

type Status = 'idle' | 'saving' | 'saved' | 'error' | 'conflict'

/**
 * The whole editable board: state, saving, dragging and the keyboard fallback.
 *
 * The only stateful component on the page, and rendered with key={listId} so switching
 * lists remounts it rather than trying to reconcile one draft into another.
 */
export function TierBoard({
  listId,
  initialBoard,
  initialRev,
  heroNames,
  editable,
}: {
  listId: number
  initialBoard: Board
  initialRev: number
  /** slug -> display name, built once on the server. The chips only need the name. */
  heroNames: Record<string, string>
  editable: boolean
}) {
  const [board, setBoard] = useState(initialBoard)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [lifted, setLifted] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const boardRef = useRef(board)
  const revRef = useRef(initialRev)
  const dirtyRef = useRef(false)
  const savingRef = useRef(false)
  // Set once a conflict is seen. Nothing this tab holds is safe to write after that.
  const blockedRef = useRef(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flushRef = useRef<() => void>(() => {})

  const flush = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    if (maxTimer.current) clearTimeout(maxTimer.current)
    idleTimer.current = null
    maxTimer.current = null

    // One save in flight at a time. This is what actually removes the race: two writes are
    // never outstanding together, so they can't land out of order.
    if (!dirtyRef.current || savingRef.current || blockedRef.current) return

    dirtyRef.current = false
    savingRef.current = true
    setStatus('saving')

    startTransition(async () => {
      const result = await saveBoard({
        id: listId,
        rev: revRef.current,
        board: boardRef.current,
      })
      savingRef.current = false

      if (result.ok) {
        revRef.current = result.rev
        setStatus('saved')
        setMessage(null)
        // Something changed while we were saving. Go again, now, rather than waiting for
        // another edit to restart the debounce.
        if (dirtyRef.current) flushRef.current()
        return
      }

      setMessage(result.error)
      if (result.conflict) {
        blockedRef.current = true
        setStatus('conflict')
        return
      }

      // Transient. Put the board back on the queue and let the ceiling retry it.
      dirtyRef.current = true
      setStatus('error')
      maxTimer.current = setTimeout(() => flushRef.current(), SAVE_MAX_MS)
    })
  }, [listId])

  useEffect(() => {
    flushRef.current = flush
  }, [flush])

  /** Every edit funnels through here, so nothing can change the board without saving it. */
  const commit = useCallback(
    (next: Board) => {
      boardRef.current = next
      setBoard(next)
      if (!editable) return

      dirtyRef.current = true
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => flushRef.current(), SAVE_IDLE_MS)
      // A ceiling as well as an idle timer, so a long unbroken stretch of edits still
      // checkpoints instead of saving nothing until the user stops.
      if (!maxTimer.current) maxTimer.current = setTimeout(() => flushRef.current(), SAVE_MAX_MS)
    },
    [editable],
  )

  // A closed tab is the one case the debounce can't cover, so flush on the way out.
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flushRef.current()
    }
    const onPageHide = () => flushRef.current()

    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('pagehide', onPageHide)
      // Unmount is a navigation away -- same argument as pagehide.
      flushRef.current()
    }
  }, [])

  const onDrop = useCallback(
    (slug: string, to: Loc) => {
      commit(moveHero(boardRef.current, slug, to))
    },
    [commit],
  )

  const { dragging, hover, ghostRef, registerZone, handlers } = usePointerDrag({
    onDrop,
    enabled: editable,
  })

  const tray = useMemo(() => trayHeroes(board), [board])

  // --- Row editing -------------------------------------------------------------------

  const onRowChange = useCallback(
    (rowId: string, patch: Partial<TierRow>) => {
      commit(boardRef.current.map((row) => (row.id === rowId ? { ...row, ...patch } : row)))
    },
    [commit],
  )

  const onRowMove = useCallback(
    (rowId: string, direction: -1 | 1) => {
      const rows = [...boardRef.current]
      const from = rows.findIndex((row) => row.id === rowId)
      const to = from + direction
      if (from === -1 || to < 0 || to >= rows.length) return
      ;[rows[from], rows[to]] = [rows[to], rows[from]]
      commit(rows)
    },
    [commit],
  )

  const onRowDelete = useCallback(
    (rowId: string) => {
      // The heroes aren't deleted with it -- dropping out of every row puts them back in
      // the tray, which is what "unassigned" means here.
      commit(boardRef.current.filter((row) => row.id !== rowId))
    },
    [commit],
  )

  const addRow = useCallback(() => {
    const rows = boardRef.current
    if (rows.length >= MAX_ROWS) return
    commit([
      ...rows,
      { id: newRowId(), label: '', color: ROW_COLORS[rows.length % ROW_COLORS.length], heroes: [] },
    ])
  }, [commit])

  // --- Keyboard fallback -------------------------------------------------------------

  /**
   * Lift with Space, steer with the arrows, drop with Space or Escape. Reuses moveHero, so
   * a keyboard move and a dragged one can't disagree about what "one slot right" means.
   */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, slug: string) => {
      if (event.key === 'Escape') {
        setLifted(null)
        return
      }

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        setLifted((current) => (current === slug ? null : slug))
        return
      }

      if (lifted !== slug || !event.key.startsWith('Arrow')) return
      event.preventDefault()

      const rows = boardRef.current
      // The tray is the lane after the last row, so up/down walks one flat list.
      const laneIds: (string | null)[] = [...rows.map((row) => row.id), null]
      const laneOf = rows.findIndex((row) => row.heroes.includes(slug))
      const laneIndex = laneOf === -1 ? laneIds.length - 1 : laneOf
      const within = laneOf === -1 ? 0 : rows[laneOf].heroes.indexOf(slug)

      let to: Loc
      if (event.key === 'ArrowLeft') {
        to = { rowId: laneIds[laneIndex], index: Math.max(0, within - 1) }
      } else if (event.key === 'ArrowRight') {
        // +2, not +1: the index is read against the row as displayed, which still contains
        // this hero, so one slot right is two positions along. See moveHero.
        to = { rowId: laneIds[laneIndex], index: within + 2 }
      } else {
        const next = laneIndex + (event.key === 'ArrowUp' ? -1 : 1)
        if (next < 0 || next >= laneIds.length) return
        to = { rowId: laneIds[next], index: within }
      }

      const nextBoard = moveHero(rows, slug, to)
      commit(nextBoard)

      const target = nextBoard.find((row) => row.heroes.includes(slug))
      setAnnouncement(
        target
          ? `${heroNames[slug]} in ${target.label || 'unnamed tier'}, position ${
              target.heroes.indexOf(slug) + 1
            } of ${target.heroes.length}.`
          : `${heroNames[slug]} returned to unassigned.`,
      )
    },
    [commit, heroNames, lifted],
  )

  // --- Render ------------------------------------------------------------------------

  const dropIndexFor = (rowId: string | null) => (hover?.rowId === rowId ? hover.index : null)

  return (
    <div className="select-none">
      <div className="flex flex-col gap-2">
        {board.map((row, index) => (
          <TierRowStrip
            key={row.id}
            row={row}
            heroNames={heroNames}
            editable={editable}
            dropIndex={dropIndexFor(row.id)}
            dragging={dragging}
            lifted={lifted}
            handlers={handlers}
            onKeyDown={onKeyDown}
            registerZone={registerZone}
            onChange={onRowChange}
            onMove={onRowMove}
            onDelete={onRowDelete}
            canMoveUp={index > 0}
            canMoveDown={index < board.length - 1}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4">
        {editable && (
          <button
            type="button"
            onClick={addRow}
            disabled={board.length >= MAX_ROWS}
            className="label shard shard-edge px-3 py-1.5 text-[0.65rem] text-muted transition-colors hover:text-frost disabled:opacity-30"
            style={{ '--cut': '6px' } as React.CSSProperties}
          >
            + Add tier
          </button>
        )}

        <SaveStatus editable={editable} status={status} message={message} />
      </div>

      <section className="mt-6">
        <h2 className="label mb-2 text-[0.7rem] text-muted">
          Unassigned <span className="text-muted/60">({tray.length})</span>
        </h2>
        <TierLane
          rowId={null}
          heroes={tray}
          heroNames={heroNames}
          editable={editable}
          dropIndex={dropIndexFor(null)}
          dragging={dragging}
          lifted={lifted}
          handlers={handlers}
          onKeyDown={onKeyDown}
          registerZone={registerZone}
          className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_35%,transparent)]"
          emptyHint="Every hero is placed."
        />
      </section>

      {/* Announces placements and save state to screen readers -- the pointer version of
          both is purely visual. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* The ghost. Rendered by React once per drag; moved by the hook writing transform
          straight to this node, so the pointer never costs a render. */}
      {dragging && (
        <div
          ref={ghostRef}
          aria-hidden
          className="shard pointer-events-none fixed top-0 left-0 z-50 w-12 opacity-90 shadow-[0_0_0_1px_var(--edge-lit),0_12px_32px_-6px_color-mix(in_srgb,var(--ice-glow)_55%,transparent)] will-change-transform"
          style={{ '--cut': '5px' } as React.CSSProperties}
        >
          <Image
            src={portraitUrl(dragging)}
            alt=""
            width={235}
            height={272}
            unoptimized
            draggable={false}
            className="aspect-[235/272] w-full object-cover"
          />
        </div>
      )}
    </div>
  )
}

function SaveStatus({
  editable,
  status,
  message,
}: {
  editable: boolean
  status: Status
  message: string | null
}) {
  if (!editable) {
    return <span className="label text-[0.65rem] text-muted/70">Read only</span>
  }

  if (status === 'conflict' || status === 'error') {
    return <span className="text-[0.7rem] text-[#e0654a]">{message}</span>
  }

  return (
    <span className="label text-[0.65rem] text-muted/70">
      {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : ''}
    </span>
  )
}
