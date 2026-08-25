import type { ReactNode } from 'react'
import { ArrowRight, ListRestart, Flame, Trophy, CheckCircle2, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTracker } from '../hooks/useTracker'
import { ActivityHeatmap } from '../components/ActivityHeatmap'
import { ReadinessRadar } from '../components/ReadinessRadar'
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
  const { topics, problems, progressByProblem, streakDates, reviewEntries, error } = useTracker()

  const rows = buildTopicProgress(topics, problems, progressByProblem)
  const active = currentTopic(rows)
  const overall = overallPercent(rows)
  const streak = consecutiveStreak(streakDates)
  const totalSolved = rows.reduce((s, r) => s + r.solved, 0)
  const totalProblems = rows.reduce((s, r) => s + r.total, 0)


  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</p>
      ) : null}

      {/* Hero Overview Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Curriculum complete"
          value={`${overall}%`}
          hint={`${totalSolved} of ${totalProblems} problems solved`}
          icon={<CheckCircle2 className="size-4 text-easy" />}
        />
        <StatCard
          label="Daily streak"
          value={`${streak}`}
          hint="Consecutive active prep days"
          icon={<Flame className="size-4 text-gold fill-gold/20" />}
        />
        <StatCard
          label="Topics Mastered"
          value={`${rows.filter((r) => r.state === 'completed').length} / 17`}
          hint="100% completed topics"
          icon={<Trophy className="size-4 text-gold" />}
        />
      </section>

      {/* Next Recommended Topic Action */}
      {active ? (
        <section className="overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-gold-dim via-panel to-panel p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-gold">
            <Route className="size-3.5" />
            <span>Next Priority Topic</span>
          </div>

          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            {active.topic.order_index}. {active.topic.title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted">
            Master the mental models and interview gotchas first, then work through the easy-to-hard problem ladder.
          </p>

          <div className="mt-5 max-w-md">
            <ProgressBar
              value={active.percent}
              label={
                <>
                  <span className="font-medium">Topic Mastery</span>
                  <span className="font-semibold text-ink">
                    {active.solved}/{active.total} solved ({active.percent}%)
                  </span>
                </>
              }
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              to={`/topic/${active.topic.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-canvas transition hover:opacity-90 shadow-xs"
            >
              Continue Topic <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-easy/30 bg-easy/10 p-6 sm:p-8">
          <h1 className="font-serif text-3xl text-ink">100% Curriculum Completed! 🎉</h1>
          <p className="mt-2 text-sm text-muted">Every single curated problem is marked solved. Keep your review queue warm and drill mock sessions!</p>
        </section>
      )}

      {/* 365-Day Activity Heatmap */}
      <ActivityHeatmap streakDates={streakDates} totalSolved={totalSolved} />

      {/* Interview Readiness & Skill Radar */}
      <ReadinessRadar topicRows={rows} reviewCount={reviewEntries.length} />

      {/* Review Queue Preview Card */}
      <section className="rounded-3xl border border-line bg-panel p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gold-dim border border-gold/30">
              <ListRestart className="size-4.5 text-gold" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">Active Recall Queue</h2>
              <p className="text-xs text-muted">Struggled problems & 14-day spaced repetition queue.</p>
            </div>
          </div>
          <Link
            to="/review"
            className="rounded-full border border-line bg-panel-2 px-3.5 py-1.5 text-xs font-semibold text-gold hover:border-gold/40 transition shadow-xs"
          >
            Open Queue →
          </Link>
        </div>

        {reviewEntries.length === 0 ? (
          <p className="mt-4 text-xs sm:text-sm text-muted">
            Queue is currently empty! When you rate a problem as <strong className="text-hard">Struggled</strong> or haven't revisited a solve in 14 days, it automatically lands here.
          </p>
        ) : (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-gold/30 bg-gold-dim/40 px-4 py-3 text-xs text-gold">
            <span>
              <strong>{reviewEntries.length} problem{reviewEntries.length === 1 ? '' : 's'}</strong> require reinforcement.
            </span>
            <Link to="/review" className="font-semibold underline">
              Practice now
            </Link>
          </div>
        )}
      </section>

      {/* Linear Curriculum Roadmap */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink">Curriculum Roadmap</h2>
          <p className="text-xs sm:text-sm text-muted">17 foundational topics in monotonic order. Focus on one topic at a time.</p>
        </div>

        <ol className="relative mt-4 space-y-3 border-l border-line pl-5 sm:pl-6">
          {rows.map((row) => {
            const locked = row.state === 'upcoming'
            return (
              <li key={row.topic.id} className={locked ? 'opacity-50' : ''}>
                <span
                  className={`absolute -left-[5.5px] mt-3 size-2.5 rounded-full ring-4 ring-canvas ${
                    row.state === 'completed'
                      ? 'bg-easy'
                      : row.state === 'in_progress' || row.state === 'not_started'
                        ? 'bg-gold'
                        : 'bg-line'
                  }`}
                />
                <Link
                  to={`/topic/${row.topic.id}`}
                  className="block rounded-2xl border border-line bg-panel p-4 transition hover:border-gold/50 shadow-xs hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-mono text-muted">Topic {row.topic.order_index} of 17</p>
                      <p className="font-semibold text-ink text-base sm:text-lg">{row.topic.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-line bg-panel-2 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                        {stateLabel[row.state]}
                      </span>
                      <span className="text-xs font-mono font-medium text-ink">
                        {row.solved}/{row.total}
                      </span>
                    </div>
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
    <div className="rounded-2xl border border-line bg-panel p-5 shadow-xs">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
        {icon}
      </div>
      <p className="mt-2 font-serif text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  )
}
