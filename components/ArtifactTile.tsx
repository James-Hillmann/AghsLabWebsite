import Link from 'next/link'

import { ERA_COLOR, type Artifact } from '@/lib/artifacts'

import { CatalogueIcon } from './CatalogueIcon'

/**
 * One pedestal in the Archive. Square rather than the hero tile's portrait ratio, because
 * that's the shape the icons get extracted at.
 *
 * Unlike HeroTile, these go through the image optimizer -- they're our own 512px files, not
 * something Valve already serves at display size. That requires artifacts/*.png to sit
 * outside the proxy's matcher; see the comment there for why.
 */
export function ArtifactTile({
  artifact,
  isTopMatch = false,
  isDimmed = false,
}: {
  artifact: Artifact
  isTopMatch?: boolean
  /** Searching dims everything except the one lit artifact. A dimmed tile is still a link. */
  isDimmed?: boolean
}) {
  return (
    <Link
      href={`/artifacts/${artifact.slug}`}
      title={artifact.name}
      data-top-match={isTopMatch || undefined}
      data-dimmed={isDimmed || undefined}
      // Tailwind's scale-* sets the `scale` property, not `transform` -- transition that
      // property by name or the hover snaps instead of easing.
      className="group relative block transition-[scale] duration-200 ease-out hover:z-20 hover:scale-[1.1] focus-visible:z-20 focus-visible:scale-[1.1] motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100"
    >
      <span
        className={`shard shard-edge relative flex aspect-square items-center justify-center overflow-hidden bg-[color-mix(in_srgb,var(--ice-deep)_60%,transparent)] transition-[opacity,filter,box-shadow] duration-200 ${
          isTopMatch ? 'shadow-[0_0_0_2px_var(--ice-glow)]' : ''
        } ${
          isDimmed
            ? 'opacity-25 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0'
            : ''
        }`}
        style={{ '--cut': '10px' } as React.CSSProperties}
      >
        <CatalogueIcon
          src={artifact.icon}
          accent={ERA_COLOR[artifact.era]}
          size={256}
          className="h-full w-full object-cover brightness-[0.9] transition duration-200 group-hover:brightness-110"
        />
      </span>

      <span
        className={`mt-1.5 block text-center text-[0.6rem] leading-tight transition-colors duration-200 2xl:text-[0.68rem] ${
          isTopMatch ? 'text-frost' : 'text-muted group-hover:text-frost'
        }`}
      >
        {artifact.name}
      </span>
    </Link>
  )
}
