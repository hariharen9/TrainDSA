import { useState, useEffect, useRef } from 'react'
import {
  Brain,
  CheckCircle2,
  ChevronDown,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Target,
} from 'lucide-react'
import {
  BEHAVIORAL_CATEGORIES,
  BEHAVIORAL_QUESTIONS,
  CATEGORY_COLORS,
  type BehavioralCategory,
  type BehavioralStatus,
} from '../content/behavioral'
import { useBehavioral } from '../hooks/useBehavioral'

const STATUS_CONFIG: Record<BehavioralStatus, { label: string; color: string; next: BehavioralStatus }> = {
  not_prepared: {
    label: 'Not Prepared',
    color: 'text-muted border-line bg-panel-2',
    next: 'drafted',
  },
  drafted: {
    label: 'Drafted',
    color: 'text-medium border-medium/40 bg-medium/10',
    next: 'ready',
  },
  ready: {
    label: 'Ready ✓',
    color: 'text-easy border-easy/40 bg-easy/10',
    next: 'not_prepared',
  },
}

export function BehavioralPage() {
  const { getStatus, getNote, updateStatus, updateNote, drafted, ready } = useBehavioral()
  const [activeCategory, setActiveCategory] = useState<BehavioralCategory | 'All'>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<BehavioralStatus | 'all'>('all')

  const total = BEHAVIORAL_QUESTIONS.length
  const readyPct = Math.round((ready / total) * 100)

  const filtered = BEHAVIORAL_QUESTIONS.filter((q) => {
    const catMatch = activeCategory === 'All' || q.category === activeCategory
    const statusMatch = filterStatus === 'all' || getStatus(q.id) === filterStatus
    return catMatch && statusMatch
  })

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="overflow-hidden rounded-3xl border border-line bg-panel p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-gold">
          <Brain className="size-3.5" />
          <span>Behavioral Prep</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">STAR Bank</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          30 curated questions across all behavioral dimensions. Write your STAR answers, mark your
          readiness, and build a personal story bank for every interview.
        </p>

        {/* Progress bar */}
        <div className="mt-5 max-w-md space-y-1.5">
          <div className="flex justify-between text-xs text-muted">
            <span className="font-medium text-ink">{ready} ready · {drafted} drafted · {total - ready - drafted} not started</span>
            <span className="font-semibold text-gold">{readyPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-panel-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold transition-all duration-500"
              style={{ width: `${readyPct}%` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-line/60">
          {(['all', 'not_prepared', 'drafted', 'ready'] as const).map((s) => {
            const count =
              s === 'all'
                ? total
                : BEHAVIORAL_QUESTIONS.filter((q) => getStatus(q.id) === s).length
            const isActive = filterStatus === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-gold text-canvas font-semibold'
                    : 'border border-line bg-panel-2 text-muted hover:text-ink'
                }`}
              >
                {s === 'all' ? `All (${count})` : `${STATUS_CONFIG[s].label} (${count})`}
              </button>
            )
          })}
        </div>
      </section>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...BEHAVIORAL_CATEGORIES] as const).map((cat) => {
          const isActive = activeCategory === cat
          const colorClass = cat === 'All' ? 'text-ink border-line bg-panel' : CATEGORY_COLORS[cat as BehavioralCategory]
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat as BehavioralCategory | 'All')}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                isActive
                  ? cat === 'All'
                    ? 'bg-gold text-canvas border-gold font-semibold'
                    : `${colorClass} font-semibold`
                  : 'border-line bg-panel text-muted hover:text-ink'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Question List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-line bg-panel p-10 text-center">
          <Sparkles className="mx-auto size-8 text-gold mb-3" />
          <p className="text-sm text-muted">No questions match the current filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              status={getStatus(q.id)}
              note={getNote(q.id)}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId((prev) => (prev === q.id ? null : q.id))}
              onStatusChange={(s) => updateStatus(q.id, s)}
              onNoteChange={(n) => updateNote(q.id, n)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function QuestionCard({
  question,
  status,
  note,
  expanded,
  onToggle,
  onStatusChange,
  onNoteChange,
}: {
  question: (typeof BEHAVIORAL_QUESTIONS)[0]
  status: BehavioralStatus
  note: string
  expanded: boolean
  onToggle: () => void
  onStatusChange: (s: BehavioralStatus) => void
  onNoteChange: (n: string) => void
}) {
  const cfg = STATUS_CONFIG[status]
  const colorCls = CATEGORY_COLORS[question.category]
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (expanded && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [expanded, note])

  return (
    <article className={`rounded-2xl border bg-panel shadow-xs transition-all duration-200 ${
      status === 'ready' ? 'border-easy/30' : status === 'drafted' ? 'border-medium/30' : 'border-line'
    }`}>
      {/* Card Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <div className="mt-0.5 shrink-0">
          {status === 'ready' ? (
            <CheckCircle2 className="size-5 text-easy" />
          ) : status === 'drafted' ? (
            <FileText className="size-5 text-medium" />
          ) : (
            <MessageSquare className="size-5 text-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colorCls}`}>
              {question.category}
            </span>
          </div>
          <p className="text-sm font-medium text-ink leading-snug">{question.question}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className={`hidden sm:inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cfg.color}`}>
            {cfg.label}
          </span>
          <ChevronDown className={`size-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-line/60 px-5 py-5 space-y-5">
          {/* Interviewer Tips */}
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
              <Target className="size-3.5" />
              <span>What the interviewer is evaluating</span>
            </div>
            <p className="text-sm text-ink leading-relaxed">{question.interviewerLooksFor}</p>
          </div>

          {/* Power Phrases */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Lightbulb className="size-3.5" />
              <span>Power phrases to weave in</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {question.powerPhrases.map((phrase) => (
                <span
                  key={phrase}
                  className="rounded-lg border border-line bg-panel-2 px-2.5 py-1 text-xs text-ink"
                >
                  "{phrase}"
                </span>
              ))}
            </div>
          </div>

          {/* Follow-up Questions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Common follow-ups to prepare for</p>
            <ul className="space-y-1">
              {question.followUps.map((fu) => (
                <li key={fu} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1.5 size-1 rounded-full bg-muted shrink-0" />
                  {fu}
                </li>
              ))}
            </ul>
          </div>

          {/* STAR Notes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink">
              Your STAR Answer (private notes)
            </p>
            <p className="text-[11px] text-muted">
              Situation → Task → Action → Result. Be specific: team size, numbers, timelines.
            </p>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => {
                onNoteChange(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              placeholder="Write your personal STAR answer here…&#10;&#10;Situation: [context and who was involved]&#10;Task: [your responsibility]&#10;Action: [what you specifically did]&#10;Result: [outcome, numbers if possible]"
              className="w-full min-h-[160px] resize-none rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition"
              rows={6}
            />
          </div>

          {/* Status Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-line/60">
            <span className="text-xs text-muted font-medium">Mark readiness:</span>
            {(['not_prepared', 'drafted', 'ready'] as BehavioralStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  status === s
                    ? STATUS_CONFIG[s].color + ' font-semibold'
                    : 'border-line bg-panel-2 text-muted hover:text-ink'
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
