'use client'

import { memo } from 'react'

import { type DragHandlers } from '@/lib/use-pointer-drag'

import { HeroChip } from './HeroChip'

/**
 * A wrapping strip of hero portraits that accepts drops. Shared by the tier rows and the
 * unassigned tray, which differ in their chrome and not at all in their behaviour.
 *
 * memo'd, and the reason the drag hook is careful to change `dropIndex` only when the slot
 * actually changes: a drag across the board then re-renders two lanes per crossing rather
 * than all thirteen on every pointermove.
 */
export const TierLane = memo(function TierLane({
  rowId,
  heroes,
  heroNames,
  editable,
  dropIndex,
  dragging,
  lifted,
  handlers,
  onKeyDown,
  registerZone,
  className = '',
  emptyHint,
}: {
  /** null is the tray. Doubles as the drag hook's key for this drop target. */
  rowId: string | null
  heroes: string[]
  heroNames: Record<string, string>
  editable: boolean
  /** Where the held chip would land, or null when nothing is over this lane. */
  dropIndex: number | null
  dragging: string | null
  lifted: string | null
  handlers: DragHandlers
  onKeyDown: (event: React.KeyboardEvent, slug: string) => void
  registerZone: (rowId: string | null, el: HTMLElement | null) => void
  className?: string
  emptyHint?: string
}) {
  return (
    <div
      ref={(el) => registerZone(rowId, el)}
      className={`flex min-h-16 flex-wrap content-start items-start gap-1.5 p-2 ${className}`}
    >
      {heroes.map((slug, index) => (
        <div key={slug} className="flex items-stretch">
          {dropIndex === index && <DropMarker />}
          <HeroChip
            slug={slug}
            name={heroNames[slug] ?? slug}
            editable={editable}
            isDragging={dragging === slug}
            isLifted={lifted === slug}
            handlers={handlers}
            onKeyDown={onKeyDown}
          />
        </div>
      ))}

      {/* Dropping past the last chip is the common case for an empty row, so the marker
          has to be able to sit after everything rather than only between things. */}
      {dropIndex !== null && dropIndex >= heroes.length && <DropMarker />}

      {heroes.length === 0 && dropIndex === null && emptyHint && (
        <span className="label self-center px-1 text-[0.6rem] text-muted/60">{emptyHint}</span>
      )}
    </div>
  )
})

function DropMarker() {
  return (
    <span
      aria-hidden
      className="mx-0.5 w-0.5 self-stretch rounded-full bg-glow shadow-[0_0_8px_var(--ice-glow)]"
    />
  )
}
