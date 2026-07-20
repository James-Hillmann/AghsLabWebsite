'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Art for an artifact or a relic, with a fallback for when there isn't any.
 *
 * Two separate reasons a file can be absent, and both land here:
 *
 *  * Icons are extracted separately from the catalogue -- a fresh clone has data for
 *    everything and art for nothing until `npm run catalogue:icons` runs.
 *  * Attribute relics genuinely have no icon. The game draws them from a generic attribute
 *    sprite, so there is nothing in the VPK to extract.
 *
 * Either way a coloured diamond reads as "no art" rather than as a broken image, and the
 * onError path also covers an extraction that half-finished.
 */
export function CatalogueIcon({
  src,
  accent,
  size,
  className = '',
  fallbackClassName = '',
}: {
  src: string | null
  /** Era colour for artifacts, group colour for relics. */
  accent: string
  size: number
  className?: string
  /** Applied to the fallback instead of className, since it's a box rather than an image. */
  fallbackClassName?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <span
        aria-hidden
        className={`flex items-center justify-center bg-[color-mix(in_srgb,var(--ice-deep)_60%,transparent)] ${fallbackClassName || className}`}
      >
        <span className="size-1/4 rotate-45 opacity-30" style={{ backgroundColor: accent }} />
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
