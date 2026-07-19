import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <p className="label text-[0.65rem] text-muted">Not found</p>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-frost sm:text-4xl">
        This corridor is a dead end
      </h1>

      <p className="max-w-sm text-sm leading-relaxed text-muted">
        Nothing lives at that address. The hero you&apos;re after may not be in the roster.
      </p>

      <Link
        href="/heroes"
        className="shard shard-edge label mt-2 bg-[color-mix(in_srgb,var(--ice-glow)_14%,transparent)] px-6 py-3 text-[0.65rem] text-frost transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--ice-glow)_26%,transparent)]"
        style={{ '--cut': '10px' } as React.CSSProperties}
      >
        Back to the roster
      </Link>
    </main>
  )
}
