'use client'

import { useActionState, useEffect, useState } from 'react'

import { saveTake, type TakeState } from '@/app/actions/takes'
import { AUTHOR_COLOR, AUTHOR_NAME, type Author } from '@/lib/authors'
import { abilityIconUrl, type Hero } from '@/lib/heroes'
import { DIFFICULTIES, type Take } from '@/lib/takes'

const initialTakeState: TakeState = { error: null, savedAt: null }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="label text-[0.55rem] text-muted">{label}</p>
      <div className="mt-1.5 text-sm leading-relaxed text-frost">{children}</div>
    </div>
  )
}

function AbilityIcons({ hero, ids }: { hero: Hero; ids: string[] }) {
  const chosen = hero.abilities?.filter((a) => a.valveId && ids.includes(a.valveId)) ?? []
  if (!chosen.length) return null

  return (
    <ul className="mt-1.5 flex flex-wrap gap-2">
      {chosen.map((ability) => (
        <li key={ability.name} className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={abilityIconUrl(ability.valveId!)}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            className="shard size-7 shrink-0 shadow-[0_0_0_1px_var(--edge)]"
            style={{ '--cut': '4px' } as React.CSSProperties}
          />
          <span className="text-xs text-frost">{ability.name}</span>
        </li>
      ))}
    </ul>
  )
}

function ReadView({ hero, take, accent }: { hero: Hero; take: Take; accent: string }) {
  return (
    <>
      <div className="mt-4 flex items-end gap-5">
        <div>
          <p className="label text-[0.55rem] text-muted">Won on</p>
          <p
            className="font-[family-name:var(--font-display)] text-3xl leading-none font-light"
            style={{ color: accent }}
          >
            {take.difficulty ?? '—'}
          </p>
        </div>

        <div>
          <p className="label text-[0.55rem] text-muted">Rating</p>
          <p className="font-[family-name:var(--font-display)] text-3xl leading-none font-light text-frost tabular-nums">
            {take.rating ?? '—'}
            <span className="text-base text-muted">/10</span>
          </p>
        </div>
      </div>

      {take.verdict && (
        <p className="mt-5 border-l-2 pl-3 text-sm leading-relaxed text-frost italic" style={{ borderColor: accent }}>
          {take.verdict}
        </p>
      )}

      {take.buildNotes && (
        <Field label="Build">
          <span className="whitespace-pre-line">{take.buildNotes}</span>
        </Field>
      )}

      {take.keyAbilities.length > 0 && (
        <Field label="Play around">
          <AbilityIcons hero={hero} ids={take.keyAbilities} />
        </Field>
      )}

      {take.relics && <Field label="Relics &amp; items">{take.relics}</Field>}
    </>
  )
}

const inputStyle =
  'mt-1.5 w-full border-b border-[var(--edge)] bg-transparent pb-1.5 text-sm text-frost outline-none transition-colors duration-200 placeholder:text-[color-mix(in_srgb,var(--ice-muted)_55%,transparent)] focus:border-[var(--edge-lit)]'

