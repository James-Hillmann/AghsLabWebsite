# The catalogue

`/artifacts` and `/relics` are generated from the game's own files, not written by hand. The
106 artifacts and 117 relics — their stats, level growth, effect text, costs and drop rates —
are read straight out of the workshop VPK.

That means **`lib/artifacts.generated.ts` and `lib/relics.generated.ts` are never edited by
hand.** Anything you type into them is gone at the next regeneration. Opinions go in the
comments box on each page, which lives in the database and can't be clobbered.

## Regenerating

After a game update:

```bash
npm run catalogue:generate   # rewrites both generated files
npm run artifacts:check      # validates, and diffs against the game files
```

The diff on the generated files is a readable changelog — you can see exactly which artifacts
Valve, or rather the mod team, actually touched.

The generator finds the game by scanning your Steam libraries for workshop item `2483181385`
(*Aghanim's Labyrinth III: Crisis of Infinite Dimensions*). If it lives somewhere unusual,
point `LABYRINTH_VPK` straight at the `.vpk`.

## Icons

```bash
npm run catalogue:icons
```

This is the only step needing an external tool. The art is stored as `.vtex_c` — compiled,
block-compressed textures — so decoding it needs [Source 2 Viewer](https://s2v.app/), from the
`cli-windows-x64.zip` asset on its releases page.

**Extract the whole zip, not just the .exe.** It ships four native DLLs alongside
`Source2Viewer-CLI.exe`, including `libSkiaSharp.dll`. Without them the tool still runs and
still writes *some* files, but every texture that needs real decoding fails with a
`BadImageFormatException` — which looks like a missing-icons problem rather than a missing-DLL
one. Put the whole folder's contents on your PATH, in `tools/`, or point `SOURCE2VIEWER_CLI`
at the exe.

One run does both catalogues: 106 artifact icons into `public/artifacts/` and 84 relic icons
into `public/relics/`.

Without the tool everything else still works — anything with no art falls back to a coloured
diamond rather than a broken image, so the site is usable with zero icons extracted.

## Where the data comes from

| Source | What it gives |
|---|---|
| `scripts/npc/items/item_player_artifact.kv` | stats, growth, costs, drop weights, level caps |
| `scripts/npc/spell_modify/spell_modify_relics.kv` | relic roll ranges and weights |
| `resource/addon_english.txt` | every name, effect, note and flavour line |
| `panorama/images/custom_game/aritfact/` | the Archive icons |
| `panorama/images/custom_game/relic/` | the relic icons |
| `panorama/images/interface/`, `panorama/images/bonus_level/` | five shared pictures that effect text embeds inline |

A few things worth knowing if you touch `scripts/lib/catalogue.mjs`:

- **Era is the `rarity` field**, 1–4, named by `Hud_Artifact_Level1`–`4`. It is not a rarity in
  the usual sense; `DustCost` tracks it exactly (15/30/45/60).
- **Effect text is templated.** `"%chance%%% chance"` resolves against the artifact's own
  `AbilityValues`. Named values must be substituted *before* `%%` collapses to a literal sign,
  or the placeholder stops matching.
- **Drop chance is computed**, not stored — an artifact's weight over its pool's total.
- **`MaxLevel` varies.** Mostly 40, but 50, 60 and 100 all occur. It is not a constant.
- **Relic `_min`/`_max` are worst-to-best quality, not numeric bounds.** For a cooldown the
  better roll is the smaller number, so those entries have `_min` above `_max`. `formatRoll`
  orders them for display; don't "fix" them in the data.
- The icon folder is spelled **`aritfact`** in the game. Match the typo.
- **A texture can serve several entries.** Three relics all draw `one_shot_kill`, so the
  extractor maps a texture to a *list* of slugs and writes a copy for each.
- **33 relics have no art at all.** The attribute ones carry no `Icon` field because the game
  draws them from a generic sprite; there is nothing to extract and the fallback is correct.
- **Effect text draws pictures inline**, and builds sentences around them — Eden Anvil's
  "converted into <shard>" reads as "converted into ." if the tag is stripped. `convertIcons`
  turns the two markups whose art the site has into `[[icon:path]]` markers: the five shared
  `<img src='file://{images}/...'>` textures, which land in `public/tooltip/`, and
  `<Panel class='ArtifactIcon …'>` / `RelictIcon` references to another catalogue entry, which
  reuse art already extracted. Those Panel classes name the entry's *texture*, not its id.
- **The tooltip textures are named, not derived**, in `ICON_SETS`, and pulled file by file:
  they sit in directories holding the game's whole UI, where a bulk decompile costs minutes and
  hundreds of stray PNGs. A new folder under `public/` also needs adding to the `proxy.ts`
  matcher, or `next/image` fetches it back through the passphrase gate and fails.

## Known limits

- **The Lua is encrypted** (`decryptModule("bea250bd…")`), so artifact behaviour scripts can't
  be read. Everything the site shows comes from the KV and localization files, so this costs
  nothing today — but it caps what could ever be extracted.
- **`item_artifact_unknow` is skipped.** It's the game's own placeholder row, which is why the
  catalogue has 106 artifacts and the KV has 107 entries.
- **Generic `<Panel>` sprites are dropped.** Attribute icons, `hd_poison`, `platinum` and
  ~50 others carry no `src`: the picture lives in a Panorama CSS rule, so recovering one means
  decompiling stylesheets, parsing `background-position`, cropping sprite sheets, and probably
  reaching into Dota's own `pak01_dir.vpk`. They're decorative reinforcement of text that reads
  correctly without them, which is why they stay dropped while the inline pictures do not.
- **The generator needs the game installed.** It's a regeneration step, not a build step — the
  generated files are committed, so deploys never touch the VPK.

## Screenshots

`screenshots/artifacts/tooltips/` still exists and is still worth using. Not as a data source
any more, but for spot-checking: open an artifact's page next to its in-game tooltip and the
numbers should agree exactly.
