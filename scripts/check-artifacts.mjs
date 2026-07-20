// Validates the committed catalogue, and fails loudly.
//
//   npm run artifacts:check
//
// Two jobs. First, internal consistency -- slugs, references, drop-chance arithmetic. Second,
// and the reason this survived the move away from hand transcription: it rebuilds the
// catalogue from the game files and diffs it against what's committed. That catches a
// generated file edited by hand, and a game update that hasn't been regenerated yet.
//
// The drift check is skipped when the game isn't installed, so CI and a fresh clone can still
// run the consistency half.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

import { buildCatalogue } from './lib/catalogue.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ICONS = path.join(ROOT, 'public', 'artifacts')

const problems = []
const fail = (message) => problems.push(message)

/**
 * Node 20 can't import a .ts file and this repo has no test runner to borrow a loader from,
 * so the generated modules are type-stripped with the TypeScript that's already a
 * devDependency and imported as a data URL. No temp files, no new packages, and the check
 * reads the real module rather than re-parsing it with a regex.
 */
async function loadGenerated(file) {
  const source = readFileSync(path.join(ROOT, file), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}

const { ARTIFACTS, ERAS } = await loadGenerated('lib/artifacts.generated.ts')
const { RELICS } = await loadGenerated('lib/relics.generated.ts')

// --- artifacts ---------------------------------------------------------------------------

const slugs = new Set()

for (const artifact of ARTIFACTS) {
  const where = artifact.slug ?? artifact.name ?? '<unnamed>'

  if (!artifact.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(artifact.slug)) {
    fail(`${where}: slug must be kebab-case`)
  }
  if (slugs.has(artifact.slug)) fail(`${where}: duplicate slug`)
  slugs.add(artifact.slug)

  if (!artifact.name) fail(`${where}: missing name`)
  if (!ERAS.includes(artifact.era)) fail(`${where}: era "${artifact.era}" is not one of ${ERAS}`)
  if (!(artifact.maxLevel > 0)) fail(`${where}: maxLevel must be positive`)

  for (const stat of artifact.stats ?? []) {
    if (!stat.name) fail(`${where}: a stat has no name`)
    if (typeof stat.base !== 'number' || Number.isNaN(stat.base)) {
      fail(`${where}: stat "${stat.name}" has a non-numeric base`)
    }
    if (typeof stat.perLevel !== 'number' || Number.isNaN(stat.perLevel)) {
      fail(`${where}: stat "${stat.name}" has a non-numeric perLevel`)
    }
  }

  for (const upgrade of artifact.upgrades ?? []) {
    if (!upgrade.name) fail(`${where}: the level ${upgrade.level} upgrade has no name`)
    if (!upgrade.description) fail(`${where}: [${upgrade.name}] has no description`)
    if (upgrade.level > artifact.maxLevel) {
      fail(`${where}: [${upgrade.name}] unlocks at ${upgrade.level}, past its cap of ${artifact.maxLevel}`)
    }
  }

  // An unresolved placeholder means the generator shipped raw template syntax to the site.
  for (const text of [
    artifact.unique?.description,
    ...(artifact.upgrades ?? []).flatMap((upgrade) => [upgrade.description, upgrade.note]),
  ]) {
    if (typeof text === 'string' && /%[a-z0-9_]+%|\{[a-z0-9_]+\}/i.test(text)) {
      fail(`${where}: unresolved placeholder in "${text.slice(0, 60)}..."`)
    }
  }

  if (artifact.icon !== `/artifacts/${artifact.slug}.png`) {
    fail(`${where}: icon should be /artifacts/${artifact.slug}.png`)
  }
}

// Drop chances are a share of their pool, so each pool has to add up.
const pools = {}
for (const artifact of ARTIFACTS) {
  if (!artifact.drop) continue
  pools[artifact.drop.pool] = (pools[artifact.drop.pool] ?? 0) + artifact.drop.chance
}
for (const [pool, total] of Object.entries(pools)) {
  // Rounding to four decimals per artifact leaves a little slack across a 57-item pool.
  if (Math.abs(total - 100) > 0.05) {
    fail(`drop pool "${pool}" chances sum to ${total.toFixed(3)}%, expected 100%`)
  }
}

// --- relics ------------------------------------------------------------------------------

const relicSlugs = new Set()

for (const relic of RELICS) {
  const where = relic.slug ?? relic.name ?? '<unnamed>'

  if (!relic.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(relic.slug)) {
    fail(`relic ${where}: slug must be kebab-case`)
  }
  if (relicSlugs.has(relic.slug)) fail(`relic ${where}: duplicate slug`)
  relicSlugs.add(relic.slug)

  for (const roll of relic.rolls ?? []) {
    if (roll.min.length !== roll.max.length) {
      fail(`relic ${where}: roll "${roll.key}" has ${roll.min.length} minimums and ${roll.max.length} maximums`)
    }
    // Deliberately no min <= max check. For cooldowns and durations the game's _min/_max are
    // worst/best *quality*, not numeric bounds -- a shorter cooldown is the better roll, so
    // those entries have _min numerically above _max. formatRoll orders them for display.
    for (const value of [...roll.min, ...roll.max]) {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        fail(`relic ${where}: roll "${roll.key}" has a non-numeric bound`)
      }
    }
  }
}

