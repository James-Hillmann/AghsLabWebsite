// The Aghanim's Labyrinth roster (63 heroes), grouped and ordered the way the in-game
// picker shows them -- which is why the order isn't alphabetical. The attributes all
// match current Dota, so heroesByAttribute() needs no special-casing.
//
// Abilities, relics and review are optional so hero pages can be filled in one at a
// time. When this moves to a database, replace the getters below and keep these shapes.

export const ATTRIBUTES = ['strength', 'agility', 'intelligence', 'universal'] as const

export type Attribute = (typeof ATTRIBUTES)[number]

export type Ability = {
  name: string
  image?: string
  description?: string
}

export type Relic = {
  name: string
  image?: string
  description?: string
}

export type Hero = {
  slug: string
  name: string
  attribute: Attribute
  abilities?: Ability[]
  relics?: Relic[]
  /** Long-form review, written by us. */
  review?: string
}

export const HEROES: Hero[] = [
  { slug: 'shredder', name: 'Timbersaw', attribute: 'strength' },
  { slug: 'omniknight', name: 'Omniknight', attribute: 'strength' },
  { slug: 'abyssal_underlord', name: 'Underlord', attribute: 'strength' },
  { slug: 'pudge', name: 'Pudge', attribute: 'strength' },
  { slug: 'axe', name: 'Axe', attribute: 'strength' },
  { slug: 'slardar', name: 'Slardar', attribute: 'strength' },
  { slug: 'tidehunter', name: 'Tidehunter', attribute: 'strength' },
  { slug: 'sven', name: 'Sven', attribute: 'strength' },
  { slug: 'chaos_knight', name: 'Chaos Knight', attribute: 'strength' },
  { slug: 'bristleback', name: 'Bristleback', attribute: 'strength' },
  { slug: 'mars', name: 'Mars', attribute: 'strength' },
  { slug: 'night_stalker', name: 'Night Stalker', attribute: 'strength' },
  { slug: 'undying', name: 'Undying', attribute: 'strength' },
  { slug: 'tiny', name: 'Tiny', attribute: 'strength' },
  { slug: 'centaur', name: 'Centaur Warrunner', attribute: 'strength' },
  { slug: 'rattletrap', name: 'Clockwerk', attribute: 'strength' },
  { slug: 'dragon_knight', name: 'Dragon Knight', attribute: 'strength' },
  { slug: 'phoenix', name: 'Phoenix', attribute: 'strength' },
  { slug: 'juggernaut', name: 'Juggernaut', attribute: 'agility' },
  { slug: 'viper', name: 'Viper', attribute: 'agility' },
  { slug: 'phantom_assassin', name: 'Phantom Assassin', attribute: 'agility' },
  { slug: 'ursa', name: 'Ursa', attribute: 'agility' },
  { slug: 'sniper', name: 'Sniper', attribute: 'agility' },
  { slug: 'gyrocopter', name: 'Gyrocopter', attribute: 'agility' },
  { slug: 'mirana', name: 'Mirana', attribute: 'agility' },
  { slug: 'weaver', name: 'Weaver', attribute: 'agility' },
  { slug: 'faceless_void', name: 'Faceless Void', attribute: 'agility' },
  { slug: 'slark', name: 'Slark', attribute: 'agility' },
  { slug: 'luna', name: 'Luna', attribute: 'agility' },
  { slug: 'nevermore', name: 'Shadow Fiend', attribute: 'agility' },
  { slug: 'ember_spirit', name: 'Ember Spirit', attribute: 'agility' },
  { slug: 'razor', name: 'Razor', attribute: 'agility' },
  { slug: 'riki', name: 'Riki', attribute: 'agility' },
  { slug: 'bloodseeker', name: 'Bloodseeker', attribute: 'agility' },
  { slug: 'skywrath_mage', name: 'Skywrath Mage', attribute: 'intelligence' },
  { slug: 'zuus', name: 'Zeus', attribute: 'intelligence' },
  { slug: 'winter_wyvern', name: 'Winter Wyvern', attribute: 'intelligence' },
  { slug: 'lich', name: 'Lich', attribute: 'intelligence' },
  { slug: 'leshrac', name: 'Leshrac', attribute: 'intelligence' },
  { slug: 'crystal_maiden', name: 'Crystal Maiden', attribute: 'intelligence' },
  { slug: 'queenofpain', name: 'Queen of Pain', attribute: 'intelligence' },
  { slug: 'necrolyte', name: 'Necrophos', attribute: 'intelligence' },
  { slug: 'lion', name: 'Lion', attribute: 'intelligence' },
  { slug: 'obsidian_destroyer', name: 'Outworld Devourer', attribute: 'intelligence' },
  { slug: 'silencer', name: 'Silencer', attribute: 'intelligence' },
  { slug: 'lina', name: 'Lina', attribute: 'intelligence' },
  { slug: 'muerta', name: 'Muerta', attribute: 'intelligence' },
  { slug: 'storm_spirit', name: 'Storm Spirit', attribute: 'intelligence' },
  { slug: 'tinker', name: 'Tinker', attribute: 'intelligence' },
  { slug: 'venomancer', name: 'Venomancer', attribute: 'universal' },
  { slug: 'beastmaster', name: 'Beastmaster', attribute: 'universal' },
  { slug: 'death_prophet', name: 'Death Prophet', attribute: 'universal' },
  { slug: 'sand_king', name: 'Sand King', attribute: 'universal' },
  { slug: 'snapfire', name: 'Snapfire', attribute: 'universal' },
  { slug: 'windrunner', name: 'Windranger', attribute: 'universal' },
  { slug: 'void_spirit', name: 'Void Spirit', attribute: 'universal' },
  { slug: 'magnataur', name: 'Magnus', attribute: 'universal' },
  { slug: 'dazzle', name: 'Dazzle', attribute: 'universal' },
  { slug: 'marci', name: 'Marci', attribute: 'universal' },
  { slug: 'pangolier', name: 'Pangolier', attribute: 'universal' },
  { slug: 'nyx_assassin', name: 'Nyx Assassin', attribute: 'universal' },
  { slug: 'batrider', name: 'Batrider', attribute: 'universal' },
  { slug: 'techies', name: 'Techies', attribute: 'universal' },
]

// Heroes added after Valve stopped publishing the legacy `_vert.jpg` portraits. They
// only exist on the newer path, which serves a wider 400x250 crop -- the tile centres it.
const NO_LEGACY_PORTRAIT = new Set(['dawnbreaker', 'primal_beast', 'muerta', 'marci'])

/** Vertical picker portrait, the same art Dota's own hero grid uses. */
export function portraitUrl(slug: string): string {
  const base = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images'
  return NO_LEGACY_PORTRAIT.has(slug)
    ? `${base}/dota_react/heroes/crops/${slug}.png`
    : `${base}/heroes/${slug}_vert.jpg`
}

export function getHeroes(): Hero[] {
  return HEROES
}

export function getHero(slug: string): Hero | undefined {
  return HEROES.find((hero) => hero.slug === slug)
}

export function heroesByAttribute(attribute: Attribute): Hero[] {
  return HEROES.filter((hero) => hero.attribute === attribute)
}
