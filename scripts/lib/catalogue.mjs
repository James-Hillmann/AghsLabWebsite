// Turning the game's KeyValues + localization into the shapes the site renders.
//
// Kept separate from generate-catalogue.mjs so the validator can rebuild the same catalogue and
// diff it against what's committed, rather than re-implementing the parsing.

import { readVpk } from './vpk.mjs'
import { parseKv, parseLocalization } from './kv.mjs'
import { findGameVpk, SOURCE_FILES } from './game-files.mjs'

/** `rarity` 1-4 is the Archive's era, named by Hud_Artifact_Level1-4 in the localization. */
export const ERA_BY_RARITY = { 1: 'origin', 2: 'genesis', 3: 'middle', 4: 'post' }

export const UPGRADE_LEVEL_KEYS = [
  'additional_unlock_level_1',
  'additional_unlock_level_2',
  'additional_unlock_level_3',
  'additional_unlock_level_4',
]

/**
 * Labels for the standard Dota stats.
 *
 * The custom game publishes its own invented stats in a `dota_ability_variable_*` table, which
 * is read below and always wins. The plain Dota ones aren't in any discoverable table -- the
 * engine resolves `$damage` internally, and Dota's own localization has no canonical entry --
 * so these are spelled out. Anything missing from both falls back to a title-cased key.
 */
const STANDARD_LABELS = {
  damage: 'Attack Damage',
  attack: 'Attack Damage',
  armor: 'Armor',
  health: 'Health',
  mana: 'Mana',
  mana_regen: 'Mana Regeneration',
  hp_regen: 'Health Regeneration',
  str: 'Strength',
  agi: 'Agility',
  int: 'Intelligence',
  all: 'All Attributes',
  primary_attribute: 'Primary Attribute',
  evasion: 'Evasion',
  move_speed: 'Movement Speed',
  cast_range: 'Cast Range',
  cooldown_reduction: 'Cooldown Reduction',
  spell_lifesteal: 'Spell Lifesteal',
  status_resist: 'Status Resistance',
  slow_resistance: 'Slow Resistance',
  aoe_bonus: 'Area of Effect',
}

const stripTags = (value) => value.replace(/<[^>]*>/g, '').trim()

