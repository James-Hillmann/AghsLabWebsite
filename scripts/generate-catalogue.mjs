// Regenerates the three catalogue files -- artifacts, relics and abilities -- from the game
// files.
//
//   npm run catalogue:generate
//
// All outputs are machine-owned: types and data are emitted together so the dependency runs
// one way (lib/artifacts.ts -> lib/artifacts.generated.ts) with no import cycle. Opinions
// about artifacts live in the database, not here, so regenerating can never overwrite writing.

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildAbilities } from './lib/abilities.mjs'
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

const ABILITY_TYPES = `
/**
 * One line of an ability's value block.
 *
 * Unlike an artifact stat, an ability's number doesn't grow by a formula -- the game writes it
 * out at each of the ability's levels, so \`values\` is either one number (flat at every level)
 * or exactly \`maxLevel\` of them.
 */
export type AbilityValue = {
  key: string
  name: string
  values: number[]
  unit?: '%'
  /** Grows with the run's area-of-effect bonus. */
  scalesWithAoe?: boolean
  /** Counted as attack damage rather than spell damage. */
  isAttackDamage?: boolean
  /** Talents that change this line. \`id\` indexes into the ability's own \`talents\`. */
  talents?: { id: string; op: '+' | '='; amount: number }[]
}

/** The numbers the game prints in the tooltip's footer rather than its body. */
export type AbilityCast = {
  cooldown?: number[]
  manaCost?: number[]
  castRange?: number[]
  duration?: number[]
  channelTime?: number[]
  charges?: number[]
  chargeRestore?: number[]
}

export type AbilityTalent = {
  id: string
  text: string
}

/** A rolled upgrade that changes how an ability behaves. */
export type AbilityEpic = {
  gameId: string
  name: string
  description: string
  /** The one-line version the game shows where there's no room for the full text. */
  simple?: string
  /** Drop weight within this hero's epic pool. */
  weight: number
  iconName: string | null
  /** Other abilities this epic also modifies, as slugs. */
  alsoAffects: string[]
}

/**
 * A shard upgrade: a flat change to one of the ability's numbers.
 *
 * These carry no localization at all in the game files, so every word here is derived -- the
 * label from the parent ability's own tooltip string, and \`direction\` inferred from the key,
 * since the data stores a bare magnitude with no sign.
 */
export type AbilityShard = {
  gameId: string
  effects: { name: string; amount: number; direction: 'up' | 'down' }[]
  /** How many times it can be taken, when the game caps it. */
  countLimit?: number
  /** Epics this shard feeds, by game id. Only a couple of shards declare one. */
  powers: string[]
  weight: number
}

export type HeroAbility = {
  slug: string
  /** The game's own id, so a row can be traced back to the KV it came from. */
  gameId: string
  name: string
  /** Valve's internal hero name, which is what lib/heroes.ts keys on. */
  hero: string
  /**
   * Valve's texture name. Resolved to a CDN url at render time -- ability art is Valve's, not
   * the workshop's, so unlike artifacts and relics there's nothing to extract.
   */
  iconName: string | null
  /** 1, 3 or 4. An ability's cap is not an artifact's. */
  maxLevel: number
  isUltimate: boolean
  /** Hero level the ability unlocks at. */
  requiredLevel: number
  levelsBetweenUpgrades: number
  description: string
  /** The smaller grey clarification the tooltip prints underneath. */
  note?: string
  flavor?: string
  values: AbilityValue[]
  cast: AbilityCast
  talents: AbilityTalent[]
  epics: AbilityEpic[]
  shards: AbilityShard[]
}
`

function write(file, banner, types, name, type, rows) {
  const body = rows.map((row) => `  ${serialize(row, 1)}`).join(',\n')
  const source = `${banner}${types}\nexport const ${name}: ${type}[] = [\n${body},\n]\n`
  writeFileSync(path.join(ROOT, file), source)
  return source.split('\n').length
}

const { artifacts, relics, eraNames, problems } = buildCatalogue()
const { abilities, heroes, problems: abilityProblems } = buildAbilities()
problems.push(...abilityProblems)

// Archive order: era first, then rarest-first inside it, so the grid reads the way the
// collection actually feels rather than in the KV's arbitrary order.
artifacts.sort((a, b) => {
  const eras = ['origin', 'genesis', 'middle', 'post']
  return eras.indexOf(a.era) - eras.indexOf(b.era) || a.name.localeCompare(b.name)
})
relics.sort((a, b) => Number(a.isAttribute) - Number(b.isAttribute) || a.name.localeCompare(b.name))

// Skill-bar order within a hero: the order the abilities unlock, ultimates last. That's the
// order a player already has in their head, which beats anything alphabetical.
abilities.sort(
  (a, b) =>
    a.hero.localeCompare(b.hero) ||
    Number(a.isUltimate) - Number(b.isUltimate) ||
    a.requiredLevel - b.requiredLevel ||
    a.name.localeCompare(b.name),
)

const artifactLines = write(
  'lib/artifacts.generated.ts', BANNER, ARTIFACT_TYPES, 'ARTIFACTS', 'Artifact', artifacts,
)
const relicLines = write(
  'lib/relics.generated.ts', BANNER, RELIC_TYPES, 'RELICS', 'Relic', relics,
)
const abilityLines = write(
  'lib/abilities.generated.ts', BANNER, ABILITY_TYPES, 'ABILITIES', 'HeroAbility', abilities,
)

const byEra = {}
for (const artifact of artifacts) byEra[artifact.era] = (byEra[artifact.era] ?? 0) + 1

console.log(`lib/artifacts.generated.ts  ${artifacts.length} artifacts, ${artifactLines} lines`)
console.log(
  `  eras: ${Object.entries(byEra).map(([era, n]) => `${eraNames[era]} ${n}`).join(', ')}`,
)
console.log(`lib/relics.generated.ts     ${relics.length} relics, ${relicLines} lines`)

const epicCount = abilities.reduce((total, ability) => total + ability.epics.length, 0)
const shardCount = abilities.reduce((total, ability) => total + ability.shards.length, 0)
const talentCount = abilities.reduce((total, ability) => total + ability.talents.length, 0)

console.log(`lib/abilities.generated.ts  ${abilities.length} abilities, ${abilityLines} lines`)
console.log(
  `  ${heroes.length} heroes, ${epicCount} epics, ${shardCount} shards, ${talentCount} talents`,
)

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
