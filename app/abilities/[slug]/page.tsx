import { permanentRedirect, notFound } from 'next/navigation'

import { abilityHref, getAbility } from '@/lib/abilities'

/**
 * Abilities used to live at /abilities/<slug> before they moved under their hero. This keeps
 * those links working -- they were deployed, and the slug is still the ability's identity in
 * the database, so resolving one is a lookup rather than a guess.
 *
 * No page of its own, and nothing links here. It exists only so an old URL still lands.
 */
export default async function LegacyAbilityRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const ability = getAbility(slug)
  if (!ability) notFound()

  permanentRedirect(abilityHref(ability))
}
