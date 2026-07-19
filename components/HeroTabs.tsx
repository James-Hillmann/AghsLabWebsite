'use client'

import { useState } from 'react'

/**
 * Facts and opinions are different kinds of claim, so they don't share a scroll.
 * Codex is what the hero *is*; Takes is what the two of us think of it.
 *
 * Both panels are rendered as props so the Codex stays server-rendered -- this
 * component only decides which one is on screen. The hidden panel keeps its DOM (and
 * so a half-typed take survives a tab switch) rather than unmounting.
 *
 * No background or `isolation` here: HeroModel's turntable relies on mix-blend-mode
 * reaching the page background, and an opaque ancestor would knock it out.
 */
export function HeroTabs({ codex, takes }: { codex: React.ReactNode; takes: React.ReactNode }) {
  const [tab, setTab] = useState<'codex' | 'takes'>('codex')

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Hero detail" className="flex gap-1">
        {(['codex', 'takes'] as const).map((name) => {
          const active = tab === name

          return (
            <button
              key={name}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`panel-${name}`}
              id={`tab-${name}`}
              onClick={() => setTab(name)}
              className={`shard label px-5 py-2 text-[0.62rem] transition-colors duration-200 ${
                active
                  ? 'bg-[color-mix(in_srgb,var(--ice-glow)_16%,transparent)] text-frost shadow-[inset_0_0_0_1px_var(--edge-lit)]'
                  : 'text-muted shadow-[inset_0_0_0_1px_var(--edge)] hover:text-frost'
              }`}
              style={{ '--cut': '7px' } as React.CSSProperties}
            >
              {name}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id="panel-codex" aria-labelledby="tab-codex" hidden={tab !== 'codex'}>
        {codex}
      </div>
      <div role="tabpanel" id="panel-takes" aria-labelledby="tab-takes" hidden={tab !== 'takes'}>
        {takes}
      </div>
    </div>
  )
}
