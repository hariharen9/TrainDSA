import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PROBLEMS, TOPICS } from '../data/curriculum'
import { emptyProgress, needsReview } from '../lib/progress'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Problem, ProgressEntry, ProgressPatch, StreakLog, Topic } from '../lib/types'
import { useAuth } from './useAuth'

const LOCAL_PROGRESS_KEY = 'traindsa_local_progress'
const LOCAL_STREAKS_KEY = 'traindsa_local_streaks'

function loadLocalProgress(): ProgressEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as ProgressEntry[]) : []
  } catch {
    return []
  }
}

function saveLocalProgress(entries: ProgressEntry[]) {
  try {
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(entries))
  } catch {
    // ignore quota or private mode errors
  }
}

function loadLocalStreaks(): StreakLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STREAKS_KEY)
    return raw ? (JSON.parse(raw) as StreakLog[]) : []
  } catch {
    return []
  }
}

function saveLocalStreaks(streaks: StreakLog[]) {
  try {
    localStorage.setItem(LOCAL_STREAKS_KEY, JSON.stringify(streaks))
  } catch {
    // ignore
  }
}

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
  const [progress, setProgress] = useState<ProgressEntry[]>(() => loadLocalProgress())
  const [streaks, setStreaks] = useState<StreakLog[]>(() => loadLocalStreaks())
  const [loading, setLoading] = useState(Boolean(user && isSupabaseConfigured))
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)

    if (!user || !isSupabaseConfigured) {
      setProgress(loadLocalProgress())
      setStreaks(loadLocalStreaks())
      setLoading(false)
      return
    }

    setLoading(true)
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
      const userId = user?.id ?? 'guest'
      const current = progressByProblem.get(problemId) ?? emptyProgress(problemId, userId)
      const next: ProgressEntry = {
        ...current,
        ...patch,
        user_id: userId,
        problem_id: problemId,
        updated_at: new Date().toISOString(),
      }

      setProgress((prev) => {
        const index = prev.findIndex((entry) => entry.problem_id === problemId)
        const updated = index === -1 ? [...prev, next] : prev.map((entry, i) => (i === index ? next : entry))
        if (!user || !isSupabaseConfigured) {
          saveLocalProgress(updated)
        }
        return updated
      })

      if (next.status === 'attempted' || next.status === 'solved') {
        const today = new Date().toISOString().slice(0, 10)
        setStreaks((prev) => {
          if (prev.some((log) => log.activity_date === today)) return prev
          const updated = [
            ...prev,
            { id: `local-streak-${today}`, user_id: userId, activity_date: today },
          ]
          if (!user || !isSupabaseConfigured) {
            saveLocalStreaks(updated)
          }
          return updated
        })
      }

      if (user && isSupabaseConfigured) {
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
      topics: TOPICS,
      problems: PROBLEMS,
      progressByProblem,
      streakDates: streaks.map((log) => log.activity_date),
      loading,
      error,
      refresh: load,
      updateProgress,
      reviewEntries,
    }),
    [progressByProblem, streaks, loading, error, load, updateProgress, reviewEntries],
  )

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}

export function useTracker() {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider')
  return ctx
}
