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

import { buildAbilities } from './lib/abilities.mjs'
import { buildCatalogue } from './lib/catalogue.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ICONS = path.join(ROOT, 'public', 'artifacts')
const RELIC_ICONS = path.join(ROOT, 'public', 'relics')
const ITEM_ICONS = path.join(ROOT, 'public', 'items')

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
const { ABILITIES } = await loadGenerated('lib/abilities.generated.ts')
const { ITEMS, ITEM_CATEGORIES } = await loadGenerated('lib/items.generated.ts')

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
    artifact.unique?.note,
    artifact.second?.description,
    artifact.second?.note,
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

  // A null icon is expected -- attribute relics have no art in the game at all.
  if (relic.icon && relic.icon !== `/relics/${relic.slug}.png`) {
    fail(`relic ${where}: icon should be /relics/${relic.slug}.png`)
  }
  if (relic.icon && !relic.iconName) {
    fail(`relic ${where}: has an icon path but no source texture name`)
  }

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

// --- abilities ---------------------------------------------------------------------------

const abilitySlugs = new Set()
// `path` only has to be unique within its hero, since that's all the route disambiguates.
const abilityPaths = new Set()
const epicIds = new Set(ABILITIES.flatMap((ability) => ability.epics.map((epic) => epic.gameId)))

for (const ability of ABILITIES) {
  const where = `ability ${ability.slug ?? ability.name ?? '<unnamed>'}`

  if (!ability.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ability.slug)) {
    fail(`${where}: slug must be kebab-case`)
  }
  if (abilitySlugs.has(ability.slug)) fail(`${where}: duplicate slug`)
  abilitySlugs.add(ability.slug)

  // The route is /heroes/<hero>/<path>, so a clash inside one hero makes an ability
  // unreachable -- whichever the lookup finds first wins and the other has no url.
  if (!ability.path || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ability.path)) {
    fail(`${where}: path must be kebab-case`)
  }
  const route = `${ability.hero}/${ability.path}`
  if (abilityPaths.has(route)) fail(`${where}: duplicate path within ${ability.hero}`)
  abilityPaths.add(route)

  if (!ability.name) fail(`${where}: missing name`)
  if (!ability.hero) fail(`${where}: missing hero`)
  // Deliberately bounded rather than just positive: a 40 here would mean the artifact model
  // leaked into the ability generator.
  if (!(ability.maxLevel >= 1 && ability.maxLevel <= 4)) {
    fail(`${where}: maxLevel is ${ability.maxLevel}, expected 1-4`)
  }
  // It becomes a path segment in a CDN url, so it can't carry anything that needs escaping.
  if (ability.iconName && !/^[a-z0-9_]+$/.test(ability.iconName)) {
    fail(`${where}: iconName "${ability.iconName}" isn't url-safe`)
  }

  const talentIds = new Set(ability.talents.map((talent) => talent.id))

  for (const value of ability.values ?? []) {
    if (!value.name) fail(`${where}: value "${value.key}" has no name`)
    if (!value.values?.length) fail(`${where}: value "${value.key}" has no numbers`)
    if (value.values?.some((n) => typeof n !== 'number' || Number.isNaN(n))) {
      fail(`${where}: value "${value.key}" has a non-numeric entry`)
    }
    // One number is flat at every level. More than that is per-level, but the game sometimes
    // writes fewer than the cap -- Ember Spirit's Immolation is a 4-level ability with three
    // damage numbers -- and valueAtLevel holds the last one. What can't happen is more numbers
    // than levels, which would mean the array was read against the wrong cap.
    if (value.values && value.values.length > ability.maxLevel) {
      fail(
        `${where}: value "${value.key}" has ${value.values.length} numbers for ${ability.maxLevel} levels`,
      )
    }
    for (const talent of value.talents ?? []) {
      if (!talentIds.has(talent.id)) {
        fail(`${where}: value "${value.key}" cites talent ${talent.id}, which it doesn't carry`)
      }
    }
  }

  // The cross-file joins are what rots first on a game update, so they're checked by name.
  for (const epic of ability.epics ?? []) {
    if (!epic.name) fail(`${where}: an epic has no name`)
    for (const slug of epic.alsoAffects ?? []) {
      if (!ABILITIES.some((other) => other.slug === slug)) {
        fail(`${where}: epic ${epic.gameId} also-affects "${slug}", which is not an ability`)
      }
    }
  }
  for (const shard of ability.shards ?? []) {
    if (!shard.effects?.length) fail(`${where}: shard ${shard.gameId} changes nothing`)
    for (const epicId of shard.powers ?? []) {
      if (!epicIds.has(epicId)) {
        fail(`${where}: shard ${shard.gameId} feeds "${epicId}", which is not an epic`)
      }
    }
  }

  for (const text of [
    ability.description,
    ability.note,
    ...ability.talents.map((talent) => talent.text),
    ...ability.epics.flatMap((epic) => [epic.description, epic.simple]),
  ]) {
    if (typeof text === 'string' && /%[a-z0-9_]+%|\{[a-z0-9_]+\}/i.test(text)) {
      fail(`${where}: unresolved placeholder in "${text.slice(0, 60)}..."`)
    }
  }
}

// --- items -------------------------------------------------------------------------------

const itemSlugs = new Set()

