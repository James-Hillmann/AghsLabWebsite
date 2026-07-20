'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { ERA_COLOR, type Artifact } from '@/lib/artifacts'

/**
 * One pedestal in the Archive. Square rather than the hero tile's portrait ratio, because
 * that's the shape the icons get extracted at.
 *
 * Unlike HeroTile, these go through the image optimizer -- they're our own 256px files, not
 * something Valve already serves at display size.
 *
 * Client-side because of the missing-icon fallback: the catalogue is generated from the game
 * files, but the icons are a separate extraction step, so a fresh checkout has data for 106
 * artifacts and art for none of them. Falling back to an era diamond keeps the grid readable
 * in between rather than showing 106 broken images.
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
  const [hasIcon, setHasIcon] = useState(true)
  const accent = ERA_COLOR[artifact.era]

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
        {hasIcon ? (
          <Image
            src={artifact.icon}
            alt=""
            width={256}
            height={256}
            loading="lazy"
            onError={() => setHasIcon(false)}
            className="h-full w-full object-cover brightness-[0.9] transition duration-200 group-hover:brightness-110"
          />
        ) : (
          <span
            aria-hidden
            className="size-5 rotate-45 opacity-30 transition-opacity duration-200 group-hover:opacity-60"
            style={{ backgroundColor: accent }}
          />
        )}
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
