import { RichText } from '@/components/RichText'
import type { ArtifactEffect as Effect } from '@/lib/artifacts'

/**
 * One named effect card. An artifact leads with its unique effect, and some also define a
 * second one; both are the same shape, so they render through here.
 *
 * The note is the game's own mechanical small print -- summon stats, stacking rules -- and is
 * set the same way an upgrade's note is: smaller and grey, subordinate to the effect text.
 */
export function ArtifactEffect({ effect, accent }: { effect: Effect; accent: string }) {
  return (
    <div
      className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_55%,transparent)] px-5 py-4"
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      <h3 className="font-[family-name:var(--font-display)] text-lg" style={{ color: accent }}>
        {effect.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-frost">
        <RichText text={effect.description} />
      </p>
      {effect.note && (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          <RichText text={effect.note} />
        </p>
      )}
    </div>
  )
}
