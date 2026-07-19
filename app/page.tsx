import Image from 'next/image'
import { redirect } from 'next/navigation'

import { PasswordGate } from '@/components/PasswordGate'
import { hasSession } from '@/lib/auth-guard'

export default async function LandingPage() {
  // Already carrying a valid session -- no reason to ask again.
  if (await hasSession()) redirect('/heroes')

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="relative">
        {/* Backlight, so the wordmark reads as lit rather than pasted on. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 scale-150 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--ice-glow)_22%,transparent),transparent)] blur-2xl"
        />
        <Image
          src="/logo.png"
          alt="Aghanim's Labyrinth"
          width={405}
          height={164}
          priority
          // Source art is 405px wide -- don't upscale past it or the edges go soft.
          className="w-[min(22rem,78vw)] drop-shadow-[0_0_40px_color-mix(in_srgb,var(--ice-glow)_35%,transparent)]"
        />
      </div>

      <div className="max-w-md text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-tight text-frost sm:text-4xl">
          The Compendium
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Every hero, every ability, every relic — reviewed run by run.
        </p>
      </div>

      <PasswordGate />
    </main>
  )
}
