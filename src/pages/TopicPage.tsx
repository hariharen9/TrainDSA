import { ArrowLeft, ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProblemCard } from '../components/ProblemCard'
import { MarkdownBody, ProgressBar } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import { buildTopicProgress, completionPercent } from '../lib/progress'

type FilterType = 'all' | 'unattempted' | 'solved' | 'struggled'

export function TopicPage() {
  const { topicId } = useParams()
  const { user } = useAuth()
  const { topics, problems, progressByProblem, updateProgress, loading, error } = useTracker()
  const [conceptOpen, setConceptOpen] = useState(true)
  const [gotchasOpen, setGotchasOpen] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  const rows = useMemo(
    () => buildTopicProgress(topics, problems, progressByProblem),
    [topics, problems, progressByProblem],
  )
  const row = rows.find((item) => item.topic.id === topicId)
  const upcoming = row?.state === 'upcoming'

  const filteredProblems = useMemo(() => {
    if (!row) return []
    return row.problems.filter((problem) => {
      const entry = progressByProblem.get(problem.id)
      const status = entry?.status ?? 'unattempted'
      const confidence = entry?.confidence

      if (filter === 'unattempted') return status !== 'solved'
      if (filter === 'solved') return status === 'solved'
      if (filter === 'struggled') return confidence === 'struggled'
      return true
    })
  }, [row, progressByProblem, filter])

  if (loading) return <p className="text-sm text-muted">Loading topic…</p>
  if (!row) return <p className="text-sm text-hard">Topic not found.</p>

  const percent = completionPercent(row.solved, row.total)
  const easyCount = row.problems.filter((p) => p.difficulty === 'easy').length
  const mediumCount = row.problems.filter((p) => p.difficulty === 'medium').length
  const hardCount = row.problems.filter((p) => p.difficulty === 'hard').length

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</p>
      ) : null}

      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-gold transition">
        <ArrowLeft className="size-4" /> Back to path
      </Link>

      {/* Topic Hero Card */}
      <header className="rounded-3xl border border-line bg-panel p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gold">
            Topic {row.topic.order_index} of 17
          </p>
          <div className="flex items-center gap-2 text-xs text-muted font-mono">
            {easyCount > 0 && <span className="text-easy">{easyCount} Easy</span>}
            {mediumCount > 0 && <span>· <span className="text-medium">{mediumCount} Med</span></span>}
            {hardCount > 0 && <span>· <span className="text-hard">{hardCount} Hard</span></span>}
          </div>
        </div>

        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{row.topic.title}</h1>
        
        <div className="mt-5 max-w-md">
          <ProgressBar
            value={percent}
            label={
              <>
                <span className="font-medium">Mastery Progress</span>
                <span className="font-semibold text-ink">
                  {row.solved}/{row.total} solved ({percent}%)
                </span>
              </>
            }
          />
        </div>

        {upcoming ? (
          <div className="mt-4 rounded-xl border border-gold/30 bg-gold-dim px-4 py-2.5 text-xs text-gold">
            This topic is upcoming on the linear path. You can read the theory and gotchas, but finish the current topic first to build solid fundamentals.
          </div>
        ) : null}
      </header>

      {/* Collapsible Theory Concept */}
      <Collapsible title="Core Concept & Theory" badge="Must Read" open={conceptOpen} onToggle={() => setConceptOpen((v) => !v)}>
        <MarkdownBody>{row.topic.concept_md}</MarkdownBody>
      </Collapsible>

      {/* Collapsible Interview Gotchas */}
      <Collapsible title="Interview Gotchas & Edge Cases" badge="Pitfalls" open={gotchasOpen} onToggle={() => setGotchasOpen((v) => !v)}>
        <MarkdownBody>{row.topic.gotchas_md}</MarkdownBody>
      </Collapsible>

      {/* Curated Problem Set */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-ink">Curated Problem Set</h2>
            <p className="text-xs text-muted">Progression from basic to advanced. Use the stopwatch and capture your gotchas.</p>
          </div>

          {/* Quick Problem Filters */}
          <div className="flex items-center gap-1 rounded-xl border border-line bg-panel p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                filter === 'all' ? 'bg-gold text-canvas font-semibold' : 'text-muted hover:text-ink'
              }`}
            >
              All ({row.problems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unattempted')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                filter === 'unattempted' ? 'bg-gold text-canvas font-semibold' : 'text-muted hover:text-ink'
              }`}
            >
              <Circle className="size-3" />
              <span>To Do ({row.total - row.solved})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('solved')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                filter === 'solved' ? 'bg-gold text-canvas font-semibold' : 'text-muted hover:text-ink'
              }`}
            >
              <CheckCircle2 className="size-3" />
              <span>Solved ({row.solved})</span>
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              progress={progressByProblem.get(problem.id)}
              userId={user?.id}
              onUpdate={updateProgress}
            />
          ))}

          {filteredProblems.length === 0 && (
            <div className="rounded-2xl border border-line bg-panel p-8 text-center text-sm text-muted">
              No problems match the selected filter.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Collapsible({
  title,
  badge,
  open,
  onToggle,
  children,
}: {
  title: string
  badge?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-line bg-panel overflow-hidden shadow-xs transition hover:border-line/90">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-panel-2/40 transition"
      >
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif text-xl text-ink">{title}</h2>
          {badge && (
            <span className="rounded-full border border-gold/40 bg-gold-dim px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown className={`size-4 text-muted transition-transform duration-200 ${open ? 'rotate-180 text-gold' : ''}`} />
      </button>
      {open ? <div className="border-t border-line px-5 py-4">{children}</div> : null}
    </section>
  )
}