// --- icons -------------------------------------------------------------------------------

// Icons are extracted separately, so missing art is expected on a fresh clone and only worth
// reporting. An icon nothing references is different -- that's a real mismatch.
if (existsSync(ICONS)) {
  for (const file of readdirSync(ICONS)) {
    if (!file.endsWith('.png')) continue
    const slug = file.replace(/\.png$/, '')
    if (!slugs.has(slug)) fail(`public/artifacts/${file}: no artifact has the slug "${slug}"`)
  }
}

// --- drift against the game files ---------------------------------------------------------

let drift = 'skipped (game files not found)'

try {
  const live = buildCatalogue()
  const differences = []

  if (live.artifacts.length !== ARTIFACTS.length) {
    differences.push(`${live.artifacts.length} artifacts in the game vs ${ARTIFACTS.length} committed`)
  }
  if (live.relics.length !== RELICS.length) {
    differences.push(`${live.relics.length} relics in the game vs ${RELICS.length} committed`)
  }

  const committed = new Map(ARTIFACTS.map((artifact) => [artifact.slug, artifact]))
  for (const artifact of live.artifacts) {
    const existing = committed.get(artifact.slug)
    if (!existing) {
      differences.push(`${artifact.slug} exists in the game but not in the committed catalogue`)
      continue
    }
    // Comparing the whole entry would be noise; these are the fields that change meaning.
    for (const field of ['name', 'era', 'maxLevel', 'heroLevel']) {
      if (JSON.stringify(existing[field]) !== JSON.stringify(artifact[field])) {
        differences.push(`${artifact.slug}.${field}: committed ${existing[field]}, game says ${artifact[field]}`)
      }
    }
    if (JSON.stringify(existing.stats) !== JSON.stringify(artifact.stats)) {
      differences.push(`${artifact.slug}.stats differ from the game files`)
    }
  }

  if (differences.length) {
    fail(`the committed catalogue is out of date -- run npm run catalogue:generate`)
    for (const difference of differences.slice(0, 10)) fail(`  ${difference}`)
    drift = `${differences.length} differences`
  } else {
    drift = 'matches the game files'
  }
} catch (error) {
  if (!/Could not find the game files/.test(String(error.message))) throw error
}

// --- report ------------------------------------------------------------------------------

if (problems.length) {
  console.error(`${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

const withArt = ARTIFACTS.filter((a) => existsSync(path.join(ICONS, `${a.slug}.png`))).length

console.log(`${ARTIFACTS.length} artifacts, ${RELICS.length} relics, no problems.`)
console.log(`icons: ${withArt}/${ARTIFACTS.length} extracted`)
console.log(`drift: ${drift}`)
