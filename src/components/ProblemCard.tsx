import { ExternalLink, FileText, CheckCircle2 } from 'lucide-react'
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
  onUpdate: (
    problemId: string,
    patch: { status?: ProgressStatus; confidence?: Confidence | null; note?: string | null },
  ) => Promise<void>
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
    <article className="rounded-2xl border border-line bg-panel p-4 sm:p-5 shadow-xs transition hover:border-line/90">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${difficultyClass(
                problem.difficulty,
              )}`}
            >
              {difficultyLabel(problem.difficulty)}
            </span>
            <h3 className="text-base font-semibold text-ink sm:text-base leading-snug">
              {problem.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 pt-0.5">
            <a
              href={problem.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:underline focus:outline-none focus:ring-1 focus:ring-gold/50 rounded"
            >
              Open on LeetCode <ExternalLink className="size-3" />
            </a>
            {entry?.note && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                <FileText className="size-3 text-gold" /> Has notes
              </span>
            )}
          </div>
        </div>

        {status === 'solved' && (
          <div className="self-start sm:self-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-easy/10 border border-easy/30 px-2.5 py-0.5 text-xs font-medium text-easy">
              <CheckCircle2 className="size-3.5" /> Solved
            </span>
          </div>
        )}
      </div>

      {/* Status Selectors */}
      <div className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted mb-1.5">Status</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Problem status">
          {statuses.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => void onUpdate(problem.id, { status: value })}
              className={`flex items-center justify-center rounded-xl px-3.5 py-2 sm:py-1.5 text-xs font-medium transition active:scale-97 cursor-pointer ${
                status === value
                  ? 'bg-gold text-canvas shadow-xs font-semibold'
                  : 'border border-line bg-panel-2 text-muted hover:text-ink hover:border-gold/30'
              }`}
            >
              {statusLabel(value)}
            </button>
          ))}
        </div>
      </div>

      {/* Confidence Selectors */}
      <div className="mt-3.5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted mb-1.5">Confidence</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Confidence">
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
              className={`flex items-center justify-center rounded-xl px-3.5 py-2 sm:py-1.5 text-xs font-medium transition active:scale-97 cursor-pointer ${
                confidence === value
                  ? 'bg-ink text-canvas shadow-xs font-semibold'
                  : 'border border-line bg-panel-2/50 text-muted hover:text-ink hover:border-line'
              }`}
            >
              {confidenceLabel(value)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Toggle & Editor */}
      <div className="mt-4 pt-2 border-t border-line/60">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-gold transition py-1"
          onClick={() => setNoteOpen((open) => !open)}
        >
          <FileText className="size-3.5 text-gold" />
          {noteOpen ? 'Hide note' : entry?.note ? 'Edit note' : 'Add solution notes / gotcha'}
        </button>

        {noteOpen && (
          <div className="mt-2 space-y-1.5">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              onBlur={() => {
                if (note !== (entry?.note ?? '')) {
                  void onUpdate(problem.id, { note: note || null })
                }
              }}
              placeholder="Key invariant, gotcha, time complexity O(N), or solution sketch…"
              rows={3}
              className="w-full resize-y rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-base sm:text-sm text-ink outline-none ring-gold/40 placeholder:text-muted/60 focus:ring-2 transition"
            />
            <p className="text-[11px] text-muted text-right">Auto-saves on blur</p>
          </div>
        )}
      </div>
    </article>
  )
}
