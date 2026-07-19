// Hero roster, sorted by name.
//
// NOTE: this is the FULL Dota lineup. Aghanim's Labyrinth ships a curated subset --
// delete the rows for heroes the Labyrinth doesn't offer and the grid updates itself.
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
  { slug: 'abaddon', name: 'Abaddon', attribute: 'universal' },
  { slug: 'alchemist', name: 'Alchemist', attribute: 'strength' },
  { slug: 'ancient_apparition', name: 'Ancient Apparition', attribute: 'intelligence' },
  { slug: 'antimage', name: 'Anti-Mage', attribute: 'agility' },
  { slug: 'arc_warden', name: 'Arc Warden', attribute: 'universal' },
  { slug: 'axe', name: 'Axe', attribute: 'strength' },
  { slug: 'bane', name: 'Bane', attribute: 'universal' },
  { slug: 'batrider', name: 'Batrider', attribute: 'universal' },
  { slug: 'beastmaster', name: 'Beastmaster', attribute: 'universal' },
  { slug: 'bloodseeker', name: 'Bloodseeker', attribute: 'agility' },
  { slug: 'bounty_hunter', name: 'Bounty Hunter', attribute: 'agility' },
  { slug: 'brewmaster', name: 'Brewmaster', attribute: 'universal' },
  { slug: 'bristleback', name: 'Bristleback', attribute: 'strength' },
  { slug: 'broodmother', name: 'Broodmother', attribute: 'agility' },
  { slug: 'centaur', name: 'Centaur Warrunner', attribute: 'strength' },
  { slug: 'chaos_knight', name: 'Chaos Knight', attribute: 'strength' },
  { slug: 'chen', name: 'Chen', attribute: 'intelligence' },
  { slug: 'clinkz', name: 'Clinkz', attribute: 'agility' },
  { slug: 'rattletrap', name: 'Clockwerk', attribute: 'strength' },
  { slug: 'crystal_maiden', name: 'Crystal Maiden', attribute: 'intelligence' },
  { slug: 'dark_seer', name: 'Dark Seer', attribute: 'intelligence' },
  { slug: 'dark_willow', name: 'Dark Willow', attribute: 'intelligence' },
  { slug: 'dawnbreaker', name: 'Dawnbreaker', attribute: 'strength' },
  { slug: 'dazzle', name: 'Dazzle', attribute: 'universal' },
  { slug: 'death_prophet', name: 'Death Prophet', attribute: 'universal' },
  { slug: 'disruptor', name: 'Disruptor', attribute: 'intelligence' },
  { slug: 'doom_bringer', name: 'Doom', attribute: 'strength' },
  { slug: 'dragon_knight', name: 'Dragon Knight', attribute: 'strength' },
  { slug: 'drow_ranger', name: 'Drow Ranger', attribute: 'agility' },
  { slug: 'earth_spirit', name: 'Earth Spirit', attribute: 'strength' },
  { slug: 'earthshaker', name: 'Earthshaker', attribute: 'strength' },
  { slug: 'elder_titan', name: 'Elder Titan', attribute: 'strength' },
  { slug: 'ember_spirit', name: 'Ember Spirit', attribute: 'agility' },
  { slug: 'enchantress', name: 'Enchantress', attribute: 'intelligence' },
  { slug: 'enigma', name: 'Enigma', attribute: 'universal' },
  { slug: 'faceless_void', name: 'Faceless Void', attribute: 'agility' },
  { slug: 'grimstroke', name: 'Grimstroke', attribute: 'intelligence' },
  { slug: 'gyrocopter', name: 'Gyrocopter', attribute: 'agility' },
  { slug: 'hoodwink', name: 'Hoodwink', attribute: 'agility' },
  { slug: 'huskar', name: 'Huskar', attribute: 'strength' },
  { slug: 'invoker', name: 'Invoker', attribute: 'intelligence' },
  { slug: 'wisp', name: 'Io', attribute: 'universal' },
  { slug: 'jakiro', name: 'Jakiro', attribute: 'intelligence' },
  { slug: 'juggernaut', name: 'Juggernaut', attribute: 'agility' },
  { slug: 'keeper_of_the_light', name: 'Keeper of the Light', attribute: 'intelligence' },
  { slug: 'kez', name: 'Kez', attribute: 'agility' },
  { slug: 'kunkka', name: 'Kunkka', attribute: 'strength' },
  { slug: 'largo', name: 'Largo', attribute: 'strength' },
  { slug: 'legion_commander', name: 'Legion Commander', attribute: 'strength' },
  { slug: 'leshrac', name: 'Leshrac', attribute: 'intelligence' },
  { slug: 'lich', name: 'Lich', attribute: 'intelligence' },
  { slug: 'life_stealer', name: 'Lifestealer', attribute: 'strength' },
  { slug: 'lina', name: 'Lina', attribute: 'intelligence' },
  { slug: 'lion', name: 'Lion', attribute: 'intelligence' },
  { slug: 'lone_druid', name: 'Lone Druid', attribute: 'agility' },
  { slug: 'luna', name: 'Luna', attribute: 'agility' },
  { slug: 'lycan', name: 'Lycan', attribute: 'strength' },
  { slug: 'magnataur', name: 'Magnus', attribute: 'universal' },
  { slug: 'marci', name: 'Marci', attribute: 'universal' },
  { slug: 'mars', name: 'Mars', attribute: 'strength' },
  { slug: 'medusa', name: 'Medusa', attribute: 'agility' },
  { slug: 'meepo', name: 'Meepo', attribute: 'agility' },
  { slug: 'mirana', name: 'Mirana', attribute: 'agility' },
  { slug: 'monkey_king', name: 'Monkey King', attribute: 'agility' },
  { slug: 'morphling', name: 'Morphling', attribute: 'agility' },
  { slug: 'muerta', name: 'Muerta', attribute: 'intelligence' },
  { slug: 'naga_siren', name: 'Naga Siren', attribute: 'agility' },
  { slug: 'furion', name: 'Nature\'s Prophet', attribute: 'universal' },
  { slug: 'necrolyte', name: 'Necrophos', attribute: 'intelligence' },
  { slug: 'night_stalker', name: 'Night Stalker', attribute: 'strength' },
  { slug: 'nyx_assassin', name: 'Nyx Assassin', attribute: 'universal' },
  { slug: 'ogre_magi', name: 'Ogre Magi', attribute: 'strength' },
  { slug: 'omniknight', name: 'Omniknight', attribute: 'strength' },
  { slug: 'oracle', name: 'Oracle', attribute: 'intelligence' },
  { slug: 'obsidian_destroyer', name: 'Outworld Devourer', attribute: 'intelligence' },
  { slug: 'pangolier', name: 'Pangolier', attribute: 'universal' },
  { slug: 'phantom_assassin', name: 'Phantom Assassin', attribute: 'agility' },
  { slug: 'phantom_lancer', name: 'Phantom Lancer', attribute: 'agility' },
  { slug: 'phoenix', name: 'Phoenix', attribute: 'strength' },
  { slug: 'primal_beast', name: 'Primal Beast', attribute: 'strength' },
  { slug: 'puck', name: 'Puck', attribute: 'intelligence' },
  { slug: 'pudge', name: 'Pudge', attribute: 'strength' },
  { slug: 'pugna', name: 'Pugna', attribute: 'intelligence' },
  { slug: 'queenofpain', name: 'Queen of Pain', attribute: 'intelligence' },
  { slug: 'razor', name: 'Razor', attribute: 'agility' },
  { slug: 'riki', name: 'Riki', attribute: 'agility' },
  { slug: 'ringmaster', name: 'Ring Master', attribute: 'intelligence' },
  { slug: 'rubick', name: 'Rubick', attribute: 'intelligence' },
  { slug: 'sand_king', name: 'Sand King', attribute: 'universal' },
  { slug: 'shadow_demon', name: 'Shadow Demon', attribute: 'intelligence' },
  { slug: 'nevermore', name: 'Shadow Fiend', attribute: 'agility' },
  { slug: 'shadow_shaman', name: 'Shadow Shaman', attribute: 'intelligence' },
  { slug: 'silencer', name: 'Silencer', attribute: 'intelligence' },
  { slug: 'skywrath_mage', name: 'Skywrath Mage', attribute: 'intelligence' },
  { slug: 'slardar', name: 'Slardar', attribute: 'strength' },
  { slug: 'slark', name: 'Slark', attribute: 'agility' },
  { slug: 'snapfire', name: 'Snapfire', attribute: 'universal' },
  { slug: 'sniper', name: 'Sniper', attribute: 'agility' },
  { slug: 'spectre', name: 'Spectre', attribute: 'agility' },
  { slug: 'spirit_breaker', name: 'Spirit Breaker', attribute: 'strength' },
  { slug: 'storm_spirit', name: 'Storm Spirit', attribute: 'intelligence' },
  { slug: 'sven', name: 'Sven', attribute: 'strength' },
  { slug: 'techies', name: 'Techies', attribute: 'universal' },
  { slug: 'templar_assassin', name: 'Templar Assassin', attribute: 'agility' },
  { slug: 'terrorblade', name: 'Terrorblade', attribute: 'agility' },
  { slug: 'tidehunter', name: 'Tidehunter', attribute: 'strength' },
  { slug: 'shredder', name: 'Timbersaw', attribute: 'strength' },
  { slug: 'tinker', name: 'Tinker', attribute: 'intelligence' },
  { slug: 'tiny', name: 'Tiny', attribute: 'strength' },
  { slug: 'treant', name: 'Treant Protector', attribute: 'strength' },
  { slug: 'troll_warlord', name: 'Troll Warlord', attribute: 'agility' },
  { slug: 'tusk', name: 'Tusk', attribute: 'strength' },
  { slug: 'abyssal_underlord', name: 'Underlord', attribute: 'strength' },
  { slug: 'undying', name: 'Undying', attribute: 'strength' },
  { slug: 'ursa', name: 'Ursa', attribute: 'agility' },
  { slug: 'vengefulspirit', name: 'Vengeful Spirit', attribute: 'agility' },
  { slug: 'venomancer', name: 'Venomancer', attribute: 'universal' },
  { slug: 'viper', name: 'Viper', attribute: 'agility' },
  { slug: 'visage', name: 'Visage', attribute: 'universal' },
  { slug: 'void_spirit', name: 'Void Spirit', attribute: 'universal' },
  { slug: 'warlock', name: 'Warlock', attribute: 'intelligence' },
  { slug: 'weaver', name: 'Weaver', attribute: 'agility' },
  { slug: 'windrunner', name: 'Windranger', attribute: 'universal' },
  { slug: 'winter_wyvern', name: 'Winter Wyvern', attribute: 'intelligence' },
  { slug: 'witch_doctor', name: 'Witch Doctor', attribute: 'intelligence' },
  { slug: 'skeleton_king', name: 'Wraith King', attribute: 'strength' },
  { slug: 'zuus', name: 'Zeus', attribute: 'intelligence' },
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
