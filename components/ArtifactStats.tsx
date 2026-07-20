'use client'

import { useState } from 'react'

import { statValue, type ArtifactStat } from '@/lib/artifacts'

/**
 * The stat block, with a level slider driving it.
 *
 * The whole reason artifacts store `base` and `perLevel` rather than a number copied off a
 * screenshot is so this can answer "what does it look like at 30?" -- the value shown in any
 * one tooltip is only true at the level that tooltip was captured at.
 *
 * The formula stays visible underneath each line rather than being hidden behind the result,
 * so the number is checkable instead of magic.
 *
 * This is the only client island on the artifact page; everything around it stays server
 * rendered, the same split HeroTabs uses.
 */
export function ArtifactStats({
  stats,
  maxLevel,
  initialLevel = 1,
}: {
  stats: ArtifactStat[]
  /** Per-artifact, not a constant -- caps run 40, 50, 60 and 100 across the Archive. */
  maxLevel: number
  initialLevel?: number
}) {
  const [level, setLevel] = useState(initialLevel)

  return (
    <div>
      <ul className="space-y-3">
        {stats.map((stat) => (
          <li key={stat.name} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-[family-name:var(--font-label)] text-xl text-glow tabular-nums">
              +{statValue(stat, level)}
              {stat.unit ?? ''}
            </span>
            <span className="text-sm text-frost">{stat.name}</span>
            <span className="ml-auto text-xs text-muted tabular-nums">
              {stat.base}
              {stat.unit ?? ''} +{stat.perLevel} / level
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-4">
        <label htmlFor="artifact-level" className="label shrink-0 text-[0.6rem] text-muted">
          Level
        </label>
        <input
          id="artifact-level"
          type="range"
          min={1}
          max={maxLevel}
          value={level}
          onChange={(event) => setLevel(Number(event.target.value))}
          className="h-1 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-[var(--edge)] accent-[var(--ice-glow)]"
        />
        <span className="w-8 shrink-0 text-right font-[family-name:var(--font-label)] text-sm text-frost tabular-nums">
          {level}
        </span>
      </div>
    </div>
  )
}
