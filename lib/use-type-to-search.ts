'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Dota's picker doesn't make you click a search box -- you just start typing, and the grid
 * dims rather than filters. This is the window-level key listener that makes that work, shared
 * by the hero roster and the artifact Archive.
 *
 * Keys are appended manually and the event is cancelled, rather than just focusing the input
 * and letting the character through. Focusing mid-keydown is racy across browsers and drops or
 * doubles the first letter.
 */
export function useTypeToSearch({
  inputRef,
  setQuery,
  onEnter,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  setQuery: (update: (query: string) => string) => void
  /**
   * Runs on Enter. Return true if it did something -- only then is the key swallowed, so a
   * form elsewhere on the page still submits normally when there's nothing to open.
   */
  onEnter: () => boolean
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const typingElsewhere =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable

      if (event.key === 'Escape') {
        setQuery(() => '')
        inputRef.current?.blur()
        return
      }

      // Enter fires even while the search box has focus -- that's where you'll be typing.
      if (event.key === 'Enter') {
        if (onEnter()) event.preventDefault()
        return
      }

      if (typingElsewhere) return

      if (event.key === 'Backspace') {
        event.preventDefault()
        setQuery((query) => query.slice(0, -1))
        inputRef.current?.focus()
        return
      }

      if (event.key.length === 1 && event.key !== ' ') {
        event.preventDefault()
        setQuery((query) => query + event.key)
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [inputRef, setQuery, onEnter])
}
