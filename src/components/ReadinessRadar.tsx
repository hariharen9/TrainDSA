import { useMemo } from 'react'
import { ShieldCheck, Target, TrendingUp } from 'lucide-react'
import type { TopicProgress } from '../lib/types'

type Props = {
  topicRows: TopicProgress[]
  reviewCount: number
}

export function ReadinessRadar({ topicRows, reviewCount }: Props) {
  const stats = useMemo(() => {
    const totalProblems = topicRows.reduce((sum, r) => sum + r.total, 0)
    const totalSolved = topicRows.reduce((sum, r) => sum + r.solved, 0)
    const completedTopics = topicRows.filter((r) => r.state === 'completed').length
    const startedTopics = topicRows.filter((r) => r.state === 'in_progress' || r.state === 'completed').length

    // Breadth score (0-35 points)
    const breadthScore = (startedTopics / 17) * 20 + (completedTopics / 17) * 15

    // Volume score (0-45 points)
    const volumeScore = totalProblems > 0 ? (totalSolved / totalProblems) * 45 : 0

    // Review hygiene score (0-20 points)
    const reviewPenalty = Math.min(20, reviewCount * 2)
    const reviewScore = Math.max(0, 20 - reviewPenalty)

    const readinessPercent = Math.min(100, Math.round(breadthScore + volumeScore + reviewScore))

    let grade = 'Novice'
    let gradeColor = 'text-muted'
    if (readinessPercent >= 90) {
      grade = 'Interview Ready (A+)'
      gradeColor = 'text-easy'
    } else if (readinessPercent >= 75) {
      grade = 'Strong Contender (A)'
      gradeColor = 'text-easy'
    } else if (readinessPercent >= 50) {
      grade = 'Competent (B)'
      gradeColor = 'text-gold'
    } else if (readinessPercent >= 25) {
      grade = 'In Progress (C)'
      gradeColor = 'text-medium'
    }

    // Identify strongest and weakest topics
    const sorted = [...topicRows].sort((a, b) => b.percent - a.percent)
    const strongest = sorted.filter((t) => t.percent > 0).slice(0, 3)
    const needsAttention = sorted.filter((t) => t.percent < 100).slice(-3).reverse()

    return {
      readinessPercent,
      grade,
      gradeColor,
      totalSolved,
      totalProblems,
      completedTopics,
      strongest,
      needsAttention,
    }
  }, [topicRows, reviewCount])

  return (
    <section className="rounded-3xl border border-line bg-panel p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gold-dim border border-gold/30">
            <ShieldCheck className="size-4.5 text-gold" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">Interview Readiness & Mastery</h2>
            <p className="text-xs text-muted">Multi-factor score based on breadth across 17 topics, solve volume, and retention.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted">Readiness Level</span>
            <p className={`font-serif text-lg font-bold ${stats.gradeColor}`}>{stats.grade}</p>
          </div>
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-canvas border border-line">
            <span className="font-serif text-xl font-bold text-ink">{stats.readinessPercent}%</span>
          </div>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted font-medium">
          <span>Overall Readiness Index</span>
          <span>{stats.readinessPercent} / 100</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-line/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold via-medium to-easy transition-all duration-500"
            style={{ width: `${stats.readinessPercent}%` }}
          />
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid gap-4 sm:grid-cols-2 pt-1">
        {/* Strongest topics */}
        <div className="rounded-2xl border border-line/70 bg-canvas/40 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-easy">
            <TrendingUp className="size-3.5" />
            <span>Strongest Topic Areas</span>
          </div>
          {stats.strongest.length > 0 ? (
            <ul className="space-y-1.5 text-xs">
              {stats.strongest.map((t) => (
                <li key={t.topic.id} className="flex items-center justify-between text-ink">
                  <span className="truncate max-w-[200px]">{t.topic.order_index}. {t.topic.title}</span>
                  <span className="font-mono text-easy font-semibold">{t.percent}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted italic">Solve problems in topic 1 to establish strengths.</p>
          )}
        </div>

        {/* Needs Attention */}
        <div className="rounded-2xl border border-line/70 bg-canvas/40 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gold">
            <Target className="size-3.5" />
            <span>Next Target Focus</span>
          </div>
          {stats.needsAttention.length > 0 ? (
            <ul className="space-y-1.5 text-xs">
              {stats.needsAttention.map((t) => (
                <li key={t.topic.id} className="flex items-center justify-between text-ink">
                  <span className="truncate max-w-[200px]">{t.topic.order_index}. {t.topic.title}</span>
                  <span className="font-mono text-muted">{t.percent}% done</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted italic">All 17 topics mastered!</p>
          )}
        </div>
      </div>
    </section>
  )
}
