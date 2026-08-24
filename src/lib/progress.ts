import type { Problem, ProgressEntry, Topic, TopicProgress } from './types'

const REVIEW_MS = 14 * 24 * 60 * 60 * 1000

export function emptyProgress(problemId: string, userId: string): ProgressEntry {
  return {
    id: `local-${problemId}`,
    user_id: userId,
    problem_id: problemId,
    status: 'unattempted',
    confidence: null,
    note: null,
    updated_at: new Date(0).toISOString(),
  }
}

export function completionPercent(solved: number, total: number): number {
  if (total === 0) return 0
  return Math.round((solved / total) * 100)
}

export function buildTopicProgress(
  topics: Topic[],
  problems: Problem[],
  progressByProblem: Map<string, ProgressEntry>,
): TopicProgress[] {
  const byTopic = new Map<string, Problem[]>()
  for (const problem of problems) {
    const list = byTopic.get(problem.topic_id) ?? []
    list.push(problem)
    byTopic.set(problem.topic_id, list)
  }

  const rows: TopicProgress[] = topics
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map((topic) => {
      const topicProblems = (byTopic.get(topic.id) ?? []).sort(
        (a, b) => a.order_index - b.order_index,
      )
      const solved = topicProblems.filter(
        (problem) => progressByProblem.get(problem.id)?.status === 'solved',
      ).length
      const total = topicProblems.length
      const percent = completionPercent(solved, total)
      const started = topicProblems.some((problem) => {
        const status = progressByProblem.get(problem.id)?.status
        return status === 'attempted' || status === 'solved'
      })
      return {
        topic,
        problems: topicProblems,
        solved,
        total,
        percent,
        state: percent === 100 && total > 0 ? 'completed' : started ? 'in_progress' : 'not_started',
      }
    })

  const currentIndex = rows.findIndex((row) => row.percent < 100)
  return rows.map((row, index) => {
    if (row.state === 'completed') return row
    if (currentIndex >= 0 && index > currentIndex) {
      return { ...row, state: 'upcoming' }
    }
    return row
  })
}

export function currentTopic(rows: TopicProgress[]): TopicProgress | undefined {
  return rows.find((row) => row.percent < 100)
}

export function overallPercent(rows: TopicProgress[]): number {
  const total = rows.reduce((sum, row) => sum + row.total, 0)
  const solved = rows.reduce((sum, row) => sum + row.solved, 0)
  return completionPercent(solved, total)
}

export function consecutiveStreak(activityDates: string[]): number {
  if (activityDates.length === 0) return 0

  const unique = [...new Set(activityDates)].sort()
  const today = toUtcDateString(new Date())
  const yesterday = toUtcDateString(new Date(Date.now() - 86_400_000))
  const latest = unique[unique.length - 1]
  if (latest !== today && latest !== yesterday) return 0

  let streak = 1
  for (let i = unique.length - 1; i > 0; i -= 1) {
    const newer = parseUtcDate(unique[i])
    const older = parseUtcDate(unique[i - 1])
    const delta = (newer.getTime() - older.getTime()) / 86_400_000
    if (delta === 1) streak += 1
    else break
  }
  return streak
}

export function needsReview(entry: ProgressEntry): boolean {
  if (entry.confidence === 'struggled') return true
  if (entry.status !== 'solved') return false
  const updated = new Date(entry.updated_at).getTime()
  return Date.now() - updated >= REVIEW_MS
}

export function toUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function parseUtcDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`)
}
