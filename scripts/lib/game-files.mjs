// Finds the workshop VPK the catalogue is generated from, wherever Steam put it.
//
// The game is a custom game, not Valve content, so its assets are not in Dota's own
// pak01_dir.vpk -- they're in the workshop item below, downloaded per-library.

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

/** "Aghanim's Labyrinth III: Crisis of Infinite Dimensions". 570 is Dota 2's Steam app id. */
export const WORKSHOP_ID = '2483181385'
export const GAME_NAME = "Aghanim's Labyrinth III: Crisis of Infinite Dimensions"

/** Paths inside the VPK that the generator reads. */
export const SOURCE_FILES = {
  artifacts: 'scripts/npc/items/item_player_artifact.kv',
  relics: 'scripts/npc/spell_modify/spell_modify_relics.kv',
  english: 'resource/addon_english.txt',
  // The game misspells this directory. Matching the typo is required, not a mistake here.
  iconDir: 'panorama/images/custom_game/aritfact',
}

const DEFAULT_STEAM_PATHS = [
  'C:/Program Files (x86)/Steam',
  'C:/Program Files/Steam',
  process.env.HOME ? path.join(process.env.HOME, '.steam/steam') : null,
  process.env.HOME ? path.join(process.env.HOME, 'Library/Application Support/Steam') : null,
].filter(Boolean)

/** Every Steam library on this machine, read out of libraryfolders.vdf. */
export function steamLibraries() {
  const libraries = []

  for (const steam of DEFAULT_STEAM_PATHS) {
    const manifest = path.join(steam, 'steamapps', 'libraryfolders.vdf')
    if (!existsSync(manifest)) continue

    libraries.push(steam)
    // The file is KeyValues, but only the "path" entries matter and pulling them out with a
    // regex avoids depending on the parser for something this small.
    for (const match of readFileSync(manifest, 'utf8').matchAll(/"path"\s+"([^"]+)"/g)) {
      libraries.push(match[1].replace(/\\\\/g, '/'))
    }
  }

  return [...new Set(libraries)]
}

/**
 * @returns absolute path to the workshop VPK.
 * @throws with instructions if the game isn't installed on this machine.
 */
export function findGameVpk() {
  const override = process.env.LABYRINTH_VPK
  if (override) {
    if (!existsSync(override)) throw new Error(`LABYRINTH_VPK is set but ${override} does not exist`)
    return override
  }

  const searched = []

  for (const library of steamLibraries()) {
    const candidate = path.join(
      library, 'steamapps', 'workshop', 'content', '570', WORKSHOP_ID, `${WORKSHOP_ID}.vpk`,
    )
    searched.push(candidate)
    if (existsSync(candidate)) return candidate
  }

  throw new Error(
    `Could not find the game files.\n\n` +
      `Looking for workshop item ${WORKSHOP_ID} -- ${GAME_NAME}.\n` +
      `Subscribe to it in Dota's arcade and let Steam download it, then run this again.\n\n` +
      `Set LABYRINTH_VPK to point at the .vpk directly if it lives somewhere unusual.\n\n` +
      `Searched:\n${searched.map((p) => `  ${p}`).join('\n') || '  (no Steam libraries found)'}`,
  )
}
