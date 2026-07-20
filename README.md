# Aghanim's Labyrinth Compendium

A private review site for the Dota 2 arcade game *Aghanim's Labyrinth* — every hero's abilities,
relics, and a written review. The whole site sits behind one shared passphrase.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Locally the passphrases are `james` and `liam` — change them
before anyone else uses this.

## Environment

All of these are server-only. Never prefix them with `NEXT_PUBLIC_`.

| Variable | Purpose |
| --- | --- |
| `SITE_PASSWORD_JAMES` | James's passphrase. Signing in with it is what marks a take as his. |
| `SITE_PASSWORD_LIAM` | Liam's passphrase. Must differ from James's, or the gate refuses everyone. |
| `SESSION_SECRET` | Signs the session cookie. Changing it signs everyone out. |
| `DATABASE_URL` | Neon Postgres, for per-author takes. Unset, takes silently no-op and the rest of the site works. |

There is **one passphrase per person**, not one shared one — that's how the site knows whose take
it's saving. `SITE_PASSWORD` is the old shared variable; it still works as a fallback for James
(`app/actions/auth.ts:42`), but `SITE_PASSWORD_JAMES` overrides it when both are set, which is a
confusing way to lock yourself out. Set the per-author pair and delete the old one.

Generate a fresh secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## How the gate works

- `app/actions/auth.ts` — Server Action. Constant-time compare against both passphrases, rate
  limited per IP, then sets a `jose`-signed httpOnly cookie good for 30 days.
- `proxy.ts` — redirects any route other than `/` to the landing screen without a valid cookie.
  (Next 16 renamed `middleware.ts` to `proxy.ts`.)
- `lib/auth-guard.ts` — `requireSession()`, called at the top of each protected page. Server
  Functions can fall outside the proxy matcher, so pages verify for themselves too.

## Content

Two hand-written source files, both flat arrays with getters, so either can move to the database
later without changing call sites.

**Heroes are hand-written. Artifacts and relics are generated.**

`lib/heroes.ts` — the 63-hero Labyrinth roster, in the order the in-game picker shows them.
Portraits and turntable renders load from Valve's CDN, so no images need committing for the grid
to work. When this moves to a database, replace `getHeroes` / `getHero` / `heroesByAttribute` and
keep the `Hero` and `Ability` shapes.

`lib/artifacts.generated.ts` and `lib/relics.generated.ts` — 106 artifacts and 117 relics, read
straight out of the game's own files. **Never edit these by hand**; a regeneration overwrites
them. The hand-written `lib/artifacts.ts` / `lib/relics.ts` sit on top and hold the behaviour.

```bash
npm run catalogue:generate   # rewrite both generated files from the game files
npm run catalogue:icons      # extract artifact art (needs Source 2 Viewer)
npm run artifacts:check      # validate, and diff the committed data against the game
```

See [ARTIFACTS.md](ARTIFACTS.md) for how it works and what the sharp edges are.

Because the catalogue is all fact and none of it ours, opinions live in the database instead —
a comment per person per artifact or relic, next to the same per-author takes heroes have.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel — the framework preset is detected automatically.
3. Add `SITE_PASSWORD_JAMES`, `SITE_PASSWORD_LIAM` and `SESSION_SECRET` under Settings →
   Environment Variables, for all environments.

**The site is not protected until those variables exist in Vercel.** Without both passphrases the
gate refuses every attempt; without `SESSION_SECRET` pages error. Verify the gate against the live
URL after the first deploy.

## Not built yet

- Artifact icons — the data is complete, but the art needs a local Source 2 Viewer run.
- Talents on hero pages — the shape exists in `lib/heroes.ts`, the data doesn't.
- Relic icons, which are in the VPK but not yet extracted.
