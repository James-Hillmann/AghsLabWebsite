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
 * The game shows world difficulty as a letter grade (E through SSS+, then EX) rather than the
 * raw RequireDifLevel number.
 *
 * This mirrors `getLevel()` in the game's own `panorama/layout/custom_game/utils/utils.vjs`,
 * which is the function that renders these grades in-game: tier is level / 3, and the
 * remainder picks the sub-grade in -/plain/+ order. At 24 and above it switches to EX, with
 * EX+N for N over 24. `RatingList` in `scripts/vscripts/constants.lua` spells the same scale
 * out literally ("E-", "E", "E+", ... "SSS+"), and the item data agrees: OverLevelA pairs with
 * RequireDifLevel 12 (A-) and OverLevelEX13 with 37 (EX+13).
 *
 * The tiers are single/double/triple S, not S/S+/S++ -- an earlier reading of this scale had
 * the latter, which both duplicated grades (17 and 19 each rendered "S+") and emitted
 * nonsense ones ("S+-", "S+++") for levels 18-23.
 */
const PRE_EX_TIERS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS']
const SUB_GRADES = ['-', '', '+']

function formatDifficulty(level: number): string {
  if (level >= 24) {
    const over = level - 24
    return over === 0 ? 'EX' : `EX+${over}`
  }

  const tier = PRE_EX_TIERS[Math.floor(level / 3)]
  const sub = SUB_GRADES[level % 3]
  return tier ? `${tier}${sub}` : String(level)
}

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
  const { drop, cost, sources, requiredDifficulty } = artifact

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
        </Fact>
      )}

      {requiredDifficulty !== undefined && (
        <Fact label="Difficulty required">
          <span className="tabular-nums" title={`World Level ${requiredDifficulty}`}>
            {formatDifficulty(requiredDifficulty)}
          </span>
        </Fact>
      )}

      {sources.length > 0 && (
        <Fact label="Also from">
          {/*
            One line each rather than a joined run: these are the game's own sentences, and
            several carry an interpunct of their own ("Astral Vault · Shadow Sect"), which a
            " · " separator would run straight into.
          */}
          <ul className="space-y-0.5 text-xs leading-relaxed">
            {sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </Fact>
      )}
    </dl>
  )
}
