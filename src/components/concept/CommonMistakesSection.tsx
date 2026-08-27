import { AlertTriangle } from 'lucide-react'

// ─── Parser ───────────────────────────────────────────────────────────────────

type Mistake = {
  title: string
  body: string
}

/**
 * Parses common-mistake markdown formatted as:
 *   1. **Title**: body text...
 *
 *   2. **Another Title**:
 *      More body text on next line...
 */
function parseMistakes(md: string): Mistake[] {
  // Split on lines that begin a new numbered item
  const parts = md.split(/\n{1,2}(?=\d+\.\s+\*\*)/)

  return parts
    .map((part): Mistake | null => {
      // Match: digit. **Title**: rest of text (possibly multi-line)
      const match = part.match(/^\d+\.\s+\*\*([^*]+)\*\*[:\s]*([\s\S]*)$/)
      if (!match) return null
      return {
        title: match[1].trim(),
        body: match[2].trim().replace(/\n\s+/g, ' '),
      }
    })
    .filter((m): m is Mistake => m !== null && m.title.length > 0)
}

// ─── Inline code renderer ─────────────────────────────────────────────────────

function MistakeLine({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code
            key={i}
            className="rounded bg-panel px-1 py-0.5 font-mono text-[11px] text-gold border border-line/60"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CommonMistakesSection({
  mistakes: raw,
}: {
  mistakes: string
}) {
  const items = parseMistakes(raw)

  // If parsing fails (unexpected format), fall back to a simple card
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-xs">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-hard to-transparent" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-hard/10 border border-hard/20">
              <AlertTriangle className="size-5 text-hard" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
                Watch out
              </p>
              <h2 className="font-serif text-xl text-ink leading-tight">Common Mistakes</h2>
            </div>
          </div>
          <pre className="text-xs text-muted whitespace-pre-wrap leading-relaxed">{raw}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-xs">
      {/* Red top-accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-hard to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-hard/10 border border-hard/20">
            <AlertTriangle className="size-5 text-hard" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              Watch out
            </p>
            <h2 className="font-serif text-xl text-ink leading-tight">Common Mistakes</h2>
          </div>
        </div>

        {/* Mistake cards */}
        <div className="flex flex-col gap-3">
          {items.map((mistake, i) => (
            <div
              key={i}
              className="group relative flex gap-4 overflow-hidden rounded-2xl border border-hard/20 bg-hard/5 px-4 py-3.5 transition-colors hover:bg-hard/10 hover:border-hard/35"
            >
              {/* Left accent stripe */}
              <div className="absolute left-0 inset-y-0 w-[3px] bg-hard/50 rounded-l-full" />

              <div className="ml-1 flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-hard/15 text-[9px] font-bold text-hard border border-hard/20">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-ink leading-snug">{mistake.title}</h3>
                </div>

                {mistake.body && (
                  <p className="text-xs text-muted leading-relaxed ml-6">
                    <MistakeLine text={mistake.body} />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
