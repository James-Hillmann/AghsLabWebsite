import { type Talent } from '@/lib/heroes'

/**
 * The in-game tree is a ladder read bottom-up, but on a page that fights the reading
 * order, so this runs top-down with the highest level first -- the talents you're
 * actually choosing between late are the ones worth arguing about.
 *
 * Text only: Valve has no talent icons on the CDN, and the Labyrinth wording is ours.
 */
export function TalentTree({ talents }: { talents: Talent[] }) {
  const rungs = [...talents].sort((a, b) => b.level - a.level)

  return (
    <ul className="divide-y divide-[var(--edge)]">
      {rungs.map((talent) => (
        <li
          key={talent.level}
          className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 py-3"
        >
          <span className="text-right text-xs leading-relaxed text-frost">{talent.left}</span>

          <span
            className="shard label shrink-0 bg-[color-mix(in_srgb,var(--ice-glow)_12%,transparent)] px-2.5 py-1 text-[0.6rem] text-muted shadow-[0_0_0_1px_var(--edge)] tabular-nums"
            style={{ '--cut': '5px' } as React.CSSProperties}
          >
            {talent.level}
          </span>

          <span className="text-xs leading-relaxed text-frost">{talent.right}</span>
        </li>
      ))}
    </ul>
  )
}
