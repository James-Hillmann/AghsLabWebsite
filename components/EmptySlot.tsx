/**
 * Stands in for a section James hasn't filled yet. Says what's missing and what fills
 * it -- an empty section should read as waiting, not as broken.
 *
 * Uses the same shard + inset-hairline treatment as the rest of the site rather than a
 * dashed border, which clip-path would cut through at the corners.
 */
export function EmptySlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_40%,transparent)] px-5 py-6 text-sm leading-relaxed text-muted">
      {children}
    </div>
  )
}
