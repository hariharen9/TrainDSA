import type { ReactNode } from 'react'
import { useState } from 'react'
import { ArrowRight, Flame, Trophy, CheckCircle2, Route, Zap, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTracker } from '../hooks/useTracker'
import { ActivityHeatmap } from '../components/ActivityHeatmap'
import { ReadinessRadar } from '../components/ReadinessRadar'
import { WhyCurriculumModal } from '../components/WhyCurriculumModal'
import { ProgressBar } from '../components/ui'
import { BLIND_75_IDS } from '../data/blind75'
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
  const [whyModalOpen, setWhyModalOpen] = useState(false)

  const rows = buildTopicProgress(topics, problems, progressByProblem)
  const active = currentTopic(rows)
  const overall = overallPercent(rows)
  const streak = consecutiveStreak(streakDates)
  const totalSolved = rows.reduce((s, r) => s + r.solved, 0)
  const totalProblems = rows.reduce((s, r) => s + r.total, 0)
  const blind75Solved = problems.filter(
    (p) => BLIND_75_IDS.has(p.id) && progressByProblem.get(p.id)?.status === 'solved',
  ).length

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

      {/* Fast-Track Blind 75 Card */}
      <section className="overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-panel via-panel to-gold-dim/20 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold text-canvas shadow-xs">
              <Zap className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-semibold text-ink">Curated Blind 75 Mode</h2>
                <span className="rounded-full border border-gold/40 bg-gold-dim px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                  Fast-Track
                </span>
              </div>
              <p className="mt-1 text-xs text-muted max-w-xl">
                Just want to solve problems directly without reading full concept chapters? Work through our curated set of 75 highest-yield interview problems.
              </p>
            </div>
          </div>

          <Link
            to="/blind75"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-semibold text-canvas transition hover:opacity-90 shadow-xs"
          >
            <span>Practice Blind 75</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-line/60">
          <ProgressBar
            value={Math.round((blind75Solved / 75) * 100)}
            label={
              <>
                <span className="text-muted">Blind 75 Solved</span>
                <span className="font-semibold text-ink font-mono">
                  {blind75Solved}/75 ({Math.round((blind75Solved / 75) * 100)}%)
                </span>
              </>
            }
          />
        </div>
      </section>

      {/* Interview Readiness & Skill Radar */}
      <ReadinessRadar topicRows={rows} reviewCount={reviewEntries.length} />

      {/* Linear Curriculum Roadmap */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink">Curriculum Roadmap</h2>
            <p className="text-xs sm:text-sm text-muted">17 foundational topics in monotonic order. Focus on one topic at a time.</p>
          </div>

          <button
            type="button"
            onClick={() => setWhyModalOpen(true)}
            className="self-start sm:self-auto text-xs text-gold hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>Why these 17 Topics?</span>
          </button>
        </div>

        <ol className="relative mt-4 space-y-3 border-l border-line pl-5 sm:pl-6">
          {rows.map((row) => {
            const locked = row.state === 'upcoming'
            return (
              <li key={row.topic.id} className={locked ? 'opacity-50' : ''}>
                <span
                  className={`absolute -left-[5.5px] mt-3 size-2.5 rounded-full ring-4 ring-canvas ${row.state === 'completed'
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

      {/* Why 17 Topics & 99% Coverage Modal */}
      <WhyCurriculumModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
      />
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
