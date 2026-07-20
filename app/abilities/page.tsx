import { permanentRedirect } from 'next/navigation'

/**
 * The abilities catalogue is gone -- abilities are reached through their hero now. Anyone
 * holding a link to the old index lands on the roster, which is where they'd have to start
 * anyway.
 */
export default function LegacyAbilitiesIndex() {
  permanentRedirect('/heroes')
}
