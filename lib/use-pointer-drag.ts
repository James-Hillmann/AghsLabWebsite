'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type Loc } from './tierlists'

/**
 * Dragging hero portraits between tier rows, on mouse and on touch, with no dependency.
 *
 * Pointer Events rather than HTML5 drag-and-drop: `dragstart` simply does not fire from a
 * finger, and the alternative is maintaining two code paths. One set of handlers covers
 * mouse, touch and pen.
 *
 * Precedent for a hook at this level rather than inside a component: lib/use-type-to-search.ts.
 */

/** A drop target's geometry, frozen at drag start. */
type Zone = {
  rowId: string | null
  top: number
  bottom: number
  /** Chip centres, in DOM order, so the drop index is a count rather than a search. */
  centres: { x: number; y: number }[]
  /** Half a chip's height -- the tolerance for "on the same wrapped line". */
  band: number
}

/** Below this the gesture is still a tap. Higher on touch, where fingers wobble. */
const THRESHOLD = { mouse: 6, touch: 8, pen: 6 }

/** How close to the viewport edge starts an autoscroll, and how fast it can get. */
const SCROLL_EDGE = 90
const SCROLL_MIN = 4
const SCROLL_MAX = 18

function snapshot(zones: Map<string | null, HTMLElement>): Zone[] {
  // Page coordinates, not viewport: then scrolling -- including our own autoscroll --
  // never invalidates the snapshot, and one measurement lasts the whole gesture.
  const sx = window.scrollX
  const sy = window.scrollY

  return [...zones].map(([rowId, el]) => {
    const rect = el.getBoundingClientRect()
    const chips = [...el.querySelectorAll<HTMLElement>('[data-chip]')]
    const centres = chips.map((chip) => {
      const r = chip.getBoundingClientRect()
      return { x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy }
    })

    return {
      rowId,
      top: rect.top + sy,
      bottom: rect.bottom + sy,
      centres,
      band: (chips[0]?.getBoundingClientRect().height ?? 56) / 2,
    }
  })
}

/**
 * Which slot the pointer is over.
 *
 * Deliberately a linear scan over the snapshot rather than document.elementFromPoint: the
 * ghost sits under the cursor, and even with pointer-events:none each call is a full
 * hit-test walk. With a dozen zones this is both faster and easier to reason about.
 */
function hitTest(zones: Zone[], px: number, py: number): Loc | null {
  const inside = zones.find((zone) => py >= zone.top && py <= zone.bottom)

  // Past the top or bottom of the board, clamp to the nearest zone rather than dropping the
  // gesture -- a slightly overshot drag should still land somewhere sensible.
  const distance = (zone: Zone) => (py < zone.top ? zone.top - py : py - zone.bottom)
  const zone =
    inside ??
    zones.reduce<Zone | null>(
      (best, z) => (!best || distance(z) < distance(best) ? z : best),
      null,
    )
  if (!zone) return null

  // Rows wrap -- the tray holds 60-odd portraits over several lines -- so this is a y pass
  // then an x pass. Counting on x alone puts the marker on the wrong line entirely.
  let index = 0
  for (const centre of zone.centres) {
    const above = centre.y < py - zone.band
    const sameLine = Math.abs(centre.y - py) <= zone.band
    if (above || (sameLine && centre.x < px)) index++
    else break
  }

  return { rowId: zone.rowId, index }
}

