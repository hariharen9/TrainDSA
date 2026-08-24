import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { emptyProgress, needsReview } from '../lib/progress'
import { supabase } from '../lib/supabase'
import type { Problem, ProgressEntry, ProgressPatch, StreakLog, Topic } from '../lib/types'
import { useAuth } from './useAuth'

type TrackerContextValue = {
  topics: Topic[]
  problems: Problem[]
  progressByProblem: Map<string, ProgressEntry>
  streakDates: string[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  updateProgress: (problemId: string, patch: ProgressPatch) => Promise<void>
  reviewEntries: ProgressEntry[]
}

const TrackerContext = createContext<TrackerContextValue | undefined>(undefined)

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [topics, setTopics] = useState<Topic[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [streaks, setStreaks] = useState<StreakLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [topicsRes, problemsRes] = await Promise.all([
      supabase.from('topics').select('*').order('order_index', { ascending: true }),
      supabase.from('problems').select('*').order('order_index', { ascending: true }),
    ])

    if (topicsRes.error) {
      setError(topicsRes.error.message)
      setLoading(false)
      return
    }
    if (problemsRes.error) {
      setError(problemsRes.error.message)
      setLoading(false)
      return
    }

    setTopics(topicsRes.data ?? [])
    setProblems(problemsRes.data ?? [])

    if (!user) {
      setProgress([])
      setStreaks([])
      setLoading(false)
      return
    }

    const [progressRes, streakRes] = await Promise.all([
      supabase.from('progress_entries').select('*').eq('user_id', user.id),
      supabase.from('streak_logs').select('*').eq('user_id', user.id).order('activity_date', { ascending: true }),
    ])

    if (progressRes.error) setError(progressRes.error.message)
    if (streakRes.error) setError(streakRes.error?.message ?? null)

    setProgress(progressRes.data ?? [])
    setStreaks(streakRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  const progressByProblem = useMemo(() => {
    const map = new Map<string, ProgressEntry>()
    for (const entry of progress) map.set(entry.problem_id, entry)
    return map
  }, [progress])

  const updateProgress = useCallback(
    async (problemId: string, patch: ProgressPatch) => {
      if (!user) return
      const current = progressByProblem.get(problemId) ?? emptyProgress(problemId, user.id)
      const next: ProgressEntry = {
        ...current,
        ...patch,
        user_id: user.id,
        problem_id: problemId,
        updated_at: new Date().toISOString(),
      }

      setProgress((prev) => {
        const index = prev.findIndex((entry) => entry.problem_id === problemId)
        if (index === -1) return [...prev, next]
        const copy = prev.slice()
        copy[index] = next
        return copy
      })

      if (next.status === 'attempted' || next.status === 'solved') {
        const today = new Date().toISOString().slice(0, 10)
        setStreaks((prev) => {
          if (prev.some((log) => log.activity_date === today)) return prev
          return [
            ...prev,
            { id: `local-streak-${today}`, user_id: user.id, activity_date: today },
          ]
        })
      }

      const { error: upsertError } = await supabase.from('progress_entries').upsert(
        {
          user_id: user.id,
          problem_id: problemId,
          status: next.status,
          confidence: next.confidence,
          note: next.note,
        },
        { onConflict: 'user_id,problem_id' },
      )

      if (upsertError) {
        setError(upsertError.message)
        await load()
      }
    },
    [load, progressByProblem, user],
  )

  const reviewEntries = useMemo(
    () => progress.filter(needsReview),
    [progress],
  )

  const value = useMemo(
    () => ({
      topics,
      problems,
      progressByProblem,
      streakDates: streaks.map((log) => log.activity_date),
      loading,
      error,
      refresh: load,
      updateProgress,
      reviewEntries,
    }),
    [topics, problems, progressByProblem, streaks, loading, error, load, updateProgress, reviewEntries],
  )

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}

export function useTracker() {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider')
  return ctx
}
