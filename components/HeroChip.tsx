'use client'

import Image from 'next/image'
import { memo } from 'react'

import { portraitUrl } from '@/lib/heroes'
import { type DragHandlers } from '@/lib/use-pointer-drag'

/**
 * One hero portrait on the tier board. Deliberately smaller and squarer than HeroTile --
 * sixty of these share a screen, and a row of them has to read as a rank, not a gallery.
 *
 * memo'd because a hover change during a drag re-renders the two affected rows, and their
 * chips have no reason to follow.
 */
export const HeroChip = memo(function HeroChip({
  slug,
  name,
  editable,
  isDragging,
  isLifted,
  handlers,
  onKeyDown,
}: {
  slug: string
  name: string
  editable: boolean
  /** Airborne: left in place as a hole so the row's geometry doesn't shift mid-drag. */
  isDragging: boolean
  /** Picked up by keyboard, waiting for arrows. */
  isLifted: boolean
  handlers: DragHandlers
  onKeyDown: (event: React.KeyboardEvent, slug: string) => void
}) {
  return (
    <button
      type="button"
      // A plain div would be invisible to keyboards, and the arrow-key fallback is the only
      // way to use this without a pointer at all.
      disabled={!editable}
      title={name}
      aria-label={name}
      aria-pressed={isLifted}
      data-chip={slug}
      onPointerDown={editable ? (event) => handlers.onPointerDown(event, slug) : undefined}
      onPointerMove={editable ? handlers.onPointerMove : undefined}
      onPointerUp={editable ? handlers.onPointerUp : undefined}
      onPointerCancel={editable ? handlers.onPointerCancel : undefined}
      onKeyDown={editable ? (event) => onKeyDown(event, slug) : undefined}
      // touch-action on the chip and nowhere else: without it the browser claims the
      // gesture for scrolling and fires pointercancel mid-drag, and with it on the board
      // the page would stop scrolling entirely.
      style={
        {
          // The cut is smaller than a panel's because the chip is.
          '--cut': '5px',
          touchAction: editable ? 'none' : undefined,
          WebkitTouchCallout: 'none',
        } as React.CSSProperties
      }
      className={`shard shard-edge relative block w-11 shrink-0 overflow-hidden bg-[color-mix(in_srgb,var(--ice-deep)_60%,transparent)] transition-[opacity,scale] duration-150 sm:w-12 ${
        editable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${isDragging ? 'opacity-25' : ''} ${
        isLifted ? 'scale-110 shadow-[0_0_0_2px_var(--ice-glow)]' : ''
      }`}
    >
      <Image
        src={portraitUrl(slug)}
        alt=""
        width={235}
        height={272}
        unoptimized
        // draggable={false} or the browser's own HTML5 drag hijacks the mouse path and
        // fires pointercancel at us.
        draggable={false}
        className="pointer-events-none aspect-[235/272] h-full w-full object-cover brightness-[0.85] saturate-[0.9]"
      />
    </button>
  )
})
