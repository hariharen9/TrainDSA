import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Clock, ListRestart, Sparkles } from 'lucide-react'
import { ProblemCard } from '../components/ProblemCard'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'

export function ReviewPage() {
  const { user } = useAuth()
  const { problems, topics, progressByProblem, reviewEntries, updateProgress, loading, error } =
    useTracker()
  const [filter, setFilter] = useState<'all' | 'struggled' | 'overdue'>('all')

  const cards = useMemo(() => {
    return reviewEntries
      .map((entry) => {
        const problem = problems.find((item) => item.id === entry.problem_id)
        const topic = topics.find((item) => item.id === problem?.topic_id)
        if (!problem) return null
        const isStruggled = entry.confidence === 'struggled'
        const isOverdue = entry.status === 'solved' && isStruggled === false
        return { entry, problem, topic, isStruggled, isOverdue }
      })
      .filter((item) => item !== null)
      .sort((a, b) => new Date(a.entry.updated_at).getTime() - new Date(b.entry.updated_at).getTime())
  }, [problems, reviewEntries, topics])

  const struggledCount = cards.filter((c) => c.isStruggled).length
  const overdueCount = cards.filter((c) => c.isOverdue).length

  const filteredCards = useMemo(() => {
    if (filter === 'struggled') return cards.filter((c) => c.isStruggled)
    if (filter === 'overdue') return cards.filter((c) => c.isOverdue)
    return cards
  }, [cards, filter])

  if (loading) return <p className="text-sm text-muted">Loading review queue…</p>

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</p>
      ) : null}

      <header className="rounded-3xl border border-line bg-panel p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-gold">
          <ListRestart className="size-4 text-gold" />
          <span>Active Recall Engine</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Review Queue</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Problems automatically queue here if marked <strong className="text-hard">Struggled</strong> or if solved more than 14 days ago without recent practice. Re-test your mental model, update notes, and elevate confidence.
        </p>

        {/* Queue Stats Bar */}
        {cards.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-line/60">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                filter === 'all' ? 'bg-gold text-canvas font-semibold' : 'border border-line bg-panel-2 text-muted hover:text-ink'
              }`}
            >
              All Items ({cards.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('struggled')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                filter === 'struggled' ? 'bg-hard text-canvas font-semibold' : 'border border-line bg-panel-2 text-muted hover:text-ink'
              }`}
            >
              <AlertCircle className="size-3.5 text-hard" />
              <span>Struggled ({struggledCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('overdue')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                filter === 'overdue' ? 'bg-medium text-canvas font-semibold' : 'border border-line bg-panel-2 text-muted hover:text-ink'
              }`}
            >
              <Clock className="size-3.5 text-medium" />
              <span>14+ Days Inactive ({overdueCount})</span>
            </button>
          </div>
        )}
      </header>

      {filteredCards.length === 0 ? (
        <div className="rounded-3xl border border-easy/30 bg-easy/5 p-8 text-center sm:p-12">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-easy/10 border border-easy/30 text-easy mb-4">
            <Sparkles className="size-6" />
          </div>
          <h2 className="font-serif text-2xl text-ink">Review queue is empty!</h2>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            You are completely caught up. Keep progressing through the curriculum, and any problems needing reinforcement will show up automatically.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-canvas transition hover:opacity-90 shadow-xs"
          >
            Continue Curriculum Path
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredCards.map(({ entry, problem, topic, isStruggled }) => (
            <div key={entry.problem_id} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                {topic ? (
                  <Link to={`/topic/${topic.id}`} className="text-xs font-semibold text-gold hover:underline">
                    Topic {topic.order_index}: {topic.title}
                  </Link>
                ) : <span />}

                <span className="text-[11px] text-muted">
                  {isStruggled ? (
                    <span className="text-hard font-medium">Flagged as Struggled</span>
                  ) : (
                    <span>Last reviewed: {new Date(entry.updated_at).toLocaleDateString()}</span>
                  )}
                </span>
              </div>

              <ProblemCard
                problem={problem}
                progress={progressByProblem.get(problem.id) ?? entry}
                userId={user?.id}
                onUpdate={updateProgress}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
