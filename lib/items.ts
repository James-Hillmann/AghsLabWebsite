// Items: the things you buy from the shop and pick up as drops inside a Labyrinth run. Data is
// generated from the game files -- see ARTIFACTS.md -- so everything here is behaviour.
//
// Labyrinth items are not Dota's items. The mode reforges Dota's own gear into "Advanced" and
// "Greater" versions with their own numbers, and adds a shelf of run-only consumables -- the
// potions, books and mushrooms -- that don't exist in the base game at all. Only those two
// kinds are here: the untouched Dota items a run also sells are just Dota, and their stats live
// in Valve's files rather than this workshop's, so there's nothing here to say about them.
//
// Unlike an artifact, an item doesn't scale by a formula, and unlike an ability it has no
// levels -- the game writes each number once -- so the page shows a flat stat block, not a
// slider or level tabs.

import { ITEMS, ITEM_CATEGORIES, type Item, type ItemCategory, type ItemValue } from './items.generated'

export { ITEMS, ITEM_CATEGORIES }
export type { Item, ItemCategory, ItemValue }

/** The three shelves the page groups by, as the mode itself frames them. */
export const ITEM_CATEGORY_NAME: Record<ItemCategory, string> = {
  advanced: 'Advanced Items',
  consumable: 'Consumables',
  encounter: 'Encounter Items',
}

/** A line under each shelf's heading, so the grouping explains itself. */
export const ITEM_CATEGORY_BLURB: Record<ItemCategory, string> = {
  advanced: 'Dota items reforged for the run, with their own numbers.',
  consumable: 'Potions, books and mushrooms — the shelf that only exists here.',
  encounter: 'One-off items an encounter hands you.',
}

/** Shelf accents, dimmed to sit inside the ice palette like the era and group colours. */
export const ITEM_CATEGORY_COLOR: Record<ItemCategory, string> = {
  advanced: '#e0a05a',
  consumable: '#7dd3fc',
  encounter: '#b98cd9',
}

/**
 * The game's own rarity words, coloured the way Dota tiers them. Only used as a small badge, so
 * an unknown word (a future patch's new tier) falls through to the muted default rather than
 * throwing the type off.
 */
export const QUALITY_COLOR: Record<string, string> = {
  consumable: '#b0c4d4',
  rare: '#4b8fd4',
  epic: '#a45cc4',
  artifact: '#d4a24e',
}

export function getItems(): Item[] {
  return ITEMS
}

export function getItem(slug: string): Item | undefined {
  return ITEMS.find((item) => item.slug === slug)
}

export function itemsByCategory(items: Item[] = ITEMS): Record<ItemCategory, Item[]> {
  return Object.fromEntries(
    ITEM_CATEGORIES.map((category) => [
      category,
      items.filter((item) => item.category === category),
    ]),
  ) as Record<ItemCategory, Item[]>
}

/**
 * A reforged item's texture reduced to the base Dota item it's a version of.
 *
 * The "Advanced"/"Greater" items are skinned with an arcana or a numbered variant of the base
 * texture -- `item_radiance_spectre_arcana_alt2`, `item_desolator2`, `item_advanced_aether_lens`
 * -- and Valve's CDN only serves the plain base (`radiance`, `desolator`, `aether_lens`). These
 * items *are* reforged versions of that base, so its art is the honest icon for them; stripping
 * to it turns fourteen blank diamonds into the item you'd recognise. The two with no Dota base
 * at all (the Attribute Gems) still fall through to a diamond, which is correct.
 */
function baseItemTexture(iconName: string): string {
  return iconName
    .replace(/^item_/, '')
    .replace(/_spectre_arcana_alt\d*$/, '')
    .replace(/_drow_arcana$/, '')
    .replace(/_override$/, '')
    .replace(/^advanced_/, '')
    .replace(/\d+$/, '')
    .replace(/_$/, '')
}

/**
 * Where an item's art comes from.
 *
 * The mode's own items ship a texture in the VPK, extracted to public/items like the artifact
 * and relic art. The reforged Dota items reuse Valve's stock item icons, which aren't in the
 * workshop VPK at all -- so those resolve from Valve's CDN by base texture name, the same trick
 * the ability icons use. Anything the CDN doesn't have returns its best guess and
 * CatalogueIcon's onError falls back to a diamond.
 */
export function itemIconUrl(item: Item): string | null {
  if (item.icon) return item.icon
  if (!item.iconName) return null
  const name = baseItemTexture(item.iconName)
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${name}.png`
}

/** "35%" or "+70" -- a stat line's number with its unit, ready to sit beside its label. */
export function formatItemValue(value: ItemValue): string {
  return `${value.value}${value.unit ?? ''}`
}

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * Same ranking as relics: a prefix beats a mid-word hit, and the description is searchable too,
 * because an item is remembered by what it does as much as by what it's called.
 */
export function scoreItem(item: Item, query: string): number | null {
  const q = normalise(query)
  if (!q) return 0

  const name = normalise(item.name)

  if (name === q) return 0
  if (name.startsWith(q)) return 1
  if (item.name.split(/\s+/).some((word) => normalise(word).startsWith(q))) return 2
  if (name.includes(q)) return 3
  if (item.description && normalise(item.description).includes(q)) return 4
  return null
}

export function searchItems(items: Item[], query: string): Item[] {
  return items
    .map((item, index) => ({ item, index, score: scoreItem(item, query) }))
    .filter((entry): entry is { item: Item; index: number; score: number } => entry.score !== null)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.item)
}
