import { type Artifact } from '@/lib/artifacts'

/**
 * The acquisition side of an artifact: how rare it is, what it costs, where it comes from.
 *
 * Drop chance is the interesting number here and the reason this block exists -- it's the one
 * fact that isn't visible anywhere in the game's own tooltip. It's derived from the artifact's
 * drop weight against the rest of its pool, so a 0.10% reads as genuinely hard to find rather
 * than as an opaque weight of 30.
 */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label text-[0.55rem] text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-frost">{children}</dd>
    </div>
  )
}

/** Below this, an artifact is rare enough that the number is worth calling out. */
const RARE_THRESHOLD = 0.5

/**
 * Three significant figures, trailing zeros trimmed.
 *
 * A fixed number of decimals doesn't work across this range: two would round the rarest
 * artifact in the game from 0.0987% to 0.10%, and four would render a common one as
 * "1.3162%", which reads as false precision.
 */
function formatChance(chance: number): string {
  if (chance < 0.001) return '<0.001'
  return String(Number(chance.toPrecision(3)))
}

export function ArtifactFacts({ artifact }: { artifact: Artifact }) {
  const { drop, cost, sources, requiredDifficulty, maxLevel } = artifact

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
      {drop && (
        <Fact label="Drop chance">
          <span
            className={`tabular-nums ${drop.chance < RARE_THRESHOLD ? 'text-glow' : ''}`}
            title={`Weight ${drop.weight} within the ${drop.pool} pool`}
          >
            {formatChance(drop.chance)}%
          </span>
          <span className="ml-1.5 text-xs text-muted">{drop.pool}</span>
        </Fact>
      )}

      {drop && (drop.waveFrom !== undefined || drop.waveTo !== undefined) && (
        <Fact label="Drops on waves">
          <span className="tabular-nums">
            {drop.waveFrom ?? 0}
            {drop.waveTo !== undefined && drop.waveTo !== drop.waveFrom ? `–${drop.waveTo}` : ''}
          </span>
        </Fact>
      )}

      {cost && (
        <Fact label="Cost">
          <span className="tabular-nums">{cost.dust}</span>
          <span className="ml-1.5 text-xs text-muted">dust</span>
          {cost.platinum !== undefined && (
            <>
              <span className="ml-3 tabular-nums">{cost.platinum}</span>
              <span className="ml-1.5 text-xs text-muted">platinum</span>
            </>
          )}
        </Fact>
      )}

      <Fact label="Level cap">
        <span className="tabular-nums">{maxLevel}</span>
      </Fact>

      {requiredDifficulty !== undefined && (
        <Fact label="Difficulty required">
          <span className="tabular-nums">{requiredDifficulty}</span>
        </Fact>
      )}

      {sources.length > 0 && (
        <Fact label="Also from">
          <span className="text-xs leading-relaxed">{sources.join(' · ')}</span>
        </Fact>
      )}
    </dl>
  )
}
