import Link from 'next/link'

import { ActivateTome } from '@/components/ActivateTome'
import { SiteHeader } from '@/components/SiteHeader'
import { requireSession } from '@/lib/auth-guard'
import { formatPercent, getTomes, percentComplete, type Tome } from '@/lib/guidance'
import { getActiveTome, getAllCodes } from '@/lib/guidance-db'

function TomeCard({ tome, filled, active }: { tome: Tome; filled: number; active: boolean }) {
  const percent = percentComplete(filled, tome.total)
  const complete = filled >= tome.total

  return (
    <div
      className={`shard relative flex flex-col bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] transition-shadow duration-200 ${
        active ? 'shadow-[inset_0_0_0_1px_var(--edge-lit)]' : 'shard-edge'
      }`}
      style={{ '--cut': '12px' } as React.CSSProperties}
    >
      <Link href={`/guidance/${tome.slug}`} className="flex flex-1 flex-col px-6 pt-5 pb-4">
        <div className="flex items-start gap-3">
          <h2 className="flex-1 font-[family-name:var(--font-display)] text-2xl leading-tight font-light text-frost">
            {tome.name}
          </h2>
          {active && (
            <span className="label mt-1 shrink-0 text-[0.52rem] text-glow">Activated</span>
          )}
        </div>

        <p className="mt-auto pt-8">
          <span className="font-[family-name:var(--font-display)] text-3xl leading-none font-light text-frost tabular-nums">
            {filled}
          </span>
          <span className="text-base text-muted tabular-nums">/{tome.total}</span>
          <span className="label ml-3 text-[0.55rem] text-muted tabular-nums">
            {formatPercent(percent)}%
          </span>
        </p>

        {/* The game's own progress bar, reproduced: a plain slot fraction. */}
        <div
          className="mt-2.5 h-1 w-full bg-[color-mix(in_srgb,var(--ice-void)_70%,transparent)]"
          role="progressbar"
          aria-valuenow={filled}
          aria-valuemin={0}
          aria-valuemax={tome.total}
          aria-label={`${tome.name}: ${filled} of ${tome.total} slots`}
        >
          <div
            className="h-full bg-glow transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </Link>

      {/* Outside the Link -- a form can't legally nest inside an anchor. */}
      <div className="flex items-center justify-between border-t border-[var(--edge)] px-6 py-2.5">
        <span className="label text-[0.52rem] text-muted">
          {complete ? 'Complete' : `${tome.total - filled} to go`}
        </span>
        {!active && <ActivateTome tome={tome} />}
      </div>
    </div>
  )
}

export default async function GuidancePage() {
  await requireSession()

  const [codes, activeTome] = await Promise.all([getAllCodes(), getActiveTome()])

  const filledByTome = new Map<string, number>()
  for (const code of codes) {
    filledByTome.set(code.tomeSlug, (filledByTome.get(code.tomeSlug) ?? 0) + 1)
  }

  // The activated tome leads: it's the only one that can gain a slot, so it's the only one
  // you'll be adding to after tonight's games.
  const tomes = [...getTomes()].sort((a, b) => {
    if (a.slug === activeTome) return -1
    if (b.slug === activeTome) return 1
    return 0
  })

  const total = tomes.reduce((sum, tome) => sum + tome.total, 0)

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-frost sm:text-5xl">
          Path of Guidance
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Every win unlocks one random slot in the activated tome and hands you a code. Send it
          across, and you both open the same slot — two a game instead of one.
        </p>

        <p className="label mt-6 text-[0.55rem] text-muted tabular-nums">
          {codes.length} of {total} collected
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tomes.map((tome) => (
            <TomeCard
              key={tome.slug}
              tome={tome}
              filled={filledByTome.get(tome.slug) ?? 0}
              active={tome.slug === activeTome}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
