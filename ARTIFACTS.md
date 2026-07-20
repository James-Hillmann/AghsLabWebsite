# The catalogue

`/artifacts`, `/relics` and every hero's abilities are generated from the game's own files, not
written by hand. The 106 artifacts, 117 relics and 373 hero abilities — their stats, level
growth, effect text, costs, drop rates and upgrades — are read straight out of the workshop VPK.

Artifacts and relics are catalogues you browse. Abilities aren't: they belong to a hero, so
they live at `/heroes/<hero>/<ability>` and are reached from that hero's page. There's no
abilities tab, and no index of them all.

That means **`lib/artifacts.generated.ts`, `lib/relics.generated.ts` and
`lib/abilities.generated.ts` are never edited by hand.** Anything you type into them is gone at
the next regeneration. Opinions go in the comment thread on each page, which lives in the
database and can't be clobbered.

## Regenerating

After a game update:

```bash
npm run catalogue:generate   # rewrites all three generated files
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

**Abilities are the exception: nothing is extracted for them.** Labyrinth reuses Valve's own
ability art, so an ability's `AbilityTextureName` is a Valve texture id and the page builds a
`cdn.cloudflare.steamstatic.com` URL from it via `abilityIconUrl()`. There is no
`public/abilities/`, and `catalogue:icons` doesn't touch them. The handful of genuinely custom
Labyrinth icons aren't on the CDN under any name and fall back to the diamond.

That also means **`proxy.ts` needs no `abilities/.*\.png` exclusion.** The ones there for
artifacts and relics exist because `next/image` re-fetches *local* files over HTTP without a
session cookie; a remote CDN source is fetched by the optimiser directly.

## Where the data comes from

| Source | What it gives |
|---|---|
| `scripts/npc/items/item_player_artifact.kv` | stats, growth, costs, drop weights, level caps |
| `scripts/npc/spell_modify/spell_modify_relics.kv` | relic roll ranges and weights |
| `scripts/npc/abilities/hero_abilities.kv` | hero abilities, and the talents they reference |
| `scripts/npc/abilities/hero_epic_upgrade.kv` | epic upgrades, attached to an ability by name |
| `scripts/npc/abilities/hero_ability_upgrade.kv` | shard upgrades, keyed on an ability and a value |
| `resource/addon_english.txt` | every name, effect, note and flavour line |
| `panorama/images/custom_game/aritfact/` | the Archive icons |
| `panorama/images/custom_game/relic/` | the relic icons |
| `panorama/images/interface/`, `panorama/images/bonus_level/` | five shared pictures that effect text embeds inline |

Artifacts and relics are parsed by `scripts/lib/catalogue.mjs`, abilities by
`scripts/lib/abilities.mjs`. The two share only their text handling, which lives in
`scripts/lib/text.mjs` — markup conversion and template resolution.

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

And for `scripts/lib/abilities.mjs`:

- **An ability's numbers are written out per level**, not as a growth formula:
  `"150 190 230 270"` is one value at four levels. There is no `base`/`perLevel` here, which is
  why the page shows level tabs rather than a slider.
- **`MaxLevel` is 1, 3 or 4** — never an artifact's 40. The checker bounds it deliberately, so
  the artifact model leaking across gets caught.
- **The game sometimes writes fewer numbers than levels.** Ember Spirit's Immolation is a
  4-level ability with three damage numbers. `valueAtLevel` holds the last one; don't pad the
  array, because the invented number would look exactly like a real one.
- **`hero_abilities.kv` has 944 rows and 373 abilities.** The rest are `special_bonus_*` talent
  rows and hidden generic placeholders. The predicate that separates them is a `ScriptFile`
  under `skills/HeroAbility/` *and* a name in the localization.
- **Talent numbers live on the ability, not the talent.** A talent row carries no values at all;
  the operand sits in the value it modifies, as `special_bonus_…: "+400"`, and the talent's
  string reads it back through `{s:bonus_<key>}`.
- **Shard upgrades have no localization whatsoever.** Every word of their text is derived: the
  label from the parent ability's tooltip string for that value key, and the ± direction
  *inferred* from the key via `REDUCED_BY_SHARD`. That inference is the one thing on the
  ability pages the data doesn't actually assert — worth re-checking in game after an update.
- The upgrade file's entry keys are misspelled **`upgade_*`** in the game. Match the typo, same
  rule as `aritfact`.
- **Hero display names exist in no game file.** `npc_dota_hero_ursa` is not a localization
  token. Names come from `lib/heroes.ts` in the wrapper, which is the only place the generated
  ability data touches the hand-written roster.
- **An ability has two identifiers, and they aren't interchangeable.** `slug`
  (`ursa-earthshock`) is globally unique and is what a comment thread is keyed on in the
  database, which knows nothing about routes. `path` (`earthshock`) is the segment under the
  hero and is only unique within that hero. Use `abilityHref()` rather than building either by
  hand. The prefix is stripped using the game's *directory* name, not the site's hero slug —
  Sand King's abilities are `hd_sandking_*` while the roster calls him `sand_king`.

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
- **Six placeholders name a value the game never defines**, listed one by one in
  `KNOWN_BAD_TOKENS`. Three are visible typos in the game's own strings
  (`magic_rmagic_armorsist`, `epic6_stun_duration`, `projectiles_per_stack`). They're dropped
  from the text rather than guessed at — substituting the number that *looks* intended would be
  inventing data. Anything not on that list still fails the build.
- **7 heroes have abilities but no roster entry** in `lib/heroes.ts` (Abaddon, Alchemist, Bane,
  Drow Ranger, Primal Beast, Vengeful Spirit, Warlock). Since abilities are reached through
  their hero and those heroes have no page, their ~34 abilities are now **unreachable by
  navigation** — the pages render if you type the URL, and nothing links to them. Adding the
  heroes to `HEROES` fixes it; that's hand-written roster content, so it hasn't been guessed at.
  Muerta is the reverse: on the roster, no abilities.
- **A few epic upgrades ship untranslated**, still in Chinese in `addon_english.txt`. They're
  passed through as-is; there's nothing else to show.
- **The generator needs the game installed.** It's a regeneration step, not a build step — the
  generated files are committed, so deploys never touch the VPK.

## Screenshots

`screenshots/artifacts/tooltips/` still exists and is still worth using. Not as a data source
any more, but for spot-checking: open an artifact's page next to its in-game tooltip and the
numbers should agree exactly.

For abilities the spot-check that matters most is a **shard upgrade's sign** — the page says
"Cooldown −7" because the key is a cooldown, not because the file says so.
