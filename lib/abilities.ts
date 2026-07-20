// Hero abilities: the kit each hero brings into a run, plus the epic and shard upgrades that
// change how each one behaves. Data is generated from the game files -- see ARTIFACTS.md -- so
// everything here is behaviour.
//
// Unlike an artifact, an ability doesn't scale by a formula: the game writes its numbers out at
// each of its 1-4 levels, which is why the page shows level tabs rather than a slider. And
// unlike a relic, an ability belongs to a hero, so that's what the browse page groups by.

import {
  ABILITIES,
  type AbilityCast,
  type AbilityEpic,
  type AbilityShard,
  type AbilityTalent,
  type AbilityValue,
  type HeroAbility,
} from './abilities.generated'
import { abilityIconUrl, ATTRIBUTE_COLOR, getHero, type Attribute } from './heroes'

export { ABILITIES }
export type { AbilityCast, AbilityEpic, AbilityShard, AbilityTalent, AbilityValue, HeroAbility }

/**
 * The heroes the game has abilities for but the roster doesn't list yet.
 *
 * Title-casing the game's directory name gets most of these right; these are the ones it
 * doesn't. Everything else resolves through lib/heroes.ts, which is the only source of hero
 * names the site has -- no game file carries them.
 */
const OFF_ROSTER_NAMES: Record<string, string> = {
  vengefulspirit: 'Vengeful Spirit',
  abyssal_underlord: 'Underlord',
}

/** Neutral accent for a hero with no roster entry, and therefore no attribute. */
const NEUTRAL_ACCENT = '#8aa4b8'

export function getAbilities(): HeroAbility[] {
  return ABILITIES
}

export function getAbility(slug: string): HeroAbility | undefined {
  return ABILITIES.find((ability) => ability.slug === slug)
}

/** True when the hero has a page to link to. Seven heroes have abilities but no roster entry. */
export function heroInRoster(hero: string): boolean {
  return getHero(hero) !== undefined
}

export function heroName(hero: string): string {
  return (
    getHero(hero)?.name ??
    OFF_ROSTER_NAMES[hero] ??
    hero
      .split('_')
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
      .join(' ')
  )
}

/**
 * Abilities grouped by hero, in the generated order -- which is already hero, then skill-bar
 * slot -- so the browse page's sections read the way the in-game picker does.
 */
export function abilitiesByHero(abilities: HeroAbility[] = ABILITIES): Record<string, HeroAbility[]> {
  const groups: Record<string, HeroAbility[]> = {}
  for (const ability of abilities) (groups[ability.hero] ??= []).push(ability)
  return groups
}

/** Every hero with abilities, in roster order where they have one. */
export function abilityHeroes(abilities: HeroAbility[] = ABILITIES): string[] {
  return [...new Set(abilities.map((ability) => ability.hero))]
}

export function heroAttribute(hero: string): Attribute | undefined {
  return getHero(hero)?.attribute
}

/**
 * The accent colour for an ability.
 *
 * Abilities carry no era, rarity or group of their own, so unlike artifacts and relics there's
 * no colour in the data. The hero's attribute is the honest stand-in: it matches the hero pages
 * and gives the rail four colours rather than sixty-nine.
 */
export function accentFor(ability: HeroAbility): string {
  const attribute = heroAttribute(ability.hero)
  return attribute ? ATTRIBUTE_COLOR[attribute] : NEUTRAL_ACCENT
}

/** Valve's own ability art, from the CDN. Nothing is extracted for abilities -- see ARTIFACTS.md. */
export function abilityIconFor(ability: HeroAbility): string | null {
  return ability.iconName ? abilityIconUrl(ability.iconName) : null
}

/**
 * The value at one level. Levels are 1-indexed, matching the game.
 *
 * A value with a single entry is flat at every level, so it answers for any level asked.
 */
export function valueAtLevel(value: AbilityValue, level: number): number {
  return value.values[Math.min(level, value.values.length) - 1] ?? value.values[0]
}

export function formatValue(value: AbilityValue, level: number): string {
  return `${valueAtLevel(value, level)}${value.unit ?? ''}`
}

/** "150 / 190 / 230 / 270", or null when the value doesn't change with level. */
export function formatValueSpan(value: AbilityValue): string | null {
  if (value.values.length < 2) return null
  return value.values.join(' / ')
}

/**
 * "15 / 13 / 11 / 9", or "95" for a flat one. Used for the cast strip.
 *
 * An all-zero row is dropped rather than printed. The game writes `AbilityCharges: 0` on
 * abilities that only gain charges from a talent, and "Charges 0" in the tooltip footer reads
 * as a fact about the ability rather than the absence of one.
 */
export function formatCast(values: number[] | undefined): string | null {
  if (!values?.length) return null
  if (values.every((value) => value === 0)) return null
  return values.length === 1 ? String(values[0]) : values.join(' / ')
}

/** "Cooldown −7", the way a shard effect reads. */
export function formatShardEffect(effect: AbilityShard['effects'][number]): string {
  return `${effect.name} ${effect.direction === 'down' ? '−' : '+'}${effect.amount}`
}

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * Same ranking as artifacts, relics and heroes: a prefix beats a mid-word hit.
 *
 * The hero's name is searchable above the description, so typing "ursa" surfaces the whole kit
 * rather than every ability that happens to mention bears.
 */
export function scoreAbility(ability: HeroAbility, query: string): number | null {
  const q = normalise(query)
  if (!q) return 0

  const name = normalise(ability.name)

  if (name === q) return 0
  if (name.startsWith(q)) return 1
  if (ability.name.split(/\s+/).some((word) => normalise(word).startsWith(q))) return 2
  if (normalise(heroName(ability.hero)).startsWith(q)) return 3
  if (name.includes(q)) return 4
  if (normalise(ability.description).includes(q)) return 5
  return null
}

export function searchAbilities(abilities: HeroAbility[], query: string): HeroAbility[] {
  return abilities
    .map((ability, index) => ({ ability, index, score: scoreAbility(ability, query) }))
    .filter(
      (entry): entry is { ability: HeroAbility; index: number; score: number } =>
        entry.score !== null,
    )
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.ability)
}
