import { activateTome } from '@/app/actions/guidance'
import { type Tome } from '@/lib/guidance'

/**
 * A plain <form action> rather than a client component -- the same trick SiteHeader uses
 * for sign-out. One button, no state, nothing to hydrate.
 */
export function ActivateTome({ tome, className = '' }: { tome: Tome; className?: string }) {
  return (
    <form action={activateTome}>
      <input type="hidden" name="tomeSlug" value={tome.slug} />
      <button
        type="submit"
        className={`label cursor-pointer text-[0.55rem] text-muted transition-colors duration-200 hover:text-frost ${className}`}
      >
        Activate
      </button>
    </form>
  )
}
