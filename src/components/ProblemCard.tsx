import {
  ExternalLink,
  FileText,
  CheckCircle2,
  Circle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Code2,
  Zap,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { useEffect, useState, useId } from 'react'
import { emptyProgress } from '../lib/progress'
import {
  difficultyClass,
  difficultyLabel,
} from '../lib/labels'
import { formatSeconds, parseProblemNote, serializeProblemNote, type ProblemNoteData } from '../lib/notes'
import { PROBLEM_METADATA } from '../lib/problemMetadata'
import { MarkdownBody } from './ui'
import type { Confidence, Problem, ProgressEntry, ProgressStatus } from '../lib/types'

const timeComplexities = ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)']
const spaceComplexities = ['O(1)', 'O(log N)', 'O(N)', 'O(N²)']

type Props = {
  problem: Problem
  progress?: ProgressEntry
  userId?: string
  onUpdate: (
    problemId: string,
    patch: { status?: ProgressStatus; confidence?: Confidence | null; note?: string | null },
  ) => Promise<void>
}

type ActiveTab = 'notes' | 'complexity' | 'code'

export function ProblemCard({ problem, progress, userId, onUpdate }: Props) {
  const entry = progress ?? (userId ? emptyProgress(problem.id, userId) : null)
  const status = entry?.status ?? 'unattempted'
  const confidence = entry?.confidence ?? null

  const noteData = parseProblemNote(entry?.note)
  const [workspaceOpen, setWorkspaceOpen] = useState(
    Boolean(noteData.text || noteData.timeComplexity || noteData.spaceComplexity || noteData.codeSnippet),
  )
  const [activeTab, setActiveTab] = useState<ActiveTab>('notes')
  const [noteState, setNoteState] = useState<ProblemNoteData>(noteData)
  const [previewMarkdown, setPreviewMarkdown] = useState(false)

  // Stopwatch state
  const [timerSeconds, setTimerSeconds] = useState(noteData.timeSpentSeconds ?? 0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const textareaId = useId()

  useEffect(() => {
    const parsed = parseProblemNote(entry?.note)
    setNoteState(parsed)
    if (parsed.timeSpentSeconds !== undefined && parsed.timeSpentSeconds > 0) {
      setTimerSeconds(parsed.timeSpentSeconds)
    }
  }, [entry?.note])

  // Timer tick effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  const saveNoteUpdates = async (updates: Partial<ProblemNoteData>) => {
    const nextData: ProblemNoteData = {
      ...noteState,
      ...updates,
      timeSpentSeconds: timerSeconds > 0 ? timerSeconds : undefined,
    }
    setNoteState(nextData)
    const serialized = serializeProblemNote(nextData)
    if (serialized !== (entry?.note ?? null)) {
      await onUpdate(problem.id, { note: serialized })
    }
  }

  const handleStatusClick = (newStatus: ProgressStatus) => {
    if (isTimerRunning && newStatus === 'solved') {
      setIsTimerRunning(false)
      void saveNoteUpdates({ timeSpentSeconds: timerSeconds })
    }
    void onUpdate(problem.id, { status: newStatus })
  }

  const handleConfidenceClick = (newConfidence: Confidence) => {
    void onUpdate(problem.id, {
      confidence: newConfidence,
      status: status === 'unattempted' ? 'solved' : status,
    })
  }

  const insertSnippet = (snippet: string) => {
    const current = noteState.text || ''
    const updated = current ? `${current}\n\n${snippet}` : snippet
    void saveNoteUpdates({ text: updated })
  }

  const hasAnyNotes = Boolean(
    noteState.text?.trim() || noteState.timeComplexity || noteState.spaceComplexity || noteState.codeSnippet?.trim(),
  )

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-panel transition-all duration-200 shadow-xs hover:shadow-md ${
        status === 'solved'
          ? 'border-easy/40 hover:border-easy/60'
          : status === 'attempted'
            ? 'border-gold/40 hover:border-gold/60'
            : 'border-line hover:border-line/90'
      }`}
    >
      {/* Top accent glow line */}
      <div
        className={`h-1 w-full transition-colors duration-300 ${
          status === 'solved'
            ? 'bg-easy'
            : status === 'attempted'
              ? 'bg-gold'
              : 'bg-transparent'
        }`}
      />

      <div className="p-4 sm:p-5">
        {/* Header: Difficulty, Title, LeetCode Link, Stopwatch */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${difficultyClass(
                  problem.difficulty,
                )}`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    problem.difficulty === 'easy'
                      ? 'bg-easy animate-pulse'
                      : problem.difficulty === 'medium'
                        ? 'bg-medium'
                        : 'bg-hard'
                  }`}
                />
                {difficultyLabel(problem.difficulty)}
              </span>

              <span className="text-xs text-muted font-mono">#{problem.order_index}</span>

              <h3 className="text-base font-semibold text-ink sm:text-lg leading-snug">
                {problem.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <a
                href={problem.url}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-1.5 rounded-lg bg-panel-2 px-2.5 py-1 text-xs font-medium text-gold transition hover:bg-gold-dim hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <span>Solve on LeetCode</span>
                <ExternalLink className="size-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>

              {/* Quick tags / complexity badge preview */}
              {noteState.timeComplexity && (
                <span className="inline-flex items-center gap-1 rounded-md border border-line bg-panel-2/50 px-2 py-0.5 text-[11px] font-mono text-muted">
                  <Zap className="size-3 text-gold" />
                  {noteState.timeComplexity}
                </span>
              )}

              {noteState.spaceComplexity && (
                <span className="inline-flex items-center gap-1 rounded-md border border-line bg-panel-2/50 px-2 py-0.5 text-[11px] font-mono text-muted">
                  <Code2 className="size-3 text-gold" />
                  {noteState.spaceComplexity} space
                </span>
              )}
            </div>

            {/* FAANG Companies & Pattern Tags */}
            {PROBLEM_METADATA[problem.id] && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {PROBLEM_METADATA[problem.id].companies.slice(0, 3).map((comp) => (
                  <span
                    key={comp}
                    className="rounded-md border border-line/60 bg-panel-2/70 px-2 py-0.5 text-[10px] font-medium text-muted"
                  >
                    {comp}
                  </span>
                ))}
                {PROBLEM_METADATA[problem.id].patterns.slice(0, 2).map((pat) => (
                  <span
                    key={pat}
                    className="rounded-md border border-gold/30 bg-gold-dim/40 px-2 py-0.5 text-[10px] font-mono text-gold"
                  >
                    {pat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stopwatch widget */}
          <div className="flex items-center gap-2 self-start rounded-xl border border-line bg-panel-2/70 px-3 py-1.5 sm:self-center">
            <Timer className={`size-4 ${isTimerRunning ? 'text-gold animate-spin' : 'text-muted'}`} />
            <span className="font-mono text-xs font-semibold text-ink">
              {formatSeconds(timerSeconds)}
            </span>
            <button
              type="button"
              onClick={() => setIsTimerRunning((v) => !v)}
              className="inline-flex size-6 items-center justify-center rounded-md bg-panel border border-line text-gold hover:text-ink transition cursor-pointer"
              title={isTimerRunning ? 'Pause timer' : 'Start interview timer'}
              aria-label={isTimerRunning ? 'Pause timer' : 'Start interview timer'}
            >
              {isTimerRunning ? <Pause className="size-3 fill-gold" /> : <Play className="size-3 fill-gold" />}
            </button>
            {timerSeconds > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false)
                  setTimerSeconds(0)
                  void saveNoteUpdates({ timeSpentSeconds: 0 })
                }}
                className="inline-flex size-6 items-center justify-center rounded-md bg-panel border border-line text-muted hover:text-hard transition cursor-pointer"
                title="Reset timer"
                aria-label="Reset timer"
              >
                <RotateCcw className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Status & Confidence Grid */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Status Segmented Switcher */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1">
              Status
            </span>
            <div
              className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-canvas p-1"
              role="group"
              aria-label="Problem Status"
            >
              <button
                type="button"
                onClick={() => handleStatusClick('unattempted')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                  status === 'unattempted'
                    ? 'bg-panel text-ink shadow-xs border border-line font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Circle className="size-3.5" />
                <span>To Do</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusClick('attempted')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                  status === 'attempted'
                    ? 'bg-gold text-canvas shadow-xs font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Clock className="size-3.5" />
                <span>Attempted</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusClick('solved')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                  status === 'solved'
                    ? 'bg-easy text-canvas shadow-xs font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <CheckCircle2 className="size-3.5" />
                <span>Solved</span>
              </button>
            </div>
          </div>

          {/* Confidence Level Pill Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
              <span>Confidence Level</span>
              {confidence === 'struggled' && (
                <span className="text-[10px] text-hard font-medium inline-flex items-center gap-1">
                  <AlertCircle className="size-3" /> Queued for review
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-canvas p-1" role="group" aria-label="Confidence">
              <button
                type="button"
                onClick={() => handleConfidenceClick('struggled')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                  confidence === 'struggled'
                    ? 'bg-hard/20 border border-hard/40 text-hard font-semibold shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
                title="Needed significant help / couldn't solve cleanly"
              >
                <span className="size-2 rounded-full bg-hard" />
                <span>Struggled</span>
              </button>

              <button
                type="button"
                onClick={() => handleConfidenceClick('solved_with_hints')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                  confidence === 'solved_with_hints'
                    ? 'bg-medium/20 border border-medium/40 text-medium font-semibold shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
                title="Solved after checking hints or syntax"
              >
                <span className="size-2 rounded-full bg-medium" />
                <span>With Hints</span>
              </button>

              <button
                type="button"
                onClick={() => handleConfidenceClick('solved_easily')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                  confidence === 'solved_easily'
                    ? 'bg-easy/20 border border-easy/40 text-easy font-semibold shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
                title="Solved independently & optimally"
              >
                <span className="size-2 rounded-full bg-easy" />
                <span>Easy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Study Workspace & Notes Drawer */}
        <div className="mt-4 pt-3 border-t border-line/70">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWorkspaceOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-gold transition py-1 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-gold" />
                <span className="text-ink font-semibold">Solution Workspace & Notes</span>
                {hasAnyNotes && (
                  <span className="size-1.5 rounded-full bg-gold animate-ping" />
                )}
              </div>
              <ChevronDown
                className={`size-3.5 text-muted transition-transform duration-200 ${
                  workspaceOpen ? 'rotate-180 text-gold' : ''
                }`}
              />
            </button>

            {hasAnyNotes && !workspaceOpen && (
              <span className="text-[11px] text-muted truncate max-w-48 sm:max-w-64 font-mono">
                {noteState.timeComplexity ? `[${noteState.timeComplexity}] ` : ''}
                {noteState.text?.slice(0, 30)}
                {(noteState.text?.length ?? 0) > 30 ? '…' : ''}
              </span>
            )}
          </div>

          {workspaceOpen && (
            <div className="mt-3 rounded-xl border border-line bg-canvas/60 p-3 sm:p-4 space-y-3.5 transition-all">
              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                      activeTab === 'notes'
                        ? 'bg-gold-dim text-gold font-semibold'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <FileText className="size-3.5" />
                    <span>Notes & Gotchas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('complexity')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                      activeTab === 'complexity'
                        ? 'bg-gold-dim text-gold font-semibold'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Zap className="size-3.5" />
                    <span>Big-O Complexity</span>
                    {(noteState.timeComplexity || noteState.spaceComplexity) && (
                      <span className="size-1.5 rounded-full bg-gold" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                      activeTab === 'code'
                        ? 'bg-gold-dim text-gold font-semibold'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Code2 className="size-3.5" />
                    <span>Approach / Code</span>
                    {noteState.codeSnippet && <span className="size-1.5 rounded-full bg-gold" />}
                  </button>
                </div>

                {activeTab === 'notes' && (
                  <button
                    type="button"
                    onClick={() => setPreviewMarkdown((v) => !v)}
                    className="text-[11px] font-medium text-gold hover:underline cursor-pointer"
                  >
                    {previewMarkdown ? 'Edit Markdown' : 'Preview'}
                  </button>
                )}
              </div>

              {/* Tab 1: Notes & Gotchas */}
              {activeTab === 'notes' && (
                <div className="space-y-2">
                  {/* Quick Snippet Insert Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    <span className="text-[10px] uppercase font-semibold text-muted flex items-center gap-1">
                      <Sparkles className="size-3 text-gold" /> Quick inserts:
                    </span>
                    <button
                      type="button"
                      onClick={() => insertSnippet('**Key Invariant:** ')}
                      className="rounded-md border border-line bg-panel px-2 py-0.5 text-[11px] text-muted hover:text-gold hover:border-gold/40 transition cursor-pointer"
                    >
                      + Key Invariant
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('**Interview Gotcha / Pitfall:** ')}
                      className="rounded-md border border-line bg-panel px-2 py-0.5 text-[11px] text-muted hover:text-gold hover:border-gold/40 transition cursor-pointer"
                    >
                      + Gotcha
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('**Edge Cases:** Empty array, single element, negative numbers, duplicates.')}
                      className="rounded-md border border-line bg-panel px-2 py-0.5 text-[11px] text-muted hover:text-gold hover:border-gold/40 transition cursor-pointer"
                    >
                      + Edge Cases
                    </button>
                  </div>

                  {previewMarkdown ? (
                    <div className="min-h-24 rounded-xl border border-line bg-panel p-3">
                      {noteState.text ? (
                        <MarkdownBody>{noteState.text}</MarkdownBody>
                      ) : (
                        <p className="text-xs text-muted italic">No notes written yet.</p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      id={textareaId}
                      value={noteState.text}
                      onChange={(e) => setNoteState((prev) => ({ ...prev, text: e.target.value }))}
                      onBlur={() => void saveNoteUpdates({ text: noteState.text })}
                      placeholder="Write your mental model, core trick, edge cases, or interview gotchas (supports Markdown)…"
                      rows={4}
                      className="w-full resize-y rounded-xl border border-line bg-panel px-3.5 py-2.5 text-base sm:text-sm text-ink outline-none ring-gold/40 placeholder:text-muted/60 focus:ring-2 transition"
                    />
                  )}
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span>Supports GitHub Markdown (`code`, **bold**, lists)</span>
                    <span>Auto-saves on blur</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Big-O Complexity */}
              {activeTab === 'complexity' && (
                <div className="space-y-4 py-1">
                  {/* Time Complexity */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <Zap className="size-3.5 text-gold" /> Time Complexity:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {timeComplexities.map((comp) => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => {
                            const next = noteState.timeComplexity === comp ? undefined : comp
                            void saveNoteUpdates({ timeComplexity: next })
                          }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono transition cursor-pointer ${
                            noteState.timeComplexity === comp
                              ? 'bg-gold text-canvas font-bold shadow-xs'
                              : 'border border-line bg-panel text-muted hover:text-ink'
                          }`}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Space Complexity */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <Code2 className="size-3.5 text-gold" /> Auxiliary Space Complexity:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {spaceComplexities.map((comp) => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => {
                            const next = noteState.spaceComplexity === comp ? undefined : comp
                            void saveNoteUpdates({ spaceComplexity: next })
                          }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono transition cursor-pointer ${
                            noteState.spaceComplexity === comp
                              ? 'bg-ink text-canvas font-bold shadow-xs'
                              : 'border border-line bg-panel text-muted hover:text-ink'
                          }`}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Approach / Code Sketch */}
              {activeTab === 'code' && (
                <div className="space-y-2">
                  <textarea
                    value={noteState.codeSnippet ?? ''}
                    onChange={(e) => setNoteState((prev) => ({ ...prev, codeSnippet: e.target.value }))}
                    onBlur={() => void saveNoteUpdates({ codeSnippet: noteState.codeSnippet })}
                    placeholder="// Pseudocode / Python solution sketch or key helper snippet&#10;def solve(nums):&#10;    seen = set()&#10;    ..."
                    rows={5}
                    className="w-full resize-y rounded-xl border border-line bg-panel px-3.5 py-2.5 font-mono text-xs text-ink outline-none ring-gold/40 placeholder:text-muted/50 focus:ring-2 transition"
                  />
                  <p className="text-[11px] text-muted text-right">Auto-saves on blur</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
