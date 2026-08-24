import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { emptyProgress } from '../lib/progress'
import {
  confidenceLabel,
  difficultyClass,
  difficultyLabel,
  statusLabel,
} from '../lib/labels'
import type { Confidence, Problem, ProgressEntry, ProgressStatus } from '../lib/types'

const statuses: ProgressStatus[] = ['unattempted', 'attempted', 'solved']
const confidences: Confidence[] = ['struggled', 'solved_with_hints', 'solved_easily']

type Props = {
  problem: Problem
  progress?: ProgressEntry
  userId?: string
  onUpdate: (problemId: string, patch: { status?: ProgressStatus; confidence?: Confidence | null; note?: string | null }) => Promise<void>
}

export function ProblemCard({ problem, progress, userId, onUpdate }: Props) {
  const entry = progress ?? (userId ? emptyProgress(problem.id, userId) : null)
  const [noteOpen, setNoteOpen] = useState(Boolean(entry?.note))
  const [note, setNote] = useState(entry?.note ?? '')

  useEffect(() => {
    setNote(entry?.note ?? '')
  }, [entry?.note])

  const status = entry?.status ?? 'unattempted'
  const confidence = entry?.confidence ?? null

  return (
    <article className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${difficultyClass(problem.difficulty)}`}>
              {difficultyLabel(problem.difficulty)}
            </span>
            <h3 className="font-medium text-ink">{problem.title}</h3>
          </div>
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gold hover:underline"
          >
            Open problem <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Problem status">
        {statuses.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => void onUpdate(problem.id, { status: value })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              status === value
                ? 'bg-gold text-canvas'
                : 'border border-line bg-panel-2 text-muted hover:text-ink'
            }`}
          >
            {statusLabel(value)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Confidence">
        {confidences.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              void onUpdate(problem.id, {
                confidence: value,
                status: status === 'unattempted' ? 'solved' : status,
              })
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              confidence === value
                ? 'bg-ink text-canvas'
                : 'border border-line bg-transparent text-muted hover:text-ink'
            }`}
          >
            {confidenceLabel(value)}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 text-xs text-muted hover:text-gold"
        onClick={() => setNoteOpen((open) => !open)}
      >
        {noteOpen ? 'Hide note' : entry?.note ? 'Edit note' : 'Add note'}
      </button>

      {noteOpen ? (
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onBlur={() => {
            if (note !== (entry?.note ?? '')) {
              void onUpdate(problem.id, { note: note || null })
            }
          }}
          placeholder="Gotcha, pattern, or solution sketch"
          className="mt-2 h-20 w-full resize-y rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none ring-gold/40 placeholder:text-muted/70 focus:ring-2"
        />
      ) : null}
    </article>
  )
}
