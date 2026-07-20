import { ERAS, ERA_COLOR, ERA_NAME, artifactsByEra, type Artifact } from '@/lib/artifacts'

import { ArtifactTile } from './ArtifactTile'

/**
 * The Archive floor: one section per era, in rail order. Like the hero roster, searching
 * dims rather than filters, so every artifact keeps the position you learned it at.
 *
 * Empty eras still render their heading -- the Archive is meant to look incomplete while it
 * is, rather than pretending the Genesis Era doesn't exist until someone screenshots it.
 */
export function ArtifactGrid({
  artifacts,
  topMatchSlug,
  searching = false,
}: {
  artifacts: Artifact[]
  topMatchSlug?: string
  searching?: boolean
}) {
  const byEra = artifactsByEra(artifacts)

  return (
    <div className="space-y-12">
      {ERAS.map((era) => {
        const inEra = byEra[era]
        const accent = ERA_COLOR[era]

        return (
          <section key={era} id={`era-${era}`} className="scroll-mt-24">
            <header className="mb-4 flex items-baseline gap-3 border-b border-[var(--edge)] pb-2">
              <span aria-hidden className="size-2.5 rotate-45" style={{ backgroundColor: accent }} />
              <h2 className="label text-[0.95rem]" style={{ color: accent }}>
                {ERA_NAME[era]}
              </h2>
              <span className="ml-auto font-[family-name:var(--font-label)] text-sm text-muted tabular-nums">
                {inEra.length}
              </span>
            </header>

            {inEra.length ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-3 xl:grid-cols-[repeat(auto-fill,minmax(96px,1fr))] 2xl:grid-cols-[repeat(auto-fill,minmax(110px,1fr))]">
                {inEra.map((artifact) => (
                  <ArtifactTile
                    key={artifact.slug}
                    artifact={artifact}
                    isTopMatch={artifact.slug === topMatchSlug}
                    isDimmed={searching && artifact.slug !== topMatchSlug}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Nothing recorded from this era yet.</p>
            )}
          </section>
        )
      })}
    </div>
  )
}
