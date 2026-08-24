import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProblemCard } from '../components/ProblemCard'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'

export function ReviewPage() {
  const { user } = useAuth()
  const { problems, topics, progressByProblem, reviewEntries, updateProgress, loading, error } =
    useTracker()

  const cards = useMemo(() => {
    return reviewEntries
      .map((entry) => {
        const problem = problems.find((item) => item.id === entry.problem_id)
        const topic = topics.find((item) => item.id === problem?.topic_id)
        if (!problem) return null
        return { entry, problem, topic }
      })
      .filter((item) => item !== null)
      .sort((a, b) => new Date(a.entry.updated_at).getTime() - new Date(b.entry.updated_at).getTime())
  }, [problems, reviewEntries, topics])

  if (loading) return <p className="text-sm text-muted">Loading review queue…</p>

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</p>
      ) : null}

      <header>
        <h1 className="font-serif text-3xl text-ink">Review queue</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Anything marked Struggled, plus solved problems whose last update is older than 14 days. Update confidence and notes here without leaving the queue.
        </p>
      </header>

      {cards.length === 0 ? (
        <p className="rounded-2xl border border-line bg-panel px-5 py-8 text-sm text-muted">
          Queue is empty. Keep logging confidence as you solve — this list fills itself.
        </p>
      ) : (
        <div className="space-y-4">
          {cards.map(({ entry, problem, topic }) => (
            <div key={entry.problem_id} className="space-y-2">
              {topic ? (
                <Link to={`/topic/${topic.id}`} className="text-xs text-gold hover:underline">
                  {topic.order_index}. {topic.title}
                </Link>
              ) : null}
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
