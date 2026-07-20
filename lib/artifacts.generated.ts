// GENERATED FILE -- do not edit.
//
// Written by scripts/generate-catalogue.mjs, read straight out of the game files for
// Aghanim's Labyrinth III: Crisis of Infinite Dimensions (Steam workshop item 2483181385).
// Re-run `npm run catalogue:generate` after a game update; the diff is the changelog.

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
   * Drop data. `chance` is this artifact's weight as a percentage of its pool's total,
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

export const ARTIFACTS: Artifact[] = [
  {
    slug: "ripper",
    gameId: "item_artifact_ripper",
    name: "Advanced Blades Of Attack",
    era: "origin",
    icon: "/artifacts/ripper.png",
    iconName: "ripper",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Attack Damage",
        base: 18,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Slice and Dice",
      description: "Melee attacks cleave nearby enemies, dealing 15% damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Bloodthirst",
        description: "+8% Attack Lifesteal",
      },
      {
        level: 20,
        name: "Weakness Exploit",
        description: "Damage dealt against common enemies increased by 20%",
      },
      {
        level: 40,
        name: "Malice",
        description: "After 4 Rounds, remove this Artifact and gain all its bonuses.",
      },
    ],
    flavor: "The infamous weapon once wielded by a notorious murderer. The resentment of its victims clings to the blades, and over time has granted them a faint, malevolent power.",
    cost: {
      dust: 15,
    },
    sources: [
      "Login reward",
    ],
  },
  {
    slug: "necklace-of-true",
    gameId: "item_artifact_necklace_of_true",
    name: "Amulet of Truth",
    era: "origin",
    icon: "/artifacts/necklace-of-true.png",
    iconName: "necklace_of_true",
    maxLevel: 40,
    heroLevel: 3,
    stats: [
      {
        name: "Vision Radius",
        base: 18,
        perLevel: 0.3,
        unit: "%",
      },
    ],
    unique: {
      name: "True Sight",
      description: "Grants True Sight within a 500 radius.",
    },
    upgrades: [
      {
        level: 10,
        name: "Dispel",
        description: "Enemies within True Sight range have their Armor reduced by 5 and Magic Armor reduced by 10.",
      },
      {
        level: 20,
        name: "Recovery",
        description: "Applies a basic dispel to enemies within the True Sight radius, each dispelled debuff bring a 7 second cooldown before it can be dispelled again on the same target",
      },
      {
        level: 30,
        name: "Extension",
        description: "True Sight radius increased by 10% of your vision range",
      },
      {
        level: 40,
        name: "Reversion",
        description: "Recovery can be applied to allies",
      },
    ],
    flavor: "A necklace that symbolizes truth before which all falsehoods are revealed and every lie is exposed.",
    drop: {
      pool: "General",
      weight: 1000,
      chance: 3.2906,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 800,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "star-mirror",
    gameId: "item_artifact_star_mirror",
    name: "Celestial Mirror · Enteleus",
    era: "origin",
    icon: "/artifacts/star-mirror.png",
    iconName: "star_mirror",
    maxLevel: 40,
    heroLevel: 3,
    stats: [
      {
        name: "All Attributes",
        base: 8,
        perLevel: 0.1,
      },
    ],
    unique: {
      name: "Celestial Mirror",
      description: "Stage terrain is always in an explored state.",
    },
    upgrades: [
      {
        level: 10,
        name: "Celestial Shield",
        description: "At the start of each Stage, gain [Stage Depth] × 200",
      },
      {
        level: 20,
        name: "Essence Reflection",
        description: "+20% chance for double drops from",
      },
      {
        level: 30,
        name: "Flux Mirror",
        description: "After 15 seconds without taking damage, recover 5% %Celestial Shield per 1 seconds. Caps at 50%.",
      },
      {
        level: 40,
        name: "Celestial Revelation",
        description: "Reveal the entire map at the start of each Stage for 60 seconds (Stackable)",
      },
    ],
    flavor: "Starlight resonates, compresses, and merges with fragments of sages’ wandering souls and the ever-shifting geometry of the corridor itself, eventually cooling and solidifying into a Celestial Mirror neither metal nor jade.",
    drop: {
      pool: "General",
      weight: 1000,
      chance: 3.2906,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 800,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "eden-anvil",
    gameId: "item_artifact_eden_anvil",
    name: "Eden Anvil",
    era: "origin",
    icon: "/artifacts/eden-anvil.png",
    iconName: "eden_anvil",
    maxLevel: 40,
    heroLevel: 3,
    stats: [
      {
        name: "Armor",
        base: 6,
        perLevel: 0.1,
      },
    ],
    unique: {
      name: "Forge",
      description: "For each 5 Selections, one of the selection is converted into .",
    },
    upgrades: [
      {
        level: 10,
        name: "Rare Forge",
        description: "+8% chance to trigger Forge",
      },
      {
        level: 20,
        name: "Mythic Forge",
        description: "Every 7 Stages, gain one that converts into .",
      },
      {
        level: 30,
        name: "Immortal Forge",
        description: "When Forge is triggered, permanently gain 2 Armor.",
      },
      {
        level: 40,
        name: "Legendary Forge",
        description: "Upon first retrieval, gain 1 .",
      },
    ],
    flavor: "A legendary anvil said to be capable of forging something powerful.",
    drop: {
      pool: "General",
      weight: 1000,
      chance: 3.2906,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 800,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "eye-of-the-pharaoh",
    gameId: "item_artifact_eye_of_the_pharaoh",
    name: "Eye of the Pharaoh",
    era: "origin",
    icon: "/artifacts/eye-of-the-pharaoh.png",
    iconName: "eye_of_the_pharaoh",
    maxLevel: 40,
    heroLevel: 3,
    stats: [
      {
        name: "Round End Gold",
        base: 8,
        perLevel: 0.1,
        unit: "%",
      },
      {
        name: "All Attributes",
        base: 4,
        perLevel: 0.1,
      },
    ],
    unique: {
      name: "Greed Up",
      description: "Each Stage, 18% of the gold from the reward is stored. If at least 200/500 gold is stored each time, this Artifact grants an additional 1/2 all Attributes.",
    },
    upgrades: [
      {
        level: 10,
        name: "Minimum Standard",
        description: "Store at least 200 gold each time. If insufficient, the remaining amount is deducted from gold held.",
      },
      {
        level: 20,
        name: "Fair Exchange",
        description: "For every 1000 gold stored, gain an Attribute Tome related to Primary Attributes.",
      },
      {
        level: 30,
        name: "Royal Interest",
        description: "Each Stage passed increases stored gold by 20%.",
      },
      {
        level: 40,
        name: "Withdraw Fund",
        description: "When purchasing items from visitors at the relay station—[Misfortune Teller], [Immortal Authority], [Astral Alchemist]—priority is given to using the gold accumulated by Greed Up.",
      },
    ],
    flavor: "They believed this eye could see everything for the king—lies, shadows, and the betrayal lurking beneath the throne. However, with the dynasty's fall, this ring was lost in the endless sea of sand.",
    drop: {
      pool: "General",
      weight: 300,
      chance: 0.9872,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 1000,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "fungal-kingdom",
    gameId: "item_artifact_fungal_kingdom",
    name: "Fungal Realm",
    era: "origin",
    icon: "/artifacts/fungal-kingdom.png",
    iconName: "fungal_kingdom",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Mana",
        base: 100,
        perLevel: 1,
      },
      {
        name: "Mana Regeneration",
        base: 3,
        perLevel: 0.05,
      },
    ],
    unique: {
      name: "Mana Shroom",
      description: "At the end of each stage, harvest points appear.Alt + Left Mouse the status icon to pick the mushrooms.Mushrooms grant permanent attributes. Their quality and quantity are based on the mana cost during the stage. Yield scales with mana spent.",
    },
    upgrades: [
      {
        level: 10,
        name: "Ah. Nutrients.",
        description: "This Artifact can be activated to spend 550 and increase mushroom yield. Can be used up to 2 times per stage.",
      },
      {
        level: 20,
        name: "Ah. Big bite.",
        description: "When Centaur Warrunner is present and equips the Legendary shard [Free Ride], increases shroom yield (and maximum yield).",
      },
      {
        level: 30,
        name: "Good for one is good. Good for all is best.",
        description: "Eating a shroom grants your allies 33% of its bonus.",
      },
      {
        level: 40,
        name: "Verdant Growth",
        description: "After producing 12 shrooms, if you are also carrying , it will count as having completed 2 stages of growth. If not, each subsequent stage will instead produce an additional 1 shrooms per stage.",
      },
    ],
    flavor: "Most poor souls who get infested turn into inhuman monsters. The fungus can take over the host's brain and control them. But a few lucky ones with special physiques have it different. After being infected, shrooms sprout from their arms — and those are premium nutrients.",
    drop: {
      pool: "General",
      weight: 300,
      chance: 0.9872,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 1000,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "galaxy-compass",
    gameId: "item_artifact_galaxy_compass",
    name: "Galaxy Compass",
    era: "origin",
    icon: "/artifacts/galaxy-compass.png",
    iconName: "galaxy_compass",
    maxLevel: 50,
    heroLevel: 1,
    stats: [
      {
        name: "All Attributes",
        base: 8,
        perLevel: 0.1,
      },
    ],
    unique: {
      name: "Outcome Focus",
      description: "Artifact XP gained increased by 20%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Metric",
        description: "After Act II, Outcome Focus effect increased by 20%.",
      },
      {
        level: 20,
        name: "Guidance",
        description: "Other Artifacts gain XP even when inactive while this Artifact is equipped.",
      },
      {
        level: 30,
        name: "Null Defiance",
        description: "Metric activates after Act 1",
      },
      {
        level: 40,
        name: "Galactic Beacon",
        description: "Every 60 seconds, an other equipped Artifact gain 30 flat Artifact XP.",
        note: "The Artifact XP gained is a fixed value and is not affected or modified by any effects.",
      },
    ],
    flavor: "An entire galaxy is contained within the curved glass of this compass, guiding you toward things you have yet to discover.",
    cost: {
      dust: 15,
    },
    sources: [
      "Login reward",
    ],
  },
  {
    slug: "graxxs-strap",
    gameId: "item_artifact_graxxs_strap",
    name: "Graxxs Strap",
    era: "origin",
    icon: "/artifacts/graxxs-strap.png",
    iconName: "graxxs_strap",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Strength",
        base: 8,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Arena Champion",
      description: "Gain 1 stacks of Arena Champion for every 1 stages cleared. Each stack grants +40 maximum health and +0.6% maximum health. Lose 50% of your stacks each time you die.",
    },
    upgrades: [
      {
        level: 10,
        name: "Arena Bout",
        description: "Each stack of Arena Champion additionally grants +1 to all attributes",
      },
      {
        level: 20,
        name: "Unyielding",
        description: "Up to 1 times, if you can be revived after dying, you will not lose the bonuses from Arena Champion",
      },
      {
        level: 30,
        name: "Undisputed Champion",
        description: "During a Stage, if you deal more than 50% of your team's total damage, gain an additional 2 stacks of Arena Champion",
      },
      {
        level: 40,
        name: "Declaration of Victory",
        description: "This Artifact can be activated. You take 75% additional damage and your final damage is reduced by 40%. For the next 2 combat stages, you must contribute more than 40% of your team's total damage without dying. Upon fulfilling these conditions, permanently extract the bonuses currently accumulated by Arena Champion",
        note: "After completing Declaration of Victory, dying will not cause the extracted bonuses to be lost. There is no penalty for failing the declaration",
      },
    ],
    flavor: "This is the great Belt of Omex, the pinnacle of gladiatorial skill and a wellspring of fighting spirit.",
    cost: {
      dust: 15,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "covetous-silver-serpent-ring",
    gameId: "item_artifact_covetous_silver_serpent_ring",
    name: "Greed Ring",
    era: "origin",
    icon: "/artifacts/covetous-silver-serpent-ring.png",
    iconName: "covetous_silver_serpent_ring",
    maxLevel: 40,
    heroLevel: 3,
    stats: [
      {
        name: "Round End Gold",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "[Curse]Shackles of Greed",
      description: "Upon entering a Stage, if your gold is less than (400 + Hero Level × 100), the base bonus does not take effect.",
    },
    upgrades: [
      {
        level: 10,
        name: "Obsession",
        description: "Gain 150 bonus Gold per Stage",
      },
      {
        level: 20,
        name: "Proliferation of Greed",
        description: "After [Curse]Shackles of Greed triggers, bonus and gold requirement are increased by 4%",
      },
      {
        level: 30,
        name: "Resistance to Greed",
        description: "Once every 3 Rounds, when [Curse]Shackles of Greed triggers, the base bonus will take effect still",
      },
      {
        level: 40,
        name: "Satisfaction of Greed",
        description: "After holding 10000 gold, remove this Artifact and gain all of its effects.",
      },
    ],
    flavor: "Snakes are known as creatures of great avarice, devouring prey even larger than themselves by swallowing them whole.If one's shackles are cause for discontent, perhaps it is time for some old-fashioned greed.",
    cost: {
      dust: 15,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "potion-of-planar-in-fusions",
    gameId: "item_artifact_potion_of_planar_in_fusions",
    name: "Harmony Elixir",
    era: "origin",
    icon: "/artifacts/potion-of-planar-in-fusions.png",
    iconName: "potion_of_planar_in_fusions",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Bottle Regen AMP",
        base: 15,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Bottle Enchantment",
      description: "+1 Bottle max chargesThe Bottle's target gains 15% Spell AMP, stacking independently for 40 seconds.",
    },
    upgrades: [
      {
        level: 10,
        name: "Phase",
        description: "Bottle Enchantment grants Phase movement and +40% MS",
      },
      {
        level: 20,
        name: "Harmony",
        description: "The Bottle applies a dispel",
      },
      {
        level: 30,
        name: "Perfect",
        description: "The target can completely negate one instance of damage that exceeds 20% of Max HP.",
      },
      {
        level: 40,
        name: "Flawless",
        description: "When the Bottle has at least 4 charges its restoration effect becomes 135%.",
      },
    ],
    flavor: "This silvery liquid is meticulously extracted from contact with starlight within black holes, and sounds in the vacuum. When left to rest, it forms a swirling spiral galaxy. Remarkably, the liquid replenishes itself even after some of it is consumed.",
    drop: {
      pool: "General",
      weight: 1000,
      chance: 3.2906,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 800,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "magnuss-frying-pan",
    gameId: "item_artifact_magnuss_frying_pan",
    name: "Magnus's Frying Pan",
    era: "origin",
    icon: "/artifacts/magnuss-frying-pan.png",
    iconName: "magnuss_frying_pan",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Round End Gold",
        base: 10,
        perLevel: 0.1,
        unit: "%",
      },
      {
        name: "Mana Regeneration",
        base: 2,
        perLevel: 0.04,
      },
    ],
    unique: {
      name: "Chef's Toss",
      description: "Mushrooms gathered from — Fungal Kingdom — may be stir-fried at the end of each round if left in your inventory, becoming far more potent restorative meals. Adding [Faerie Fire] and [Mango] as seasoning ingredients can create even greater delicacies.",
    },
    upgrades: [
      {
        level: 10,
        name: "My horns become sharper",
        description: "Upon completing a stage, special cooking ingredients may be uncovered. They may be sold immediately or preserved for the next meal.",
      },
      {
        level: 20,
        name: "Sharing is Caring",
        description: "Meals you prepare may also be shared with allied players.",
      },
      {
        level: 30,
        name: "Exclusive Cookware",
        description: "Cooking efficiency is increased while playing Magnus.",
      },
      {
        level: 40,
        name: "Buy Ingredients",
        description: "Artifacts can be unlocked, allowing special ingredients to be purchased from the Interdimensional Bazaar.",
      },
    ],
    flavor: "Centaur Rhinos were once hunted for their prized horns, driven to the brink of extinction by greedy hands. Then came that infamous year. Ever since, no one has dared hunt them again—for fear of ending up as the main course in the Rhino’s stew pot.",
    drop: {
      pool: "General",
      weight: 300,
      chance: 0.9872,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 1000,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "mystery",
    gameId: "item_artifact_mystery",
    name: "Mystery",
    era: "origin",
    icon: "/artifacts/mystery.png",
    iconName: "mystery",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Luck",
        base: 12,
        perLevel: 0.2,
      },
      {
        name: "Mana Regeneration",
        base: 3,
        perLevel: 0.05,
      },
    ],
    unique: {
      name: "Omen",
      description: "Activates after 1 Round. Grants 1 Options.",
    },
    upgrades: [
      {
        level: 10,
        name: "Fated Preference",
        description: "+50% XP Gained from this Artifact",
      },
      {
        level: 20,
        name: "Twist of Fate",
        description: "Grants 1 refreshes every 4 Stages",
      },
      {
        level: 30,
        name: "Bias",
        description: "+50% chance for to drop rare items",
      },
      {
        level: 40,
        name: "Greater Omen",
        description: "Omen+1 options",
      },
    ],
    flavor: "A candle formed from mysterious matter. As it burns, it reveals a miniature starry sky, within which truth resides.",
    cost: {
      dust: 15,
    },
    sources: [
      "Code redemption",
    ],
  },
  {
    slug: "pale-incarnation",
    gameId: "item_artifact_pale_incarnation",
    name: "Pale Incarnation",
    era: "origin",
    icon: "/artifacts/pale-incarnation.png",
    iconName: "pale_incarnation",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Strength",
        base: 8,
        perLevel: 0.1,
      },
    ],
    unique: {
      name: "Lesser Decay",
      description: "Your next attack releases Decay, dealing [50 + 75% of your Strength] damage to enemies within the range. Each trigger grants 2 temporary Strength. Stacks independently and lasts 30 seconds.",
    },
    upgrades: [],
    flavor: "The right hand of the Immortal, hosting the power of death...Guide death once more. Whether it's the death of the living, or the true death of the already dead.",
    drop: {
      pool: "General",
      weight: 1000,
      chance: 3.2906,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "precious-dragon-egg",
    gameId: "item_artifact_precious_dragon_egg",
    name: "Precious Fire Dragon Egg",
    era: "origin",
    icon: "/artifacts/precious-dragon-egg.png",
    iconName: "precious_dragon_egg",
    maxLevel: 100,
    heroLevel: 1,
    stats: [
      {
        name: "All Attributes",
        base: 4,
        perLevel: 0.08,
      },
    ],
    unique: {
      name: "Hatching Dragon Egg",
      description: "After 2 Stages, hatch a Young Red Dragon to aid you in combat.",
    },
    upgrades: [
      {
        level: 10,
        name: "Grow",
        description: "Every 1 Stages, additionally inherits 9% Attributes",
      },
      {
        level: 20,
        name: "Juvenile Red Dragon",
        description: "After 3 Grow, attacks deal 40% splash damage within a 300 radius",
      },
      {
        level: 30,
        name: "Sky Tyrant",
        description: "After 5 Grow, increases Attack Range by 400",
      },
      {
        level: 40,
        name: "Adult Red Dragon",
        description: "After 7 Grow, every 6 attacks unleash a dash strike, dealing magic damage equal to 300% of Attack Damage",
      },
    ],
    flavor: "A dragon egg still in its infancy, radiating a faint warmth. With proper care, it may one day hatch into a true dragon.",
    drop: {
      pool: "General",
      weight: 30,
      chance: 0.0987,
      waveFrom: 0,
    },
    cost: {
      dust: 15,
      platinum: 2000,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "seed-of-rebirth",
    gameId: "item_artifact_seed_of_rebirth",
    name: "Seed of Rebirth",
    era: "origin",
    icon: "/artifacts/seed-of-rebirth.png",
    iconName: "seed_of_rebirth",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Health Regeneration",
        base: 8,
        perLevel: 0.1,
      },
    ],
    unique: {
      name: "Rebirth",
      description: "Revives you 60 seconds after death. All effects are lost when Rebirth charges are depleted.",
    },
    upgrades: [
      {
        level: 10,
        name: "Germinate",
        description: "After 3 consecutive Stages without Rebirth, Health Regeneration granted by this Artifact is increased by 100%.",
      },
      {
        level: 20,
        name: "Sapling",
        description: "After 2 consecutive Stages without Rebirth, grants 1 permanent growth.",
      },
      {
        level: 30,
        name: "Blossom",
        description: "After 2 consecutive Stages without Rebirth, each new Stage entered thereafter grants 1 permanent bonus level(s).",
      },
      {
        level: 40,
        name: "Fruit",
        description: "After 2 consecutive stages without Rebirth, this Artifact is removed. Grants 1 current and max HP Runes.Permanently grants all effects except Rebirth.",
      },
    ],
    flavor: "Some of us die. Others are born anew.",
    cost: {
      dust: 15,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "seekers-pendant",
    gameId: "item_artifact_seekers_pendant",
    name: "Seeker's Pendant",
    era: "origin",
    icon: "/artifacts/seekers-pendant.png",
    iconName: "seekers_pendant",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "Mana",
        base: 150,
        perLevel: 2,
      },
      {
        name: "Mana Regeneration",
        base: 2,
        perLevel: 0.08,
      },
    ],
    unique: {
      name: "Reserve Mana",
      description: "At the start of each Stage, regain 100% [Stage Depth] + 300 points of Reserve Mana, which automatically restores when Mana falls below 70%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Transposition",
        description: "After casting a spell, heal for 25% of the Mana consumed.",
      },
      {
        level: 20,
        name: "Efficient Casting",
        description: "-10% Mana Cost",
      },
      {
        level: 40,
        name: "Fusion",
        description: "While carrying this Artifact, after the Hero levels up 7 times, this Artifact is removed and all its bonuses are permanently granted.",
      },
    ],
    flavor: "For young mages who have not yet mastered vast mana, this pendant is the most reliable companion. It quietly absorbs the ambient arcane aura, transforming it into a subtle yet persistent echo that slowly replenishes the wearer's mana. Many renowned archmages once relied on such a humble artifact.",
    drop: {
      pool: "General",
      weight: 1000,
      chance: 3.2906,
      waveFrom: 0,
      waveTo: 6,
    },
    cost: {
      dust: 15,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "the-chain-of-restraint",
    gameId: "item_artifact_the_chain_of_restraint",
    name: "Shackle Collar",
    era: "origin",
    icon: "/artifacts/the-chain-of-restraint.png",
    iconName: "the_chain_of_restraint",
    maxLevel: 40,
    heroLevel: 1,
    stats: [
      {
        name: "All Damage",
        base: 10,
        perLevel: -0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "The Worthless",
      description: "Reduces damage dealt to gain 20% bonus XP.",
    },
    upgrades: [
      {
        level: 10,
        name: "The Defiant",
        description: "Upon Rebirth, gain +15% this Stage",
      },
      {
        level: 20,
        name: "The Ascended",
        description: "+0.8 Growth",
      },
      {
        level: 30,
        name: "The Breaker",
        description: "Upon first retrieval, its level is increased to 2",
      },
      {
        level: 40,
        name: "The Unbound",
        description: "Can be actively used by spending 2000 gold to remove this Artifact and permanently grant +20% XP gain and +0.8 Growth.",
        note: "Reacquiring this Artifact does not stack the bonuses.",
      },
    ],
    flavor: "The false gods understood the limits of mortal flesh and sought to steal divine power through shortcuts. They forged these chains, forcing their followers to wear them.",
    drop: {
      pool: "General",
      weight: 2000,
      chance: 6.5811,
      waveFrom: 0,
      waveTo: 4,
    },
    cost: {
      dust: 15,
      platinum: 800,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "flying-thief",
    gameId: "item_artifact_flying_thief",
    name: "Winged Pilferer",
    era: "origin",
    icon: "/artifacts/flying-thief.png",
    iconName: "flying_thief",
    maxLevel: 40,
    heroLevel: 3,
    stats: [
      {
        name: "Vision Radius",
        base: 350,
        perLevel: 3,
      },
      {
        name: "Round End Gold",
        base: 10,
        perLevel: 0.1,
        unit: "%",
      },
    ],
    unique: {
      name: "Absolute Initiative",
      description: "The first 2 instances of damage an enemy deals to you are evaded. Each evasion steals 8 gold, up to 300 per Stage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Early Warning",
        description: "Damage within 20% vision range: 10% chance to evade and trigger Absolute Initiative steal.",
      },
      {
        level: 20,
        name: "Seize",
        description: "Your first instance of damage against an enemy triggers steal effect from Absolute Initiative",
      },
      {
        level: 30,
        name: "Grand Larceny",
        description: "Each instance of damage also has a 7% chance to trigger steal effect from Absolute Initiative.",
      },
      {
        level: 40,
        name: "Momentum",
        description: "Seize's maximum steal attempts increases by 750 and the value per Stage increases to 1000. Additionally, damage evasion is no longer limited to this Artifact — any evasion can trigger the effect.",
      },
    ],
    flavor: "A parrot assembled from precision machinery, previously the pet of a bearded pirate. Although a construct, magic has granted it limited intelligence, allowing it to recognize your commands.",
    cost: {
      dust: 15,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "aether-ring",
    gameId: "item_artifact_aether_ring",
    name: "Aether Ring",
    era: "genesis",
    icon: "/artifacts/aether-ring.png",
    iconName: "aether_ring",
    maxLevel: 40,
    heroLevel: 6,
    stats: [
      {
        name: "Damage Reduction",
        base: 8,
        perLevel: 0.1,
        unit: "%",
      },
    ],
    unique: {
      name: "Inner Space",
      description: "Creates 1 dedicated slots for Origin Artifact. The non-economic base attributes provided by Artifacts in these slots are increased by 100%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Initial Attunement",
        description: "+50% bonus Attributes from Inner Space",
      },
      {
        level: 20,
        name: "Initial Expansion",
        description: "Adds 1 dedicated Origin Artifact slot to Inner Space. Artifacts in this slot gain 50% bonus attributes",
      },
      {
        level: 30,
        name: "Further Attunement",
        description: "Origin Artifact in the slot provided by Initial Expansion gains the same attribute amplification as those in the first slot",
      },
      {
        level: 40,
        name: "Inner Attunement",
        description: "Every 2 stages cleared, Artifacts in Inner Space additionally count as having progressed through 1 stages. This effect is reduced for certain Artifacts",
        note: "Affected by this reduction: Eye of the Pharaoh — Royal Interest",
      },
    ],
    flavor: "Is not creating that which does not exist the ultimate pursuit of every mage?",
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Contract",
    ],
  },
  {
    slug: "bracers-of-dimensional-traveler",
    gameId: "item_artifact_bracers_of_dimensional_traveler",
    name: "Astral Traveler",
    era: "genesis",
    icon: "/artifacts/bracers-of-dimensional-traveler.png",
    iconName: "bracers_of_dimensional_traveler",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "All Attributes",
        base: 12,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Dimensional Anchor",
      description: "1 times per Stage, negate lethal damage and become invulnerable for 4 seconds. During this period, dimensions are locked, and non-boss enemies cannot act.",
    },
    upgrades: [
      {
        level: 10,
        name: "Slow Field",
        description: "After Dimensional Anchor ends, reduce enemy Movement Speed by 60% for 3 seconds.",
      },
      {
        level: 20,
        name: "Folded Field",
        description: "After Dimensional Anchor ends, gain equal to 30% of damage dealt during the duration.",
        note: "Shield value is capped at 150% of your max HP/MP whichever is higher",
      },
      {
        level: 30,
        name: "Dimensional Lock",
        description: "Increases Dimensional Anchor duration by 2 seconds.",
      },
      {
        level: 40,
        name: "Dimensional Convergence",
        description: "Dimensional Anchor can trigger again. 180 seconds cooldown.",
      },
    ],
    flavor: "The bracers worn by Aghanim as he traversed different dimensions. The core is a gem forged by layering aether through dimensional power. Even in lightless worlds, it breaks the limits of natural law to emit a faint glow. The field emitted by this artifact protects its contents from erosion by the forces within multidimensional passages.",
    cost: {
      dust: 30,
    },
    sources: [
      "Contract",
    ],
  },
  {
    slug: "kilineiram",
    gameId: "item_artifact_kilineiram",
    name: "Black Blade · Kilineiram",
    era: "genesis",
    icon: "/artifacts/kilineiram.png",
    iconName: "kilineiram",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Attack Damage",
        base: 15,
        perLevel: 0.2,
      },
      {
        name: "Strength",
        base: 10,
        perLevel: 0.1,
      },
      {
        name: "Intelligence",
        base: 10,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Dark Energy",
      description: "Your next melee attack releases a horizontal slash which explodes after 2 seconds, dealing damage equal to 25% max MP to enemies within the slashed area.",
    },
    upgrades: [
      {
        level: 10,
        name: "Gravity",
        description: "Dark Energy applies a 60% MS slow",
      },
      {
        level: 20,
        name: "Mass Reversion",
        description: "Dark Energy restores MP equal to 30% of the highest single-target damage dealt",
      },
      {
        level: 30,
        name: "Phase Change",
        description: "After Mass Reversion restores Mana, gain 50% of the restored amount as bonus Max Mana. This effect stacks independently and lasts for 20 seconds.",
        note: "Max bonus is 10000.",
      },
      {
        level: 40,
        name: "Mass Ray",
        description: "Ranged attacks can also trigger Dark Energy, converting it into an instant ray, but Gravity no longer take effect.",
      },
    ],
    flavor: "Born from a dying star whose remnants became a meteor, it shattered after colliding with an unfortunate elder dragon in the atmosphere. Fragments of the meteor were later reforged into several weapons, capable of channeling the power of their progenitor star, now collapsed into a black hole, to impose overwhelming gravity.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 10,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "chrono-casket",
    gameId: "item_artifact_chrono_casket",
    name: "Chrono Casket",
    era: "genesis",
    icon: "/artifacts/chrono-casket.png",
    iconName: "chrono_casket",
    maxLevel: 40,
    heroLevel: 6,
    stats: [
      {
        name: "Health",
        base: 240,
        perLevel: 5,
      },
      {
        name: "Mana",
        base: 240,
        perLevel: 5,
      },
    ],
    unique: {
      name: "HP Storage",
      description: "Can store up to 2 HP Runes.",
    },
    upgrades: [
      {
        level: 10,
        name: "Imperfect Rewind",
        description: "Active: Convert stored HP into 400 gold.",
      },
      {
        level: 20,
        name: "Reversal",
        description: "If you lose at least 2 HP Runes due to death in a single Stage, restore 1 upon completing the Stage.",
      },
      {
        level: 30,
        name: "Perfect Rewind",
        description: "+250 Imperfect Rewind Gold converted",
      },
      {
        level: 40,
        name: "Echoes Rebuilt",
        description: "Generates 1 HP Runes every 3 Stages",
        note: "HP Runes can still drop on the ground when at maximum capacity.",
      },
    ],
    flavor: "An exquisite gem-crafted ornament engraved with a clock on its surface symbolizing its connection to temporal powers.",
    drop: {
      pool: "General",
      weight: 300,
      chance: 0.9872,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "cold-moon",
    gameId: "item_artifact_cold_moon",
    name: "Cold Moon",
    era: "genesis",
    icon: "/artifacts/cold-moon.png",
    iconName: "cold_moon",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Mana Regeneration",
        base: 5,
        perLevel: 0.1,
      },
      {
        name: "Intelligence",
        base: 20,
        perLevel: 0.25,
      },
    ],
    unique: {
      name: "Moon Phase",
      description: "Spell AMP increases over time, reaching a maximum of 30% after 15 seconds. Upon dealing any spell damage, the bonus lingers for 1.5 seconds, then resets to 0%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Waning Moon",
        description: "Moon Phase return value increased to 10%",
        note: "Spell AMP now returns to 10% instead of 0%",
      },
      {
        level: 20,
        name: "Crescent Moon",
        description: "Moon Phase linger duration increased to 4 seconds. Each kill during this period extends the duration by an additional 0.5 seconds.",
      },
      {
        level: 30,
        name: "Full Moon",
        description: "Allied units within 500 gain 30% bonus Mana RegenertionWhen Moon Phase returns, release Cold Moon at the optimal point within 1000, dealing magic damage to enemies within 400. Damage equals 60% of the highest total damage dealt to a single enemy during this Moon Phase linger duration.",
      },
      {
        level: 40,
        name: "New Moon",
        description: "Once per Sage, completing a full Moon Phase cycle with full bonuses grants: 1% permanent Spell AMP+2% maximum Moon Phase bonus",
        note: "Removing the Artifact resets accumulated Moon Phase bonuses, but permanent spell AMP bonuses are retained.",
      },
    ],
    flavor: "Formed of ice crystal, veined with silver light. A fragment of a collapsing lunar soul carves the mark of tides within the flow of time.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "cosmic-singularity",
    gameId: "item_artifact_cosmic_singularity",
    name: "Cosmic Singularity",
    era: "genesis",
    icon: "/artifacts/cosmic-singularity.png",
    iconName: "cosmic_singularity",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Cooldown Reduction",
        base: 14,
        perLevel: 0.18,
        unit: "%",
      },
    ],
    unique: {
      name: "Umbral Dome",
      description: "Up to 2 times per Stage, create a dome that covers an area with a radius of 500 for 8 seconds. Allied units within the area cannot be detected by enemies.",
    },
    upgrades: [
      {
        level: 10,
        name: "Slow Field",
        description: "During Umbral Dome, enemy Movement Speed reduced by 40%.",
      },
      {
        level: 20,
        name: "Folded Field",
        description: "+200 Umbral Dome range",
      },
      {
        level: 30,
        name: "Agnosticism",
        description: "Increases Umbral Dome duration by 2 seconds.",
      },
      {
        level: 40,
        name: "Time Dilation Effect",
        description: "During Umbral Dome, Cooldown Speed increased by 140%.",
      },
    ],
    flavor: "A peculiar ring with a miniature black hole housed at its center. When your finger passes through the band, the black hole hovers above your fingertip.",
    cost: {
      dust: 30,
    },
    sources: [
      "Contract",
    ],
  },
  {
    slug: "dung-eaters-grip",
    gameId: "item_artifact_dung_eaters_grip",
    name: "Dung Eater's Grip",
    era: "genesis",
    icon: "/artifacts/dung-eaters-grip.png",
    iconName: "dung_eaters_grip",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Health",
        base: 500,
        perLevel: 8,
      },
    ],
    unique: {
      name: "Cycle",
      description: "Upgrades the relic [Blabber Guy]. Its effects gain a bonus value equal to 8% of your max HP. Additionally, 's damage is converted into Poison equal to 150% of its damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Accelerated Cycle",
        description: "-1s interval",
      },
      {
        level: 20,
        name: "High-Quality Cycle",
        description: "+Cycle4% bonus maximum HP",
      },
      {
        level: 30,
        name: "Foul Stench",
        description: "Each time triggers, it activates Poison.Activation Ratio: 2%Activation Damage: 1500%",
      },
      {
        level: 40,
        name: "Another Sip",
        description: "Each trigger of applies a debuff for 1.1 seconds, reducing the target's Poison Decay by 40%. Reapplying the debuff refreshes its duration.",
      },
    ],
    flavor: "I ate heartily; it tasted so good.",
    cost: {
      dust: 30,
      platinum: 800,
    },
    sources: [
      "Daily reward",
    ],
  },
  {
    slug: "monkey-kings-headband",
    gameId: "item_artifact_monkey_kings_headband",
    name: "Free Mind",
    era: "genesis",
    icon: "/artifacts/monkey-kings-headband.png",
    iconName: "monkey_kings_headband",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "All Attributes",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Cycle Begins",
      description: "Cannot be equipped after Act 3. Grants 2 rebirth charges. Each time a rebirth is consumed, all Attribute bonus granted is multiplied by 0.15. If death occurs when rebirth is unavailable, this Artifact is disabled.",
    },
    upgrades: [
      {
        level: 10,
        name: "Cycle Three",
        description: "+1 Cycle Begins Rebirths",
      },
      {
        level: 20,
        name: "Eternal Existence",
        description: "Cycle Begins rebirth invulnerability duration increased by 4 seconds. During this period, gain 30% .",
      },
      {
        level: 30,
        name: "Unified Minds",
        description: "Equipment level requirement of other Artifacts reduced by 1",
      },
      {
        level: 40,
        name: "Cycle Again",
        description: "If the Artifact remains disabled for 3 Rounds, dying with no rebirth charges left will automatically remove it.",
      },
    ],
    flavor: "Be he Sage or Buddha, the dawn has yet to be brought, just like the mantra. Through memory and obsession, a new journey to the west can be embarked upon.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1500,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "future-vision",
    gameId: "item_artifact_future_vision",
    name: "Future Vision",
    era: "genesis",
    icon: "/artifacts/future-vision.png",
    iconName: "future_vision",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Luck",
        base: 20,
        perLevel: 0.3,
      },
      {
        name: "Mana",
        base: 300,
        perLevel: 5,
      },
    ],
    unique: {
      name: "Temporal Aid",
      description: "+2 Levels worth of .",
    },
    upgrades: [
      {
        level: 10,
        name: "Further Beyond",
        description: "Upon leveling up, there is a 18% chance to increase Temporal Aid bonus level by 1.",
        note: "Guaranteed to succeed after every 5 failures.",
      },
      {
        level: 20,
        name: "Divine Blessing",
        description: "Each time you encounter [Relay Station Visitor - Misfortune Teller], Temporal Aid bonus level is increased by 1.",
      },
      {
        level: 30,
        name: "Fatebound Visitor",
        description: "After 2 Stages, the Artifact can be actively used in regular combat Stages to summon [Misfortune Teller]Can be used 1 times per Act.",
        note: "All players share this usage limit.",
      },
      {
        level: 40,
        name: "Favor of the Oracle",
        description: "After 2 Stages, gain a 50% discount at the [Misfortune Teller]",
      },
    ],
    flavor: "Many time-related spells are generally classified as forbidden magic, with only a small few ever being learned. Even so, fools often trigger paradoxes, causing disturbances in the magical field of an entire area.",
    cost: {
      dust: 30,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "ghoul-mask",
    gameId: "item_artifact_ghoul_mask",
    name: "Ghoul Mask",
    era: "genesis",
    icon: "/artifacts/ghoul-mask.png",
    iconName: "ghoul_mask",
    maxLevel: 40,
    heroLevel: 6,
    stats: [
      {
        name: "Health",
        base: 300,
        perLevel: 4,
      },
      {
        name: "Health Regeneration",
        base: 15,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Soul Rip",
      description: "Grants 13% attack lifesteal and 13% spell lifesteal.",
    },
    upgrades: [
      {
        level: 10,
        name: "Devour",
        description: "Each time you steal 100% HP with Soul Rip, grants 1% maximum HP.",
        note: "Max HP bonus: 10%",
      },
      {
        level: 20,
        name: "Potent Absorption",
        description: "Lifesteal reduction against non-boss enemies reduced by 18%",
      },
      {
        level: 30,
        name: "Evolution",
        description: "Each time Soul Rip drains 120% HP, grants permanent 2 bonus Attack Damage.",
        note: "Max Bonus: 300",
      },
      {
        level: 40,
        name: "Feast",
        description: "Attacks have bonus lifesteal equal to 1% of the target’s current HP, which is also counted as bonus damage. This bonus cannot exceed 50% of your base Attack Damage.",
        note: "This will be included in Devour and Evolution",
      },
    ],
    flavor: "Ghouls are generally considered a low-tier undead, but there exist special individuals with extremely powerful strength, such as the formidable Nyx. This life form can infest any living creature and control them, then tear their flesh from within when they become useless, achieving a feast.",
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "god-of-black-sand",
    gameId: "item_artifact_god_of_black_sand",
    name: "God of Black Sand",
    era: "genesis",
    icon: "/artifacts/god-of-black-sand.png",
    iconName: "god_of_black_sand",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Poison Damage",
        base: 10,
        perLevel: 0.1,
        unit: "%",
      },
      {
        name: "Spell Lifesteal",
        base: 6,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Poison Sacrifice",
      description: "Passively gain 10 stacks of Poison Sacrifice every 5 seconds. Stacks are reset at the start of each stage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Sandstorm",
        description: "Every 5 seconds, applying stun to an enemy adds 10 stacks of Poison Sacrifice.When consuming Poison Sacrifice, apply Poison equal to 5% of the target's Max HP.",
      },
      {
        level: 20,
        name: "Harvest Day",
        description: "Restores 1 stacks of Poison Sacrifice on enemy kill.",
      },
      {
        level: 30,
        name: "Black Sand Envoy",
        description: "Attach 6 envoys initially, gaining an additional 1 per stage. Every 4.5 seconds, they launch a round of attacks that activate Poison.Activation Ratio: 0.75%Activation Damage: 1500%",
      },
      {
        level: 40,
        name: "Eternal Festival",
        description: "The artifact can be switched, allowing you to sacrifice beetles through different attacks or abilities. Additionally, each Black Sand Envoy grants a 0.8% Max HP bonus.",
      },
    ],
    flavor: "The God of Black Sand craves sacrifices. The lost lure fragile beetles with poison, spilling their blood in ritual slaughter—each drop transformed into the fangs and blessings of the god’s envoys.",
    drop: {
      pool: "General",
      weight: 100,
      chance: 0.3291,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 800,
    },
    requiredDifficulty: 37,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "malignant-growth",
    gameId: "item_artifact_malignant_growth",
    name: "Malignant Growth",
    era: "genesis",
    icon: "/artifacts/malignant-growth.png",
    iconName: "malignant_growth",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Poison Damage",
        base: 15,
        perLevel: 0.1,
        unit: "%",
      },
    ],
    unique: {
      name: "Pustule",
      description: "Your next attack applies Poison equal to 150% of your Primary Attribute and adds 1 stacks of Pustule, activating Poison once per second. After each activation, Pustule performs a check with a 80% chance to succeed; on failure, it is destroyed. The check's sprimary attributesuccess chance is halved for every 1 damage activations by Pustule.Activation Ratio: 1%Activation Damage: 500%",
    },
    upgrades: [
      {
        level: 10,
        name: "Proliferation",
        description: "Each time Pustule triggers, Poison increases by 2%, up to a maximum of 60% of your primary attribute.",
      },
      {
        level: 20,
        name: "Spare Magazine",
        description: "+1 Pustule Charges",
      },
      {
        level: 30,
        name: "Poison Charges",
        description: "Each time Poison Damage is dealt, the bullet with the longest remaining charge is accelerated by 0.1 seconds.",
      },
      {
        level: 40,
        name: "Spore Magazine",
        description: "When a bullet finishes charging, all other charging bullets have their recharge time reduced by 10%.",
      },
    ],
    flavor: "A pistol crafted from special biomass. It looks somewhat disgusting, but don’t worry—it won’t harm the wielder.",
    drop: {
      pool: "General",
      weight: 350,
      chance: 1.1517,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 800,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "thousand-lash-bug",
    gameId: "item_artifact_thousand_lash_bug",
    name: "Myriapod",
    era: "genesis",
    icon: "/artifacts/thousand-lash-bug.png",
    iconName: "thousand_lash_bug",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Strength",
        base: 12,
        perLevel: 0.2,
      },
      {
        name: "Intelligence",
        base: 12,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Insect Wielder",
      description: "Minimum Attack Range increased by 300.Attacks apply a 50% MS slow for 0.3 seconds.",
    },
    upgrades: [
      {
        level: 10,
        name: "Leash",
        description: "Attacks leash the target for 4 seconds.",
        note: "Can only leash one target at a time. A target that has been leashed cannot be leashed again for 30 seconds.",
      },
      {
        level: 20,
        name: "Acid Gland",
        description: "Leash reduces Armor by 7",
        note: "Effect lingers for 10 seconds after the leash ends.",
      },
      {
        level: 30,
        name: "Metamorphosis",
        description: "Increases minimum Attack Range by 100 per Act completed",
        note: "Removing the Artifact resets this bonus.",
      },
      {
        level: 40,
        name: "Sentient Weapon",
        description: "When not actively attacking enemies, attack enemies within your minimum Attack Range every 3 seconds.",
      },
    ],
    flavor: "Grasp its tail as a handle, and it becomes a living whip capable of tearing the horizon apart.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "nirvana-ring",
    gameId: "item_artifact_nirvana_ring",
    name: "Nirvana",
    era: "genesis",
    icon: "/artifacts/nirvana-ring.png",
    iconName: "nirvana_ring",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Health Regeneration",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
      {
        name: "Health Regeneration",
        base: 15,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Immolation",
      description: "Activates when HP is above 95%, deactivates when below 70%.Deals damage per second to enemies within 400 equal to 100% of HP Regeneration. While active, consumes 2% HP per second, increasing by 0.2% per second.",
    },
    upgrades: [
      {
        level: 10,
        name: "Revival",
        description: "+50% rebirth invulnerability duration. Health Regeneration from this Artifact is multiplied by 2 during this period.",
      },
      {
        level: 20,
        name: "Eastern Rise",
        description: "After maintaining HP above 95% for 3 seconds, gain 80% %Immolation range.",
      },
      {
        level: 30,
        name: "Western Fall",
        description: "At low HP, Immolation damage to enemies is not disabled, but reduced by 60%.",
      },
      {
        level: 40,
        name: "Nirvana",
        description: "Consuming HP Runes to rebirth grants permanent 4",
      },
    ],
    flavor: "A ring forged from the blazing flames born of a phoenix’s nirvana.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "puppeteers-grasp",
    gameId: "item_artifact_puppeteers_grasp",
    name: "Puppet Master's Grasp",
    era: "genesis",
    icon: "/artifacts/puppeteers-grasp.png",
    iconName: "puppeteers_grasp",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Summon Duration",
        base: 15,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Grip Master",
      description: "Summons Attack Speed increased by 25%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Delicate Handling",
        description: "If the number of controlled units is less than or equal to 3, then Grip Master gains an additional 15% bonus effect.",
      },
      {
        level: 20,
        name: "Void Glance",
        description: "Each basic attack from a puppet has a 20% chance to deal 140% critical strike.",
      },
      {
        level: 30,
        name: "Coordinated Strike",
        description: "After a controlled unit attacks, all other controlled units gain a 0.5% bonus attack damage. This effect stacks independently and lasts 8 seconds, up to 100%.",
        note: "Considered as applied by you",
      },
      {
        level: 40,
        name: "Total Command",
        description: "Can be activated to increase the bonus attack speed of Grip Master to 100%. During this time, you are disarmed. Duration: 10 seconds. Cooldown: 25 seconds.",
      },
    ],
    flavor: "An ordinary puppeteer can only control one unit; it is not an easy task to control a unit using five fingers. Usually, a puppeteer releases magical energy from their fingers to connect to the individual being controlled. The area a single thread can cover is limited. To control a larger individual, or to perform more delicate operations, more detailed information transmission is required, thus more fingers are needed for coordination. However, this is not absolute; at least that master could issue complex commands to an individual using just one finger.",
    drop: {
      pool: "General",
      weight: 350,
      chance: 1.1517,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 800,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "razor",
    gameId: "item_artifact_razor",
    name: "Razor",
    era: "genesis",
    icon: "/artifacts/razor.png",
    iconName: "razor",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Agility",
        base: 25,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Lightning Strike",
      description: "Your next attack deals bonus damage equal to 200% and gains +300 Attack Range. After the attack lands, gain bonus Attack Damage equal to 20% for 15 seconds. This effect stacks independently.",
    },
    upgrades: [
      {
        level: 10,
        name: "Extension",
        description: "+150 Lightning Strike Attack Range",
      },
      {
        level: 20,
        name: "Double Strike",
        description: "Lightning Strike attacks also perform an additional attack dealing 40% damage.",
      },
      {
        level: 30,
        name: "Stored Energy",
        description: "-1 seconds Lightning Strike cooldown",
      },
      {
        level: 40,
        name: "Lightning Whip",
        description: "Lightning Strike stores up to 5 charges, releasing all effects on attack.",
      },
    ],
    flavor: "A whip that crackles with lightning. In skilled hands, it can deliver five strikes in an instant.",
    drop: {
      pool: "General",
      weight: 350,
      chance: 1.1517,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 800,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "scales-of-sacrifice",
    gameId: "item_artifact_scales_of_sacrifice",
    name: "Scales of Sacrifice",
    era: "genesis",
    icon: "/artifacts/scales-of-sacrifice.png",
    iconName: "scales_of_sacrifice",
    maxLevel: 50,
    heroLevel: 6,
    stats: [
      {
        name: "All Attributes",
        base: 10,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Unequal Exchange",
      description: "After each stage, gain an buff. Press Alt + Left Mouse on the buff to exchange 6 all attributes for 550. After every 1 stages cleared, 1 of the attributes deducted by this exchange are restored, provided you contributed at least 40% of the total damage during that stage. Can be exchanged up to 3 times per stage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Regular Customer",
        description: "-1 all-attribute cost for Unequal Exchange",
      },
      {
        level: 20,
        name: "Rebate",
        description: "After using all exchanges available during a stage, gain an additional 300 when the attributes deducted by that set of exchanges are restored",
      },
      {
        level: 30,
        name: "Dissolution",
        description: "Press Alt + Left Mouse on the Cost Debuff to spend at a 130% ratio and regain the attributes.",
      },
      {
        level: 40,
        name: "Cost Conversion",
        description: "This Artifact can be activated to increase all attributes by 35% for the current stage. At the end of the stage, you are afflicted with a debuff that permanently reduces all attributes by 10%. Press Alt + Left Mouse on the debuff and spend 3500 could remove it",
      },
    ],
    flavor: "Most exchanges are never truly equal. You may give much and receive little in return—in love as in business.",
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "second-energy-core",
    gameId: "item_artifact_second_energy_core",
    name: "Secondary Core",
    era: "genesis",
    icon: "/artifacts/second-energy-core.png",
    iconName: "second_energy_core",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Mana",
        base: 300,
        perLevel: 6,
      },
      {
        name: "Mana Regeneration",
        base: 6,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Secondary Core",
      description: "Upon each cast, 30% of its mana cost is stored. When the stored amount reaches 100% of maximum mana, an explosion occurs, dealing 100% of the stored amount as damage to enemies within 800 range. When current mana falls below 50%, mana is restored from the backup reserve.",
    },
    upgrades: [
      {
        level: 10,
        name: "Kinetic Power",
        description: "Grants 1% charges for every 700 distance moved.",
      },
      {
        level: 20,
        name: "Solar Charging",
        description: "Grants 1% charges every 2 seconds while in Status state.",
      },
      {
        level: 30,
        name: "Charge Expansion",
        description: "Can be toggled to a different effect. When used, the maximum stored amount of Secondary Core is increased to 300%. This causes both Kinetic Power and Solar Charging to also charge based on the expanded capacity.",
      },
      {
        level: 40,
        name: "Concussive Charge",
        description: "After Secondary Core explodes, 35% of the highest single-instance damage caused by the explosion is converted into restored charges. However, the amount restored cannot exceed 75% of the original consumed amount.",
      },
    ],
    flavor: "Most living things have a single energy flow. Constructs? They cheat. One core runs the show. Break that core and the unit drops — heartbreak style. However, some upgraded constructs carry a second energy source. When primary dies, they flip to secondary core and stay in the fight.",
    drop: {
      pool: "General",
      weight: 150,
      chance: 0.4936,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "selyanas-guard",
    gameId: "item_artifact_selyanas_guard",
    name: "Selyana's Guard",
    era: "genesis",
    icon: "/artifacts/selyanas-guard.png",
    iconName: "selyanas_guard",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Mana",
        base: 300,
        perLevel: 6,
      },
      {
        name: "Intelligence",
        base: 15,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Chosen Ritual",
      description: "Each attack consumes 40% of Mana based on Primary Attribute, converting it into bonus damage. After dealing damage, the consumed Mana is restored over 5 seconds as Mana Regeneration, up to a maximum of 10% of the damage dealt.",
    },
    upgrades: [
      {
        level: 10,
        name: "Divine Gift",
        description: "Chosen Ritual restores 105% of Mana consumed.",
      },
      {
        level: 20,
        name: "Divine Wings",
        description: "When initiating an attack, grants 500 Movement Speed and charge towards the target.",
      },
      {
        level: 30,
        name: "Divine Slash",
        description: "Move at least 500 with Divine Wings: next attack ignores 30 Armor.",
      },
      {
        level: 40,
        name: "Divine Guardian",
        description: "Unlock two different forms. Activate this Artifact to switch between them.1. Divine Favor: Chosen Ritual Mana cost increased by 50%. Gain bonus Attack Damage equal to 100% of the Mana Regeneration it provides.Guardian: Gain an all-damage shield every second equal to 15% of your Mana Regeneration, lasting 10 seconds. This shield cannot exceed 200% of your Max HP or MP, whichever is higher.",
      },
    ],
    flavor: "Throughout history, the battlefield has been dominated by male heroes. However, Empress Selyana of the Empire defied this norm. During the Tide of Madness, she single-handedly held off attacks from thousands of sub-humans. In an Empire teeming with heroes, the Empress had no need to go to the front lines, yet she still used her strength to protect the Empire's people. Over time, the people bestowed upon their Empress a new title: Guardian of the Empire. — Ninth World: Atlus, Official History.",
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "helm-of-the-seraph-knight",
    gameId: "item_artifact_helm_of_the_seraph_knight",
    name: "Seventh Heaven",
    era: "genesis",
    icon: "/artifacts/helm-of-the-seraph-knight.png",
    iconName: "helm_of_the_seraph_knight",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Armor",
        base: 10,
        perLevel: 0.2,
      },
      {
        name: "Magic Armor",
        base: 10,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Apocalypse",
      description: "At the start of a Stage, gain 20 stacks of Apocalypse. Dealing damage consumes 1 stack(s) to boost final damage by 30%. Restores 1 stack every 8 seconds.",
    },
    upgrades: [
      {
        level: 10,
        name: "Divine Gift",
        description: "-1s Apocalypse cooldown",
      },
      {
        level: 20,
        name: "Divine Retribution",
        description: "Damage amplified by Apocalypse causes a 20% splash in a 200 radius.",
      },
      {
        level: 30,
        name: "Divine Will",
        description: "Restores 1 / 5 stack(s) of Apocalypse upon killing normal/leader enemies.",
      },
      {
        level: 40,
        name: "Sky Crossing",
        description: "Once per day, after clearing Act III with this Artifact, permanently gain 30 bonus HP. This effect reaches its maximum after 30 stacks.",
      },
    ],
    flavor: "Born from the final fire of the Star-Forging Furnace in the Seventh Heaven. When the Star Chart of Creation dimmed, Archangel Gabriel plucked his own light-wings and forged them into this helmet, bearing the mission of redemption.",
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "slime-forged-core",
    gameId: "item_artifact_slime_forged_core",
    name: "Slime's Forging Core",
    era: "genesis",
    icon: "/artifacts/slime-forged-core.png",
    iconName: "slime_forged_core",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Primary Attribute",
        base: 20,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Water",
      description: "Enhances the ability of the relic [Acidic Slime]. Enemies within its capture range are always considered targets and have 1 stacks of a unique debuff, which can only be detected and dispelled by .",
    },
    upgrades: [
      {
        level: 10,
        name: "Capture I",
        description: "+150 to ’s capture range",
      },
      {
        level: 20,
        name: "Capture II",
        description: "+1 to ’s maximum dissolution count",
      },
      {
        level: 30,
        name: "Capture III",
        description: "-2 's dissolution interval",
      },
      {
        level: 40,
        name: "Two-Faced",
        description: "Artifact can switch modes:Inward Mode: targets and prioritizes allies, removing their debuffs and applying healing.Outward Mode: does not dispel the target’s debuffs.",
      },
    ],
    flavor: "An artificial heart crafted mainly from slime creatures, though it is not intended for use in humans.",
    cost: {
      dust: 30,
      platinum: 800,
    },
    sources: [
      "Daily reward",
    ],
  },
  {
    slug: "soul-lantern",
    gameId: "item_artifact_soul_lantern",
    name: "Soul Lantern",
    era: "genesis",
    icon: "/artifacts/soul-lantern.png",
    iconName: "soul_lantern",
    maxLevel: 40,
    heroLevel: 8,
    stats: [
      {
        name: "Attack Damage",
        base: 25,
        perLevel: 0.4,
      },
    ],
    unique: {
      name: "Soul Vessel",
      description: "Killing a Regular/Leader enemy collects 1/5 stacks of souls, each stack grants 0.5 Attack Damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Soul Searchlight",
        description: "At 20/80/200 stacks, summon a Soul Cluster that automatically seeks out enemies.",
      },
      {
        level: 20,
        name: "Soul Harvest",
        description: "After dealing damage exceeding 25% of a target’s max HP, souls are collected without requiring you to land the killing blow.",
      },
      {
        level: 30,
        name: "Soul Redemption",
        description: "Minimum Soul Searchlight +15 per Stage",
        note: "At the end of each Stage, automatically replenish souls up to 15 stacks.",
      },
      {
        level: 40,
        name: "Soul Requisition",
        description: "Removing the Artifact retains 50% of souls",
      },
    ],
    flavor: "The lantern hangs empty, unlit within. Only by drinking souls does it burn, only by devouring life does it shine. The dead become fuel, its edge grows ever colder. As souls gather and shadows deepen, spectral servants arise. When others fade, this lantern may steal their light. On the battlefield, souls are thin; in empty valleys, it harvests by force. The lantern may be cast aside, but the soul brand never fades. Half is offered as sacrifice, bound forever to the mantle of war.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "thousand-leagues-astrologer",
    gameId: "item_artifact_thousand_leagues_astrologer",
    name: "Thousand Leagues Astrologer",
    era: "genesis",
    icon: "/artifacts/thousand-leagues-astrologer.png",
    iconName: "thousand_leagues_astrologer",
    maxLevel: 40,
    heroLevel: 6,
    stats: [
      {
        name: "Luck",
        base: 15,
        perLevel: 0.2,
      },
      {
        name: "Evasion",
        base: 15,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Distant Astrology",
      description: "Gain 3 charges at the start of a Stage. Killing a boss or elite enemy restores 1 charges.Maximum charges: 3.When taking damage exceeding 15 % of your maximum HP, consume 1 charge(s) to evade that damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Foreseen Motion",
        description: "+10% chance to not consume charges when Distant Astrology triggers",
      },
      {
        level: 20,
        name: "Stellar Rewind",
        description: "When charges are consumed, restore 15% HP and apply a strong dispel",
      },
      {
        level: 30,
        name: "Omniscience",
        description: "For every 2 damage instances evaded by Distant Astrology, gain 1 permanent luck, up to 20;For every 10 luck gained, gain 1 Distant Astrology charges.",
      },
      {
        level: 40,
        name: "Divine Ordinance",
        description: "When Distant Astrology has no charges, restore 1 charge every 20 seconds.",
      },
    ],
    flavor: "The current whereabouts of the Artifact remain unknown, and there has been no sign of the deity choosing a new champion since the Second Chaos Insurgency. Even so, the goddess’s followers believe that somewhere out there, the Thousand Leagues Astrologer is guiding a new Stellar Watcher through the dark, starry night.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 2,
      waveTo: 8,
    },
    cost: {
      dust: 30,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "witch-headcrown",
    gameId: "item_artifact_witch_headcrown",
    name: "Witch Headcrown",
    era: "genesis",
    icon: "/artifacts/witch-headcrown.png",
    iconName: "witch_headcrown",
    maxLevel: 40,
    heroLevel: 6,
    stats: [
      {
        name: "Intelligence",
        base: 25,
        perLevel: 0.3,
      },
      {
        name: "Status Resistance",
        base: 10,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Maximum Mana Amplification",
      description: "+10% Spell AMP+1% per Stage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Immunity",
        description: "Dispels 1 debuffs every 15 seconds",
      },
      {
        level: 20,
        name: "Ascension",
        description: "When first equipped, gain random 1",
      },
      {
        level: 30,
        name: "Greater Immunity",
        description: "Immunity dispels additional 1 debuffsMaximum Mana Amplification now lasts only 2 Stages",
      },
      {
        level: 40,
        name: "Greater Ascension",
        description: "Ascension now grants",
      },
    ],
    flavor: "Seals away the wearer’s ego, allowing them to wield magic beyond their natural limits. However, forcibly removing it inflicts psychic backlash from the amplified mental force — caution is advised when worn.",
    cost: {
      dust: 30,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "manaweave-canopy",
    gameId: "item_artifact_manaweave_canopy",
    name: "Arcane Skyveil",
    era: "middle",
    icon: "/artifacts/manaweave-canopy.png",
    iconName: "manaweave_canopy",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Mana",
        base: 500,
        perLevel: 10,
      },
      {
        name: "Mana Regeneration",
        base: 10,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Skyveil Guard",
      description: "When MP is above 30%, consume Mana to block 60% damage. Each point of MP blocks 1.5 damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Mana Maintenance",
        description: "Every 5 seconds, restore 2% of Mana consumed",
      },
      {
        level: 20,
        name: "Dense Field",
        description: "+0.5 damage blocked /MP of Skyveil Guard",
      },
      {
        level: 30,
        name: "Precision Control",
        description: "Skyveil Guard consumes up to (300 + 15% of Max MP) Mana per use.",
      },
      {
        level: 40,
        name: "Skyveil",
        description: "Can be activated to convert 50% of your Max MP into a separate Mana PoolThe Mana Pool has 100% independent MP Regeneration, and Skyveil Guard consumes Mana only from this pool.",
        note: "As expected, all Abilities now affect only the separate Mana Pool, and the 30% restriction no longer applies.",
      },
    ],
    flavor: "Using the supreme techniques of the arcane schools, mana is woven into an absolute shield.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "azure-star",
    gameId: "item_artifact_azure_star",
    name: "Azure Star",
    era: "middle",
    icon: "/artifacts/azure-star.png",
    iconName: "azure_star",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Mana",
        base: 800,
        perLevel: 10,
      },
    ],
    unique: {
      name: "Azure Reflux",
      description: "+1% Max Mana Regeneration per second, with 150% effect while in Water Terrain.",
    },
    upgrades: [
      {
        level: 10,
        name: "Current Growth",
        description: "When MP is above 95%, the Mana cost per second for Azure Reflux increases to 2%",
      },
      {
        level: 20,
        name: "Ebb and Flow",
        description: "The lower your MP, the higher the Mana Regeneration provided by Azure Reflux, up to an additional 50%",
      },
      {
        level: 30,
        name: "Current Echo",
        description: "Mana consumed by Azure Reflux is converted into 100% damage dealt to enemies within a 500 radius",
      },
      {
        level: 40,
        name: "Underflow",
        description: "Can be activated to increase Azure Reflux ’s cost by 300% and remove its drain limit. Additionally, 50% of the Mana drained is converted into temporary Max Mana bonus. This effect stacks independently and lasts for 10 seconds.",
      },
    ],
    flavor: "The Dark Reef is not merely a prison; its lengthy labyrinth actually has two branches—one leads to the most dangerous cells, the other to the hidden treasury of the ocean empire. Many overconfident thieves come here, unaware that the warden has already prepared cages for them, waiting for them to walk right into the trap.",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "celestial-expanse",
    gameId: "item_artifact_celestial_expanse",
    name: "Celestial Expanse",
    era: "middle",
    icon: "/artifacts/celestial-expanse.png",
    iconName: "celestial_expanse",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Area of Effect",
        base: 10,
        perLevel: 0.15,
        unit: "%",
      },
      {
        name: "Primary Attribute",
        base: 15,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Enigma",
      description: "Start with 3 Gravity Spheres. When a nearby enemy within 500 range tries to land an attack, one sphere fires off, shoving them toward the outer rim. That sphere then sinks into the ground and creates a small gravity field, largely slows for 6 seconds. Each ready sphere increases your bonus radius by 30. Each active sphere grants you 6% damage reduction.",
    },
    upgrades: [
      {
        level: 10,
        name: "Nested Rings",
        description: "+1 Enigma Gravity Spheres",
      },
      {
        level: 20,
        name: "Universal Gravitation",
        description: "The Gravity Sphere pulls along any other enemies it touches on the way, dragging them all to the edge together.",
      },
      {
        level: 30,
        name: "Collapse",
        description: "While the gravity field from Enigma is active, if you cast a spell while inside its area, or target a point inside it with an ability, the field collapses. It pulls in all enemies within 500 toward the center and stuns them for 2 seconds. When the stun ends, they take damage equal to 30% of the damage they received during the stun. After collapsing, the Gravity Sphere resets 5 seconds later. During that delay, no field is generated.",
        note: "The bonus damage cannot exceed 600% of your primary attribute. Any damage flagged as life loss, retaliate, or similar is ignored for the calculation.",
      },
      {
        level: 40,
        name: "Binary Star",
        description: "Toggles active effect. While the active is on, Enigma uses two Gravity Spheres to pull enemies, and immediately triggers Collapse when the push-off is finished. This means you need at least two ready spheres for it to work. Additionally, while active, if your total percentage-based radius bonuses exceed 60%, gain +10% Final Damage Bonus.",
      },
    ],
    flavor: "Gaia's land is just one corner of the world. By human measure, this planet is already huge. Many spend their whole lives without ever leaving home. But the world is vast. Between realms you've got the void and the aether. Star-clouds drifting out there — no one's mapped them all.",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "judgement-of-the-fallen",
    gameId: "item_artifact_judgement_of_the_fallen",
    name: "Celestial Judgment",
    era: "middle",
    icon: "/artifacts/judgement-of-the-fallen.png",
    iconName: "judgement_of_the_fallen",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Strength",
        base: 20,
        perLevel: 0.3,
      },
      {
        name: "Armor",
        base: 10,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Judgement",
      description: "After the same unit attacks you 6 times, an echo is triggered centered on that unit, dealing [120 + 270% ] damage to other enemies within 400 radius.Each unit has a 5 seconds cooldown.",
    },
    upgrades: [
      {
        level: 10,
        name: "Arcane Totem",
        description: "Your attacks generate 2 Judgement attack count",
      },
      {
        level: 20,
        name: "Arcane Resonance",
        description: "The primary target that triggers Judgement also takes 1 instances of damage",
      },
      {
        level: 30,
        name: "Echoes Beyond",
        description: "For each target affected by Judgement, gain 1% bonus Strength, stacking independently for 30 seconds, up to 20 stacks",
      },
      {
        level: 40,
        name: "Arcane Echo",
        description: "Your spell damage also generates 2 Judgement attack counts",
      },
    ],
    flavor: "Earthshaker cannot restore life to those who perished in the destruction of his sister earth, but he can wield a fragment born from her demise to mete out justice upon those responsible.",
    cost: {
      dust: 45,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "censer-of-bitter-plague",
    gameId: "item_artifact_censer_of_bitter_plague",
    name: "Censer of Bitter Plague",
    era: "middle",
    icon: "/artifacts/censer-of-bitter-plague.png",
    iconName: "censer_of_bitter_plague",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Health Regeneration",
        base: 30,
        perLevel: 0.5,
      },
      {
        name: "Health Regeneration",
        base: 15,
        perLevel: 0.1,
        unit: "%",
      },
    ],
    unique: {
      name: "Agony Recompense",
      description: "After taking cumulative damage equal to 10% of your maximum health, release a slowly spreading that affects enemies up to 800 units away. Enemies that touch are immediately afflicted with Poison equal to 15% of their maximum health. While within its area, they are afflicted with an additional 3% of their maximum health as Poison each second. lasts 3 seconds.",
    },
    upgrades: [
      {
        level: 10,
        name: "Spell Recompense",
        description: "50% of your spell costs also count toward Agony Recompense, whether paid with mana or health",
      },
      {
        level: 20,
        name: "Foul Recompense",
        description: "Releasing also applies a weak dispel to yourself. If any debuff is dispelled, gains 40% potency, plus an additional 5% for each debuff dispelled",
      },
      {
        level: 30,
        name: "Concurrent Recompense",
        description: "gains 10% potency for each Poison Target on the battlefield",
      },
      {
        level: 40,
        name: "Origin of Plague",
        description: "An area of 300 around you constantly produces the effect of at the highest potency it has reached during the current stage",
      },
    ],
    flavor: "Every wound, every brush with death, and every curse dispelled is refined into pestilent miasma.",
    drop: {
      pool: "General",
      weight: 150,
      chance: 0.4936,
      waveFrom: 10,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 15,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "cloudstrider",
    gameId: "item_artifact_cloudstrider",
    name: "Cloudstrider",
    era: "middle",
    icon: "/artifacts/cloudstrider.png",
    iconName: "cloudstrider",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Movement Speed",
        base: 120,
        perLevel: 2,
      },
      {
        name: "Evasion",
        base: 15,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Cloudstep",
      description: "Has 2 charge(s). When you use a teleport or blink Ability, this Artifact goes on cooldown instead, with a cooldown time equal to 140% of the original.",
    },
    upgrades: [
      {
        level: 10,
        name: "Feather Rush",
        description: "After Cloudstep, gain 20% bonus MS, stacking independently for 10 seconds",
      },
      {
        level: 20,
        name: "Sky Treader",
        description: "-25%Cloudstep cooldown time replaced",
      },
      {
        level: 30,
        name: "The Third Wings",
        description: "+1 max Cloudstep charges",
      },
      {
        level: 40,
        name: "Sky Walker",
        description: "+150/300 min/max MS",
      },
    ],
    flavor: "The bodies of humanoid creatures are surprisingly resilient. Even a fall from high ground is unlikely to kill you outright. More often, your ribs snap like branches, puncturing your lungs and leaving you to slowly and painfully suffocate in your own blood. So when you wear these boots… it’s best not to look down.",
    cost: {
      dust: 45,
    },
    sources: [
      "Contract",
    ],
  },
  {
    slug: "constellation-relic",
    gameId: "item_artifact_constellation_relic",
    name: "Constellation Relic",
    era: "middle",
    icon: "/artifacts/constellation-relic.png",
    iconName: "constellation_relic",
    maxLevel: 50,
    heroLevel: 12,
    stats: [
      {
        name: "Health",
        base: 500,
        perLevel: 5,
      },
      {
        name: "Mana",
        base: 500,
        perLevel: 5,
      },
      {
        name: "Luck",
        base: 25,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Celestial Myriad",
      description: "After each Stage, gain 5 Luck. Has a 15% chance to obtain a random Ability . If this effect does not trigger, the chance is doubled for the next attempt.",
    },
    upgrades: [
      {
        level: 10,
        name: "Stargazing",
        description: "Whenever you obtain any (including temporary ones), +2 Luck",
      },
      {
        level: 20,
        name: "Celestial Insight",
        description: "Has a 30% chance (Luck × 15) to negate incoming damage",
      },
      {
        level: 30,
        name: "Wheel of Fate",
        description: "Up to 3 times per Stage, when taking lethal damage, consume 20 Luck to survive and become invulnerable for 1s. Lost Luck is restored at the end of the Stage.",
        note: "Does not trigger if you lack sufficient Luck.",
      },
      {
        level: 40,
        name: "Starpath",
        description: "Each day, after clearing a Stage with this Artifact, it grants additional 8 Luck for the day. This bonus decreases by 1 each time",
      },
    ],
    flavor: "A robe embodying the legacy of legendary pioneers, granting fleeting visions of its power only to those whose sight reaches the farthest horizons. In ages long past, only a handful of true relics existed, their names etched upon the very pinnacle of the Constellation — [Aeili][肥宅快乐浪][四棱][李狗蛋][无色无味]. In later eras, countless imitations emerged. Though lacking the full divine might of the originals, they still bear the honored name of the Constellation Relic.",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Event",
    ],
  },
  {
    slug: "kiss-of-the-rose",
    gameId: "item_artifact_kiss_of_the_rose",
    name: "Crimson Rose",
    era: "middle",
    icon: "/artifacts/kiss-of-the-rose.png",
    iconName: "kiss_of_the_rose",
    maxLevel: 50,
    heroLevel: 11,
    stats: [
      {
        name: "Attack Damage",
        base: 30,
        perLevel: 0.5,
      },
      {
        name: "Attack Damage",
        base: 40,
        perLevel: 0.8,
      },
    ],
    unique: {
      name: "Kiss of Thorns",
      description: "Critical damage is increased by 60%. Each time you trigger a critical strike, you take backlash damage equal to 15% of that damage, capped at 10% of your Max HP.",
    },
    upgrades: [
      {
        level: 10,
        name: "Kiss of Death",
        description: "+20% critical damage",
      },
      {
        level: 20,
        name: "Kiss of Blood",
        description: "+10% critical strike lifesteal",
      },
      {
        level: 30,
        name: "Kiss of Madness",
        description: "After trigger a critical strike, the next 2 attacks gain additional 100 (an max) Attack Speed",
      },
      {
        level: 50,
        name: "Final Kiss",
        description: "Each attack has a 30% chance to roll 1 additional critical strikes, using the highest result as the final critical damage",
        note: "Different critical strike mechanics interact differently. For example, Chaos Strike does not increase critical strike chance, but if it triggers, it rolls twice and uses the higher critical damage. If a critical strike is produced as a secondary effect of another mechanic, this effect will not take effect.",
      },
    ],
    flavor: "Some beautiful things are dangerous by nature. No matter how alluring the surface may be, their hidden defenses cannot be ignored. Often, by the time you realize this, your life has already reached its end.",
    drop: {
      pool: "General",
      weight: 150,
      chance: 0.4936,
      waveFrom: 10,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1500,
    },
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "waning-sea-coral",
    gameId: "item_artifact_waning_sea_coral",
    name: "Fading Surf",
    era: "middle",
    icon: "/artifacts/waning-sea-coral.png",
    iconName: "waning_sea_coral",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Health",
        base: 800,
        perLevel: 8,
      },
      {
        name: "Armor",
        base: 15,
        perLevel: 0.3,
      },
    ],
    unique: {
      name: "Ocean Erosion",
      description: "Gradually reduces armor of enemies within 900 range, permanently reducing armor by 1 every second, up to a maximum of 15. If the wielder is in Water Terrain, then every 5 seconds, the maximum reduction is increased by 1 (but up to a maximum of 27). Leave Water Terrain and the extra cap disappears. Already reduced armor stays reduced, but it won't go past the active cap.",
    },
    upgrades: [
      {
        level: 10,
        name: "Current Expansion",
        description: "Ocean Erosion's radius increases by an amount equal to 100% of your own armor.",
      },
      {
        level: 20,
        name: "Depth Warden",
        description: "Grants bonus armor equal to 50% of the total armor reduced by Ocean Erosion. (The closest enemy counts for 100%, while all other enemies count for only 20%.)",
      },
      {
        level: 30,
        name: "Soaked",
        description: "Enter Water Terrain and the Ocean Erosion bonus remains for 10 seconds even if briefly leaving.",
      },
      {
        level: 40,
        name: "Great Cleansing",
        description: "Physical damage you deal behaves as though Ocean Erosion has already been running for 1 seconds.",
      },
    ],
    flavor: "Many currents meet here, and the heavy stuff gets pulled in too. Dark Reef holds plenty of high-risk criminals and a good pile of treasure. The warden thought no one and nothing could ever slip out. But he didn't count on one slippery convict making off with a chunk of his stash.",
    drop: {
      pool: "Siltbreaker",
      weight: 350,
      chance: 58.3333,
      waveFrom: 10,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 24,
    sources: [
      "Boss: Breaker",
    ],
  },
  {
    slug: "yotunheim-ring",
    gameId: "item_artifact_yotunheim_ring",
    name: "Frost of Jotunheim",
    era: "middle",
    icon: "/artifacts/yotunheim-ring.png",
    iconName: "yotunheim_ring",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Health",
        base: 500,
        perLevel: 5,
      },
      {
        name: "Armor",
        base: 10,
        perLevel: 0.2,
      },
      {
        name: "Magic Armor",
        base: 15,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Body of Ymir",
      description: "30% of damage taken is converted into energy. Over the next 10s, 10% of this energy is converted into every 1 seconds. The shield lasts 15 seconds.",
    },
    upgrades: [
      {
        level: 10,
        name: "Frozen Bloodline",
        description: "While the Body of Ymir shield is active, gain additional 20% physical damage reduction",
      },
      {
        level: 20,
        name: "Frost Resistance",
        description: "While the Body of Ymir shield is active, gain additional 60% slow resistance",
      },
      {
        level: 30,
        name: "Frozen",
        description: "Once per Stage, when HP falls below 40%, you become invulnerable and receive a strong dispel for 5 seconds, restoring 10% HP and MP every second. After 1 seconds, you can end the effect early with a stop command (S/H).",
      },
      {
        level: 40,
        name: "Embrace of Frost",
        description: "Gains a Body of Ymir shield equal to 50% of Armor/Magic Armor (whichever is higher) per second",
      },
    ],
    flavor: "In the beginning lived the giant Ymir. There was no sand, no sea, no cool waves; no earth beneath, no sky above. Only the yawning abyss existed, and no grass grew. Then the sons of Borr raised the land and shaped radiant Midgard. — Poetic Edda, Völuspá, Verses 3–4",
    drop: {
      pool: "FrostGiant",
      weight: 400,
      chance: 100,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 24,
    sources: [
      "Boss: Frost Giant",
    ],
  },
  {
    slug: "singularity-glintstone-staff",
    gameId: "item_artifact_singularity_glintstone_staff",
    name: "Glintstone Singularity Staff",
    era: "middle",
    icon: "/artifacts/singularity-glintstone-staff.png",
    iconName: "singularity_glintstone_staff",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "Intelligence",
        base: 25,
        perLevel: 0.2,
      },
      {
        name: "Mana Regeneration",
        base: 15,
        perLevel: 0.3,
      },
    ],
    unique: {
      name: "Glintstone Sorcery",
      description: "+100% MP cost and 45 min MP costEvery 3 casts, lanuch a glintstone beam at a random enemy within 1000 range, dealing 100% of the total MP spent across those 3 casts as damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Efficient Conversion",
        description: "Glintstone Sorcery conversion damage increased to 140%.",
      },
      {
        level: 20,
        name: "Mana Fracture",
        description: "+15% of your max MP to Glintstone Sorcery's damage",
      },
      {
        level: 30,
        name: "Glintstone Surge",
        description: "Glintstone Sorcery deals damage withn 300 range",
      },
      {
        level: 40,
        name: "Singularity Ascension",
        description: "Can be toggled. While active: Your Abilities consume additional MP equal to 10% of your current MP.You can accumulate 5 casts. Glintstone Surge's radius increases to 500. If all casts are the same Abilities, its cooldown is reset when triggered.",
      },
    ],
    flavor: "The distinction between comet and meteor magic always felt rather otiose to me. One produces horizontal beams. Another causes vertical blasts. Both hurt all the same. My colleagues insisted there was more nuance to it, however—so to prove them wrong, I mastered both.— Lusata Zur, wizardly prodigy.",
    cost: {
      dust: 45,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "gravebloom",
    gameId: "item_artifact_gravebloom",
    name: "Gravebloom Coronet",
    era: "middle",
    icon: "/artifacts/gravebloom.png",
    iconName: "gravebloom",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "All Attributes",
        base: 12,
        perLevel: 0.1,
      },
      {
        name: "Poison Damage",
        base: 8,
        perLevel: 0.08,
        unit: "%",
      },
    ],
    unique: {
      name: "Floral Offering",
      description: "The Poison you apply is reduced by 30%, with the reduced stacks absorbed by Floral Offering as nourishment. Once the nourishment reaches 1000% of your Primary Attribute, Floral Offering gains a level. Each time the requirement doubles thereafter, it gains 1 levels",
    },
    upgrades: [
      {
        level: 10,
        name: "Rotten Soil",
        description: "When an enemy dies with Poison while within the area of Floral Offering, immediately gain nourishment equal to 30% of its remaining Poison",
        note: "If multiple instances of Floral Offering are present, only the nearest one absorbs the nourishment",
      },
      {
        level: 20,
        name: "Violet Heart",
        description: "When Floral Offering reaches level 5, Poison Decay is slowed by 20% for enemies within its area",
      },
      {
        level: 30,
        name: "Bloom",
        description: "When Floral Offering reaches level 7, any Poison you apply has a 20% chance to be applied again after 1s",
      },
      {
        level: 40,
        name: "Unfading",
        description: "When the stage resets, Floral Offering from Floral Offering is no longer cleared and instead loses only 2 levels",
      },
    ],
    flavor: "Do not mourn the withering dead. Some flowers bloom eternal only upon their remains.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 15,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "scythe-of-the-grim-shepherd",
    gameId: "item_artifact_scythe_of_the_grim_shepherd",
    name: "Grim Shepherd",
    era: "middle",
    icon: "/artifacts/scythe-of-the-grim-shepherd.png",
    iconName: "scythe_of_the_grim_shepherd",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Summon AMP",
        base: 12,
        perLevel: 0.15,
        unit: "%",
      },
      {
        name: "Attack Damage",
        base: 25,
        perLevel: 0.4,
      },
    ],
    unique: {
      name: "Enslave Undead",
      description: "Units you kill are raised as undead. Every 8 seconds, they unleash a 350 radius area attack, dealing 100% damage.Lasts 15 seconds. Maximum enslaved units: 2.",
    },
    upgrades: [
      {
        level: 10,
        name: "Trap Force",
        description: "+2s to all summon durations",
        note: "Applies to summons from other sources, but some summons are not affected",
      },
      {
        level: 20,
        name: "Tethering Force",
        description: "When Enslave Undead reaches its max count, a random undead has its attack cooldown reduced by 2s, and its next attack deals additional 30% damage",
        note: "An undead bound by souls does not expire until it makes an attack or you die, and its next attack will occur no sooner than 1 seconds later",
      },
      {
        level: 30,
        name: "Guiding Force",
        description: "Undead prioritize targets with low HP",
      },
      {
        level: 40,
        name: "Tribute to the Black Fertility Mother",
        description: "Killing a boss enemy spawns a more powerful undead.Increases the maximum number of enslaved units by one. This undead becomes a permanent boss-level follower that resets at the start of each round.",
        note: "Leader undead additionally inherit 30% of Attack Damage. If the max is already reached, it replaces a normal undead.",
      },
    ],
    flavor: "Fear not the grim shepherd, for it is they who tend your flock. You may not see them, nor know that they are there, but when your final bleating cries are heard, they will be there to guide you unto grander pastures.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "eagle-eye-ring",
    gameId: "item_artifact_eagle_eye_ring",
    name: "Hawk-Eye Ring",
    era: "middle",
    icon: "/artifacts/eagle-eye-ring.png",
    iconName: "eagle_eye_ring",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "Attack Damage",
        base: 50,
        perLevel: 0.8,
      },
    ],
    unique: {
      name: "Hawk-Eye Insight",
      description: "+30% final critical damage",
    },
    upgrades: [
      {
        level: 10,
        name: "Reveal",
        description: "+25% vision radius. Grants unobstructed vision within 450 range.",
      },
      {
        level: 20,
        name: "Hawk Vision",
        description: "After critical strike, gain True Sight on the target for 15s",
      },
      {
        level: 30,
        name: "Exposure",
        description: "Every 15s, mark the nearest enemy within 1000 radius, causing it to take additional 40% final critical damage",
      },
      {
        level: 40,
        name: "Fusion",
        description: "Once only, consume this Artifact to permanently gain 15% final critical damage",
      },
    ],
    flavor: "A ring passed down in the name of Gough the Eagle Eye, one of the Four Knights who served Gwyn, the Lord of the First Flame.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 10,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "arcanomatic-railgun",
    gameId: "item_artifact_arcanomatic_railgun",
    name: "Keen Cannon",
    era: "middle",
    icon: "/artifacts/arcanomatic-railgun.png",
    iconName: "arcanomatic_railgun",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "Attack Damage",
        base: 30,
        perLevel: 0.3,
      },
      {
        name: "Agility",
        base: 20,
        perLevel: 0.25,
      },
    ],
    unique: {
      name: "Charged Sniping",
      description: "+700 minimum Attack Range. Converts attacks into beams, firing one beam every 6 seconds at the target. Each beam hits all enemies in its path, dealing (200% + 100% ) damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Hyper-Energy Penetration",
        description: "-10% Charged Sniping damage decay",
      },
      {
        level: 20,
        name: "Hyper-Energy Piercing",
        description: "+16 Charged Sniping Armor Reduction",
      },
      {
        level: 30,
        name: "Overcharged",
        description: "After each cooldown cycle of Charged Sniping, gain additional 20% Attack Damage inheritance and 50 minimum Attack Range",
        note: "Up to 10 stacks",
      },
      {
        level: 40,
        name: "Energy Overload",
        description: "-1 seconds to minimum/maximum charge time. While at least 3 stacks of Overcharged, Charged Sniping gains additional 100 beam width and damage no longer decays.",
      },
    ],
    flavor: "Strictly speaking, it is neither a cannon nor particularly 'giant'. Yet its first shot pierced an entire mountain, and amid gasps of awe, the name stuck.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1500,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "keen-scope",
    gameId: "item_artifact_keen_scope",
    name: "Keen Scope",
    era: "middle",
    icon: "/artifacts/keen-scope.png",
    iconName: "keen_scope",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Cast Range",
        base: 180,
        perLevel: 2,
      },
      {
        name: "Spell AMP",
        base: 15,
        perLevel: 0.12,
        unit: "%",
      },
    ],
    unique: {
      name: "Lens",
      description: "For targeted abilities, final damage is increased by 3% for every 100 distance between you and the target.",
    },
    upgrades: [
      {
        level: 10,
        name: "Point-Blank Aim",
        description: "Lens always gains at least the bonus of 400 distance.",
      },
      {
        level: 20,
        name: "Long-Range Aim",
        description: "If the target is farther than 80% of the cast range, Lens treats the target as being an additional 400 units away",
      },
      {
        level: 30,
        name: "Aiming Assist",
        description: "Increases the cast range of targeted abilities by 20%.",
      },
      {
        level: 40,
        name: "Focus",
        description: "Consecutively casting unit-targeted abilities on the same target grants Lens bonus distance for its final distance calculation. Each cast adds 150 units, stacking up to 10 casts",
      },
    ],
    flavor: "The Keen are always inventing strange new gadgets. This scope, for instance, can spot the fuzz on a target’s face from three thousand yards away.",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "light-of-dawn",
    gameId: "item_artifact_light_of_dawn",
    name: "Light of Dawn",
    era: "middle",
    icon: "/artifacts/light-of-dawn.png",
    iconName: "light_of_dawn",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Health",
        base: 500,
        perLevel: 6,
      },
      {
        name: "Buff Duration",
        base: 10,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Rite of Light",
      description: "During Status, buff Duration granted by this Artifact have a 30% chance to gain 200% effectiveness.",
    },
    upgrades: [
      {
        level: 10,
        name: "Gift of Dawn",
        description: "Up to 1 time per Stage, when turns into , gain additional 2 After Act 3, each stack additionally grants 1",
      },
      {
        level: 20,
        name: "Blessing of Dawn",
        description: "When Rite of Light triggers, the target gains 18% damage reduction until the applied effect expires",
      },
      {
        level: 30,
        name: "Shield of Tomorrow",
        description: "For each active Blessing of Dawn on allied Heroes, you gain 15 per second",
        note: "The shield lasts until the end of the current Stage and can accumulate up to 25% of your Max HP",
      },
      {
        level: 40,
        name: "Step into Tomorrow",
        description: "Can be used to grant Status for this StageCooldown: 2 Stages",
        note: "This also affects other Abilities and can trigger Gift of Dawn, regardless of whether it is currently night",
      },
    ],
    flavor: "All blessings granted by daylight can be forged into armor of light, and at the end of the long night, dawn shall always come.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "lord-of-madness",
    gameId: "item_artifact_lord_of_madness",
    name: "Lord of Frenzy",
    era: "middle",
    icon: "/artifacts/lord-of-madness.png",
    iconName: "lord_of_madness",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Primary Attribute",
        base: 20,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Inject Frenzy",
      description: "The artifact can be toggled on or off. While active, it applies Burn to yourself each second equal to 185% of your primary attribute, while granting 50% Burn Resistance. Whenever you take Burn Damage, the prevented portion is emitted as Burn to enemies within 600 radius.",
    },
    upgrades: [
      {
        level: 10,
        name: "Tier One Resistance",
        description: "+10% Burn Resistance while Inject Frenzy is active",
      },
      {
        level: 20,
        name: "Tier Two Resistance",
        description: "Grants 30% Burn Resistance even while Inject Frenzy is inactive.",
      },
      {
        level: 30,
        name: "Tier Three Resistance",
        description: "Blocks Burn Damage equal to 2% of your Max Health.",
      },
      {
        level: 40,
        name: "Devotion",
        description: "The artifact can be activated a second time. All Burn applied to yourself and enemies is increased by 60%. Additionally, when your Burn Stacks exceeds 80% of your Max Health, gain an additional 25% Burn Resistance.",
      },
    ],
    flavor: "Why did he set himself on fire? I don't know. Maybe for the cause he believed in.",
    drop: {
      pool: "General",
      weight: 150,
      chance: 0.4936,
      waveFrom: 10,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "yulsarias-mantle",
    gameId: "item_artifact_yulsarias_mantle",
    name: "Mantle of Yulsaria",
    era: "middle",
    icon: "/artifacts/yulsarias-mantle.png",
    iconName: "yulsarias_mantle",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "Magic Armor",
        base: 20,
        perLevel: 0.2,
      },
      {
        name: "Mana",
        base: 25,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Frostmist",
      description: "Enemies within 800 range have their MS reduced by 20% and their Magic Armor reduced by 18.",
    },
    upgrades: [
      {
        level: 10,
        name: "Encasing Frost",
        description: "Magic Armor reduction of Frostmist is increased by 0.3× against Frozen or Stunned enemies.",
      },
      {
        level: 20,
        name: "Breath of Yulsaria",
        description: "Enemies entering Frostmist are Frozen for 2 seconds, each target has a 20 seconds cooldown",
      },
      {
        level: 30,
        name: "Permafrost",
        description: "For every 500 Max MP, Frostmist gains additional 1 Magic Armor reduction, up to a maximum of 30.",
      },
      {
        level: 40,
        name: "Great Frostseal",
        description: "Can be toggled. While active, Frostmist radius increases by 400 and Magic Armor reduction increases to 40, consuming 5% MP per second.",
      },
    ],
    flavor: "In an age now lost to time, the Frozen Witch Yulsaria ruled the whitelands, summoning blizzards and hail storms upon those who displeased her, while an army of ice golems roamed the lands to snuff out all warmth. In time, her southward expansion angered the Eldwurm Slyrak who, in his terrible rage, melted Yulsaria's armies with his endless flame before conquering the Frozen Witch herself. Now, centuries later, shifts in the ice have uncovered yet another shard of her empire: her frosty mantle.",
    cost: {
      dust: 45,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "nightfarer",
    gameId: "item_artifact_nightfarer",
    name: "Nightfarer",
    era: "middle",
    icon: "/artifacts/nightfarer.png",
    iconName: "nightfarer",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Health Regeneration",
        base: 16,
        perLevel: 0.2,
      },
      {
        name: "Health",
        base: 400,
        perLevel: 5,
      },
      {
        name: "Mana",
        base: 400,
        perLevel: 4,
      },
    ],
    unique: {
      name: "Scatter Reforge",
      description: "Killing an enemy restores 8% HP and 3% MP, reduces the cooldown of a random Ability by 0.75 seconds.Effect is multiplied by 2 during Status.",
    },
    upgrades: [
      {
        level: 10,
        name: "Dark Vision",
        description: "+500 night vision",
      },
      {
        level: 20,
        name: "Dark Harmony",
        description: "During Status, gain +30% HP Regeneration and 10%",
      },
      {
        level: 30,
        name: "Night Crossing",
        description: "For every 3 Stages ended at Status, gain random 1",
      },
      {
        level: 40,
        name: "Night Reign",
        description: "an be activated, usable 3 times per day, granting permanentStatus this game. Further uses require after reaching the daily limit.",
        note: "This also affects other abilities, and the effect persists even if the artifact is removed.",
      },
    ],
    flavor: "Woven from drifting strands of mist, forever cycling between dispersion and reformation.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1500,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "sovereign-of-the-azure-seas",
    gameId: "item_artifact_sovereign_of_the_azure_seas",
    name: "Ocean Ruler",
    era: "middle",
    icon: "/artifacts/sovereign-of-the-azure-seas.png",
    iconName: "sovereign_of_the_azure_seas",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Attack Damage",
        base: 70,
        perLevel: 1.5,
      },
    ],
    unique: {
      name: "Sea Return",
      description: "Your next attack deals a 230% Critical Strike and cleaves enemies in a large area in front for 100% damage. While in Water Terrain, this attack gains 40% Armor Penetration.",
    },
    upgrades: [
      {
        level: 10,
        name: "Dominance",
        description: "-2 seconds Sea Return's cooldown",
      },
      {
        level: 20,
        name: "No Recall",
        description: "Armor Penetration gained from Sea Return persists temporarily, decaying over 4 seconds.",
      },
      {
        level: 30,
        name: "Calamity Shift",
        description: "If under Water Terrain, No Recall applied to the primary target is propagated to enemies affected by the cleave prior to the cleave damage.",
      },
      {
        level: 40,
        name: "Present Break",
        description: "Sea Return creates a lingering slash line. After 1.5 seconds, enemies along the line are struck again for the same damage. This effect can hit the original target. Enemies within the slash path are Stalled while the effect persists.",
      },
    ],
    flavor: "If any blade could symbolize mastery over the ocean, it would be this one.",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "primordial-earth-heart",
    gameId: "item_artifact_primordial_earth_heart",
    name: "Primordial Earth Heart",
    era: "middle",
    icon: "/artifacts/primordial-earth-heart.png",
    iconName: "primordial_earth_heart",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Strength",
        base: 30,
        perLevel: 0.4,
      },
      {
        name: "Armor",
        base: 15,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Stoneskin",
      description: "As solid as bedrock, -130 Movement Speed, but gain 40% physical damage reduction and immunity to physical damage below 100.",
    },
    upgrades: [
      {
        level: 10,
        name: "Earth Attunement",
        description: "+25% model scale. For every 5% additional model scale, gain 1% Max HP",
      },
      {
        level: 20,
        name: "Highlands",
        description: "+40% slow resistance",
      },
      {
        level: 30,
        name: "Earth Stomp",
        description: "Every 6s, deal damage equal to 10% of your Max HP to enemies within a 350 radius beneath you",
        note: "Damage is further increased based on your model scale",
      },
      {
        level: 40,
        name: "Assimilation",
        description: "After Stoneskin takes effect, gain an additional 25% model scale. Stoneskin is replaced by , no longer reduces MS, and now can block 150 physical damage",
      },
    ],
    flavor: "You must understand—he is a myth. There has never been any proof, and it is not unreasonable to think it all a mess of foolish assumptions. So when the blasting slurry detonated ahead of schedule, shattering the supports, every crewman knew we were finished. The cavern groaned under its own weight; there was nowhere to go but down. Then the ground split. Jagged crystals burst from the fissures, rising toward the ceiling. We fled without shame—most with only minor wounds. I was the last to leave. And when I looked back… I will never forget that diamond-bright smile at the end of the tunnel, before the crystal faded and everything collapsed. No one else saw it, but… I know it was no illusion. He is still down there, somewhere. I know it. And while he remains, I will do all I can to repay him. — Report of a miner’s encounter with Tyre Gallem, from Planar Exiles",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "providence",
    gameId: "item_artifact_providence",
    name: "Providence",
    era: "middle",
    icon: "/artifacts/providence.png",
    iconName: "providence",
    maxLevel: 40,
    heroLevel: 10,
    stats: [
      {
        name: "Damage Reduction",
        base: 10,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Sanctuary",
      description: "Gain (100 + Hero level × 30) .The shield is restored 40 seconds after it is broken.",
    },
    upgrades: [
      {
        level: 10,
        name: "Undying",
        description: "-10 seconds Sanctuary restoration time",
      },
      {
        level: 20,
        name: "Dissent",
        description: "Enemy deaths within a 1000 radius increase the current Sanctuary shield value by 10%",
        note: "The shield value can be increased up to 300% of its initial value",
      },
      {
        level: 30,
        name: "Guardian Soul",
        description: "Once per Stage, block lethal damage and fully restore the Sanctuary shield",
      },
      {
        level: 40,
        name: "Providence",
        description: "Increase the Sanctuary shield value equal to (25% Max HP)/(25% Max MP)",
        note: "The higher value is applied",
      },
    ],
    flavor: "At the summit of the Sacred Mountain Aurélion, the first ray of sunlight on the anniversary of the Battle of Dawn pierces the crystal crown and reflects the blessing of the firmament upon this relic.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "rose-scepter",
    gameId: "item_artifact_rose_scepter",
    name: "Rose Scepter",
    era: "middle",
    icon: "/artifacts/rose-scepter.png",
    iconName: "rose_scepter",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Spell AMP",
        base: 15,
        perLevel: 0.1,
        unit: "%",
      },
      {
        name: "Intelligence",
        base: 20,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Poor Man's Rose",
      description: "Plants a rose at the target location that continuously releases toxic fumes, reducing the Magic Armor of nearby enemies and dealing damage over time.Duration: 15 secondsRadius: 500Magic Armor Reduction: 25Damage per Second: [300% + 8% Max Mana]",
    },
    upgrades: [],
    flavor: "The Poor Man’s Rose is a low-cost miniature weapon of mass destruction. Cheap to produce and devastating in effect, it is beloved by petty dictators and desperate nations alike.",
    drop: {
      pool: "General",
      weight: 100,
      chance: 0.3291,
      waveFrom: 6,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "malenias-winged-helm",
    gameId: "item_artifact_malenias_winged_helm",
    name: "Rotwing",
    era: "middle",
    icon: "/artifacts/malenias-winged-helm.png",
    iconName: "malenias_winged_helm",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "Health",
        base: 500,
        perLevel: 10,
      },
      {
        name: "Status Resistance",
        base: 25,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Crimson Curse",
      description: "+20% to all damageWhile in combat, gain 3 stacks of Crimson Decay per second. Killing an enemy removes 10 stacks. Death clears all stacks. Damage dealt per stack of Decay: 0.1%Extra damage taken per stack: 0.5%Maximum stacks: 300",
    },
    upgrades: [
      {
        level: 10,
        name: "Curse Resistance",
        description: "-0.15% additional damage taken per stack of Crimson Curse",
      },
      {
        level: 20,
        name: "Decaying Blossom",
        description: "1 times per Stage, when you take lethal damage, if Crimson Curse stacks exceed 100, remove all stacks, block this damage, and restore HP to 50%",
      },
      {
        level: 30,
        name: "Oath",
        description: "When HP falls below 25%, restore 10% HP, and increase the maximum stacks of Crimson Curse by 50%, stacking independently for 120sCooldown 5s",
      },
      {
        level: 40,
        name: "Obsession",
        description: "At the start of the Stage, gain 10 charges. Gain 1 Charge every 3 seconds. When you take damage, you may consume 1 Charge to negate the increased damage of Crimson Curse.",
      },
    ],
    flavor: "The Valkyries swore solemn oaths to oppose the spread of the God of Rot’s influence at any cost. The first true trial of their devotion was to draw the scarlet plague into their own bodies, wielding its unfathomable power to fight its very source.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 10,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "saintblood-twinblades",
    gameId: "item_artifact_saintblood_twinblades",
    name: "Saintblood Twinblades",
    era: "middle",
    icon: "/artifacts/saintblood-twinblades.png",
    iconName: "saintblood_twinblades",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Agility",
        base: 20,
        perLevel: 0.2,
      },
      {
        name: "Max Attack Speed",
        base: 40,
        perLevel: 0.3,
      },
    ],
    unique: {
      name: "Overture",
      description: "Odd-numbered attacks trigger , consuming 5% of your current HP and converting it into 150% bonus Attack Damage. Even-numbered attacks trigger , healing you for 20% of the attack's damage. When your HP is below 50%, both effects are amplified by 100%.Every 4 attack cycles, gain 1 stacks of Overture. The cycles required for each subsequent gain increase by 1.",
    },
    upgrades: [
      {
        level: 10,
        name: "Interlude",
        description: "+1% Attack Damage for every 3 stacks of Overture",
      },
      {
        level: 20,
        name: "Main Theme",
        description: "When Overture reaches 15 stacks, your base attack time is reduced by 0.1s",
      },
      {
        level: 30,
        name: "Variation",
        description: "splatters blood, sending Blood Mark to nearby enemies. Hitting a marked enemy with transfers 1 stacks of to another nearby enemy and deals bonus damage equal to Blood Mark Stacks × 10% of your Attack Damage. stacks independently and lasts 7s",
      },
      {
        level: 40,
        name: "Finale",
        description: "Taking lethal damage grants [Finale] for 3 seconds. During [Finale], you are immune to all damage, and attacks trigger both Amplifying Melodies. Once per stage.Fake Death can also trigger [Finale]. If already active, its duration is refreshed and extended. [Finale] can last up to 30 seconds per stage and cannot be extended while more than 6s remain",
      },
    ],
    flavor: "A bloodstained saint who murdered the very god she worshipped. Kind, selfless, and pure, she was deceived by a false god’s lies—only to be condemned by another, more hypocritical deity. Punished for the crime of deicide, she was twisted into an inhuman abomination...",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "staff-of-resurrection",
    gameId: "item_artifact_staff_of_resurrection",
    name: "Scepter of Rebirth",
    era: "middle",
    icon: "/artifacts/staff-of-resurrection.png",
    iconName: "staff_of_resurrection",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "Health",
        base: 600,
        perLevel: 8,
      },
      {
        name: "Mana",
        base: 600,
        perLevel: 8,
      },
    ],
    unique: {
      name: "Rebirth",
      description: "2 available per Match, 5 available per day. Spend 1800 gold to revive a Hero.",
    },
    upgrades: [
      {
        level: 10,
        name: "Restored State",
        description: "Rebirth refreshes all Ability and item cooldowns of the target",
      },
      {
        level: 20,
        name: "Blessing of Immortality",
        description: "Rebirth grants the target 15 until death",
      },
      {
        level: 30,
        name: "Authority of the Highborn",
        description: "Rebirth daily uses are increased to 10, and this Artifact no longer consumes Chrono Dust",
      },
      {
        level: 40,
        name: "Grace of the Sacred King",
        description: "The first 2 uses of Rebirth each day do not consume gold",
      },
    ],
    flavor: "The scepter whispers a requiem of a forgotten dynasty. Once the supreme symbol of the Twin Thrones, its power does not grant life, but reverses the flow of the River of Death, dragging souls back to their bodies.",
    drop: {
      pool: "General",
      weight: 900,
      chance: 2.9615,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "evil-serpent-of-the-abyss",
    gameId: "item_artifact_evil_serpent_of_the_abyss",
    name: "Serpent of the Abyss",
    era: "middle",
    icon: "/artifacts/evil-serpent-of-the-abyss.png",
    iconName: "evil_serpent_of_the_abyss",
    maxLevel: 40,
    heroLevel: 11,
    stats: [
      {
        name: "Health",
        base: 500,
        perLevel: 6,
      },
      {
        name: "Strength",
        base: 20,
        perLevel: 0.3,
      },
    ],
    unique: {
      name: "Abyssal Idol",
      description: "When you active Teleport/Blink-type Ability, release a fiery blast at the destination within a 400 radius, applying burning effect equal to (300 + 200% of Primary Attribute).",
    },
    upgrades: [
      {
        level: 10,
        name: "Abyssal Boon",
        description: "+15% cast range for Teleport/Blink-type Abilities",
      },
      {
        level: 20,
        name: "Abyssal Swiftness",
        description: "-15% cooldown for Teleport/Blink-type Abilities",
      },
      {
        level: 30,
        name: "Abyssal Ember",
        description: "Abyssal Idol leaves a burning zone on the ground for 4s, reducing burn damage decay by 65% within the area",
      },
      {
        level: 40,
        name: "Abyssal Decay",
        description: "Can be toggled. While active, Abyssal Ember duration is increased by 10s, and you are also afflicted with burning damage.This effect can be disabled at any time, otherwise it lasts until the end of the Stage. The Artifact is disabled for 1 Stages after this effect ends.",
      },
    ],
    flavor: "When the winged serpent’s eyes glow yellow, the seal still holds. When that light fades, you would do well to run, pray, or beg, even though none of it will save you.",
    cost: {
      dust: 45,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "shadow-of-subverter",
    gameId: "item_artifact_shadow_of_subverter",
    name: "Subverter Gloom",
    era: "middle",
    icon: "/artifacts/shadow-of-subverter.png",
    iconName: "shadow_of_subverter",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Health",
        base: 500,
        perLevel: 6,
      },
      {
        name: "All Attributes",
        base: 10,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Reverse",
      description: "Your final healing effect is reduced by 40%. Additionally, each time you heal, an energy wave with a radius of 350 is triggered centered on your heal target, dealing 125% of that heal amount as damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Never Die",
        description: "The healing reduction imposed by Reverse is weakened on low-health targets.",
      },
      {
        level: 20,
        name: "False Shield",
        description: "While healing, generates equal to 20% of healing amount, lasting until the end of the stage, up to 150% of max HP.",
      },
      {
        level: 30,
        name: "Living Undeath",
        description: "Can be used to reduce your HP to 1, preventing death for the next 6 seconds. Cooldown: 60 seconds. Triggers a Fake Death upon activation, which can be used to trigger certain death effects.",
      },
      {
        level: 40,
        name: "Undead March",
        description: "Each time you heal, there is a chance based on the healing amount to trigger on the target hero. Base chance: 10%. Each trigger reduces the chance by half, stacking independently for 70s.",
      },
    ],
    flavor: "A set meant for anyone trying to break reality's script. A former friend recalls the wearer as once being totally gentle. Chances are, the Abyss Sovereign's dirty work is behind it all.",
    drop: {
      pool: "General",
      weight: 150,
      chance: 0.4936,
      waveFrom: 10,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "tesla-cannon",
    gameId: "item_artifact_tesla_cannon",
    name: "Tesla Cannon",
    era: "middle",
    icon: "/artifacts/tesla-cannon.png",
    iconName: "tesla_cannon",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Attack Damage",
        base: 60,
        perLevel: 0.6,
      },
    ],
    unique: {
      name: "Hyper-Energy Blast",
      description: "The next attack deals 150%damage to enemies in a line, and hit enemies take an additional 25% damage after 5 seconds.",
    },
    upgrades: [
      {
        level: 10,
        name: "Precision Correction",
        description: "For every 100 distance from you, deal additional 3% bonus damage.",
      },
      {
        level: 20,
        name: "Shock Reset",
        description: "Hyper-Energy Blast damage on the target permanently increases by 5% each time, up to 60%",
      },
      {
        level: 30,
        name: "Light Strike",
        description: "Each attack has a 10% chance to trigger the Hyper-Energy Blast effect",
      },
      {
        level: 40,
        name: "Overload",
        description: "Can be activated, reducing Hyper-Energy Blast cooldown by 40%, increasing Light Strike trigger chance by 15%, but the generated rays have divergence",
      },
    ],
    flavor: "An energy weapon crafted from the ore of Thunder Mountain. Its pitch-black barrel possesses APEX energy conductivity, allowing energy to be output and radiated with almost no loss. The creator is unknown; it is said to be a deity, but there is no evidence to substantiate this—perhaps it is merely the self-deception of those dwarf craftsmen...",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "tyrant-kings-robe",
    gameId: "item_artifact_tyrant_kings_robe",
    name: "Tyrant’s Mantle",
    era: "middle",
    icon: "/artifacts/tyrant-kings-robe.png",
    iconName: "tyrant_kings_robe",
    maxLevel: 100,
    heroLevel: 12,
    stats: [
      {
        name: "Primary Attribute",
        base: 35,
        perLevel: 0.3,
      },
    ],
    unique: {
      name: "Tyranny",
      description: "For every 1 Stage carried, provides an additional 4 Primary Attributes bonus.",
    },
    upgrades: [
      {
        level: 10,
        name: "Intimidation",
        description: "The first damage dealt to you by an enemy has no effect",
      },
      {
        level: 20,
        name: "Eternal Reign",
        description: "Even after removing the Artifact, retains 50% of the bonus from Tyranny",
      },
      {
        level: 30,
        name: "Sovereign’s Rule",
        description: "The secondary bonuses granted by each point of your Primary Attribute are increased by 30%",
        note: "Does not grant Spell Amplification",
      },
      {
        level: 40,
        name: "Soothe Obsession",
        description: "Can be used, each time consuming 2000 gold to permanently gain secondary bonus from 5% Primary Attributes, after reaching 5 times it is no longer affected by Tyranny, and can be removed/used at any times.",
      },
    ],
    flavor: "The Hidden Church's collection is truly diverse... they even managed to acquire the mantle of a former tyrant king. Although that tyrant has vanished into the river of history, his former subjects would never allow 'commoners' to touch their king's belongings. But the Hidden Church cares not for such things; these items all flow into their black market.",
    cost: {
      dust: 45,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "voiceless-gaze",
    gameId: "item_artifact_voiceless_gaze",
    name: "Voiceless Gaze",
    era: "middle",
    icon: "/artifacts/voiceless-gaze.png",
    iconName: "voiceless_gaze",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Mana",
        base: 25,
        perLevel: 0.3,
        unit: "%",
      },
    ],
    unique: {
      name: "Voiceless Glimmer",
      description: "This Artifact can be toggled, forcing you into silence. While active, it deals damage equal to 8% of your maximum mana each second to enemies within 700 range. Once activated, it cannot be deactivated for 15 seconds unless you die.",
    },
    upgrades: [
      {
        level: 10,
        name: "Farsighted Gaze",
        description: "Increases the radius of Voiceless Glimmer to 20% of your vision range",
      },
      {
        level: 20,
        name: "Nearsighted Gaze",
        description: "Voiceless Glimmer deals 40% increased damage to the target you are attacking",
      },
      {
        level: 30,
        name: "Fleeting Glimpse",
        description: "Upon entering a stage, gain 1500 vision range. This bonus decays over time",
      },
      {
        level: 40,
        name: "Insight",
        description: "Voiceless Glimmer additionally affects the 2 lowest-health enemies within your vision range, treating them as targets of Nearsighted Gaze. If these targets are also within its normal radius, they are hit multiple times.",
      },
    ],
    flavor: "Silence does not mean having nothing to say; sometimes, silence itself speaks with deafening force.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 6,
      waveTo: 11,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 15,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "nihility-fulcrum",
    gameId: "item_artifact_nihility_fulcrum",
    name: "Void Anchor",
    era: "middle",
    icon: "/artifacts/nihility-fulcrum.png",
    iconName: "nihility_fulcrum",
    maxLevel: 40,
    heroLevel: 12,
    stats: [
      {
        name: "Final Spell AMP",
        base: 10,
        perLevel: 0.1,
        unit: "%",
      },
    ],
    unique: {
      name: "Void Return",
      description: "Every 10 seconds, deals damage equal to 25% of your highest single Ability damage in this Stage to up to 2 enemies within 900 radius.",
    },
    upgrades: [
      {
        level: 10,
        name: "Void Penetration",
        description: "Void Return damage ignores 25% Armor/Magic Armor Reduction",
      },
      {
        level: 20,
        name: "Void Annihilation",
        description: "Void Return deals 50% splash damage within 260 radius",
      },
      {
        level: 30,
        name: "Void Creation",
        description: "Once per Stage, this Artifact can be used to create a Void Anchor at a targeted location. Every 15 seconds, it applies Void Return to the nearest 1 visible enemies within 1800 range.",
      },
      {
        level: 40,
        name: "Void Fusion",
        description: "Void Return gains cooldown reduction equal to 40% of the last trigger’s source Ability cooldown reduction.",
      },
    ],
    flavor: "Void Shard is a substance formed from aether, lacking a fixed form and influenced by the user's characteristics; depending on the user, it exhibits entirely different properties. In this regard, this weapon has not fully utilized the advantages of Void Shard. Nevertheless, the creator of this weapon is a rare forge master, so this fixed property has been maximized.",
    drop: {
      pool: "General",
      weight: 100,
      chance: 0.3291,
      waveFrom: 6,
    },
    cost: {
      dust: 45,
      platinum: 1000,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "abyssal-avenger",
    gameId: "item_artifact_abyssal_avenger",
    name: "Abyssal Avenger",
    era: "post",
    icon: "/artifacts/abyssal-avenger.png",
    iconName: "abyssal_avenger",
    maxLevel: 60,
    heroLevel: 17,
    stats: [
      {
        name: "Attack Damage",
        base: 50,
        perLevel: 0.5,
      },
      {
        name: "Melee Attack Range",
        base: 120,
        perLevel: 2,
      },
    ],
    unique: {
      name: "Abyssal Maw",
      description: "Attacks slow the target's MS by 30% and reduce Armor by 8 for 4 seconds. While in Water Terrain, this Artifact grants 100% bonus Melee Attack Range.",
    },
    upgrades: [
      {
        level: 10,
        name: "Tidal Erosion",
        description: "Grants 3 seconds Abyssal Maw duration. Armor reduction increases by 1 /2 seconds, up to 10.",
      },
      {
        level: 20,
        name: "Abyssal Prison",
        description: "The first attack against an enemy grants 10 seconds to Abyssal Maw debuff duration and creates a water sphere that traps the target, preventing movement for 3 seconds. If the target dies while trapped, you gain for 15 sceconds.",
      },
      {
        level: 30,
        name: "Tidal Dominion",
        description: "While in , attacking enemies affected by Abyssal Maw shares 20% of the damage dealt with other enemies with the same debuff.",
        note: "This shared damage is applied once every 1 seconds.",
      },
      {
        level: 40,
        name: "Abyssal Descent",
        description: "2 times per day. Activate to assume a massive sea monster form. In this form:· +50% Max HP, +30% Base Strength and Base Agility· Your attacks are always melee and deal 50% splash damage within 300 range· Intelligence reduced by 50%· No other transformations allowed· Leaving disables bonuses for 15 seconds",
        note: "Base Attack Range is set to 250. Removing this Artifact also removes this effect.",
      },
    ],
    flavor: "Your soul is but a single droplet within the boundless ocean of my power. Offer it willingly, be reborn within the abyssal vortex, and let your enemies find their doom therein.",
    drop: {
      pool: "Siltbreaker",
      weight: 250,
      chance: 41.6667,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 2500,
    },
    requiredDifficulty: 24,
    sources: [
      "Boss: Breaker",
    ],
  },
  {
    slug: "blighttouch-scepter",
    gameId: "item_artifact_blighttouch_scepter",
    name: "Blighttouch Scepter",
    era: "post",
    icon: "/artifacts/blighttouch-scepter.png",
    iconName: "blighttouch_scepter",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Intelligence",
        base: 30,
        perLevel: 0.3,
      },
      {
        name: "Poison Application",
        base: 15,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Blighttouch Parasite",
      description: "Enemies you afflict with Poison are marked by a Parasite. If a marked enemy maintains the highest Poison stacks for 3s, the Parasite awakens, pulling up to 4 marked enemies within 400 toward it.Affected enemies gain for 3s, slowing movement by 20% and Poison Decay by 15%, and activating Poison once. Secondary targets consume no Poison Stacks and use the primary target's stack count.Activation Ratio: 5%Activation Damage: 1200%",
    },
    upgrades: [
      {
        level: 10,
        name: "Deep Roots",
        description: "Entangled secondary targets transfer 5% of their Poison stacks to the primary target",
      },
      {
        level: 20,
        name: "Twisted Knots",
        description: "Tentacles bounce from secondary targets at an angle 1 times",
      },
      {
        level: 30,
        name: "Strangulation",
        description: "While lasts, activates Poison every 1s.Activation Ratio: 2%Activation Damage: 700%",
      },
      {
        level: 40,
        name: "Breeding Ground",
        description: "When the primary target dies, 30% of its remaining Poison stacks are distributed among entangled targets",
      },
    ],
    flavor: "That fell venom shall not merely abide within the flesh. It shall take root and blossom, seeking out the soul most grievously corrupted, and drawing all other wretches into the very heart of decay.",
    drop: {
      pool: "General",
      weight: 30,
      chance: 0.0987,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    requiredDifficulty: 37,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "slaimute",
    gameId: "item_artifact_slaimute",
    name: "Bloodbound Slymet",
    era: "post",
    icon: "/artifacts/slaimute.png",
    iconName: "slaimute",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Health",
        base: 600,
        perLevel: 6,
      },
      {
        name: "Health Regeneration",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Blood Barrier",
      description: "When HP is above 90%, excess blood is stored. When HP falls below 50%, stored blood is consumed to restore HP. Can store up to 500% of Max HP as blood. Resets at the start of each Stage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Blood Cushion",
        description: "For every 100% of Max HP stored as blood, gain 3 Armor",
      },
      {
        level: 20,
        name: "Autonomous Assault",
        description: "For every 100% of Max HP stored as blood, gain 1 Autonomous Assault. Each attacks once every 7 seconds, dealing 3% of current stored blood as damage.",
      },
      {
        level: 30,
        name: "Blood Compression",
        description: "Max storage increased to 1000%, and at the start of a Stage, grants blood equal to 40% Max HP",
      },
      {
        level: 40,
        name: "Pure Bloodbound",
        description: "Reduces 30% cost when Blood Barrier restores life. Each time blood is consumed, reduce the attack cooldown of all Autonomous Assault by 0.5 seconds, but attacks have a minimum cooldown of 1.5 seconds.",
      },
    ],
    flavor: "An artificial symbiote derived from a demonic core. Through an intricate process of arcane manipulation and bio-engineering, the Grand Archive’s Biotics Division succeeded in creating a symbiotic slime core, allowing a host creature to bond with it and generate endoplasm and an exoskeletal layer, protecting both the slime and its core from harm.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 1500,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "cosmic-aspect",
    gameId: "item_artifact_cosmic_aspect",
    name: "Cosmic Aspect",
    era: "post",
    icon: "/artifacts/cosmic-aspect.png",
    iconName: "cosmic_aspect",
    maxLevel: 50,
    heroLevel: 6,
    stats: [
      {
        name: "Summon AMP",
        base: 25,
        perLevel: 0.2,
        unit: "%",
      },
      {
        name: "All Attributes",
        base: 15,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Cosmic Warden",
      description: "Summon the Guardian, which possesses various special abilities. Until the wielder reaches level 17, this Artifact provides only 40% of its base bonuses, and the Guardian's attributes are reduced to 35% as well.",
    },
    upgrades: [
      {
        level: 10,
        name: "Immortal Ascension",
        description: "Each time the Warden dies, its attributes are increased by 10%, up to 10 times.",
      },
      {
        level: 20,
        name: "Cosmic Reversal",
        description: "The respawn time of Cosmic Warden is reduced to 13s. The first death in each stage will respawn with no delay",
      },
      {
        level: 30,
        name: "Interstellar Voyage",
        description: "After taking damage equal to 10% of its max HP, the Guardian reverts to its state 3s prior, dealing 15% of max HP as damage to enemies in range. Each time it recovers 60% of max HP by this effect, it counts as Immortal Ascension once",
        note: "Has a trigger interval of 5s",
      },
      {
        level: 40,
        name: "Cosmic Mystery",
        description: "After Immortal Ascension reaches its cap, it can continue to gain attribute bonuses, but each subsequent bonus gain is reduced to 4%.",
        note: "Max Bonus: 100%",
      },
    ],
    flavor: "For centuries, stargazers have been trying to explore the mysteries of the cosmos, and astrological research has also made rapid progress. During a routine assignment, a student at the Calatos Observatory spotted a strange creature. It looked like Roshan, but it could move freely through space.",
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "necromancers-robe",
    gameId: "item_artifact_necromancers_robe",
    name: "Crimson Robe",
    era: "post",
    icon: "/artifacts/necromancers-robe.png",
    iconName: "necromancers_robe",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Intelligence",
        base: 30,
        perLevel: 0.3,
      },
      {
        name: "Health",
        base: 400,
        perLevel: 4,
      },
      {
        name: "Mana",
        base: 400,
        perLevel: 4,
      },
    ],
    unique: {
      name: "Blood Price",
      description: "3% of the spell damage you deal is converted into Negative Energy, stacking independently for 15 seconds. When your HP/MP falls below 70%, you can use Negative Energy to restore.",
    },
    upgrades: [
      {
        level: 10,
        name: "Blood Hunt",
        description: "Converts an additional 30% Negative Energy when dealing damage to enemies with HP above 80%",
      },
      {
        level: 20,
        name: "Essence Conversion",
        description: "When Negative Energy decays naturally, each point restores 0.25 HP/MP",
      },
      {
        level: 30,
        name: "Negative Energy Release",
        description: "Locks onto up to 3 enemies within 1000 range, dealing 10% of accumulated Negative Energy as damage per second to them.",
      },
      {
        level: 40,
        name: "Primordial Blood",
        description: "Negative Energy does not expire, but for portions exceeding × 30 , it decays by 8% per second",
      },
    ],
    flavor: "A lingering stream of negative energy flows within this robe. Whenever powerful magic is channeled through it, the robe expels this energy in the form of dark smoke with scarlet veins.",
    cost: {
      dust: 60,
      platinum: 1200,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "shadow-of-the-darkmoon",
    gameId: "item_artifact_shadow_of_the_darkmoon",
    name: "Darkmoon Shadow",
    era: "post",
    icon: "/artifacts/shadow-of-the-darkmoon.png",
    iconName: "shadow_of_the_darkmoon",
    maxLevel: 60,
    heroLevel: 17,
    stats: [
      {
        name: "Intelligence",
        base: 30,
        perLevel: 0.3,
      },
      {
        name: "Mana",
        base: 400,
        perLevel: 4,
      },
      {
        name: "Armor",
        base: 8,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Darkmoon Shackles",
      description: "Manifest two arms that grasp enemies within a 1100 radius. Slows Movement Speed by 40 and deals 180 + 150% of your damage per second.",
    },
    upgrades: [
      {
        level: 10,
        name: "Eclipsing Breath",
        description: "Darkmoon Shackles gains 12% bonus damage per 1 seconds, up to 60%. This bonus resets when switching targets.",
      },
      {
        level: 20,
        name: "Moonshadow Spread",
        description: "Darkmoon Shackles radius is increased by an amount equal to 100%",
      },
      {
        level: 30,
        name: "Lunar Resonance",
        description: "Each Ability cast triggers Darkmoon Shackles, causing the arms to immediately deal 3 seconds worth of damage to grasp targets",
        note: "The cooldown applied by the triggering Ability cannot be reduced below 1 seconds",
      },
      {
        level: 40,
        name: "Lunar Crossing",
        description: "Darkmoon Shackles arms can now grasp the same target. Casting a single-target Ability creates 1 additional arm acting on the target.Duration: (4 + 75% of the Ability's base cooldown)",
        note: "A single target can be grasped by up to 5 additional arms, and the slow effect does not stack.",
      },
    ],
    flavor: "An extra pair of arms can be incredibly useful—unfortunately, they are terribly bad at hugging or shaking hands, unless you happen to enjoy the sensation of a thousand ice cubes slowly sliding down your spine.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "divine-sanction",
    gameId: "item_artifact_divine_sanction",
    name: "Divine Sanction",
    era: "post",
    icon: "/artifacts/divine-sanction.png",
    iconName: "divine_sanction",
    maxLevel: 60,
    heroLevel: 17,
    stats: [
      {
        name: "Intelligence",
        base: 40,
        perLevel: 0.4,
      },
      {
        name: "Cast Range",
        base: 200,
        perLevel: 2,
      },
    ],
    unique: {
      name: "The First Tome: Time Lockdown",
      description: "Has a 30 second quota. After each cast, the Ability's remaining cooldown is instantly reduced by 40%, and 175% of this portion is transferred for the Artifact to bear instead.",
    },
    upgrades: [
      {
        level: 10,
        name: "The Second Tome: Sacred Echo",
        description: "The more cooldown The First Tome: Time Lockdown bears, the faster its cooldown speed, up to 25% faster",
      },
      {
        level: 20,
        name: "The Third Tome: Endless Path",
        description: "+5s The First Tome: Time Lockdown duration. Restores 75% mana per ability cooldown completed.",
      },
      {
        level: 30,
        name: "The Fourth Tome: Eternal Flame Wings",
        description: "+5 seconds to The First Tome: Time Lockdown duration. 1 times per stage, when taking fatal damage, fully restores HP and mana.",
      },
      {
        level: 40,
        name: "The Fifth Tome: Perfect Casting",
        description: "When The First Tome: Time Lockdown is off cooldown, +20% area radius. Otherwise, +20% spell amplification.",
      },
    ],
    flavor: "This is a spear and also a special key, possessing a unique ability to open a small spiritual gate, allowing the wielder to temporarily summon a tome from a designated area of the Hall of Enlightenment. These tomes contain powerful sacred magic, capable of manifesting the essence of the knowledge or stories they carry. This manifestation may be a blessing applied to the wielder or a magical phenomenon affecting the surrounding area.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "bow-of-lucid-dreams",
    gameId: "item_artifact_bow_of_lucid_dreams",
    name: "Echo of Dreams",
    era: "post",
    icon: "/artifacts/bow-of-lucid-dreams.png",
    iconName: "bow_of_lucid_dreams",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "RangedAttack Range",
        base: 200,
        perLevel: 2,
      },
      {
        name: "Attack Damage",
        base: 50,
        perLevel: 0.8,
      },
    ],
    unique: {
      name: "Dreamweaving",
      description: "Creates a following dream illusion that attacks every 2.5 seconds, dealing 160% damage. The illusion is disabled while you are silenced or banished.",
    },
    upgrades: [
      {
        level: 10,
        name: "Lost Domain",
        description: "The illusion’s attacks reduce 3 Magic Armor, stacking independently for 20 seconds",
      },
      {
        level: 20,
        name: "Sharp Sense",
        description: "Attacks and casts have a 20/100% chance to command the illusion to attack",
      },
      {
        level: 30,
        name: "Dual Dream",
        description: "Creates No.2 illusion",
      },
      {
        level: 40,
        name: "Fallen Dreamscape",
        description: "While you are silenced or banished, the illusion no longer disappears and now creates 2 additional illusions.",
      },
    ],
    flavor: "From the bow comes a deeper chill and drowsiness—the echo of sinking into the dream realm.",
    drop: {
      pool: "General",
      weight: 700,
      chance: 2.3034,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "power-hammer",
    gameId: "item_artifact_power_hammer",
    name: "Force Maul",
    era: "post",
    icon: "/artifacts/power-hammer.png",
    iconName: "power_hammer",
    maxLevel: 60,
    heroLevel: 17,
    stats: [
      {
        name: "Attack Damage",
        base: 35,
        perLevel: 0.5,
      },
      {
        name: "Attack Damage",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Realm Breaker",
      description: "Your attack speed is reduced by 60%, but your attack damage is increased by 35%. Additionally, each attack emits a field that deals 75% split damage to up to 3 nearby enemies.",
    },
    upgrades: [
      {
        level: 10,
        name: "Wex Strike",
        description: "Every 6 seconds, increase your next attack damage by 50%.",
      },
      {
        level: 20,
        name: "Truth",
        description: "Wex Strike increases Realm Breaker radius by 200 and splits all enemies.",
      },
      {
        level: 30,
        name: "Loyalty",
        description: "Wex Strike is modified by base . For every 25 Strength, your attacks have a 1% chance to trigger its effect.",
      },
      {
        level: 40,
        name: "Millennial Glory",
        description: "Forged through countless battles, this war hammer grows stronger over time. For every 10 bosses killed, the damage bonus of Wex Strike permanently increases by 1%(+). Stacks up to 260%.",
      },
    ],
    flavor: "A product of technology at its peak. It stands as a symbol of loyalty made real.",
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "gaia",
    gameId: "item_artifact_gaia",
    name: "Gaia",
    era: "post",
    icon: "/artifacts/gaia.png",
    iconName: "gaia",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Intelligence",
        base: 30,
        perLevel: 0.4,
      },
      {
        name: "Area of Effect",
        base: 85,
        perLevel: 1,
      },
    ],
    unique: {
      name: "Terrain Reshape",
      description: "Passively creates an earthquake zone within 500 range. This zone slowly moves toward enemy areas at 200 units per second. Every second, it deals damage to enemies inside equal to 14% of their max mana and slows their movement speed by 30%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Gravity Tweak",
        description: "Each time you cast a spell, the earthquake zone becomes harder to move through. Movement slow increases by an additional 5%, stacking independently for 8 seconds, up to 20%.",
      },
      {
        level: 20,
        name: "Gravity",
        description: "Movement slow of Terrain Reshape lingers for an extra 4 seconds. When enemies are outside the zone, gravity pulls them in at 150 units per second.",
      },
      {
        level: 30,
        name: "Companion Star",
        description: "Creates a companion star that orbits you in an ellipse. Used for gravity effects, it can pull in enemies within 500 range. When it gets near an earthquake zone, it triggers a much stronger quake, increasing that zone's damage by up to 100%.",
      },
      {
        level: 40,
        name: "Astral Grip",
        description: "Consumes 5% of max mana per trigger and the companion star gets a 50 pull speed toward the quake's core. Independent stack, lasts 10 seconds. Keep the star within 100 of the center and the quake zone grows by 300%. Also, the longer hold that position, the harder the quake hits.",
      },
    ],
    flavor: "A massive sickle forged from the horn of a Moonhorn. Every few decades, the Moonhorn's horn naturally sheds to allow a larger new horn to grow. For generations, local residents have collected these horns to Forge sacred weapons and present them to heroes.",
    drop: {
      pool: "General",
      weight: 60,
      chance: 0.1974,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1500,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "gods-mercy",
    gameId: "item_artifact_gods_mercy",
    name: "God's Mercy",
    era: "post",
    icon: "/artifacts/gods-mercy.png",
    iconName: "gods_mercy",
    maxLevel: 60,
    heroLevel: 17,
    stats: [
      {
        name: "Strength",
        base: 40,
        perLevel: 0.5,
      },
      {
        name: "Armor",
        base: 15,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Wrath of Strife",
      description: "Reduces 35% of frontal physical damage taken from close range. After the total mitigated damage reaches [400 + 20% of your Max HP], petrifies enemies in front of you for 3.5 seconds and increase the Physical Damage they take by 70%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Hypocrisy",
        description: "+100 petrification width and +300 length",
      },
      {
        level: 20,
        name: "Face Off",
        description: "Increases the angle considered as frontal by 20. Also affects judgment for other abilities.",
      },
      {
        level: 30,
        name: "Divine Retribution",
        description: "After Wrath of Strife petrifies enemies, apply a 260% Critical Strike. This attack gains 160% bonus Attack Damage.",
      },
      {
        level: 40,
        name: "Trial",
        description: "Attacking enemies within the affected area of Wrath of Strife also triggers its effect. Cooldown: 15 seconds.",
      },
    ],
    flavor: "Trust not in the mercy of gods, for many find it more fearsome than mortal spite.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "god-slaying-emperor-blade",
    gameId: "item_artifact_god_slaying_emperor_blade",
    name: "Godslayer Blade",
    era: "post",
    icon: "/artifacts/god-slaying-emperor-blade.png",
    iconName: "god_slaying_emperor_blade",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Attack Damage",
        base: 120,
        perLevel: 2,
      },
    ],
    unique: {
      name: "Godslayer",
      description: "+20 Attack Armor Reduction",
    },
    upgrades: [
      {
        level: 10,
        name: "Inevitable",
        description: "The first attack against an enemy gains an additional 350 Attack Damage",
      },
      {
        level: 20,
        name: "Inescapable",
        description: "The first attack against an enemy always hits and applies Break, disabling passives for 3 seconds.",
      },
      {
        level: 30,
        name: "Irresistible",
        description: "The first attack against an enemy ignores all Armor",
      },
      {
        level: 40,
        name: "Irrevocable",
        description: "The first attack resets after 15 seconds",
      },
    ],
    flavor: "It is the sharpest of blades, capable of cleaving through enchanted armor. Even defenses reinforced to their absolute limits are stripped away before its edge.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "the-hat-of-moiret",
    gameId: "item_artifact_the_hat_of_moiret",
    name: "Hat of Moiret",
    era: "post",
    icon: "/artifacts/the-hat-of-moiret.png",
    iconName: "the_hat_of_moiret",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Spell AMP",
        base: 30,
        perLevel: 0.3,
        unit: "%",
      },
    ],
    unique: {
      name: "Foresight of Fate",
      description: "Spell damage has a 20% chance to be increased to 140%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Revelation of Fate",
        description: "Every 10 seconds, reveals an enemy and reduces its Magic Armor by 20 for 10 seconds",
        note: "Boss units are prioritized",
      },
      {
        level: 20,
        name: "Shear of Fate",
        description: "When dealing higher spell damage, the trigger chance of Foresight of Fate is increased to 50%",
        note: "This comparison uses values before spell amplification is applied",
      },
      {
        level: 30,
        name: "Favor of the Three",
        description: "The next failed chance-based event is converted into a success. Cooldown: 3–60 seconds, based on the chance.",
        note: "Not all chance-based events are affected, including this Artifact itself. The base chance of the target event must be at least 1%.",
      },
      {
        level: 40,
        name: "Omnivision",
        description: "Can be activated to increase its base bonus to 200% for the current Stage. After the effect ends, the Artifact is disabled for 1 Stages.",
      },
    ],
    flavor: "A hat blessed by Three Fates, granting its wearer the ability to glimpse a fleeting future.",
    drop: {
      pool: "General",
      weight: 400,
      chance: 1.3162,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "helmet-of-bayle",
    gameId: "item_artifact_helmet_of_bayle",
    name: "Helmet of Bayle",
    era: "post",
    icon: "/artifacts/helmet-of-bayle.png",
    iconName: "helmet_of_bayle",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Health",
        base: 15,
        perLevel: 0.15,
        unit: "%",
      },
      {
        name: "Magic Armor",
        base: 20,
        perLevel: 0.2,
      },
    ],
    unique: {
      name: "Tyranny",
      description: "Every 7 seconds, generate up to 5 lightning strikes hitting enemies within 1000 range, dealing 6% maximum HP damage. The lower the current HP, the shorter the strike interval.",
    },
    upgrades: [
      {
        level: 10,
        name: "Berserk",
        description: "For every 10% HP lost, increases Health Regeneration by 3%",
      },
      {
        level: 20,
        name: "Tenacity",
        description: "For every 10% HP lost, grants 2% damage reduction",
      },
      {
        level: 30,
        name: "Furious Destroyer",
        description: "After each instance of damage taken, accelerates the next Tyranny by 0.1 seconds",
        note: "There is still a minimum trigger interval",
      },
      {
        level: 40,
        name: "Wyrm's Wrath",
        description: "Can be activated to grant an additional 20% Max Health bonus, but your Max Health is capped at 30%.",
      },
    ],
    flavor: "A-Ahhhhhh… B...Bayle… You shall know...fear yet...Graaaaaargh! Bayle the Dread! You shall haunt me no longer!",
    drop: {
      pool: "General",
      weight: 60,
      chance: 0.1974,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 1200,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "houyis-bow",
    gameId: "item_artifact_houyis_bow",
    name: "Hou Yi’s Bow",
    era: "post",
    icon: "/artifacts/houyis-bow.png",
    iconName: "houyis_bow",
    maxLevel: 60,
    heroLevel: 17,
    stats: [
      {
        name: "RangedAttack Range",
        base: 250,
        perLevel: 2.5,
      },
      {
        name: "Agility",
        base: 40,
        perLevel: 0.5,
      },
    ],
    unique: {
      name: "Solar Strike",
      description: "Attacks fire into the sky. After 3s, they fall on enemies within 200% attack range at a rate of 5 arrows/s. deals 150% damage. When many are stored, their consumption speed and damage are increased.",
    },
    upgrades: [
      {
        level: 10,
        name: "Volley of Arrows",
        description: "Fires 8 when attacking a target for the first time.",
      },
      {
        level: 20,
        name: "Set Ablaze",
        description: "applies Burn equal to 80%",
      },
      {
        level: 30,
        name: "Sun Chaser",
        description: "During Status, +25% Burn application, and fall faster",
      },
      {
        level: 40,
        name: "Solar Radiance",
        description: "While under Status, the attack range bonus from Houyi's Bow is increased by +75% and you gain 2 passive effects:·When any enemy dies under Burn State, gain Status for 8s.·When Burn Stacks on any enemy within attack range reaches 20% of their max HP, gain Status",
      },
    ],
    flavor: "Since the dawn of creation, there were once ten suns in the sky. Hou Yi drew his bow and shot down nine fiery crows, leaving only a single Golden Sun—the true flame of the sun itself.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "jasper-daggers",
    gameId: "item_artifact_jasper_daggers",
    name: "Jade Dagger",
    era: "post",
    icon: "/artifacts/jasper-daggers.png",
    iconName: "jasper_daggers",
    maxLevel: 60,
    heroLevel: 17,
    stats: [
      {
        name: "Agility",
        base: 40,
        perLevel: 0.5,
      },
      {
        name: "Poison Damage",
        base: 10,
        perLevel: 0.1,
        unit: "%",
      },
    ],
    unique: {
      name: "Verdant Bite",
      description: "Attacks apply Poison equal to 300 + 150% .",
    },
    upgrades: [
      {
        level: 10,
        name: "Resistance Break",
        description: "Every 10 seconds, your next attack reduces the target's Poison decay by 50% for 5 seconds",
      },
      {
        level: 20,
        name: "Backstab",
        description: "When attacking from behind, Verdant Bite applies an additional 200% of Poison.",
      },
      {
        level: 30,
        name: "Funeral Rite",
        description: "When attacking an enemy from behind, activate Poison once. This effect has a 2-s cooldown per enemy.Activation Ratio: 7.5%Activation Damage: 2000%",
      },
      {
        level: 40,
        name: "Marked Weakness",
        description: "+25 angle considered as back",
      },
    ],
    flavor: "Many say the Jade Assembly are merely hired killers... But that is too simplistic a view. Lorlin Lasan's spy network offers many services — as long as the client can pay. Assassinations are merely the most popular among them.",
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "comets-luna-trail",
    gameId: "item_artifact_comets_luna_trail",
    name: "Meteor Leap",
    era: "post",
    icon: "/artifacts/comets-luna-trail.png",
    iconName: "comets_luna_trail",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Agility",
        base: 30,
        perLevel: 0.4,
      },
      {
        name: "Attack Damage",
        base: 40,
        perLevel: 0.5,
      },
    ],
    unique: {
      name: "Drifting Moon",
      description: "During combat, are generated and spin. These blades track enemies within an orbit radius of 200 – 1200, dealing 120% damage on hit.",
    },
    upgrades: [
      {
        level: 10,
        name: "Chasing Moon",
        description: "rotation speed increases by 8% per second, up to a maximum of 120%. Speed is reduced by 10% upon grazing an enemy.",
      },
      {
        level: 20,
        name: "Aegis Moon",
        description: "Each full revolution of Moon Glaives grants 2% damage reduction, up to a maximum of 50%. Each time damage is negated, this bonus is reduced by 10%.",
      },
      {
        level: 30,
        name: "Reclining Moon",
        description: "Before each full revolution, the first 1 instances of damage inherit attack effects.",
      },
      {
        level: 40,
        name: "New Moon",
        description: "Additional Moon Glaives are generated every 15 attacks or on each spell cast. Extra Glaives last 7 seconds, up to a maximum of 2.",
        note: "Extra Moon Glaives always orbit on an outer layer beyond the primary glaive and do not overlap.",
      },
    ],
    flavor: "A star-path instrument formed where a falling comet entwined with a waning moon. When moving swiftly, its silver axis turns with its shadow, tracing frost-laced arcs through the air.",
    drop: {
      pool: "General",
      weight: 700,
      chance: 2.3034,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
      "Shop",
    ],
  },
  {
    slug: "titanic-bulwark",
    gameId: "item_artifact_titanic_bulwark",
    name: "Mighty Greatshield",
    era: "post",
    icon: "/artifacts/titanic-bulwark.png",
    iconName: "titanic_bulwark",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Armor",
        base: 18,
        perLevel: 0.3,
      },
      {
        name: "Model Scale",
        base: 20,
        perLevel: 0.3,
        unit: "%",
      },
    ],
    unique: {
      name: "Mighty Physique",
      description: "Increases Strength by 15%, reduces Agility by 20%. Damage instances below 100% of your Strength are reduced by 40%.",
    },
    upgrades: [
      {
        level: 10,
        name: "Might",
        description: "+10% Max HP, +15% Health Regeneration",
      },
      {
        level: 20,
        name: "Mighty Force",
        description: "Every 3 seconds, deal 250% damage to enemies within 300 radius",
        note: "The effect radius also increases with your model size",
      },
      {
        level: 30,
        name: "Mighty Strength",
        description: "+2% of your Max HP as Mighty Force damage",
      },
      {
        level: 40,
        name: "Grand Might",
        description: "After not attacking for 20 seconds, trigger interval of Mighty Force is reduced by 1 seconds, Strength is increased by 20%",
      },
    ],
    flavor: "Those who wield the strength to move mountains will eventually become part of them. Your heartbeat echoes the pulse of the earth, and your breath turns into the gales that sweep the mountain passes.",
    drop: {
      pool: "General",
      weight: 700,
      chance: 2.3034,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 1200,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "twin-moon-blades",
    gameId: "item_artifact_twin_moon_blades",
    name: "Moonfire Blades",
    era: "post",
    icon: "/artifacts/twin-moon-blades.png",
    iconName: "twin_moon_blades",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Attack Damage",
        base: 40,
        perLevel: 0.5,
      },
      {
        name: "Spell AMP",
        base: 15,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Carian Sword Arts",
      description: "For every 5% Spell AMP, grants 3% bonus Attack Damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Moonlight",
        description: "Every 8 attacks, grants 30% of Max MP to your next attack damage",
      },
      {
        level: 20,
        name: "Flame Scorch",
        description: "From attack 4 onward, every 8 attacks deals 75% splash damage in 300 radius.",
      },
      {
        level: 30,
        name: "Mutual Genesis",
        description: "During Status, Moonlight has a 30% chance to also trigger Flame Scorch. During Status, Flame Scorch has the same chance to trigger Moonlight.",
      },
      {
        level: 40,
        name: "Moonfire Stance",
        description: "When Moonlight and Flame Scorch trigger simultaneously, both effects are amplified by 100%.",
      },
    ],
    flavor: "A Carian greatsword inlaid with glintstone. Moon and flame reside within, forever inseparable.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "paradox",
    gameId: "item_artifact_paradox",
    name: "Parallel Paradox",
    era: "post",
    icon: "/artifacts/paradox.png",
    iconName: "paradox",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Attack Damage",
        base: 60,
        perLevel: 1,
      },
      {
        name: "Cooldown Reduction",
        base: 8,
        perLevel: 0.1,
        unit: "%",
      },
    ],
    unique: {
      name: "Paradox Space",
      description: "Creates a remnant from another timeline that remains at its current location. Whenever you teleport or blink, the remnant casts Paradox Space to move to your previous position.",
    },
    upgrades: [
      {
        level: 10,
        name: "Void Break",
        description: "Paradox Space deals 120% Critical Damage.",
      },
      {
        level: 20,
        name: "Shadow Break",
        description: "Repeated Paradox Space hits increase the armor reduction by 3. Stacks independently for 4 seconds.",
      },
      {
        level: 30,
        name: "Time Break",
        description: "Creates a new remnant linked to your first remnant.",
      },
      {
        level: 40,
        name: "Realm Break",
        description: "You also cast Paradox Space toward the target.",
      },
    ],
    flavor: "Going into another timeline is risky… but it’s only for a few seconds here. And it’s never hurt anyone I didn’t intend to.",
    cost: {
      dust: 60,
      platinum: 1500,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "thousand-faced-mirage-currents",
    gameId: "item_artifact_thousand_faced_mirage_currents",
    name: "Phantom Flow",
    era: "post",
    icon: "/artifacts/thousand-faced-mirage-currents.png",
    iconName: "thousand_faced_mirage_currents",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Armor",
        base: 14,
        perLevel: 0.3,
      },
      {
        name: "Magic Armor",
        base: 20,
        perLevel: 0.3,
      },
    ],
    unique: {
      name: "Surging Flow",
      description: "While in Water Terrain, you and allied units within 300 gain 35% MS.",
    },
    upgrades: [
      {
        level: 10,
        name: "Riptide",
        description: "While in , you can command water currents to attack enemies, striking 3 targets once, or 1 targets with 2 hits. Cooldown: 6 seconds.",
        note: "Damage equals 1000% of your Armor. For every 3 Magic Armor you have, this damage increases by 1%.",
      },
      {
        level: 20,
        name: "Myriad Forms",
        description: "At the end of each Stage, gain 20% damage resistance against the damage type that dealt the most damage to you during that Stage.",
        note: "Damage types: Physical / Magic / Pure",
      },
      {
        level: 30,
        name: "All Are One",
        description: "While in , Myriad Forms applies as all-damage reduction.",
      },
      {
        level: 40,
        name: "Surging Flow",
        description: "4 times per day, this Artifact can be activated to permanently gain Status. After reaching the daily limit, further uses require .",
        note: "This also affects other skill effects. The bonus persists even if the Artifact is removed.",
      },
    ],
    flavor: "Where the tide’s murmur reaches, there lies dominion; where the waves cover, all becomes ocean.",
    drop: {
      pool: "General",
      weight: 700,
      chance: 2.3034,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "phoenix-feather",
    gameId: "item_artifact_phoenix_feather",
    name: "Phoenix Feather",
    era: "post",
    icon: "/artifacts/phoenix-feather.png",
    iconName: "phoenix_feather",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Health",
        base: 15,
        perLevel: 0.15,
        unit: "%",
      },
      {
        name: "Health Regeneration",
        base: 18,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Sun Ray",
      description: "Create a 600 heat zone which deals Burn damage equal to 12% of your max HP Burn. Closer enemies gain more stacks. This artifact can be activated to increase Burn damage by 75%, but you will also suffer 50% of that damage as burn effect.",
    },
    upgrades: [
      {
        level: 10,
        name: "Scorching Healing",
        description: "Burn damage you take heals other allies within range for 30% of that damage.",
      },
      {
        level: 20,
        name: "Falling Feather",
        description: "After taking a total of 250% of your max HP in damage from Burn, restore 1 HP Runes. Can occur up to 1 times every 2 stages. Damage still accumulates normally even during cooldown.",
      },
      {
        level: 30,
        name: "Advanced Nirvana",
        description: "Consume a Health Rune to respawn. Permanently gain +8 All Attributes.",
      },
      {
        level: 40,
        name: "Phoenix Remnant",
        description: "At the start of each stage, summon a Phoenix Remnant. The remnant casts Solar Beam toward the nearest visible enemy, applying Sun Ray Burn effect. The remnant is considered as a summon and inherits 150% of your health. It does not cost health to maintain. When a target attacked by the remnant dies, you are healed for 10% of your maximum health.",
      },
    ],
    flavor: "The darkest hour is just before dawn. And right before that tide-turning final stand, the despair hits hardest. One sacrifice can change the future. This blade almost begs its wielder to make that call.",
    drop: {
      pool: "General",
      weight: 50,
      chance: 0.1645,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 1200,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "primary-fulcrum",
    gameId: "item_artifact_primary_fulcrum",
    name: "Primordial Fulcrum",
    era: "post",
    icon: "/artifacts/primary-fulcrum.png",
    iconName: "primary_fulcrum",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Intelligence",
        base: 30,
        perLevel: 0.4,
      },
      {
        name: "Spell AMP",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Unstable Casting",
      description: "Grants 20%–40% additional cooldown. 20% of spell damage dealt is stored. After a 10 seconds delay, the next cast releases a radial shockwave, damaging enemies up to 800 away.",
    },
    upgrades: [
      {
        level: 10,
        name: "Inertial Field",
        description: "Unstable Casting applies a 50% Movement Speed slow for 2 seconds.",
      },
      {
        level: 20,
        name: "Dark Insight",
        description: "Unstable Casting grants unobstructed vision for 10 seconds and applies a permanent 15 Magic Armor reduction, once per enemy.",
      },
      {
        level: 30,
        name: "Dark Repulsion",
        description: "After Unstable Casting, you gain 80% damage reduction for 2 seconds",
      },
      {
        level: 40,
        name: "Primordial Singularity",
        description: "Can be activated to mark a location. Unstable Casting then converges on this location and pulls enemies toward it. The effect has a radius of 1200.",
        note: "Activating the Artifact again will remove the mark",
      },
    ],
    flavor: "A small faction of the Scholar of the Dark Dawn dedicated itself to researching the shadows between the stars and the spaces where light cannot reach. Most of them went mad, and the resulting experiments were nearly as unstable as the scholars themselves.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1500,
    },
    requiredDifficulty: 15,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "spuit-lance",
    gameId: "item_artifact_spuit_lance",
    name: "Spuit Lance",
    era: "post",
    icon: "/artifacts/spuit-lance.png",
    iconName: "spuit_lance",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Attack Damage",
        base: 70,
        perLevel: 1,
      },
      {
        name: "Health Regeneration",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
    ],
    unique: {
      name: "Bloodlust",
      description: "Gain 30% lifesteal on attack, and 20% of excess lifesteal becomes a physical damage shield.",
    },
    upgrades: [
      {
        level: 10,
        name: "Frenzy",
        description: "After stealing health equal to 50% of your Max Health, gain +50 Max Attack Speed. Resets at the end of the stage.",
      },
      {
        level: 20,
        name: "Bloodthirst",
        description: "Bloodlust gains 100%(x) increased lifesteal on the first 3 hits against each enemy.",
      },
      {
        level: 30,
        name: "Blood Frenzy",
        description: "Gain bonus Attack Damage equal to 5% of Lifesteal dealt in the last 10 seconds.",
        note: "Cannot exceed 500% of your Base Attack Damage.",
      },
      {
        level: 40,
        name: "Blood Bath",
        description: "Artifact can be switched. Activates Blood Bath. Drains 15% of Max Health per second. Frenzy grants +100 Max Attack Speed and 30% status resistance. Bloodlust lifesteal is increased to 60%.",
      },
    ],
    flavor: "A colossal lance forged in the likeness of a syringe. Its spearhead drinks the blood of those it impales, storing it within the hollow shaft before channeling it back to the wielder through embedded tubes.",
    cost: {
      dust: 60,
      platinum: 1500,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "fallen-star-blades",
    gameId: "item_artifact_fallen_star_blades",
    name: "Starfall Blades",
    era: "post",
    icon: "/artifacts/fallen-star-blades.png",
    iconName: "fallen_star_blades",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Strength",
        base: 30,
        perLevel: 0.3,
      },
      {
        name: "Slow Resistance",
        base: 30,
        perLevel: 0.4,
        unit: "%",
      },
    ],
    unique: {
      name: "Gravity Enchant",
      description: "Every 10 attacks, your next attack deals 180% splash damage within a 425 radius, pulls enemies toward the center, and slows Movement Speed by 50% for 1.5 seconds.",
    },
    upgrades: [
      {
        level: 10,
        name: "Weighted",
        description: "After Gravity Enchant triggers, gain complete slow resistance for 2 seconds",
      },
      {
        level: 20,
        name: "Gravity Aftermath",
        description: "Gravity Enchant creates a gravity field. Enemies within the area have their Movement Speed slowed by 20% and take 20% additional damage.",
      },
      {
        level: 30,
        name: "Imbalance",
        description: "Gravity Enchant attack counts continue to accumulate while on cooldown. Auto reload after 10 seconds without attacking.",
      },
      {
        level: 40,
        name: "Star Shatter",
        description: "Every 24 seconds, summon a gravity meteor that deals damage to enemies within 345 range. The damage is equal to 100% of the highest damage instance triggered by Gravity Enchant this run.",
      },
    ],
    flavor: "A low, pulsating gravitational hum whispers like the heartbeat of distant stars.",
    drop: {
      pool: "General",
      weight: 200,
      chance: 0.6581,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 1500,
    },
    requiredDifficulty: 12,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "start-sword",
    gameId: "item_artifact_start_sword",
    name: "Stellar Greatsword",
    era: "post",
    icon: "/artifacts/start-sword.png",
    iconName: "start_sword",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Attack Damage",
        base: 50,
        perLevel: 1,
      },
    ],
    unique: {
      name: "Stellar Energy",
      description: "Draws energy from the sun, moon, and stars. Each Stage grants +3% Attack Damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Steel Cleaver",
        description: "+30% Positive Armor Reduction",
      },
      {
        level: 20,
        name: "Energy Discharge",
        description: "Your next attack strikes up to 2 targets within 300 radius. Cooldown: 4 seconds.",
      },
      {
        level: 30,
        name: "Stellar Radiance",
        description: "In Stages that start at , Stellar Energy growth is increased by 100%",
        note: "Status cannot trigger this effect",
      },
      {
        level: 40,
        name: "Resonance",
        description: "2 times per day. When the Hero reaches level 5, activate to unlock 50% of its capabilities in advance. After reaching the daily limit, further uses require",
        note: "Growth earned before reaching the unlock level is restored when fully unlocked.",
      },
    ],
    flavor: "Star metal exists only in the polar regions. After absorbing the energy of the sun, moon, and stars without end, it emits a faint blue glow. Weapons forged from star metal can achieve a sharpness unattainable by any other material.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "daemonomicon",
    gameId: "item_artifact_daemonomicon",
    name: "Tome of the Fallen",
    era: "post",
    icon: "/artifacts/daemonomicon.png",
    iconName: "daemonomicon",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Summon AMP",
        base: 20,
        perLevel: 0.2,
        unit: "%",
      },
      {
        name: "All Attributes",
        base: 15,
        perLevel: 0.15,
      },
    ],
    unique: {
      name: "Soul Confluence",
      description: "After a summon takes lethal damage, it remains invulnerable for 5 seconds",
    },
    upgrades: [
      {
        level: 10,
        name: "Soul Endurance",
        description: "For each enemy that dies within 1000 radius around you, the duration of active Soul Confluence is extended by 1 seconds, up to 10 seconds.",
      },
      {
        level: 20,
        name: "Death Dominion",
        description: "Undead summons deal 30% additional damage, and summons under Soul Confluence are considered undead.",
      },
      {
        level: 30,
        name: "Legion of the Dead",
        description: "When an enemy dies within 1000 range of you, spawn a Death Warrior that lasts for 60 seconds, inheriting 50% of your Attack Damage. Up to 4 Death Warriors can exist at the same time.",
        note: "Death Warriors are uncontrollable, have no HP, take no damage, and do not trigger effects based on HP",
      },
      {
        level: 40,
        name: "Soul Convergence",
        description: "Legion of the Dead at max: empowers all Skeleton Warriors. Duration +5 seconds, Attack Damage +5% (max 150%).",
      },
    ],
    flavor: "Souls are like bubbles cast from the vast current of the world. Though they differ in size, all souls share the same nature.",
    cost: {
      dust: 60,
    },
    sources: [
      "Code redemption",
    ],
  },
  {
    slug: "thunder-bolt",
    gameId: "item_artifact_thunder_bolt",
    name: "True Thunderbolt",
    era: "post",
    icon: "/artifacts/thunder-bolt.png",
    iconName: "thunder_bolt",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Intelligence",
        base: 35,
        perLevel: 0.4,
      },
      {
        name: "Attack Damage",
        base: 60,
        perLevel: 1,
      },
    ],
    unique: {
      name: "Lightning Call",
      description: "Attack additionally deals 600% damage.",
    },
    upgrades: [
      {
        level: 10,
        name: "Primal Decree",
        description: "Gain 1 Attack Speed per point of Spell AMP",
      },
      {
        level: 20,
        name: "Thunderclap",
        description: "Lightning Call becomes a 300 area effect.",
      },
      {
        level: 30,
        name: "Static Field",
        description: "Any Spell Damage deals additional damage equal to 8% of the target’s current HP (Bosses: 5%), capped at 1000% . Each Spell has a 3 seconds cooldown per target.",
      },
      {
        level: 40,
        name: "Tempest Wrath",
        description: "Lightning Call has a 30% chance to deal pure damage and deal 30% bonus damage.",
      },
    ],
    flavor: "Striding through the clouds and leaping between storms, the True Thunderbolt roams the skies, ever ready to smite the unjust in Zeus’s eyes.",
    cost: {
      dust: 60,
    },
    sources: [
      "Card pack",
    ],
  },
  {
    slug: "hand-of-the-valkyrie",
    gameId: "item_artifact_hand_of_the_valkyrie",
    name: "Valkyrie’s Arm",
    era: "post",
    icon: "/artifacts/hand-of-the-valkyrie.png",
    iconName: "hand_of_the_valkyrie",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Melee Attack Range",
        base: 100,
        perLevel: 1,
      },
      {
        name: "Max Attack Speed",
        base: 60,
        perLevel: 0.5,
      },
    ],
    unique: {
      name: "Waterfowl Dance",
      description: "Final Attack Damage reduced by 50%, grants 35% base Agility bonus.",
    },
    upgrades: [
      {
        level: 10,
        name: "Restorative Reprisal",
        description: "When attacked, there is a 20% chance to counterattack with a strike",
      },
      {
        level: 20,
        name: "Corruption",
        description: "After Waterfowl Dance triggers, target gains additional 3% Waterfowl Dance vulnerability, up to 30%",
      },
      {
        level: 30,
        name: "Blood Piercer",
        description: "Attack has a 10% chance to detonate Waterfowl Dance, removing only 30% of its accumulated value",
      },
      {
        level: 40,
        name: "Crimson Incarnation",
        description: "Every 7 seconds, an avatar splits off to attack enemies on a random path. Attack Speed affects this trigger interval.",
      },
    ],
    flavor: "In the endless struggle against the Crimson Rot, Valkyries often lose their limbs to its deadly plague. Forged of pure gold, these prosthetics are bestowed upon those who fight on through pain, allowing them to return to the battlefield with renewed fervor and formidable new weapons.",
    drop: {
      pool: "General",
      weight: 60,
      chance: 0.1974,
      waveFrom: 8,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    requiredDifficulty: 27,
    sources: [
      "Level reward",
    ],
  },
  {
    slug: "deaths-vigil",
    gameId: "item_artifact_deaths_vigil",
    name: "Vigil of Death",
    era: "post",
    icon: "/artifacts/deaths-vigil.png",
    iconName: "deaths_vigil",
    maxLevel: 40,
    heroLevel: 16,
    stats: [
      {
        name: "Summon Duration",
        base: 10,
        perLevel: 0.15,
        unit: "%",
      },
      {
        name: "Intelligence",
        base: 30,
        perLevel: 0.3,
      },
    ],
    unique: {
      name: "Pyre of Cremation",
      description: "When the summon disappears, it deals damage equal to the summon's 400 + 100% of its max health to enemies within 450.",
    },
    upgrades: [
      {
        level: 10,
        name: "Ashes of Death",
        description: "After Pyre of Cremation triggers, the cooldown of the summoning ability is reduced by 20%",
      },
      {
        level: 20,
        name: "Flame of Vigil",
        description: "Within the area affected by Pyre of Cremation, your summons gain a shield that absorbs damage equal to 50% of their HP.",
      },
      {
        level: 30,
        name: "Fire of Rebirth",
        description: "For the first 2 seconds after being summoned, summons gain 70% damage reduction",
      },
      {
        level: 40,
        name: "Vigil of Death",
        description: "Can be activated. While active, summons lose 20% of their Max HP every 2 seconds and trigger Pyre of Cremation at 60% effectiveness. This also applies to invulnerable summons, but the interval is increased to 4 seconds.",
      },
    ],
    flavor: "From the very first day of our existence, she was already there. Leaning against a silver-plated skull, she helped us find rebirth.She brought aid to the ailing. Not light, not brightness, not glory — but like embers, she shielded us from the cold of death. For those on the verge of dying, she offered a gentle farewell. The departed, under her care, left with a ring of sparkling embers, adorned with immaculate dignity. Others brought death — she burned it away. A practitioner’s wound, left on the dark blade; the scars she excised no longer troubled us. And so we lived, grew, and passed on under her watch, she bearing a double burden — both of penance and of solace. Who better to guard life than one who holds its end? Who better to reap life than one who knows its worth? — The Planar Exile",
    drop: {
      pool: "General",
      weight: 700,
      chance: 2.3034,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
  {
    slug: "baleful-banner",
    gameId: "item_artifact_baleful_banner",
    name: "Vile Shackles",
    era: "post",
    icon: "/artifacts/baleful-banner.png",
    iconName: "baleful_banner",
    maxLevel: 40,
    heroLevel: 17,
    stats: [
      {
        name: "Summon AMP",
        base: 22,
        perLevel: 0.2,
        unit: "%",
      },
      {
        name: "Health",
        base: 15,
        perLevel: 0.15,
        unit: "%",
      },
    ],
    unique: {
      name: "Soulbind Legion",
      description: "Losing 30% HP to summon Vile Soul which inherits 100% HP Lost, and its Attack Damage equal to 50% of its Max HP.Attack Interval: 4s. Damage:150%Attack Effect: -5 Magic Armor, stacking independently for 10s, up to 100%.Max Summons: 2Souls are invincible and persist until the end of the Stage (And the lost HP will be returned).",
    },
    upgrades: [
      {
        level: 10,
        name: "Soulbind",
        description: "When Vile Soul kills an enemy, it absorbs 1% of the target’s Max HP, up to 5% summoner’s Max HP per absorption.",
        note: "This increases Vile Soul's Max hp, thereby increasing its Attack Damage.",
      },
      {
        level: 20,
        name: "Affliction",
        description: "2% of damage dealt by Souls is converted into temporary HP for the summoner, up to a maximum of 3000, lasting until the end of the Round.",
      },
      {
        level: 30,
        name: "Shackles",
        description: "Souls within 300 receive 50% of temporary HP gained from Affliction.",
      },
      {
        level: 40,
        name: "Unshackle",
        description: "+1 max Vile Souls. You may continue summoning beyond the max; doing so will remove the oldest Vile Soul, then consumes HP again to summon a new one.",
        note: "New Vile Souls inherit the maximum HP gained by the previous Vile Soul through Shackles.",
      },
    ],
    flavor: "Forged from the bones and wreckage of battlefields where tens of thousands perished. The halberd’s shaft is entwined with the dry bones and shattered weapons of fallen soldiers, while the ghostly war banner hanging from its side is woven from the souls of the defeated, whispering dirges of war and death. The weapon pulses with the agony of bound spirits, glowing with a blood-red spectral light.",
    drop: {
      pool: "General",
      weight: 700,
      chance: 2.3034,
      waveFrom: 10,
    },
    cost: {
      dust: 60,
      platinum: 1000,
    },
    sources: [
      "Drops in runs",
    ],
  },
]
