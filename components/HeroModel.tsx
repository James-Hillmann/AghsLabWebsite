'use client'

import { useEffect, useRef, useState } from 'react'

import { portraitUrl, renderUrl, type Hero } from '@/lib/heroes'

/**
 * The hero's 3D model, as the looping turntable Valve renders for dota2.com.
 *
 * The source is a 1440x1440 VP9 WebM with no alpha channel -- the background is pure
 * black. `mix-blend-mode: screen` maps black to fully transparent, so the model floats
 * on the page backdrop instead of sitting in a matte box. For that to work no ancestor
 * may set `isolation: isolate` or an opaque background.
 *
 * No poster: the portrait art has a coloured background that the screen blend would
 * wash out. A quiet placeholder holds the space until the first frame decodes.
 */
export function HeroModel({ hero }: { hero: Hero }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      return
    }

    // Some browsers reject autoplay even when muted; the still frame remains.
    video.play().catch(() => {})
  }, [])

  if (state === 'failed') {
    return (
      <div className="relative aspect-square w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portraitUrl(hero.slug)}
          alt={hero.name}
          className="h-full w-full object-contain opacity-90"
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full">
      {state === 'loading' && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--ice-glow)_10%,transparent),transparent)]"
        />
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setState('ready')}
        onError={() => setState('failed')}
        aria-label={`${hero.name} model`}
        className={`h-full w-full object-contain mix-blend-screen transition-opacity duration-700 ${
          state === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={renderUrl(hero.slug)} type="video/webm" />
      </video>
    </div>
  )
}
