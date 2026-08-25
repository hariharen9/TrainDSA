import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProblemCard } from '../components/ProblemCard'
import { MarkdownBody, ProgressBar } from '../components/ui'
import { VisualizerSlot } from '../components/visualizers'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import { buildTopicProgress, completionPercent } from '../lib/progress'

export function TopicPage() {
  const { topicId } = useParams()
  const { user } = useAuth()
  const { topics, problems, progressByProblem, updateProgress, error } = useTracker()
  const [gotchasOpen, setGotchasOpen] = useState(false)
  const [problemsOpen, setProblemsOpen] = useState(false)

  const rows = useMemo(
    () => buildTopicProgress(topics, problems, progressByProblem),
    [topics, problems, progressByProblem],
  )
  const row = rows.find((item) => item.topic.id === topicId)
  const upcoming = row?.state === 'upcoming'

  if (!row) return <p className="text-sm text-hard">Topic not found.</p>

  const percent = completionPercent(row.solved, row.total)

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</p>
      ) : null}

      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold">
        <ArrowLeft className="size-4" /> Back to path
      </Link>

      <header className="rounded-3xl border border-line bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">
          Topic {row.topic.order_index} of 17
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{row.topic.title}</h1>
        <div className="mt-4 max-w-md">
          <ProgressBar
            value={percent}
            label={
              <>
                <span>Completion</span>
                <span>
                  {row.solved}/{row.total} · {percent}%
                </span>
              </>
            }
          />
        </div>
        {upcoming ? (
          <p className="mt-4 text-sm text-muted">
            This topic is still ahead on the linear path. You can read the notes, but finish the current topic first when you can.
          </p>
        ) : null}
      </header>

      {/* Concept is the main event: always expanded, no accordion friction. */}
      <section className="rounded-3xl border border-line bg-panel p-6 sm:p-8">
        <MarkdownBody>{row.topic.concept_md}</MarkdownBody>
      </section>

      <VisualizerSlot visualizerId={row.topic.visualizer_id} />

      <Collapsible title="Quick reference: interview gotchas" open={gotchasOpen} onToggle={() => setGotchasOpen((v) => !v)}>
        <MarkdownBody>{row.topic.gotchas_md}</MarkdownBody>
      </Collapsible>

      <Collapsible
        title="Practice problems"
        subtitle={`${row.solved}/${row.total} solved — optional once the concept clicks`}
        open={problemsOpen}
        onToggle={() => setProblemsOpen((v) => !v)}
        muted
      >
        <div className="space-y-3">
          {row.problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              progress={progressByProblem.get(problem.id)}
              userId={user?.id}
              onUpdate={updateProgress}
            />
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

function Collapsible({
  title,
  subtitle,
  open,
  onToggle,
  children,
  muted,
}: {
  title: string
  subtitle?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
  muted?: boolean
}) {
  return (
    <section className={`rounded-2xl border border-line ${muted ? 'bg-panel/50' : 'bg-panel'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <h2 className={muted ? 'text-sm font-medium text-muted' : 'font-serif text-xl text-ink'}>{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
        </div>
        <ChevronDown className={`size-4 text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="border-t border-line px-5 py-4">{children}</div> : null}
    </section>
  )
}
