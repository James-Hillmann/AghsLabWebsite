import { AbilityBrowser } from '@/components/AbilityBrowser'
import { SiteHeader } from '@/components/SiteHeader'
import { getAbilities } from '@/lib/abilities'
import { requireSession } from '@/lib/auth-guard'

export default async function AbilitiesPage() {
  // Server Functions can fall outside the proxy matcher, so every protected page verifies
  // the session itself rather than trusting the redirect in proxy.ts.
  await requireSession()

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="px-6 py-10 2xl:px-10 2xl:py-8">
        <AbilityBrowser abilities={getAbilities()} />
      </div>
    </main>
  )
}
