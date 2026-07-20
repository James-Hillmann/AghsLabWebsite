'use client'

import { memo, useState } from 'react'

import { ROW_COLORS, ROW_LABEL_MAX, type TierRow } from '@/lib/tierlists'
import { type DragHandlers } from '@/lib/use-pointer-drag'

import { TierLane } from './TierLane'

/**
 * One tier: its label block, its heroes, and the controls that edit it.
 *
 * The label is an <input> at all times rather than a click-to-edit affordance. There are at
 * most a dozen rows and they belong to whoever is looking at them -- a second interaction
 * before you can rename S to "God tier" would be ceremony for nothing.
 */
export const TierRowStrip = memo(function TierRowStrip({
  row,
  heroNames,
  editable,
  dropIndex,
  dragging,
  lifted,
  handlers,
  onKeyDown,
  registerZone,
  onChange,
  onMove,
  onDelete,
  canMoveUp,
  canMoveDown,
}: {
  row: TierRow
  heroNames: Record<string, string>
  editable: boolean
  dropIndex: number | null
  dragging: string | null
  lifted: string | null
  handlers: DragHandlers
  onKeyDown: (event: React.KeyboardEvent, slug: string) => void
  registerZone: (rowId: string | null, el: HTMLElement | null) => void
  onChange: (rowId: string, patch: Partial<TierRow>) => void
  onMove: (rowId: string, direction: -1 | 1) => void
  onDelete: (rowId: string) => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const [showColors, setShowColors] = useState(false)

  return (
    <div
      className="shard shard-edge flex items-stretch bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)]"
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      {/* The colour is the row's identity at a glance, so it tints the label block rather
          than sitting in a swatch somewhere off to the side. */}
      <div
        className="relative flex w-16 shrink-0 flex-col items-center justify-center gap-1 p-1.5 sm:w-20"
        style={{ backgroundColor: `color-mix(in srgb, ${row.color} 22%, transparent)` }}
      >
        {editable ? (
          <input
            value={row.label}
            maxLength={ROW_LABEL_MAX}
            onChange={(event) => onChange(row.id, { label: event.target.value })}
            aria-label="Tier name"
            className="w-full bg-transparent text-center font-display text-lg leading-tight font-semibold outline-none sm:text-xl"
            style={{ color: row.color }}
          />
        ) : (
          <span
            className="text-center font-display text-lg leading-tight font-semibold sm:text-xl"
            style={{ color: row.color }}
          >
            {row.label}
          </span>
        )}

        {editable && (
          <button
            type="button"
            onClick={() => setShowColors((open) => !open)}
            aria-expanded={showColors}
            aria-label="Change tier colour"
            className="label text-[0.55rem] text-muted transition-colors hover:text-frost"
          >
            Colour
          </button>
        )}

        {/* Six swatches rather than <input type="color">: one tap on a phone, and the
            result can't fight the palette. */}
        {showColors && (
          <div className="absolute top-full left-0 z-20 flex gap-1 border border-[var(--edge)] bg-void p-1.5 shadow-lg">
            {ROW_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Use ${color}`}
                onClick={() => {
                  onChange(row.id, { color })
                  setShowColors(false)
                }}
                className={`size-4 rotate-45 transition-transform hover:scale-125 ${
                  row.color === color ? 'ring-1 ring-frost ring-offset-1 ring-offset-void' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      <TierLane
        rowId={row.id}
        heroes={row.heroes}
        heroNames={heroNames}
        editable={editable}
        dropIndex={dropIndex}
        dragging={dragging}
        lifted={lifted}
        handlers={handlers}
        onKeyDown={onKeyDown}
        registerZone={registerZone}
        className="flex-1"
        emptyHint={editable ? 'Drag heroes here' : undefined}
      />

      {editable && (
        <div className="flex shrink-0 flex-col justify-center gap-0.5 border-l border-[var(--edge)] px-1">
          <RowButton label="Move tier up" disabled={!canMoveUp} onClick={() => onMove(row.id, -1)}>
            ↑
          </RowButton>
          <RowButton
            label="Move tier down"
            disabled={!canMoveDown}
            onClick={() => onMove(row.id, 1)}
          >
            ↓
          </RowButton>
          <RowButton label="Delete tier" onClick={() => onDelete(row.id)}>
            ×
          </RowButton>
        </div>
      )}
    </div>
  )
})

function RowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="size-5 text-xs leading-none text-muted transition-colors hover:text-frost disabled:opacity-25 disabled:hover:text-muted"
    >
      {children}
    </button>
  )
}