for (const item of ITEMS) {
  const where = `item ${item.slug ?? item.name ?? '<unnamed>'}`

  if (!item.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug)) {
    fail(`${where}: slug must be kebab-case`)
  }
  if (itemSlugs.has(item.slug)) fail(`${where}: duplicate slug`)
  itemSlugs.add(item.slug)

  if (!item.name) fail(`${where}: missing name`)
  if (!ITEM_CATEGORIES.includes(item.category)) {
    fail(`${where}: category "${item.category}" is not one of ${ITEM_CATEGORIES}`)
  }

  // A local icon comes from extraction, so its path is fixed; a null one means the art is on
  // Valve's CDN instead, and either way the source texture name has to be there to resolve it.
  if (item.icon && item.icon !== `/items/${item.slug}.png`) {
    fail(`${where}: icon should be /items/${item.slug}.png`)
  }
  if (item.icon && !item.iconName) fail(`${where}: has a local icon but no source texture name`)

  for (const value of item.values ?? []) {
    if (!value.name) fail(`${where}: value "${value.key}" has no name`)
    if (typeof value.value !== 'number' && typeof value.value !== 'string') {
      fail(`${where}: value "${value.key}" is neither a number nor a string`)
    }
    if (typeof value.value === 'number' && Number.isNaN(value.value)) {
      fail(`${where}: value "${value.key}" is NaN`)
    }
  }

  for (const text of [item.description, item.note]) {
    if (typeof text === 'string' && /%[a-z0-9_]+%|\{[a-z0-9_]+\}/i.test(text)) {
      fail(`${where}: unresolved placeholder in "${text.slice(0, 60)}..."`)
    }
  }
}

// --- icons -------------------------------------------------------------------------------

// Icons are extracted separately, so missing art is expected on a fresh clone and only worth
// reporting. An icon nothing references is different -- that's a real mismatch. Items are
// checked only against the slugs that actually carry a local icon: the reforged Dota items draw
// from the CDN and have no file here, so their slugs would otherwise read as orphaned art.
const itemArtSlugs = new Set(ITEMS.filter((item) => item.icon).map((item) => item.slug))
for (const [dir, known, kind] of [
  [ICONS, slugs, 'artifact'],
  [RELIC_ICONS, relicSlugs, 'relic'],
  [ITEM_ICONS, itemArtSlugs, 'item'],
]) {
  if (!existsSync(dir)) continue
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.png')) continue
    const slug = file.replace(/\.png$/, '')
    if (!known.has(slug)) {
      fail(`${path.relative(ROOT, dir)}/${file}: no ${kind} has the slug "${slug}"`)
    }
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
  if (live.items.length !== ITEMS.length) {
    differences.push(`${live.items.length} items in the game vs ${ITEMS.length} committed`)
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

  const committedItems = new Map(ITEMS.map((item) => [item.slug, item]))
  for (const item of live.items) {
    const existing = committedItems.get(item.slug)
    if (!existing) {
      differences.push(`${item.slug} exists in the game but not in the committed items`)
      continue
    }
    for (const field of ['name', 'category', 'cost', 'quality']) {
      if (JSON.stringify(existing[field]) !== JSON.stringify(item[field])) {
        differences.push(`${item.slug}.${field}: committed ${existing[field]}, game says ${item[field]}`)
      }
    }
    if (JSON.stringify(existing.values) !== JSON.stringify(item.values)) {
      differences.push(`${item.slug}.values differ from the game files`)
    }
  }

  const liveAbilities = buildAbilities()
  if (liveAbilities.abilities.length !== ABILITIES.length) {
    differences.push(
      `${liveAbilities.abilities.length} abilities in the game vs ${ABILITIES.length} committed`,
    )
  }

  const committedAbilities = new Map(ABILITIES.map((ability) => [ability.slug, ability]))
  for (const ability of liveAbilities.abilities) {
    const existing = committedAbilities.get(ability.slug)
    if (!existing) {
      differences.push(`${ability.slug} exists in the game but not in the committed abilities`)
      continue
    }
    // `path` is in here because it's a url: a game update that renames an ability silently
    // breaks every link to it, and that should show up as drift rather than as a 404.
    for (const field of ['name', 'hero', 'path', 'maxLevel', 'isUltimate', 'requiredLevel']) {
      if (JSON.stringify(existing[field]) !== JSON.stringify(ability[field])) {
        differences.push(`${ability.slug}.${field}: committed ${existing[field]}, game says ${ability[field]}`)
      }
    }
    if (JSON.stringify(existing.values) !== JSON.stringify(ability.values)) {
      differences.push(`${ability.slug}.values differ from the game files`)
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
const relicsWantingArt = RELICS.filter((relic) => relic.icon)
const relicsWithArt = relicsWantingArt.filter((relic) =>
  existsSync(path.join(RELIC_ICONS, `${relic.slug}.png`)),
).length
const itemsWantingArt = ITEMS.filter((item) => item.icon)
const itemsWithArt = itemsWantingArt.filter((item) =>
  existsSync(path.join(ITEM_ICONS, `${item.slug}.png`)),
).length

const epicCount = ABILITIES.reduce((total, ability) => total + ability.epics.length, 0)
const shardCount = ABILITIES.reduce((total, ability) => total + ability.shards.length, 0)

console.log(
  `${ARTIFACTS.length} artifacts, ${RELICS.length} relics, ${ITEMS.length} items, ` +
    `${ABILITIES.length} abilities, no problems.`,
)
console.log(
  `       ${epicCount} epic and ${shardCount} shard upgrades across ` +
    `${new Set(ABILITIES.map((ability) => ability.hero)).size} heroes`,
)
// No icon line for abilities: their art is Valve's, served from the CDN, so there's nothing
// extracted into public/ to count.
console.log(
  `icons: ${withArt}/${ARTIFACTS.length} artifacts, ${relicsWithArt}/${relicsWantingArt.length} relics, ` +
    `${itemsWithArt}/${itemsWantingArt.length} items`,
)
console.log(
  `       ${RELICS.length - relicsWantingArt.length} relics have no art in the game (attributes)`,
)
console.log(
  `       ${ITEMS.length - itemsWantingArt.length} items draw from Valve's CDN (reforged Dota items)`,
)
console.log(`drift: ${drift}`)
