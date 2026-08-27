import { FlaskConical } from 'lucide-react'
import { CodeBlock } from '../CodeBlock'
import { MarkdownBody } from '../ui'
import type { WorkedExample } from '../../content/types'

// ─── Trace parser ─────────────────────────────────────────────────────────────

type TraceItem =
  | { kind: 'preamble'; text: string }
  | { kind: 'step'; num: number; text: string }
  | { kind: 'suffix'; text: string }

function parseTrace(explanation: string): TraceItem[] {
  // Split on lines that start with a step number
  const parts = explanation.split(/\n(?=\d+\. )/)
  const items: TraceItem[] = []
  let seenStep = false

  for (const part of parts) {
    const stepMatch = part.match(/^(\d+)\.\s+([\s\S]+)$/)
    if (stepMatch) {
      seenStep = true
      items.push({
        kind: 'step',
        num: parseInt(stepMatch[1]),
        text: stepMatch[2].trim().replace(/\n/g, ' '),
      })
    } else {
      const text = part.trim()
      if (!text) continue
      if (!seenStep) {
        items.push({ kind: 'preamble', text })
      } else {
        // Could be a closing note / follow-up after the numbered steps
        // Split on double newline to separate potential multiple suffix paragraphs
        for (const para of text.split(/\n\n+/)) {
          if (para.trim()) items.push({ kind: 'suffix', text: para.trim() })
        }
      }
    }
  }

  return items
}

// ─── Inline code renderer for trace text ─────────────────────────────────────

/** Renders a trace line, turning `backtick` spans into <code> elements. */
function TraceLine({ text }: { text: string }) {
  // Split on backtick pairs
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

export function WorkedExampleSection({ example }: { example: WorkedExample }) {
  const { title, problem, code, explanation } = example
  const traceItems = explanation ? parseTrace(explanation) : []
  const stepItems = traceItems.filter((t) => t.kind === 'step')
  const preamble = traceItems.find((t) => t.kind === 'preamble')
  const suffixItems = traceItems.filter((t) => t.kind === 'suffix')

  return (
    <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-xs">
      {/* Blue top-accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#60a5fa]/10 border border-[#60a5fa]/20">
            <FlaskConical className="size-5 text-[#60a5fa]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              Step-by-step
            </p>
            <h2 className="font-serif text-xl text-ink leading-tight">
              Worked Example: <span className="text-[#60a5fa]">{title}</span>
            </h2>
          </div>
        </div>

        {/* Problem statement */}
        {problem && (
          <div className="mb-5 rounded-2xl border border-line bg-panel-2/50 p-4">
            <MarkdownBody>{problem}</MarkdownBody>
          </div>
        )}

        {/* Split pane: code | trace */}
        {(code ?? explanation) && (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            {/* Code pane */}
            {code && (
              <div className="lg:w-[58%] shrink-0">
                <CodeBlock
                  code={code.snippet}
                  language={code.language}
                  title="Solution"
                />
              </div>
            )}

            {/* Trace pane */}
            {explanation && traceItems.length > 0 && (
              <div className="flex-1 rounded-2xl border border-line bg-canvas overflow-hidden">
                {/* Trace header */}
                <div className="flex items-center gap-2 border-b border-line bg-panel-2/80 px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="size-2.5 rounded-full bg-hard/60" />
                    <span className="size-2.5 rounded-full bg-medium/60" />
                    <span className="size-2.5 rounded-full bg-easy/60" />
                  </div>
                  <span className="text-xs font-semibold text-muted">Execution Trace</span>
                </div>

                <div className="p-4 space-y-2">
                  {/* Preamble */}
                  {preamble && (
                    <p className="text-xs text-muted italic leading-relaxed pb-2 border-b border-line/60 mb-3">
                      <TraceLine text={preamble.text} />
                    </p>
                  )}

                  {/* Numbered steps */}
                  {stepItems.map((item) => {
                    if (item.kind !== 'step') return null
                    return (
                      <div
                        key={item.num}
                        className="flex gap-2.5 rounded-xl hover:bg-panel-2/60 px-2 py-1.5 transition-colors"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-[10px] font-bold text-gold mt-0.5">
                          {item.num}
                        </span>
                        <p className="text-xs text-muted leading-relaxed">
                          <TraceLine text={item.text} />
                        </p>
                      </div>
                    )
                  })}

                  {/* Suffix / follow-up text */}
                  {suffixItems.map((item, i) => {
                    if (item.kind !== 'suffix') return null
                    return (
                      <p
                        key={i}
                        className="text-xs text-muted/70 italic leading-relaxed pt-2 border-t border-line/60 mt-2"
                      >
                        <TraceLine text={item.text} />
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
