import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ActivateTome } from '@/components/ActivateTome'
import { CodeSlot } from '@/components/CodeSlot'
import { SiteHeader } from '@/components/SiteHeader'
import { requireSession } from '@/lib/auth-guard'
import { formatPercent, getTome, percentComplete } from '@/lib/guidance'
import { getActiveTome, getCodesForTome } from '@/lib/guidance-db'

export default async function TomePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireSession()

  const { slug } = await params
  const tome = getTome(slug)
  if (!tome) notFound()

  const [codes, activeTome] = await Promise.all([getCodesForTome(tome.slug), getActiveTome()])

  const active = tome.slug === activeTome
  const filled = codes.size
  const percent = percentComplete(filled, tome.total)

  // Every slot the tome has, in order -- the gaps are as informative as the codes.
  const slots = Array.from({ length: tome.total }, (_, i) => i + 1)

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <Link
          href="/guidance"
          className="label text-[0.6rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          &larr; All tomes
        </Link>

        <div className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-frost sm:text-5xl">
            {tome.name}
          </h1>
          {active && <span className="label pb-1.5 text-[0.55rem] text-glow">Activated</span>}
        </div>

        <p className="mt-4">
          <span className="font-[family-name:var(--font-display)] text-3xl leading-none font-light text-frost tabular-nums">
            {filled}
          </span>
          <span className="text-base text-muted tabular-nums">/{tome.total}</span>
          <span className="label ml-3 text-[0.55rem] text-muted tabular-nums">
            {formatPercent(percent)}%
          </span>
        </p>

        <div
          className="mt-2.5 h-1 w-full bg-[color-mix(in_srgb,var(--ice-void)_70%,transparent)]"
          role="progressbar"
          aria-valuenow={filled}
          aria-valuemin={0}
          aria-valuemax={tome.total}
          aria-label={`${filled} of ${tome.total} slots`}
        >
          <div className="h-full bg-glow transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>

        {!active && (
          <div
            className="shard mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-4 py-3"
            style={{ '--cut': '8px' } as React.CSSProperties}
          >
            <p className="flex-1 text-xs leading-relaxed text-muted">
              This tome isn&apos;t activated, so wins won&apos;t unlock anything in it.
            </p>
            <ActivateTome tome={tome} className="text-glow hover:text-frost" />
          </div>
        )}

        <p className="label mt-8 text-[0.55rem] text-muted">Click a code to copy it</p>

        <ul className="mt-2">
          {slots.map((slot) => (
            <CodeSlot key={slot} tome={tome} slot={slot} code={codes.get(slot) ?? null} />
          ))}
        </ul>
      </div>
    </main>
  )
}
