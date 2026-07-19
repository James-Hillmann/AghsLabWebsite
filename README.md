# Aghanim's Labyrinth Compendium

A private review site for the Dota 2 arcade game *Aghanim's Labyrinth* — every hero's abilities,
relics, and a written review. The whole site sits behind one shared passphrase.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `.env.local` ships with a development passphrase of `labyrinth`
and a generated signing secret — change the passphrase before anyone else uses it.

## Environment

Both variables are server-only. Never prefix them with `NEXT_PUBLIC_`.

| Variable | Purpose |
| --- | --- |
| `SITE_PASSWORD` | The passphrase typed on the landing screen. |
| `SESSION_SECRET` | Signs the session cookie. Changing it signs everyone out. |

Generate a fresh secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## How the gate works

- `app/actions/auth.ts` — Server Action. Constant-time compare against `SITE_PASSWORD`, rate
  limited per IP, then sets a `jose`-signed httpOnly cookie good for 30 days.
- `proxy.ts` — redirects any route other than `/` to the landing screen without a valid cookie.
  (Next 16 renamed `middleware.ts` to `proxy.ts`.)
- `lib/auth-guard.ts` — `requireSession()`, called at the top of each protected page. Server
  Functions can fall outside the proxy matcher, so pages verify for themselves too.

## Content

`lib/heroes.ts` is the single source of truth. It currently holds the **full Dota lineup** —
delete the rows for heroes the Labyrinth doesn't offer and the grid updates itself. Portraits load
from Valve's CDN, so no images need committing for the grid to work.

When this moves to a database, replace `getHeroes` / `getHero` / `heroesByAttribute` and keep the
`Hero`, `Ability` and `Relic` shapes.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel — the framework preset is detected automatically.
3. Add `SITE_PASSWORD` and `SESSION_SECRET` under Settings → Environment Variables, for all
   environments.

**The site is not protected until those variables exist in Vercel.** Without `SITE_PASSWORD` the
gate refuses every attempt; without `SESSION_SECRET` pages error. Verify the gate against the live
URL after the first deploy.

## Not built yet

- Hero detail pages (`/heroes/[slug]`) — tiles link there already.
- Database + in-browser review editor.
- Ability and relic icon uploads.
