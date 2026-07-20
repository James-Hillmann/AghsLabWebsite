// Extracts artifact and relic icons out of the game files into public/.
//
//   npm run catalogue:icons
//
// This is the one step that needs an external tool. The art is stored as .vtex_c --
// compiled, block-compressed textures -- so decoding it means Source 2 Viewer's CLI rather
// than anything reasonable to write here.
//
// Everything else in the pipeline is plain Node against the VPK; only pictures need this.

import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  renameSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildCatalogue } from './lib/catalogue.mjs'
import { findGameVpk, ICON_SETS } from './lib/game-files.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const DOWNLOAD = 'https://s2v.app/'

/** Where the CLI plausibly lives, beyond just being on PATH. */
const CLI_CANDIDATES = [
  process.env.SOURCE2VIEWER_CLI,
  'Source2Viewer-CLI',
  'Source2Viewer-CLI.exe',
  path.join(ROOT, 'tools', 'Source2Viewer-CLI.exe'),
  'C:/Tools/Source2Viewer-CLI.exe',
].filter(Boolean)

function findCli() {
  for (const candidate of CLI_CANDIDATES) {
    try {
      // --help exits 0 and proves the binary both exists and runs.
      execFileSync(candidate, ['--help'], { stdio: 'ignore' })
      return candidate
    } catch {
      continue
    }
  }
  return null
}

const cli = findCli()

if (!cli) {
  console.error('Source 2 Viewer CLI not found.\n')
  console.error(`Artifact icons are compiled textures, so extracting them needs that tool:`)
  console.error(`  ${DOWNLOAD}\n`)
  console.error('Download it, then either put Source2Viewer-CLI.exe on your PATH, drop it in')
  console.error('tools/ next to this repo, or point SOURCE2VIEWER_CLI at it.\n')
  console.error('Everything else still works without it -- the catalogue generates fine, and')
  console.error('artifacts without art fall back to an era diamond rather than a broken image.')
  process.exit(1)
}

const vpk = findGameVpk()
const staging = mkdtempSync(path.join(tmpdir(), 'aghslab-icons-'))

/**
 * Runs the CLI and reports whether it completed, without throwing.
 *
 * A nonzero exit is not treated as failure, because on some machines the tool dies in a
 * SkiaSharp finalizer -- `BadImageFormatException` out of the garbage collector -- *after*
 * writing perfectly good PNGs. That crash can also cut a bulk run short partway through the
 * alphabet, which is what the per-file retry pass below is for. What actually matters is
 * whether the files landed, so that's what gets checked.
 */
function run(filter) {
  try {
    execFileSync(cli, ['-i', vpk, '-o', staging, '--vpk_filepath', filter, '--vpk_decompile'], {
      stdio: 'ignore',
    })
    return true
  } catch {
    return false
  }
}

/**
 * Texture name -> the slugs that use it. Entries without art are skipped.
 *
 * A list rather than a single slug because sharing happens: three relics all draw the
 * `one_shot_kill` texture, and mapping texture->slug one-to-one silently left two of them
 * without a file.
 */
function iconTargets(entries) {
  const bySlug = new Map()
  for (const entry of entries) {
    if (!entry.iconName) continue
    if (!bySlug.has(entry.iconName)) bySlug.set(entry.iconName, [])
    bySlug.get(entry.iconName).push(entry.slug)
  }
  return bySlug
}

function extract({ kind, source, out }, bySlug) {
  // The CLI mirrors the archive's directory structure under the output folder.
  const staged = path.join(staging, ...source.split('/'))
  const outDir = path.join(ROOT, 'public', out)

  console.log(`\n${kind}s: extracting ${bySlug.size} icons from ${source} ...`)

  run(source)

  const landed = () =>
    new Set(
      existsSync(staged)
        ? readdirSync(staged)
            .filter((file) => file.endsWith('.png'))
            .map((file) => file.replace(/_png\.png$/, '').replace(/\.png$/, ''))
        : [],
    )

  const missing = [...bySlug.keys()].filter((texture) => !landed().has(texture))

  // Retried on what's missing rather than on the exit status: the finalizer crash can cut a
  // bulk run short while the process still exits 0, so a clean exit proves nothing.
  if (missing.length) {
    // Single-file runs are short-lived enough that the finalizer never gets a chance to fire.
    console.log(`  bulk pass left ${missing.length}; retrying individually ...`)
    for (const texture of missing) {
      // Textures carry a _png suffix before the extension: the IconName is "eden_anvil",
      // the archive entry is "eden_anvil_png.vtex_c".
      run(`${source}/${texture}_png.vtex_c`)
    }
  }

  if (!existsSync(staged)) {
    throw new Error(`the CLI wrote nothing to ${staged} -- has the ${kind} icon path changed?`)
  }

  mkdirSync(outDir, { recursive: true })

  let written = 0
  let unmatched = 0

  for (const file of readdirSync(staged)) {
    if (!file.endsWith('.png')) continue

    const texture = file.replace(/_png\.png$/, '').replace(/\.png$/, '')
    const slugs = bySlug.get(texture)

    // Not an error: these folders also hold UI chrome nothing in the catalogue references.
    if (!slugs) {
      unmatched++
      continue
    }

    // Copy for every slug but the last, then move -- shared textures need one file each.
    const from = path.join(staged, file)
    slugs.slice(0, -1).forEach((slug) => copyFileSync(from, path.join(outDir, `${slug}.png`)))
    renameSync(from, path.join(outDir, `${slugs[slugs.length - 1]}.png`))
    written += slugs.length
  }

  const stillMissing = [...bySlug.values()]
    .flat()
    .filter((slug) => !existsSync(path.join(outDir, `${slug}.png`)))

  console.log(`  ${written} icons -> public/${out}/`)
  if (stillMissing.length) {
    console.log(`  ${stillMissing.length} without art: ${stillMissing.slice(0, 6).join(', ')}`)
  }
  if (unmatched) console.log(`  ${unmatched} extracted files matched nothing and were skipped.`)
}

try {
  const { artifacts, relics } = buildCatalogue()
  const entriesFor = { artifact: artifacts, relic: relics }

  for (const set of ICON_SETS) {
    extract(set, iconTargets(entriesFor[set.kind]))
  }
} finally {
  rmSync(staging, { recursive: true, force: true })
}
