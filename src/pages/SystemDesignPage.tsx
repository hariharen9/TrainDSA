import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Code2,
  Layers,
  Server,
  Sparkles,
} from 'lucide-react'
import {
  HLD_TOPICS,
  LLD_TOPICS,
  type SDStatus,
  type SDTopic,
  type SDTrack,
} from '../content/systemDesign'
import { useSystemDesign } from '../hooks/useSystemDesign'

const STATUS_CONFIG: Record<SDStatus, { label: string; color: string }> = {
  not_started: { label: 'Not Started', color: 'text-muted border-line bg-panel-2' },
  reading: { label: 'Reading', color: 'text-medium border-medium/40 bg-medium/10' },
  comfortable: { label: 'Comfortable ✓', color: 'text-easy border-easy/40 bg-easy/10' },
}

export function SystemDesignPage() {
  const { getStatus, getNote, updateStatus, updateNote } = useSystemDesign()
  const [track, setTrack] = useState<SDTrack>('HLD')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<SDStatus | 'all'>('all')

  const topics = track === 'HLD' ? HLD_TOPICS : LLD_TOPICS
  const hldComfortable = HLD_TOPICS.filter((t) => getStatus(t.id) === 'comfortable').length
  const lldComfortable = LLD_TOPICS.filter((t) => getStatus(t.id) === 'comfortable').length

  const filtered = topics.filter((t) => {
    return filterStatus === 'all' || getStatus(t.id) === filterStatus
  })

  const trackComfortable = track === 'HLD' ? hldComfortable : lldComfortable
  const trackTotal = track === 'HLD' ? HLD_TOPICS.length : LLD_TOPICS.length
  const trackPct = Math.round((trackComfortable / trackTotal) * 100)

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="overflow-hidden rounded-3xl border border-line bg-panel p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-gold">
          <Server className="size-3.5" />
          <span>System Design</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Design Primer</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          18 topics across High-Level Design (distributed systems) and Low-Level Design (OOP &
          patterns). Study the concepts, patterns, and classic problems interviewers reach for.
        </p>

        {/* Overall stat pills */}
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-3 py-2">
            <Server className="size-3.5 text-gold" />
            <span className="text-xs">
              <span className="font-semibold text-ink">{hldComfortable}/{HLD_TOPICS.length}</span>
              <span className="text-muted ml-1">HLD comfortable</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-3 py-2">
            <Code2 className="size-3.5 text-easy" />
            <span className="text-xs">
              <span className="font-semibold text-ink">{lldComfortable}/{LLD_TOPICS.length}</span>
              <span className="text-muted ml-1">LLD comfortable</span>
            </span>
          </div>
        </div>

        {/* Track progress bar */}
        <div className="mt-4 max-w-md space-y-1.5">
          <div className="flex justify-between text-xs text-muted">
            <span>{track} progress</span>
            <span className="font-semibold text-gold">{trackPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-panel-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold transition-all duration-500"
              style={{ width: `${trackPct}%` }}
            />
          </div>
        </div>

        {/* Status filters */}
        <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-line/60">
          {(['all', 'not_started', 'reading', 'comfortable'] as const).map((s) => {
            const count =
              s === 'all'
                ? topics.length
                : topics.filter((t) => getStatus(t.id) === s).length
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  filterStatus === s
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

      {/* Track Toggle */}
      <div className="flex rounded-2xl border border-line bg-panel p-1.5 gap-1.5">
        <TrackTab
          active={track === 'HLD'}
          label="High-Level Design"
          sublabel="Distributed systems · 12 topics"
          icon={<Server className="size-4" />}
          onClick={() => { setTrack('HLD'); setExpandedId(null); setFilterStatus('all') }}
        />
        <TrackTab
          active={track === 'LLD'}
          label="Low-Level Design"
          sublabel="OOP & patterns · 6 topics"
          icon={<Code2 className="size-4" />}
          onClick={() => { setTrack('LLD'); setExpandedId(null); setFilterStatus('all') }}
        />
      </div>

      {/* Topic List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-line bg-panel p-10 text-center">
          <Sparkles className="mx-auto size-8 text-gold mb-3" />
          <p className="text-sm text-muted">No topics match the current filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((topic) => (
            <SDTopicCard
              key={topic.id}
              topic={topic}
              status={getStatus(topic.id)}
              note={getNote(topic.id)}
              expanded={expandedId === topic.id}
              onToggle={() => setExpandedId((prev) => (prev === topic.id ? null : topic.id))}
              onStatusChange={(s) => updateStatus(topic.id, s)}
              onNoteChange={(n) => updateNote(topic.id, n)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TrackTab({
  active,
  label,
  sublabel,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  sublabel: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left transition cursor-pointer ${
        active
          ? 'bg-gold text-canvas shadow-xs'
          : 'text-muted hover:bg-panel-2 hover:text-ink'
      }`}
    >
      <div className={active ? 'text-canvas' : 'text-muted'}>{icon}</div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className={`text-xs ${active ? 'text-canvas/70' : 'text-muted'}`}>{sublabel}</p>
      </div>
    </button>
  )
}

function SDTopicCard({
  topic,
  status,
  note,
  expanded,
  onToggle,
  onStatusChange,
  onNoteChange,
}: {
  topic: SDTopic
  status: SDStatus
  note: string
  expanded: boolean
  onToggle: () => void
  onStatusChange: (s: SDStatus) => void
  onNoteChange: (n: string) => void
}) {
  const cfg = STATUS_CONFIG[status]

  return (
    <article className={`rounded-2xl border bg-panel shadow-xs transition-all duration-200 ${
      status === 'comfortable'
        ? 'border-easy/30'
        : status === 'reading'
        ? 'border-medium/30'
        : 'border-line'
    }`}>
      {/* Card Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <span className="text-2xl shrink-0">{topic.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">
              {topic.track} · {topic.order.toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-sm font-semibold text-ink mt-0.5">{topic.title}</p>
          {!expanded && (
            <p className="text-xs text-muted mt-0.5 line-clamp-1">{topic.summary}</p>
          )}
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
          {/* Summary */}
          <p className="text-sm text-muted leading-relaxed">{topic.summary}</p>

          {/* Key Points */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
              <BookOpen className="size-3.5" />
              <span>Key Concepts</span>
            </div>
            <ul className="space-y-1.5">
              {topic.keyPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-ink/90">
                  <ChevronRight className="mt-0.5 size-3.5 text-gold shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Patterns */}
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              How to use this in an interview
            </p>
            <ul className="space-y-1">
              {topic.interviewPatterns.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-ink">
                  <span className="mt-1.5 size-1.5 rounded-full bg-gold shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Classic Problems */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
              <Layers className="size-3.5" />
              <span>Classic Interview Problems</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {topic.classicProblems.map((problem) => (
                <div
                  key={problem.title}
                  className="rounded-xl border border-line bg-panel-2 px-4 py-3 space-y-1.5"
                >
                  <p className="text-sm font-medium text-ink">{problem.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {problem.keyConcepts.map((kc) => (
                      <span
                        key={kc}
                        className="rounded-md bg-panel border border-line px-2 py-0.5 text-[10px] text-muted"
                      >
                        {kc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Notes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink">
              Your notes
            </p>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add your own notes, examples from your experience, or things to remember…"
              className="w-full min-h-[100px] resize-y rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition"
              rows={4}
            />
          </div>

          {/* Status Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-line/60">
            <span className="text-xs text-muted font-medium">Your comfort level:</span>
            {(['not_started', 'reading', 'comfortable'] as SDStatus[]).map((s) => (
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
