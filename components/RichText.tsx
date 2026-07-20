import Image from 'next/image'

const MARKER = /\[\[(\w+)(?::([^\]]+))?\]\]([\s\S]*?)\[\[\/\]\]/g

/**
 * An icon marker's parameter is a path stem under public/, e.g. `tooltip/aghs-shard`. Checked
 * rather than trusted: it goes straight into a `src`, and the generator is the only thing that
 * should ever be writing one.
 */
const ICON_PATH = /^[a-z0-9-]+\/[a-z0-9-]+$/

/**
 * Renders the `[[color:#hex]]...[[/]]` / `[[value]]...[[/]]` / `[[ref]]...[[/]]` /
 * `[[icon:path]]label[[/]]` markers the catalogue generator embeds in artifact and relic
 * descriptions (see `resolveTemplate` in scripts/lib/catalogue.mjs) as styled spans, mirroring
 * the game's own tooltip highlighting -- element keywords in their real color, substituted
 * numbers glowing, self-references underlined, and the pictures the game draws inline. Every
 * description/note/special field that comes out of the generator must render through this
 * rather than as plain text, or the marker syntax shows up literally.
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
    } else if (kind === 'icon' && param && ICON_PATH.test(param)) {
      // The game draws these inline and writes around them -- "converted into <shard>" means
      // nothing without the picture. Sized in em so it tracks the surrounding text at any font
      // size, and nudged down onto the baseline rather than sitting on top of it. The label
      // carries the meaning for anyone the picture doesn't reach.
      nodes.push(
        <Image
          key={key++}
          src={`/${param}.png`}
          alt={content}
          title={content}
          width={32}
          height={32}
          className="mx-0.5 inline-block h-[1.15em] w-auto align-[-0.2em]"
        />,
      )
    } else {
      nodes.push(content)
    }

    cursor = index + whole.length
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))

  return <>{nodes}</>
}