export function usePointerDrag({
  onDrop,
  enabled,
}: {
  onDrop: (slug: string, to: Loc) => void
  enabled: boolean
}) {
  // What the board renders: which chip is airborne, and where it would land.
  const [dragging, setDragging] = useState<string | null>(null)
  const [hover, setHover] = useState<Loc | null>(null)

  const zonesEl = useRef(new Map<string | null, HTMLElement>())
  const ghostRef = useRef<HTMLDivElement | null>(null)

  const session = useRef<{
    pointerId: number
    slug: string
    target: HTMLElement
    startX: number
    startY: number
    grabX: number
    grabY: number
    threshold: number
    active: boolean
    zones: Zone[]
    /** Latest pointer position, in client coords. Read by the rAF loops. */
    clientX: number
    clientY: number
  } | null>(null)

  const hoverRef = useRef<Loc | null>(null)
  const frame = useRef<number | null>(null)
  const scrollFrame = useRef<number | null>(null)

  /** Rows hand us their container. A null element means the row unmounted. */
  const registerZone = useCallback((rowId: string | null, el: HTMLElement | null) => {
    if (el) zonesEl.current.set(rowId, el)
    else zonesEl.current.delete(rowId)
  }, [])

  const paint = useCallback(() => {
    const drag = session.current
    if (!drag?.active) return

    const px = drag.clientX + window.scrollX
    const py = drag.clientY + window.scrollY

    // The ghost never goes through React: one composited layer moved by writing transform,
    // so a 1000Hz mouse costs no renders at all.
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate3d(${drag.clientX - drag.grabX}px, ${
        drag.clientY - drag.grabY
      }px, 0)`
    }

    // And setHover only when the slot actually changes -- a handful of renders per drag
    // rather than one per pointermove.
    const next = hitTest(drag.zones, px, py)
    const prev = hoverRef.current
    if (next?.rowId !== prev?.rowId || next?.index !== prev?.index) {
      hoverRef.current = next
      setHover(next)
    }
  }, [])

  // A rAF loop has to schedule itself, and a useCallback can't reference its own binding.
  const autoscrollRef = useRef<() => void>(() => {})

  const autoscroll = useCallback(() => {
    const drag = session.current
    if (!drag?.active) {
      scrollFrame.current = null
      return
    }

    const y = drag.clientY
    const height = window.innerHeight
    let delta = 0
    if (y < SCROLL_EDGE) delta = -ramp((SCROLL_EDGE - y) / SCROLL_EDGE)
    else if (y > height - SCROLL_EDGE) delta = ramp((y - (height - SCROLL_EDGE)) / SCROLL_EDGE)

    if (delta !== 0) {
      window.scrollBy(0, delta)
      // The pointer hasn't moved but the page has, so the slot under it has changed.
      paint()
    }

    scrollFrame.current = requestAnimationFrame(() => autoscrollRef.current())
  }, [paint])

  useEffect(() => {
    autoscrollRef.current = autoscroll
  }, [autoscroll])

  const end = useCallback(
    (commit: boolean) => {
      const drag = session.current
      session.current = null

      if (frame.current !== null) cancelAnimationFrame(frame.current)
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current)
      frame.current = null
      scrollFrame.current = null

      if (drag) {
        try {
          drag.target.releasePointerCapture(drag.pointerId)
        } catch {
          // Capture is already gone if the element unmounted mid-drag. Nothing to undo.
        }
      }

      // Compute the target here, synchronously from the final position, rather than reading
      // the last value the rAF paint left in hoverRef. A fast flick can release before the
      // next frame runs, and browsers throttle rAF hard on an unfocused tab -- either way
      // the marker the user saw and the slot they get must not depend on a frame that may
      // never have fired.
      const to =
        drag?.active && drag.zones.length
          ? hitTest(drag.zones, drag.clientX + window.scrollX, drag.clientY + window.scrollY)
          : null

      hoverRef.current = null
      setHover(null)
      setDragging(null)

      // Drop and cancel share this path so cleanup can't diverge between them.
      if (commit && drag?.active && to) onDrop(drag.slug, to)
    },
    [onDrop],
  )

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>, slug: string) => {
      if (!enabled || session.current) return
      // Secondary buttons and second fingers are not drags.
      if (!event.isPrimary) return
      if (event.pointerType === 'mouse' && event.button !== 0) return

      const target = event.currentTarget
      const rect = target.getBoundingClientRect()

      // Capture on the chip itself: move/up/cancel keep firing here even once the pointer
      // has left it, so there are no window listeners and no lost-mouse-outside-the-viewport
      // bug when the drag ends over browser chrome. Non-fatal: it throws if the element is
      // already detaching, and losing capture is a degraded drag, not a broken handler.
      try {
        target.setPointerCapture(event.pointerId)
      } catch {
        // No capture -- the drag still works while the pointer stays over the board.
      }

      session.current = {
        pointerId: event.pointerId,
        slug,
        target,
        startX: event.clientX,
        startY: event.clientY,
        grabX: event.clientX - rect.left,
        grabY: event.clientY - rect.top,
        threshold: THRESHOLD[event.pointerType as keyof typeof THRESHOLD] ?? THRESHOLD.mouse,
        active: false,
        zones: [],
        clientX: event.clientX,
        clientY: event.clientY,
      }
    },
    [enabled],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = session.current
      if (!drag || event.pointerId !== drag.pointerId) return

      drag.clientX = event.clientX
      drag.clientY = event.clientY

      if (!drag.active) {
        const moved = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY)
        // Below the threshold this is still a tap, so a chip can also be a link.
        if (moved < drag.threshold) return

        drag.active = true
        // Measure once, now: the board is settled and won't reflow until the drop.
        drag.zones = snapshot(zonesEl.current)
        setDragging(drag.slug)
        scrollFrame.current = requestAnimationFrame(autoscroll)
      }

      // pointermove outruns the display on high-poll mice and on touch, so coalesce to one
      // hit-test and one transform write per frame.
      if (frame.current === null) {
        frame.current = requestAnimationFrame(() => {
          frame.current = null
          paint()
        })
      }
    },
    [autoscroll, paint],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (session.current?.pointerId !== event.pointerId) return
      end(true)
    },
    [end],
  )

  /** An incoming call, a system gesture, a missing touch-action. Put the chip back. */
  const onPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (session.current?.pointerId !== event.pointerId) return
      end(false)
    },
    [end],
  )

  // A resize reflows the board under a held pointer. Re-measure rather than drop the drag.
  useEffect(() => {
    const onResize = () => {
      const drag = session.current
      if (drag?.active) drag.zones = snapshot(zonesEl.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Unmounting mid-drag (switching lists, navigating away) must not leave a rAF running.
  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current)
    }
  }, [])

  // Memoized as one object because it's passed through React.memo'd rows down to every
  // chip -- a fresh literal each render would defeat the memo on all sixty of them.
  const handlers = useMemo(
    () => ({ onPointerDown, onPointerMove, onPointerUp, onPointerCancel }),
    [onPointerDown, onPointerMove, onPointerUp, onPointerCancel],
  )

  return { dragging, hover, ghostRef, registerZone, handlers }
}

export type DragHandlers = ReturnType<typeof usePointerDrag>['handlers']

/** Slow near the edge, quick past it, so a nudge doesn't fling the page. */
function ramp(t: number): number {
  return SCROLL_MIN + (SCROLL_MAX - SCROLL_MIN) * Math.min(1, Math.max(0, t))
}