const FONT_TAG = /<font\s+color=['"]?(#[0-9a-fA-F]{3,8})['"]?>([\s\S]*?)<\/font>/gi

/**
 * The shared images tooltip text embeds with `<img src='file://{images}/...'>`, mapped to a
 * path stem under public/ and the label that becomes the picture's alt text.
 *
 * Five, across every artifact and relic string in the game -- so naming them beats resolving
 * paths generically. Keys must stay in step with the `textures` maps in lib/game-files.mjs,
 * which is what actually pulls these out of the archive.
 */
const TOOLTIP_ICONS = {
  'interface/aghanims_reward_staff.png': ['tooltip/aghs-shard', 'Scepter Shard'],
  'interface/aghanims_reward_staff_elite.png': ['tooltip/aghs-shard-elite', 'Elite Scepter Shard'],
  'interface/aghanims_reward_staff_legendary.png': [
    'tooltip/aghs-shard-legendary',
    'Legendary Scepter Shard',
  ],
  'interface/crate.png': ['tooltip/crate', 'Chest'],
  'bonus_level/token_level5.png': ['tooltip/neutral-token', 'Neutral Item'],
}

// Both `<img ... />` and `<img ... >` occur in the game's strings; `[^>]*` covers either.
const IMG_TAG = /<img\b[^>]*\bsrc=['"]file:\/\/\{images\}\/([^'"]+)['"][^>]*>/gi

// `<Panel class='ArtifactIcon eden_anvil'/>` -- a description citing another catalogue entry.
// `RelictIcon` is the game's spelling, not a typo here.
const PANEL_ENTRY_ICON = /<Panel\b[^>]*\bclass=['"](ArtifactIcon|RelictIcon)\s+([a-z0-9_]+)['"][^>]*>/gi

const ICON_MARKER = /\[\[icon:[^\]]+\]\][\s\S]*?\[\[\/\]\]/g

/**
 * Turns the two picture markups whose art the site actually has into `[[icon:path]]` markers.
 *
 * The game draws these inline and builds sentences around them -- Eden Anvil's "converted into
 * <shard>" reads as "converted into ." once the tag is stripped -- so dropping them loses
 * meaning, not just decoration. Everything else in a `<Panel class>` is a Panorama CSS sprite
 * with no src to follow; those still fall to `stripTags`, and are only ever decorative
 * reinforcement of text that reads correctly without them.
 */
function convertIcons(value, refs, problems, where) {
  const withImages = value.replace(IMG_TAG, (_, src) => {
    const icon = TOOLTIP_ICONS[src.toLowerCase()]
    if (!icon) {
      problems.push(`${where}: unknown tooltip image ${src}`)
      return ''
    }
    return `[[icon:${icon[0]}]]${icon[1]}[[/]]`
  })

  return withImages.replace(PANEL_ENTRY_ICON, (_, family, texture) => {
    const entry = refs.iconLabels?.get(`${family}:${texture}`)
    if (!entry) {
      problems.push(`${where}: dropped icon placeholder <Panel class='${family} ${texture}'>`)
      return ''
    }
    const [stem, label] = entry
    return `[[icon:${stem}]]${label}[[/]]`
  })
}

/**
 * Like `stripTags`, but keeps the markup the site actually wants: the inline pictures
 * `convertIcons` handles, and a `<font color>` run such as `HD_Poison`'s `<font
 * color='#98f698'><Panel .../>Poison</font>`. Each run becomes a `[[color:#hex]]text[[/]]`
 * marker for `RichText` to render as a colored span -- anything else inside it is dropped, same
 * as before. Markers use square brackets specifically so they survive the plain-tag strip that
 * follows, and don't collide with the `%key%`/`{key}` placeholder syntax `resolveTemplate`
 * still has to scan for.
 *
 * Order is load-bearing twice over. Icons convert first, before any `stripTags` -- including
 * the one inside the `<font>` handler, which would otherwise eat an icon sitting in a colored
 * run. And an icon found inside such a run is lifted out in front of it, because `RichText`
 * matches markers flat: nested, the icon's `[[/]]` would close the color early and print the
 * spare terminator on the page.
 */
function convertMarkup(value, refs = {}, problems = [], where = '') {
  const withIcons = convertIcons(value, refs, problems, where)

  const withColors = withIcons.replace(FONT_TAG, (_, color, inner) => {
    const icons = (inner.match(ICON_MARKER) ?? []).join('')
    const text = stripTags(inner.replace(ICON_MARKER, ''))
    return text ? `${icons}[[color:${color}]]${text}[[/]]` : icons
  })

  return stripTags(withColors)
}

const titleCase = (key) =>
  key
    .replace(/^bonus_/, '')
    .split('_')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')

/** 'item_artifact_the_hat_of_moiret' -> 'the-hat-of-moiret'. */
const toSlug = (gameId, prefix) => gameId.replace(prefix, '').replace(/_/g, '-')

const num = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Resolves a description template against an artifact's values.
 *
 *   %chance%%%       -> "[[value]]20[[/]]%"   -- the named value highlighted, %% collapsing
 *                                                 to a literal sign
 *   {main_ability}   -> the artifact's own effect title, as an underlined [[ref]]
 *   {HD_GoldIcon}    -> another localization token, resolved recursively
 *
 * Order matters: `%chance%%%` is `%chance%` followed by `%%`, so named values must be
 * substituted *before* `%%` collapses -- otherwise the value's own closing sign gets eaten
 * and the placeholder no longer matches.
 *
 * Unresolved placeholders are reported rather than silently shipped. A description reading
 * "%lv40_bonus%% for the current Stage" on the live site is the failure worth catching loudly.
 */
export function resolveTemplate(template, values, refs, problems, where, depth = 0) {
  if (!template) return undefined

  // Markup comes off first, except the pictures and <font color> runs convertMarkup keeps as
  // markers. Some tokens only ever appear inside markup -- {images} is a path variable in
  // <img src='file://{images}/...'/> -- so handling markup first means they never reach the
  // resolver to be reported as missing; convertIcons consumes that one a step earlier.
  let text = convertMarkup(template, refs, problems, where)

  // The trailing (%%)? swallows the literal percent sign some templates trail a value with,
  // so "30%" highlights as one unit instead of the number alone.
  text = text.replace(/%([a-z0-9_]+)%(%%)?/gi, (whole, key, pct) => {
    const value = values[key]
    if (value === undefined) {
      problems.push(`${where}: unresolved %${key}%`)
      return whole
    }
    return `[[value]]${value}${pct ? '%' : ''}[[/]]`
  })

  text = text.replace(/\{([a-z0-9_:]+)\}/gi, (whole, key) => {
    const direct = refs[key]
    if (direct !== undefined) return direct

    // Tokens like {HD_GoldIcon} point at other localization entries, which may themselves
    // carry markup or further tokens. Bounded so a self-referential pair can't spin.
    const looked = refs.localization?.get(key)
    if (looked !== undefined) {
      if (depth >= 4) return convertMarkup(looked, refs, problems, where)
      return resolveTemplate(looked, values, refs, problems, where, depth + 1) ?? ''
    }

    // What's left are panorama-side icon placeholders -- the game substitutes a picture, not
    // text, so there's nothing to put here. Dropping reads better than printing the raw token
    // ("Attacks fire {additional_10} into the sky"), but it's still recorded so the count is
    // visible rather than silently swallowed.
    problems.push(`${where}: dropped icon placeholder {${key}}`)
    return ''
  })

  return text.replace(/%%/g, '%').replace(/\s{2,}/g, ' ').trim()
}

/**
 * Relic substitution values.
 *
 * A relic's numbers live in its `_min`/`_max` roll arrays, not in `value` -- that field is a
 * placeholder and is almost always "0". Substituting it verbatim produces "Bottle maximum
 * charges increased by 0", which is worse than useless.
 *
 * So a rolled value becomes the span across every tier: "1-5". The per-tier breakdown is in
 * the table on the relic's page; the sentence just needs to convey the magnitude.
 *
 * Bounds are ordered numerically because for cooldowns and durations the game's _min is the
 * worst roll and therefore the larger number.
 */
function flattenRelicValues(abilityValues = {}) {
  const flat = {}

  for (const [key, value] of Object.entries(abilityValues)) {
    if (typeof value === 'string') {
      flat[key] = value
      continue
    }
    if (!value || typeof value !== 'object') continue

    if ('_min' in value) {
      const bounds = [
        ...String(value._min).trim().split(/\s+/).map(Number),
        ...String(value._max ?? '').trim().split(/\s+/).map(Number),
      ].filter((bound) => Number.isFinite(bound))

      if (bounds.length) {
        const low = Math.min(...bounds)
        const high = Math.max(...bounds)
        flat[key] = low === high ? String(low) : `${low}–${high}`
        continue
      }
    }

    if (typeof value.value === 'string') flat[key] = value.value
  }

  return flat
}

/** Flattens AbilityValues to a plain key -> scalar map for template substitution. */
function flattenValues(abilityValues = {}) {
  const flat = {}
  for (const [key, value] of Object.entries(abilityValues)) {
    if (typeof value === 'string') flat[key] = value
    else if (value && typeof value === 'object' && typeof value.value === 'string') {
      flat[key] = value.value
    }
  }
  return flat
}

/**
 * The scaling stat lines: AbilityValues entries carrying `_level_bonus`.
 *
 * Label and unit both come from the per-artifact localization string, e.g. "%+$spell_amp" --
 * a leading % marks a percentage, and $token names the label.
 */
function readStats(gameId, entry, english, variableLabels) {
  const stats = []

  for (const [key, value] of Object.entries(entry.AbilityValues ?? {})) {
    if (!value || typeof value !== 'object' || !('_level_bonus' in value)) continue

    const base = num(value.value)
    const perLevel = num(value._level_bonus)
    if (base === undefined || perLevel === undefined) continue

    const raw = english.get(`DOTA_Tooltip_ability_${gameId}_${key}`) ?? ''
    const token = raw.match(/\$([a-z0-9_]+)/i)?.[1]

    const label =
      (token ? variableLabels.get(token) : undefined) ??
      (token ? STANDARD_LABELS[token] : undefined) ??
      STANDARD_LABELS[key.replace(/^bonus_/, '')] ??
      titleCase(key)

    stats.push({
      name: label,
      base,
      perLevel,
      ...(raw.trimStart().startsWith('%') ? { unit: '%' } : {}),
    })
  }

  return stats
}

function readUpgrades(gameId, entry, english, values, refs, problems) {
  const upgrades = []

  UPGRADE_LEVEL_KEYS.forEach((levelKey, index) => {
    const level = num(entry[levelKey])
    if (level === undefined) return

    const slot = index + 1
    const name = english.get(`DOTA_Tooltip_ability_${gameId}_additional_${slot}_title`)
    const description = english.get(`DOTA_Tooltip_ability_${gameId}_additional_${slot}`)
    if (!name && !description) return

    const note = english.get(`DOTA_Tooltip_ability_${gameId}_additional_${slot}_Note0`)

    upgrades.push({
      level,
      name: stripTags(name ?? ''),
      description:
        resolveTemplate(description, values, refs, problems, `${gameId} additional_${slot}`) ?? '',
      ...(note
        ? { note: resolveTemplate(note, values, refs, problems, `${gameId} additional_${slot} note`) }
        : {}),
    })
  })

  return upgrades
}

/** FromList is a comma-separated set of internal source tags; these are the readable ones. */
function readSources(fromList) {
  if (!fromList) return []

  const seen = new Set()
  for (const tag of fromList.split(',').map((value) => value.trim())) {
    if (!tag) continue
    if (tag === 'Default') seen.add('Drops in runs')
    else if (tag === 'ShopDefault') seen.add('Shop')
    else if (tag.startsWith('Card_')) seen.add('Card pack')
    else if (tag.startsWith('OverLevel')) seen.add('Level reward')
    else if (tag.startsWith('BOSS_')) seen.add(`Boss: ${tag.slice(5).replace(/([a-z])([A-Z])/g, '$1 $2')}`)
    else if (tag === 'Login') seen.add('Login reward')
    else if (tag === 'Daily') seen.add('Daily reward')
    else if (tag === 'Contract') seen.add('Contract')
    else if (tag.startsWith('CDKBook')) seen.add('Code redemption')
    else if (tag.startsWith('Event')) seen.add('Event')
    else seen.add(tag)
  }
  return [...seen]
}

export function buildCatalogue() {
  const problems = []
  const vpk = readVpk(findGameVpk())

  try {
    const artifactKv = parseKv(vpk.readPath(SOURCE_FILES.artifacts).toString('utf8'))
    const relicKv = parseKv(vpk.readPath(SOURCE_FILES.relics).toString('utf8'))
    const english = parseLocalization(vpk.readPath(SOURCE_FILES.english).toString('utf8'))

    const variableLabels = new Map()
    for (const [token, label] of english) {
      if (token.startsWith('dota_ability_variable_')) {
        variableLabels.set(token.replace('dota_ability_variable_', ''), stripTags(label))
      }
    }

    // Every `additional_<N>_title` the localization defines, grouped by artifact.
    //
    // Slots 1-4 are the unlockable upgrades, but the game also names sub-mechanics in a higher
    // block -- Eden Anvil's slot 10 is "Ascend", the thing its lv20 and lv40 upgrades hand you.
    // Those have a title and nothing else: no description, no `additional_unlock_level_10`. They
    // exist only to be cited by {additional_N} in other upgrades, so they're indexed here rather
    // than derived from UPGRADE_LEVEL_KEYS, which would stop at slot 4 and drop the citation.
    const additionalTitles = new Map()
    for (const [token, title] of english) {
      const match = token.match(/^DOTA_Tooltip_ability_(.+)_additional_(\d+)_title$/)
      if (!match) continue
      const [, gameId, slot] = match
      if (!additionalTitles.has(gameId)) additionalTitles.set(gameId, new Map())
      additionalTitles.get(gameId).set(slot, title)
    }

    // `ArtifactIcon:eden_anvil` -> [path stem, display name], for the
    // `<Panel class='ArtifactIcon ...'>` references a description can make to another entry.
    //
    // Keyed by the entry's *texture* name, because that -- not its id or slug -- is what the
    // Panel class carries: `<Panel class='RelictIcon acidic_slime'/>` cites the relic whose
    // Icon is `acidic_slime`, which is `core_main_effect_acidic_slime`. Built ahead of both
    // loops because a description may cite an entry that hasn't been constructed yet, and
    // first-wins where a texture is shared, so the choice stays deterministic. Only entries
    // with art get in: presence doubles as proof a picture was extracted for that slug, and
    // RichText renders on the server with no way to recover from a missing file.
    const iconLabels = new Map()
    const addIconLabel = (family, texture, stem, name) => {
      const key = `${family}:${texture}`
      if (texture && !iconLabels.has(key)) iconLabels.set(key, [stem, stripTags(name)])
    }
    for (const [gameId, entry] of Object.entries(artifactKv)) {
      const name = english.get(`DOTA_Tooltip_ability_${gameId}`)
      if (!name || !ERA_BY_RARITY[entry.rarity] || gameId === 'item_artifact_unknow') continue
      const texture = entry.IconName ?? entry.AbilityTextureName
      addIconLabel('ArtifactIcon', texture, `artifacts/${toSlug(gameId, 'item_artifact_')}`, name)
    }
    for (const [gameId, entry] of Object.entries(relicKv)) {
      const name = english.get(gameId)
      if (!name) continue
      const slug = gameId.replace(/^core_/, '').replace(/_/g, '-')
      addIconLabel('RelictIcon', entry.Icon, `relics/${slug}`, name)
    }

    const eraNames = {}
    for (const [rarity, era] of Object.entries(ERA_BY_RARITY)) {
      eraNames[era] = english.get(`Hud_Artifact_Level${rarity}`) ?? era
    }

    // --- artifacts -------------------------------------------------------------------
    const artifacts = []

    for (const [gameId, entry] of Object.entries(artifactKv)) {
      const name = english.get(`DOTA_Tooltip_ability_${gameId}`)
      const era = ERA_BY_RARITY[entry.rarity]

      // item_artifact_unknow is the game's own placeholder row, not a real artifact.
      if (!name || !era || gameId === 'item_artifact_unknow') continue

      const slug = toSlug(gameId, 'item_artifact_')
      const values = flattenValues(entry.AbilityValues)
      const uniqueName = english.get(`DOTA_Tooltip_ability_${gameId}_main_ability_title`)

      const refs = { localization: english, iconLabels }
      if (uniqueName) {
        // {ability2} -- and {abilit2}, misspelled in the game's own strings -- both refer back
        // to the artifact's main effect by name. Wrapped as a [[ref]] so it renders underlined,
        // matching the game's own self-referential-link styling.
        refs.main_ability = `[[ref]]${stripTags(uniqueName)}[[/]]`
        refs.ability2 = refs.main_ability
        refs.abilit2 = refs.main_ability
      }
      // Some upgrades refer to each other by slot, e.g. Galaxy Compass's lv30 cites its lv10.
      for (const [slot, title] of additionalTitles.get(gameId) ?? []) {
        refs[`additional_${slot}`] = `[[ref]]${stripTags(title)}[[/]]`
      }

      const uniqueText = english.get(`DOTA_Tooltip_ability_${gameId}_main_ability`)
      const flavor = english.get(`DOTA_Tooltip_ability_${gameId}_Lore`)

      const weight = num(entry.weight)
      const dust = num(entry.DustCost)
      const platinum = num(entry.PlatinumCost)

      artifacts.push({
        slug,
        gameId,
        name: stripTags(name),
        era,
        icon: `/artifacts/${slug}.png`,
        iconName: entry.IconName ?? entry.AbilityTextureName ?? null,
        maxLevel: num(entry.MaxLevel) ?? 40,
        heroLevel: num(entry.RequireLevel) ?? 0,
        stats: readStats(gameId, entry, english, variableLabels),
        ...(uniqueName && uniqueText
          ? {
              unique: {
                name: stripTags(uniqueName),
                description:
                  resolveTemplate(uniqueText, values, refs, problems, `${gameId} main_ability`) ?? '',
              },
            }
          : {}),
        upgrades: readUpgrades(gameId, entry, english, values, refs, problems),
        ...(flavor ? { flavor: stripTags(flavor) } : {}),
        ...(entry.DropPool && weight !== undefined
          ? {
              drop: {
                pool: entry.DropPool,
                weight,
                chance: 0, // filled in below, once the pool totals are known
                ...(num(entry.DropWaveRangeFrom) !== undefined
                  ? { waveFrom: num(entry.DropWaveRangeFrom) }
                  : {}),
                ...(num(entry.DropWaveRangeEnd) !== undefined
                  ? { waveTo: num(entry.DropWaveRangeEnd) }
                  : {}),
              },
            }
          : {}),
        ...(dust !== undefined
          ? { cost: { dust, ...(platinum !== undefined ? { platinum } : {}) } }
          : {}),
        ...(num(entry.RequireDifLevel) !== undefined
          ? { requiredDifficulty: num(entry.RequireDifLevel) }
          : {}),
        sources: readSources(entry.FromList),
      })
    }

    // Drop chance is only meaningful against the rest of its pool, so it's a second pass.
    const poolTotals = {}
    for (const artifact of artifacts) {
      if (!artifact.drop) continue
      poolTotals[artifact.drop.pool] = (poolTotals[artifact.drop.pool] ?? 0) + artifact.drop.weight
    }
    for (const artifact of artifacts) {
      if (!artifact.drop) continue
      artifact.drop.chance =
        Math.round((artifact.drop.weight / poolTotals[artifact.drop.pool]) * 1e6) / 1e4
    }

    // --- relics ----------------------------------------------------------------------
    const relics = []

    for (const [gameId, entry] of Object.entries(relicKv)) {
      const name = english.get(gameId)
      if (!name) continue

      const values = flattenRelicValues(entry.AbilityValues)
      const refs = { localization: english, iconLabels }

      const description = english.get(`${gameId}_des`)
      const special = english.get(`${gameId}_special`)

      // Roll ranges are space-separated, one entry per rarity tier.
      const rolls = []
      for (const [key, value] of Object.entries(entry.AbilityValues ?? {})) {
        if (!value || typeof value !== 'object' || !('_min' in value)) continue
        const min = String(value._min).trim().split(/\s+/).map(Number)
        const max = String(value._max ?? '').trim().split(/\s+/).map(Number)
        if (min.some(Number.isNaN) || max.some(Number.isNaN) || min.length !== max.length) continue
        rolls.push({ key, min, max })
      }

      const slug = gameId.replace(/^core_/, '').replace(/_/g, '-')

      relics.push({
        slug,
        gameId,
        name: stripTags(name),
        description: resolveTemplate(description, values, refs, problems, `${gameId}_des`) ?? '',
        ...(special
          ? { special: resolveTemplate(special, values, refs, problems, `${gameId}_special`) }
          : {}),
        isAttribute: entry.bIsAttribute === '1',
        weight: num(entry.weight) ?? 0,
        // Attribute relics carry no Icon -- the game draws them from a generic attribute
        // sprite -- so both fields stay null and the UI falls back to a group diamond.
        iconName: entry.Icon ?? null,
        icon: entry.Icon ? `/relics/${slug}.png` : null,
        rolls,
      })
    }

    return { artifacts, relics, eraNames, problems }
  } finally {
    vpk.close()
  }
}
