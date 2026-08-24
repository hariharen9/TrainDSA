import type { ReactNode } from 'react'
import { ArrowRight, ListRestart, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTracker } from '../hooks/useTracker'
import { ProgressBar } from '../components/ui'
import {
  buildTopicProgress,
  consecutiveStreak,
  currentTopic,
  overallPercent,
} from '../lib/progress'

const stateLabel = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  upcoming: 'Upcoming',
} as const

export function DashboardPage() {
  const { topics, problems, progressByProblem, streakDates, reviewEntries, loading, error } =
    useTracker()

  const rows = buildTopicProgress(topics, problems, progressByProblem)
  const active = currentTopic(rows)
  const overall = overallPercent(rows)
  const streak = consecutiveStreak(streakDates)

  if (loading) return <p className="text-sm text-muted">Loading curriculum…</p>

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Curriculum complete" value={`${overall}%`} hint={`${rows.reduce((s, r) => s + r.solved, 0)} / ${rows.reduce((s, r) => s + r.total, 0)} problems solved`} />
        <StatCard
          label="Daily streak"
          value={`${streak}`}
          hint="Consecutive days with an attempt or solve"
          icon={<Flame className="size-4 text-gold" />}
        />
      </section>

      {active ? (
        <section className="overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold-dim to-panel p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Next action</p>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            {active.topic.order_index}. {active.topic.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Stay on the current topic until it is complete. Concept and interview gotchas come before the problem set.
          </p>
          <div className="mt-5 max-w-md">
            <ProgressBar
              value={active.percent}
              label={
                <>
                  <span>Topic progress</span>
                  <span>
                    {active.solved}/{active.total}
                  </span>
                </>
              }
            />
          </div>
          <Link
            to={`/topic/${active.topic.id}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-canvas"
          >
            Continue topic <ArrowRight className="size-4" />
          </Link>
        </section>
      ) : (
        <section className="rounded-3xl border border-easy/30 bg-easy/10 p-6">
          <h1 className="font-serif text-3xl text-ink">Path complete</h1>
          <p className="mt-2 text-sm text-muted">Every curated problem is marked solved. Keep the review queue warm.</p>
        </section>
      )}

      <section className="rounded-3xl border border-line bg-panel p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListRestart className="size-4 text-gold" />
            <h2 className="font-serif text-xl">Needs review</h2>
          </div>
          <Link to="/review" className="text-sm text-gold hover:underline">
            Open queue
          </Link>
        </div>
        {reviewEntries.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing queued. Struggled problems and solves older than 14 days appear here.</p>
        ) : (
          <p className="mt-3 text-sm text-muted">
            {reviewEntries.length} problem{reviewEntries.length === 1 ? '' : 's'} need reinforcement.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-serif text-2xl">Curriculum roadmap</h2>
        <p className="mt-1 text-sm text-muted">Seventeen topics in order. Upcoming steps stay visually quiet so the path stays linear.</p>
        <ol className="relative mt-6 space-y-3 border-l border-line pl-6">
          {rows.map((row) => {
            const locked = row.state === 'upcoming'
            return (
              <li key={row.topic.id} className={locked ? 'opacity-45' : ''}>
                <span
                  className={`absolute -left-[5px] mt-2 size-2.5 rounded-full ${
                    row.state === 'completed'
                      ? 'bg-easy'
                      : row.state === 'in_progress' || row.state === 'not_started'
                        ? 'bg-gold'
                        : 'bg-line'
                  }`}
                />
                <Link
                  to={`/topic/${row.topic.id}`}
                  className="block rounded-2xl border border-line bg-panel px-4 py-3 hover:border-gold/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted">Topic {row.topic.order_index} of 17</p>
                      <p className="font-medium text-ink">{row.topic.title}</p>
                    </div>
                    <span className="rounded-full border border-line px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted">
                      {stateLabel[row.state]}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={row.percent} />
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  hint: string
  icon?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted">
        {label}
        {icon}
      </div>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  )
}
