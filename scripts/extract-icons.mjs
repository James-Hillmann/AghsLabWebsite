// Extracts artifact icons out of the game files into public/artifacts/.
//
//   npm run catalogue:icons
//
// This is the one step that needs an external tool. Artifact art is stored as .vtex_c --
// compiled, block-compressed textures -- so decoding it means Source 2 Viewer's CLI rather
// than anything reasonable to write here.
//
// Everything else in the pipeline is plain Node against the VPK; only pictures need this.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildCatalogue } from './lib/catalogue.mjs'
import { findGameVpk, SOURCE_FILES } from './lib/game-files.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'artifacts')

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

// The CLI mirrors the archive's directory structure under the output folder.
const extracted = path.join(staging, ...SOURCE_FILES.iconDir.split('/'))

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

try {
  // Files come out named after the texture, e.g. the_hat_of_moiret_png.png. The catalogue
  // knows each artifact's texture name, so this maps them onto slugs.
  const bySlug = new Map()
  for (const artifact of buildCatalogue().artifacts) {
    if (artifact.iconName) bySlug.set(artifact.iconName, artifact.slug)
  }

  console.log(`extracting ${bySlug.size} icons from ${SOURCE_FILES.iconDir} ...`)

  // One bulk pass for speed, since it usually gets most of the way.
  const clean = run(SOURCE_FILES.iconDir)

  const landed = () =>
    new Set(
      existsSync(extracted)
        ? readdirSync(extracted)
            .filter((file) => file.endsWith('.png'))
            .map((file) => file.replace(/_png\.png$/, '').replace(/\.png$/, ''))
        : [],
    )

  let have = landed()
  const missing = [...bySlug.keys()].filter((texture) => !have.has(texture))

  if (!clean && missing.length) {
    // Single-file runs are short-lived enough that the finalizer never gets a chance to fire.
    console.log(`bulk pass ended early; retrying ${missing.length} individually ...`)
    for (const texture of missing) {
      // Textures are stored with a _png suffix before the extension: the artifact's IconName
      // is "eden_anvil", the archive entry is "eden_anvil_png.vtex_c".
      run(`${SOURCE_FILES.iconDir}/${texture}_png.vtex_c`)
    }
    have = landed()
  }

  if (!existsSync(extracted)) {
    throw new Error(`the CLI wrote nothing to ${extracted} -- has the icon path changed?`)
  }

  mkdirSync(OUT, { recursive: true })

  let written = 0
  const unmatched = []

  for (const file of readdirSync(extracted)) {
    if (!file.endsWith('.png')) continue

    const texture = file.replace(/_png\.png$/, '').replace(/\.png$/, '')
    const slug = bySlug.get(texture)

    if (!slug) {
      unmatched.push(file)
      continue
    }

    renameSync(path.join(extracted, file), path.join(OUT, `${slug}.png`))
    written++
  }

  console.log(`\n${written} icons -> public/artifacts/`)

  const stillMissing = [...bySlug.values()].filter(
    (slug) => !existsSync(path.join(OUT, `${slug}.png`)),
  )
  if (stillMissing.length) {
    console.log(
      `${stillMissing.length} artifacts still have no art: ${stillMissing.slice(0, 8).join(', ')}`,
    )
  }
  if (unmatched.length) {
    // Not an error: the folder also holds UI chrome that no artifact references.
    console.log(`${unmatched.length} extracted files matched no artifact and were skipped.`)
  }
} finally {
  rmSync(staging, { recursive: true, force: true })
}
