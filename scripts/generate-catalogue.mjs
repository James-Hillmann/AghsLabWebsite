// Regenerates lib/artifacts.generated.ts and lib/relics.generated.ts from the game files.
//
//   npm run catalogue:generate
//
// Both outputs are machine-owned: types and data are emitted together so the dependency runs
// one way (lib/artifacts.ts -> lib/artifacts.generated.ts) with no import cycle. Opinions
// about artifacts live in the database, not here, so regenerating can never overwrite writing.

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildCatalogue } from './lib/catalogue.mjs'
import { GAME_NAME, WORKSHOP_ID } from './lib/game-files.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const BANNER = `// GENERATED FILE -- do not edit.
//
// Written by scripts/generate-catalogue.mjs, read straight out of the game files for
// ${GAME_NAME} (Steam workshop item ${WORKSHOP_ID}).
// Re-run \`npm run catalogue:generate\` after a game update; the diff is the changelog.
`

/** Deterministic, readable TS literals -- the output is committed, so diffs need to be legible. */
function serialize(value, indent = 0) {
  const pad = '  '.repeat(indent)
  const padInner = '  '.repeat(indent + 1)

  if (value === null) return 'null'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)

  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    const items = value.map((item) => `${padInner}${serialize(item, indent + 1)}`)
    return `[\n${items.join(',\n')},\n${pad}]`
  }

  const entries = Object.entries(value).filter(([, v]) => v !== undefined)
  if (!entries.length) return '{}'

  const body = entries.map(([key, v]) => {
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key)
    return `${padInner}${safeKey}: ${serialize(v, indent + 1)}`
  })
  return `{\n${body.join(',\n')},\n${pad}}`
}

const ARTIFACT_TYPES = `
export const ERAS = ['origin', 'genesis', 'middle', 'post'] as const

export type Era = (typeof ERAS)[number]

/**
 * One line of the stat block. Values scale with the artifact's level:
 *
 *     value = base + perLevel * level
 *
 * Hat of Moiret reads +36.9% Spell AMP at Lv. 23 because 30 + 0.3 * 23 = 36.9. The game
 * stores growth rather than a displayed number, which is what lets the page show any level.
 */
export type ArtifactStat = {
  name: string
  base: number
  perLevel: number
  unit?: '%'
}

export type ArtifactUpgrade = {
  level: number
  name: string
  description: string
  /** The smaller grey clarification some upgrades carry underneath. */
  note?: string
}

export type Artifact = {
  slug: string
  /** The game's own id, so a row can be traced back to the KV it came from. */
  gameId: string
  name: string
  era: Era
  icon: string
  /** The texture name inside the VPK, used by the icon extractor to match files up. */
  iconName: string | null
  /** Level cap. Mostly 40, but 50, 60 and 100 all occur -- it is not a constant. */
  maxLevel: number
  /** Required hero level. */
  heroLevel: number
  stats: ArtifactStat[]
  unique?: { name: string; description: string }
  upgrades: ArtifactUpgrade[]
  flavor?: string
  /**
   * Drop data. \`chance\` is this artifact's weight as a percentage of its pool's total,
   * so the numbers within one pool sum to 100.
   */
  drop?: {
    pool: string
    weight: number
    chance: number
    waveFrom?: number
    waveTo?: number
  }
  cost?: { dust: number; platinum?: number }
  requiredDifficulty?: number
  /** Readable acquisition routes, from the game's FromList tags. */
  sources: string[]
}
`

const RELIC_TYPES = `
/**
 * A relic's value doesn't scale with level like an artifact's -- it rolls within a range, and
 * the range widens by rarity tier. \`min[0]\`/\`max[0]\` is tier 1, and so on.
 */
export type RelicRoll = {
  key: string
  min: number[]
  max: number[]
}

export type Relic = {
  slug: string
  gameId: string
  name: string
  description: string
  /** An extra clause some relics gain at higher tiers. */
  special?: string
  /** Attribute relics are flat stat sticks; main-effect relics change how something works. */
  isAttribute: boolean
  /** Drop weight within the relic pool. */
  weight: number
  /**
   * Art, or null. Only main-effect relics have their own icon; the attribute ones are drawn
   * from a generic sprite in game, so there's nothing to extract for them.
   */
  icon: string | null
  /** The texture name inside the VPK, used by the icon extractor to match files up. */
  iconName: string | null
  rolls: RelicRoll[]
}
`

function write(file, banner, types, name, type, rows) {
  const body = rows.map((row) => `  ${serialize(row, 1)}`).join(',\n')
  const source = `${banner}${types}\nexport const ${name}: ${type}[] = [\n${body},\n]\n`
  writeFileSync(path.join(ROOT, file), source)
  return source.split('\n').length
}

const { artifacts, relics, eraNames, problems } = buildCatalogue()

// Archive order: era first, then rarest-first inside it, so the grid reads the way the
// collection actually feels rather than in the KV's arbitrary order.
artifacts.sort((a, b) => {
  const eras = ['origin', 'genesis', 'middle', 'post']
  return eras.indexOf(a.era) - eras.indexOf(b.era) || a.name.localeCompare(b.name)
})
relics.sort((a, b) => Number(a.isAttribute) - Number(b.isAttribute) || a.name.localeCompare(b.name))

const artifactLines = write(
  'lib/artifacts.generated.ts', BANNER, ARTIFACT_TYPES, 'ARTIFACTS', 'Artifact', artifacts,
)
const relicLines = write(
  'lib/relics.generated.ts', BANNER, RELIC_TYPES, 'RELICS', 'Relic', relics,
)

const byEra = {}
for (const artifact of artifacts) byEra[artifact.era] = (byEra[artifact.era] ?? 0) + 1

console.log(`lib/artifacts.generated.ts  ${artifacts.length} artifacts, ${artifactLines} lines`)
console.log(
  `  eras: ${Object.entries(byEra).map(([era, n]) => `${eraNames[era]} ${n}`).join(', ')}`,
)
console.log(`lib/relics.generated.ts     ${relics.length} relics, ${relicLines} lines`)

const unresolved = problems.filter((problem) => problem.includes('unresolved'))
const dropped = problems.filter((problem) => problem.includes('dropped'))

if (dropped.length) {
  console.log(`\n${dropped.length} icon placeholders dropped (the game draws a picture there).`)
}

if (unresolved.length) {
  console.error(`\n${unresolved.length} unresolved placeholders -- these ship as raw tokens:\n`)
  for (const problem of unresolved.slice(0, 20)) console.error(`  ${problem}`)
  process.exit(1)
}
