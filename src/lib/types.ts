export type Difficulty = 'easy' | 'medium' | 'hard'
export type ProgressStatus = 'unattempted' | 'attempted' | 'solved'
export type Confidence = 'struggled' | 'solved_with_hints' | 'solved_easily'

export type Topic = {
  id: string
  title: string
  order_index: number
  concept_md: string
  gotchas_md: string
  visualizer_id: string | null
  created_at?: string
}

export type Problem = {
  id: string
  topic_id: string
  title: string
  url: string
  difficulty: Difficulty
  order_index: number
  created_at?: string
}

export type ProgressEntry = {
  id: string
  user_id: string
  problem_id: string
  status: ProgressStatus
  confidence: Confidence | null
  note: string | null
  updated_at: string
}

export type StreakLog = {
  id: string
  user_id: string
  activity_date: string
}

export type ProgressPatch = {
  status?: ProgressStatus
  confidence?: Confidence | null
  note?: string | null
}

export type TopicProgress = {
  topic: Topic
  problems: Problem[]
  solved: number
  total: number
  percent: number
  state: 'not_started' | 'in_progress' | 'completed' | 'upcoming'
}

export type Database = {
  public: {
    Tables: {
      progress_entries: {
        Row: ProgressEntry
        Insert: Omit<ProgressEntry, 'id' | 'updated_at'> & { id?: string; updated_at?: string }
        Update: Partial<Omit<ProgressEntry, 'id' | 'user_id' | 'problem_id'>>
        Relationships: []
      }
      streak_logs: {
        Row: StreakLog
        Insert: Omit<StreakLog, 'id'> & { id?: string }
        Update: Partial<StreakLog>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      progress_status: ProgressStatus
      confidence_level: Confidence
    }
    CompositeTypes: Record<string, never>
  }
}