function EditView({
  hero,
  take,
  accent,
  onDone,
}: {
  hero: Hero
  take: Take | null
  accent: string
  onDone: () => void
}) {
  const [state, formAction, pending] = useActionState(saveTake, initialTakeState)

  // Close the editor once the write actually lands, not when the button is pressed.
  useEffect(() => {
    if (state.savedAt) onDone()
  }, [state.savedAt, onDone])

  const withIds = hero.abilities?.filter((ability) => ability.valveId) ?? []

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="heroSlug" value={hero.slug} />

      <div className="flex gap-5">
        <label className="flex-1">
          <span className="label text-[0.55rem] text-muted">Highest difficulty won</span>
          <select
            name="difficulty"
            defaultValue={take?.difficulty ?? ''}
            className={`${inputStyle} [&>option]:bg-[var(--ice-deep)]`}
          >
            <option value="">Not yet</option>
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>

        <label className="w-24">
          <span className="label text-[0.55rem] text-muted">Rating</span>
          <input
            type="number"
            name="rating"
            min={1}
            max={10}
            step={1}
            defaultValue={take?.rating ?? ''}
            placeholder="1-10"
            className={`${inputStyle} tabular-nums`}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="label text-[0.55rem] text-muted">Verdict</span>
        <input
          type="text"
          name="verdict"
          defaultValue={take?.verdict ?? ''}
          placeholder="One line — would you pick it again?"
          className={inputStyle}
        />
      </label>

      <label className="mt-4 block">
        <span className="label text-[0.55rem] text-muted">Build</span>
        <textarea
          name="buildNotes"
          rows={5}
          defaultValue={take?.buildNotes ?? ''}
          placeholder="What you levelled, what you skipped, what felt best."
          className={`${inputStyle} resize-y leading-relaxed`}
        />
      </label>

      {withIds.length > 0 && (
        <fieldset className="mt-5">
          <legend className="label text-[0.55rem] text-muted">Abilities to play around</legend>
          <div className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {withIds.map((ability) => (
              <label key={ability.name} className="flex items-center gap-2 text-xs text-frost">
                <input
                  type="checkbox"
                  name="keyAbilities"
                  value={ability.valveId}
                  defaultChecked={take?.keyAbilities.includes(ability.valveId!)}
                  className="size-3.5 shrink-0 accent-[var(--ice-glow)]"
                />
                {ability.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className="mt-5 block">
        <span className="label text-[0.55rem] text-muted">Relics &amp; items</span>
        <input
          type="text"
          name="relics"
          defaultValue={take?.relics ?? ''}
          placeholder="The pickups that made it work."
          className={inputStyle}
        />
      </label>

      {state.error && (
        <p role="status" aria-live="polite" className="mt-4 text-xs text-[color-mix(in_srgb,var(--ice-glow)_70%,#fff)]">
          {state.error}
        </p>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="shard label px-5 py-2 text-[0.62rem] text-frost transition-colors duration-200 disabled:cursor-wait disabled:text-muted"
          style={
            {
              '--cut': '7px',
              backgroundColor: `color-mix(in srgb, ${accent} 18%, transparent)`,
            } as React.CSSProperties
          }
        >
          {pending ? 'Saving' : 'Save'}
        </button>

        <button
          type="button"
          onClick={onDone}
          className="label px-3 py-2 text-[0.62rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

/**
 * One person's opinion of one hero. Read-only unless it's your own card -- the Edit
 * button is hidden on the other person's, and the Server Action ignores whatever the
 * form claims and files the take under the session's author regardless.
 */
export function TakeCard({
  hero,
  author,
  take,
  editable,
}: {
  hero: Hero
  author: Author
  take: Take | null
  editable: boolean
}) {
  const [editing, setEditing] = useState(false)
  const accent = AUTHOR_COLOR[author]

  return (
    <article
      className="shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-6 py-5"
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      <header className="flex items-center gap-2.5 border-b border-[var(--edge)] pb-3">
        <span aria-hidden className="size-2 rotate-45" style={{ backgroundColor: accent }} />
        <h3 className="label text-[0.65rem]" style={{ color: accent }}>
          {AUTHOR_NAME[author]}
        </h3>

        {editable && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="label ml-auto text-[0.58rem] text-muted transition-colors duration-200 hover:text-frost"
          >
            {take ? 'Edit' : 'Write one'}
          </button>
        )}
      </header>

      {editing ? (
        <EditView hero={hero} take={take} accent={accent} onDone={() => setEditing(false)} />
      ) : take ? (
        <ReadView hero={hero} take={take} accent={accent} />
      ) : (
        <p className="mt-5 text-sm leading-relaxed text-muted">
          {editable
            ? `You haven't written up ${hero.name} yet.`
            : `${AUTHOR_NAME[author]} hasn't played ${hero.name} yet.`}
        </p>
      )}
    </article>
  )
}
