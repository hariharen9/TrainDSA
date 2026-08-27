import { Target } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MarkdownBody } from '../ui'

// ─── Types ────────────────────────────────────────────────────────────────────

type StructuredPattern = {
  name: string
  giveaway: string
  strategy: string
  topProblems: string[]
  followUp: string
}

type SimplePattern = {
  name: string
  body: string
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

/**
 * Parses the "#### Pattern N: Name" format (e.g. arrays-hashing, graphs).
 * Returns null if the format is not detected.
 */
function parseStructuredPatterns(md: string): StructuredPattern[] | null {
  if (!md.includes('#### ')) return null

  const blocks = md
    .split(/\n(?=####\s)/)
    .filter((b) => b.trimStart().startsWith('####'))

  if (blocks.length < 2) return null

  return blocks.map((block) => {
    const lines = block.trim().split('\n')
    // Strip leading "#### " and optional "Pattern N: " prefix
    const rawName = lines[0].replace(/^####\s*/, '').trim()
    const name = rawName.replace(/^Pattern \d+:\s*/i, '').trim()

    const result: StructuredPattern = {
      name,
      giveaway: '',
      strategy: '',
      topProblems: [],
      followUp: '',
    }

    for (const line of lines.slice(1)) {
      const giveaway = line.match(/^-\s+\*\*Giveaway\*\*:\s*(.+)$/)
      const strategy = line.match(/^-\s+\*\*Strategy\*\*:\s*(.+)$/)
      const topProbs = line.match(/^-\s+\*\*Top Problems?\*\*:\s*(.+)$/)
      const followUp = line.match(/^-\s+\*\*Likely follow-?up\*\*:\s*(.+)$/i)

      if (giveaway) result.giveaway = giveaway[1]
      if (strategy) result.strategy = strategy[1]
      if (topProbs) {
        result.topProblems = topProbs[1]
          .split(/[,;]/)
          .map((p) => p.replace(/\*|_/g, '').trim())
          .filter(Boolean)
      }
      if (followUp) result.followUp = followUp[1]
    }

    return result
  })
}

/**
 * Parses the flat "- **Name**: body" bullet format (e.g. two-pointers, stack).
 * Returns null if fewer than 2 bullets are found.
 */
function parseSimplePatterns(md: string): SimplePattern[] | null {
  const regex = /^-\s+\*\*([^*]+)\*\*[:\s]+([\s\S]*?)(?=\n-\s+\*\*|\n#{1,4}\s|$)/gm
  const matches = [...md.matchAll(regex)]
  if (matches.length < 2) return null

  return matches.map((m) => ({
    name: m[1].trim(),
    body: m[2].trim(),
  }))
}

// ─── Inline markdown (single-line / short content) ────────────────────────────

const inlineClasses = [
  'text-xs text-muted leading-relaxed',
  '[&_strong]:text-ink [&_strong]:font-semibold',
  '[&_em]:text-ink/80',
  '[&_code]:rounded [&_code]:bg-panel-2 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px] [&_code]:text-gold',
].join(' ')

function InlineMd({ children }: { children: string }) {
  return (
    <div className={inlineClasses}>
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const badgeColors = [
  'bg-gold text-canvas',
  'bg-easy/80 text-canvas',
  'bg-medium/80 text-canvas',
  'bg-hard/70 text-canvas',
  'bg-muted/30 text-ink',
]

function StructuredPatternCard({
  pattern,
  index,
}: {
  pattern: StructuredPattern
  index: number
}) {
  const badgeClass = badgeColors[index % badgeColors.length]

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-panel-2/60 p-4 hover:border-gold/40 transition-colors">
      {/* Name row */}
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${badgeClass}`}
        >
          {index + 1}
        </span>
        <h3 className="text-sm font-semibold text-ink leading-snug">{pattern.name}</h3>
      </div>

      {/* Giveaway */}
      {pattern.giveaway && (
        <div className="rounded-xl border border-gold/20 bg-gold-dim/40 px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1">
            Giveaway Signal
          </p>
          <InlineMd>{pattern.giveaway}</InlineMd>
        </div>
      )}

      {/* Strategy */}
      {pattern.strategy && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1">
            Strategy
          </p>
          <InlineMd>{pattern.strategy}</InlineMd>
        </div>
      )}

      {/* Top problems */}
      {pattern.topProblems.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1.5">
            Key Problems
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pattern.topProblems.map((prob) => (
              <span
                key={prob}
                className="rounded-full border border-line bg-panel px-2 py-0.5 text-[10px] font-medium text-muted"
              >
                {prob}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up */}
      {pattern.followUp && (
        <div className="rounded-xl border border-line bg-panel/60 px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1">
            Likely Follow-up
          </p>
          <InlineMd>{pattern.followUp}</InlineMd>
        </div>
      )}
    </div>
  )
}

function SimplePatternCard({
  pattern,
  index,
}: {
  pattern: SimplePattern
  index: number
}) {
  const badgeClass = badgeColors[index % badgeColors.length]

  return (
    <div className="flex gap-3 rounded-2xl border border-line bg-panel-2/60 p-4 hover:border-gold/40 transition-colors">
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${badgeClass}`}
      >
        {index + 1}
      </span>
      <div className="min-w-0 space-y-1.5">
        <h3 className="text-sm font-semibold text-ink">{pattern.name}</h3>
        <InlineMd>{pattern.body}</InlineMd>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PatternSection({
  patternRecognition,
}: {
  patternRecognition: string
}) {
  const structured = parseStructuredPatterns(patternRecognition)
  const simple = !structured ? parseSimplePatterns(patternRecognition) : null

  return (
    <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-xs">
      {/* Green top-accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-easy to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-easy/10 border border-easy/20">
            <Target className="size-5 text-easy" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              When to use it
            </p>
            <h2 className="font-serif text-xl text-ink leading-tight">Pattern Recognition</h2>
          </div>
        </div>

        {/* Content: structured grid, simple list, or MarkdownBody fallback */}
        {structured ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {structured.map((pattern, i) => (
              <StructuredPatternCard key={pattern.name} pattern={pattern} index={i} />
            ))}
          </div>
        ) : simple ? (
          <div className="flex flex-col gap-3">
            {simple.map((pattern, i) => (
              <SimplePatternCard key={pattern.name} pattern={pattern} index={i} />
            ))}
          </div>
        ) : (
          <MarkdownBody>{patternRecognition}</MarkdownBody>
        )}
      </div>
    </div>
  )
}
