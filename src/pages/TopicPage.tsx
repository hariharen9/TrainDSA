import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProblemCard } from '../components/ProblemCard'
import { MarkdownBody, ProgressBar } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import { buildTopicProgress, completionPercent } from '../lib/progress'

export function TopicPage() {
  const { topicId } = useParams()
  const { user } = useAuth()
  const { topics, problems, progressByProblem, updateProgress, loading, error } = useTracker()
  const [conceptOpen, setConceptOpen] = useState(true)
  const [gotchasOpen, setGotchasOpen] = useState(true)

  const rows = useMemo(
    () => buildTopicProgress(topics, problems, progressByProblem),
    [topics, problems, progressByProblem],
  )
  const row = rows.find((item) => item.topic.id === topicId)
  const upcoming = row?.state === 'upcoming'

  if (loading) return <p className="text-sm text-muted">Loading topic…</p>
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

      <Collapsible title="Concept" open={conceptOpen} onToggle={() => setConceptOpen((v) => !v)}>
        <MarkdownBody>{row.topic.concept_md}</MarkdownBody>
      </Collapsible>
      <Collapsible title="Interview gotchas" open={gotchasOpen} onToggle={() => setGotchasOpen((v) => !v)}>
        <MarkdownBody>{row.topic.gotchas_md}</MarkdownBody>
      </Collapsible>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Curated problems</h2>
        <p className="text-sm text-muted">Easy to hard. Status, confidence, and a note should take a couple of clicks.</p>
        {row.problems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            progress={progressByProblem.get(problem.id)}
            userId={user?.id}
            onUpdate={updateProgress}
          />
        ))}
      </section>
    </div>
  )
}

function Collapsible({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-line bg-panel">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h2 className="font-serif text-xl text-ink">{title}</h2>
        <ChevronDown className={`size-4 text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="border-t border-line px-5 py-4">{children}</div> : null}
    </section>
  )
}
