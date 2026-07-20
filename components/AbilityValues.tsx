'use client'

import { useState } from 'react'

import { formatValueSpan, valueAtLevel, type AbilityTalent, type AbilityValue } from '@/lib/abilities'

import { RichText } from './RichText'

/**
 * The value block, with level tabs driving it.
 *
 * The artifact page uses a slider because an artifact runs to level 40 and its numbers come
 * from a growth formula. An ability has one, three or four levels and the game writes each one
 * out longhand -- so tabs, which show every stop at once and take a single click, beat a slider
 * you have to aim at.
 *
 * The full span stays visible beside each line, so the number is checkable rather than magic --
 * the same reasoning as keeping an artifact's per-level growth on screen.
 *
 * This is the only client island on the ability page; everything around it stays server
 * rendered, the same split ArtifactStats uses.
 */
export function AbilityValues({
  values,
  maxLevel,
  talents,
}: {
  values: AbilityValue[]
  /** 1, 3 or 4 -- per ability, and never an artifact's 40. */
  maxLevel: number
  talents: AbilityTalent[]
}) {
  const [level, setLevel] = useState(1)

  const talentText = new Map(talents.map((talent) => [talent.id, talent.text]))

  return (
    <div>
      {maxLevel > 1 && (
        <div className="mb-5 flex items-center gap-3">
          <span className="label shrink-0 text-[0.6rem] text-muted">Level</span>
          <div className="flex gap-1">
            {Array.from({ length: maxLevel }, (_, index) => index + 1).map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setLevel(step)}
                aria-pressed={step === level}
                className={`shard size-8 font-[family-name:var(--font-label)] text-sm tabular-nums transition-colors duration-200 ${
                  step === level
                    ? 'bg-[color-mix(in_srgb,var(--ice-glow)_30%,transparent)] text-frost'
                    : 'bg-[color-mix(in_srgb,var(--ice-deep)_55%,transparent)] text-muted hover:text-frost'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {values.map((value) => {
          const span = formatValueSpan(value)

          return (
            <li key={value.key}>
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="font-[family-name:var(--font-label)] text-xl text-glow tabular-nums">
                  {valueAtLevel(value, level)}
                  {value.unit ?? ''}
                </span>
                <span className="text-sm text-frost">{value.name}</span>

                {value.scalesWithAoe && (
                  <span className="label text-[0.5rem] text-muted">Scales with AoE</span>
                )}
                {value.isAttackDamage && (
                  <span className="label text-[0.5rem] text-muted">Attack damage</span>
                )}

                {span && (
                  <span className="flex items-baseline gap-x-2 border-l border-[var(--edge)] pl-3 text-xs tabular-nums">
                    <span className="text-glow">
                      {span}
                      {value.unit ?? ''}
                    </span>
                    <span className="text-muted">Per Level</span>
                  </span>
                )}
              </div>

              {/* Talents sit under the line they change, rather than in a list of their own
                  where you'd have to work out which number each one moves. */}
              {value.talents?.map((talent) =>
                talentText.has(talent.id) ? (
                  <p key={talent.id} className="mt-1 pl-1 text-xs leading-relaxed text-muted">
                    <RichText text={talentText.get(talent.id) ?? ''} />
                  </p>
                ) : null,
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
