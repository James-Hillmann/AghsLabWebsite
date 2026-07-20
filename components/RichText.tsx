const MARKER = /\[\[(\w+)(?::([^\]]+))?\]\]([\s\S]*?)\[\[\/\]\]/g

/**
 * Renders the `[[color:#hex]]...[[/]]` / `[[value]]...[[/]]` / `[[ref]]...[[/]]` markers the
 * catalogue generator embeds in artifact and relic descriptions (see `resolveTemplate` in
 * scripts/lib/catalogue.mjs) as styled spans, mirroring the game's own tooltip highlighting --
 * element keywords in their real color, substituted numbers glowing, and self-references
 * underlined. Every description/note/special field that comes out of the generator must render
 * through this rather than as plain text, or the marker syntax shows up literally.
 */
export function RichText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = []
  let cursor = 0
  let key = 0

  for (const match of text.matchAll(MARKER)) {
    const [whole, kind, param, content] = match
    const index = match.index ?? 0

    if (index > cursor) nodes.push(text.slice(cursor, index))

    if (kind === 'color' && param) {
      nodes.push(
        <span key={key++} style={{ color: param }}>
          {content}
        </span>,
      )
    } else if (kind === 'value') {
      nodes.push(
        <span key={key++} className="text-glow tabular-nums">
          {content}
        </span>,
      )
    } else if (kind === 'ref') {
      nodes.push(
        <span key={key++} className="underline">
          {content}
        </span>,
      )
    } else {
      nodes.push(content)
    }

    cursor = index + whole.length
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))

  return <>{nodes}</>
}
