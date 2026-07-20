'use client'

import Image from 'next/image'
import { useState } from 'react'

import { ERA_COLOR, type Artifact } from '@/lib/artifacts'

/**
 * An artifact's art, with a fallback for when it isn't on disk yet.
 *
 * The catalogue is generated from the game files, but icons are a separate extraction step
 * that needs Source 2 Viewer -- so a fresh checkout has data for every artifact and art for
 * none of them. An era-coloured diamond reads as "not extracted yet" rather than as a broken
 * image, and the page stays usable in between.
 */
export function ArtifactIcon({
  artifact,
  size,
  className = '',
}: {
  artifact: Artifact
  size: number
  className?: string
}) {
  const [hasIcon, setHasIcon] = useState(true)

  if (!hasIcon) {
    return (
      <span
        aria-hidden
        className={`flex items-center justify-center ${className}`}
        style={{ backgroundColor: 'color-mix(in srgb, var(--ice-deep) 60%, transparent)' }}
      >
        <span
          className="size-5 rotate-45 opacity-30"
          style={{ backgroundColor: ERA_COLOR[artifact.era] }}
        />
      </span>
    )
  }

  return (
    <Image
      src={artifact.icon}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setHasIcon(false)}
      className={className}
    />
  )
}
