/**
 * The heading rule used down both tabs of a hero page. Lives here rather than inside
 * the page because the Codex is a Server Component and the Takes tab is a Client one.
 */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="label mb-5 border-b border-[var(--edge)] pb-2 text-[0.65rem] text-muted">
        {title}
      </h2>
      {children}
    </section>
  )
}
