'use client'

import { useActionState, useEffect, useRef, useState } from 'react'

import { deleteGuidanceCode, saveGuidanceCode, type CodeState } from '@/app/actions/guidance'
import { AUTHOR_COLOR, AUTHOR_NAME } from '@/lib/authors'
import { type GuidanceCode, type Tome } from '@/lib/guidance'

const initialCodeState: CodeState = { error: null, savedAt: null }

/** How long "Copied" stays up before the row goes quiet again. */
const COPIED_MS = 1600

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden className={className}>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden className={className}>
      <path d="M4 12.5 9.5 18 20 7" />
    </svg>
  )
}

/**
 * The code itself, as one big target. Clicking anywhere on it copies -- the whole point of
 * the page is handing the string to the other person, so nothing else competes for the
 * click. Rendered in a mono face on purpose: these codes mix I/l/1 and O/0, and if a copy
 * ever fails you need to be able to read it off the screen and get it right.
 */
function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  async function copy() {
    if (timer.current) clearTimeout(timer.current)

    try {
      // Needs a secure context. Localhost and the deployed site both qualify, but guard
      // rather than throw so a stray http:// origin degrades to "select it yourself".
      if (!navigator.clipboard) throw new Error('no clipboard api')
      await navigator.clipboard.writeText(code)
      setState('copied')
    } catch {
      setState('failed')
    }

    timer.current = setTimeout(() => setState('idle'), COPIED_MS)
  }

  const copied = state === 'copied'

  return (
    <div className="min-w-0 flex-1">
      <button
        type="button"
        onClick={copy}
        title="Copy code"
        className={`shard group flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left transition-colors duration-200 ${
          copied
            ? 'bg-[color-mix(in_srgb,var(--ice-glow)_16%,transparent)]'
            : 'bg-[color-mix(in_srgb,var(--ice-deep)_60%,transparent)] hover:bg-[color-mix(in_srgb,var(--ice-glow)_9%,transparent)]'
        }`}
        style={{ '--cut': '7px' } as React.CSSProperties}
      >
        <code
          className={`min-w-0 flex-1 truncate font-mono text-[0.82rem] tracking-tight transition-colors duration-200 ${
            copied ? 'text-glow' : 'text-frost'
          }`}
        >
          {code}
        </code>

        <span
          className={`label flex shrink-0 items-center gap-1.5 text-[0.55rem] transition-colors duration-200 ${
            copied ? 'text-glow' : 'text-muted group-hover:text-frost'
          }`}
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </span>
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `Copied ${code}` : ''}
      </span>

      {state === 'failed' && (
        <p className="mt-1.5 text-xs text-muted">
          Couldn&apos;t reach the clipboard — select the code above and copy it manually.
        </p>
      )}
    </div>
  )
}

const inputStyle =
  'w-full border-b border-[var(--edge)] bg-transparent pb-1.5 font-mono text-sm text-frost outline-none transition-colors duration-200 placeholder:font-[family-name:var(--font-body)] placeholder:text-[color-mix(in_srgb,var(--ice-muted)_55%,transparent)] focus:border-[var(--edge-lit)]'

function CodeForm({
  tome,
  slot,
  code,
  onDone,
}: {
  tome: Tome
  slot: number
  code: GuidanceCode | null
  onDone: () => void
}) {
  const [state, formAction, pending] = useActionState(saveGuidanceCode, initialCodeState)
  const [clearState, clearAction, clearing] = useActionState(deleteGuidanceCode, initialCodeState)

  // Close once the write actually lands, not when the button is pressed.
  useEffect(() => {
    if (state.savedAt || clearState.savedAt) onDone()
  }, [state.savedAt, clearState.savedAt, onDone])

  const error = state.error ?? clearState.error

  return (
    <div className="min-w-0 flex-1">
      <form action={formAction} className="flex items-end gap-3">
        <input type="hidden" name="tomeSlug" value={tome.slug} />
        <input type="hidden" name="slot" value={slot} />

        <label className="min-w-0 flex-1">
          <span className="sr-only">Code for slot {slot}</span>
          <input
            type="text"
            name="code"
            defaultValue={code?.code ?? ''}
            placeholder={tome.prefix ? `${tome.prefix}…` : 'Paste the code'}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="shard label shrink-0 bg-[color-mix(in_srgb,var(--ice-glow)_18%,transparent)] px-4 py-2 text-[0.6rem] text-frost transition-colors duration-200 disabled:cursor-wait disabled:text-muted"
          style={{ '--cut': '6px' } as React.CSSProperties}
        >
          {pending ? 'Saving' : 'Save'}
        </button>

        <button
          type="button"
          onClick={onDone}
          className="label shrink-0 px-2 py-2 text-[0.6rem] text-muted transition-colors duration-200 hover:text-frost"
        >
          Cancel
        </button>
      </form>

      {error && (
        <p role="status" aria-live="polite" className="mt-2 text-xs text-[color-mix(in_srgb,var(--ice-glow)_70%,#fff)]">
          {error}
        </p>
      )}

      {code && (
        <form action={clearAction} className="mt-2">
          <input type="hidden" name="tomeSlug" value={tome.slug} />
          <input type="hidden" name="slot" value={slot} />
          <button
            type="submit"
            disabled={clearing}
            className="label text-[0.55rem] text-muted transition-colors duration-200 hover:text-frost disabled:cursor-wait"
          >
            {clearing ? 'Removing' : 'Remove this code'}
          </button>
        </form>
      )}
    </div>
  )
}

/**
 * One numbered slot in a tome: either an unlocked code you can hand over, or an empty
 * space waiting on a win. Both states are editable, since the codes were transcribed by
 * hand and a wrong character is otherwise unfixable without a redeploy.
 */
export function CodeSlot({ tome, slot, code }: { tome: Tome; slot: number; code: GuidanceCode | null }) {
  const [editing, setEditing] = useState(false)

  return (
    <li className="flex items-center gap-4 border-b border-[color-mix(in_srgb,var(--edge)_55%,transparent)] py-2.5 last:border-b-0">
      <span
        className={`w-7 shrink-0 text-right font-[family-name:var(--font-display)] text-lg leading-none font-light tabular-nums ${
          code ? 'text-frost' : 'text-[color-mix(in_srgb,var(--ice-muted)_60%,transparent)]'
        }`}
      >
        {slot}
      </span>

      {editing ? (
        <CodeForm tome={tome} slot={slot} code={code} onDone={() => setEditing(false)} />
      ) : code ? (
        <>
          <CopyButton code={code.code} />

          <span className="hidden shrink-0 items-center gap-2 sm:flex" title={`Added by ${AUTHOR_NAME[code.addedBy]}`}>
            <span aria-hidden className="size-1.5 rotate-45" style={{ backgroundColor: AUTHOR_COLOR[code.addedBy] }} />
            <span className="sr-only">Added by {AUTHOR_NAME[code.addedBy]}</span>
          </span>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="label shrink-0 text-[0.55rem] text-muted transition-colors duration-200 hover:text-frost"
          >
            Edit
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="label flex-1 cursor-pointer py-2 text-left text-[0.6rem] text-[color-mix(in_srgb,var(--ice-muted)_70%,transparent)] transition-colors duration-200 hover:text-frost"
        >
          Not unlocked — add code
        </button>
      )}
    </li>
  )
}
