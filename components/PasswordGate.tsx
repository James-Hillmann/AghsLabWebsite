'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

import { enterSite, type GateState } from '@/app/actions/auth'

const initialState: GateState = { error: null }

function EnterButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="shard shard-edge label mt-5 w-full bg-[color-mix(in_srgb,var(--ice-glow)_14%,transparent)] py-3 text-[0.72rem] text-frost transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--ice-glow)_26%,transparent)] disabled:cursor-wait disabled:text-muted"
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      {pending ? 'Opening' : 'Enter'}
    </button>
  )
}

export function PasswordGate() {
  const [state, formAction] = useActionState(enterSite, initialState)
  const inputRef = useRef<HTMLInputElement>(null)

  // Clear the field and hand focus back so a retry is one keystroke away.
  useEffect(() => {
    if (state.error) {
      inputRef.current?.select()
      inputRef.current?.focus()
    }
  }, [state.error])

  return (
    <form action={formAction} className="w-full max-w-sm">
      <div
        key={state.error ?? 'clean'}
        className={`shard shard-edge bg-[color-mix(in_srgb,var(--ice-deep)_72%,transparent)] px-7 py-7 backdrop-blur-md ${
          state.error ? 'animate-[shake_420ms_ease-in-out]' : ''
        }`}
      >
        <label htmlFor="password" className="label block text-[0.65rem] text-muted">
          Passphrase
        </label>

        <input
          ref={inputRef}
          id="password"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          aria-describedby={state.error ? 'gate-error' : undefined}
          className="mt-3 w-full border-b border-[var(--edge)] bg-transparent pb-2 text-lg tracking-[0.12em] text-frost transition-colors duration-300 outline-none placeholder:text-[color-mix(in_srgb,var(--ice-muted)_55%,transparent)] focus:border-[var(--edge-lit)]"
          placeholder="••••••••"
        />

        <EnterButton />
      </div>

      <p
        id="gate-error"
        role="status"
        aria-live="polite"
        className="mt-4 min-h-[1.25rem] text-center text-sm text-[color-mix(in_srgb,var(--ice-glow)_70%,#fff)]"
      >
        {state.error}
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(2px); }
        }
      `}</style>
    </form>
  )
}
