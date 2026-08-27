import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Filter,
  Layers,
  Search,
  Shuffle,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react'
import { ProblemCard } from '../components/ProblemCard'
import { ProgressBar } from '../components/ui'
import { WhyCurriculumModal } from '../components/WhyCurriculumModal'
import { BLIND_75_IDS } from '../data/blind75'
import { useAuth } from '../hooks/useAuth'
import { useTracker } from '../hooks/useTracker'
import type { Difficulty, Problem, Topic } from '../lib/types'

type StatusFilter = 'all' | 'unattempted' | 'attempted' | 'solved'
type DiffFilter = 'all' | Difficulty

export function Blind75Page() {
  const { user } = useAuth()
  const { problems, topics, progressByProblem, updateProgress, loading, error } = useTracker()

  const [whyModalOpen, setWhyModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('all')
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all')
  const [groupByTopic, setGroupByTopic] = useState(true)

  // Filter down to only the 75 problems
  const blind75Problems = useMemo(() => {
    return problems.filter((p) => BLIND_75_IDS.has(p.id))
  }, [problems])

  // Topics that have at least one Blind 75 problem
  const blind75Topics = useMemo(() => {
    const topicIdsWithProblems = new Set(blind75Problems.map((p) => p.topic_id))
    return topics.filter((t) => topicIdsWithProblems.has(t.id))
  }, [topics, blind75Problems])

  // Stats calculation
  const stats = useMemo(() => {
    let solved = 0
    let attempted = 0
    let easySolved = 0
    let easyTotal = 0
    let medSolved = 0
    let medTotal = 0
    let hardSolved = 0
    let hardTotal = 0

    for (const p of blind75Problems) {
      const prog = progressByProblem.get(p.id)
      const isSolved = prog?.status === 'solved'
      const isAttempted = prog?.status === 'attempted'

      if (isSolved) solved++
      if (isAttempted) attempted++

      if (p.difficulty === 'easy') {
        easyTotal++
        if (isSolved) easySolved++
      } else if (p.difficulty === 'medium') {
        medTotal++
        if (isSolved) medSolved++
      } else if (p.difficulty === 'hard') {
        hardTotal++
        if (isSolved) hardSolved++
      }
    }

    const total = blind75Problems.length || 75
    const percent = Math.round((solved / total) * 100)

    return {
      total,
      solved,
      attempted,
      unattempted: total - solved - attempted,
      percent,
      easy: { solved: easySolved, total: easyTotal },
      medium: { solved: medSolved, total: medTotal },
      hard: { solved: hardSolved, total: hardTotal },
    }
  }, [blind75Problems, progressByProblem])

  // Filtered problems based on search and filters
  const filteredProblems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return blind75Problems.filter((p) => {
      // Search
      if (q && !p.title.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) {
        return false
      }

      // Topic
      if (selectedTopicId !== 'all' && p.topic_id !== selectedTopicId) {
        return false
      }

      // Difficulty
      if (diffFilter !== 'all' && p.difficulty !== diffFilter) {
        return false
      }

      // Status
      const prog = progressByProblem.get(p.id)
      const status = prog?.status ?? 'unattempted'

      if (statusFilter !== 'all' && status !== statusFilter) {
        return false
      }

      return true
    })
  }, [blind75Problems, searchQuery, selectedTopicId, diffFilter, statusFilter, progressByProblem])

  // Grouped by topic
  const groupedByTopicList = useMemo(() => {
    const groups: { topic: Topic; problems: Problem[] }[] = []

    for (const t of blind75Topics) {
      const topicProblems = filteredProblems.filter((p) => p.topic_id === t.id)
      if (topicProblems.length > 0) {
        groups.push({ topic: t, problems: topicProblems })
      }
    }

    return groups
  }, [blind75Topics, filteredProblems])

  // Random unsolved picker
  const pickRandomUnsolved = () => {
    const unsolved = blind75Problems.filter((p) => {
      const status = progressByProblem.get(p.id)?.status
      return status !== 'solved'
    })

    if (unsolved.length === 0) return

    const randomPick = unsolved[Math.floor(Math.random() * unsolved.length)]
    const element = document.getElementById(`problem-${randomPick.id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element.classList.add('ring-2', 'ring-gold', 'ring-offset-2')
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-gold', 'ring-offset-2')
      }, 2500)
    } else {
      // If filtered out, reset filter and scroll
      setStatusFilter('all')
      setDiffFilter('all')
      setSelectedTopicId('all')
      setSearchQuery('')
      setTimeout(() => {
        const el = document.getElementById(`problem-${randomPick.id}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted text-sm">
        Loading Blind 75 practice deck…
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</p>
      ) : null}

      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-gold-dim via-panel to-panel p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Zap className="size-4 fill-gold/20 text-gold" />
              <span>Fast-Track Practice</span>
            </div>
            <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
              Curated Blind 75
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              The high-yield 75 questions designed for direct problem solving. Jump straight into coding without walking through the full theory chapters.
            </p>
            <button
              type="button"
              onClick={() => setWhyModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline cursor-pointer"
            >
              <Compass className="size-3.5" />
              <span>Why these 17 patterns cover ~99% of DSA rounds →</span>
            </button>
          </div>

          {/* Quick Random Action */}
          <button
            type="button"
            onClick={pickRandomUnsolved}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-canvas shadow-md transition hover:opacity-90 active:scale-95 cursor-pointer"
          >
            <Shuffle className="size-4" />
            <span>Pick Next Unsolved</span>
          </button>
        </div>

        {/* Progress Bar & Badges */}
        <div className="mt-6 space-y-3 pt-6 border-t border-line/60">
          <ProgressBar
            value={stats.percent}
            label={
              <>
                <span className="flex items-center gap-1.5 text-ink font-semibold">
                  <Trophy className="size-3.5 text-gold" /> Overall Progress
                </span>
                <span className="text-gold font-mono">
                  {stats.solved}/{stats.total} Solved ({stats.percent}%)
                </span>
              </>
            }
          />

          {/* Difficulty Counters */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-easy/30 bg-easy/10 px-3 py-1 font-medium text-easy">
              <span className="size-1.5 rounded-full bg-easy" />
              Easy: {stats.easy.solved}/{stats.easy.total}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-medium/30 bg-medium/10 px-3 py-1 font-medium text-medium">
              <span className="size-1.5 rounded-full bg-medium" />
              Medium: {stats.medium.solved}/{stats.medium.total}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hard/30 bg-hard/10 px-3 py-1 font-medium text-hard">
              <span className="size-1.5 rounded-full bg-hard" />
              Hard: {stats.hard.solved}/{stats.hard.total}
            </span>
          </div>
        </div>
      </header>

      {/* Control Bar: Search & Filters */}
      <section className="space-y-4 rounded-3xl border border-line bg-panel p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by problem name or keywords…"
              className="w-full rounded-2xl border border-line bg-panel-2/70 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted/60 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          {/* Grouping Toggle */}
          <div className="flex items-center gap-1 self-end sm:self-auto rounded-xl border border-line bg-panel-2/80 p-1 text-xs font-medium text-muted">
            <button
              type="button"
              onClick={() => setGroupByTopic(true)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                groupByTopic ? 'bg-panel text-ink shadow-xs font-semibold' : 'hover:text-ink'
              }`}
            >
              <Layers className="size-3.5" />
              <span>By Topic</span>
            </button>
            <button
              type="button"
              onClick={() => setGroupByTopic(false)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                !groupByTopic ? 'bg-panel text-ink shadow-xs font-semibold' : 'hover:text-ink'
              }`}
            >
              <span>Flat List</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60 text-xs">
          <div className="flex items-center gap-1.5 text-muted mr-1">
            <Filter className="size-3.5 text-gold" />
            <span>Status:</span>
          </div>

          {(['all', 'unattempted', 'attempted', 'solved'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1 font-medium capitalize transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-gold text-canvas font-semibold shadow-xs'
                  : 'border border-line bg-panel-2/50 text-muted hover:text-ink hover:bg-panel-2'
              }`}
            >
              {status}
              {status === 'all' && ` (${stats.total})`}
              {status === 'solved' && ` (${stats.solved})`}
              {status === 'attempted' && ` (${stats.attempted})`}
              {status === 'unattempted' && ` (${stats.unattempted})`}
            </button>
          ))}

          <div className="h-4 w-px bg-line/80 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-muted mr-1">
            <span>Difficulty:</span>
          </div>

          {(['all', 'easy', 'medium', 'hard'] as DiffFilter[]).map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setDiffFilter(diff)}
              className={`rounded-full px-3 py-1 font-medium capitalize transition cursor-pointer ${
                diffFilter === diff
                  ? 'bg-gold text-canvas font-semibold shadow-xs'
                  : 'border border-line bg-panel-2/50 text-muted hover:text-ink hover:bg-panel-2'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Topic Selector */}
        <div className="flex items-center gap-2 pt-1 text-xs overflow-x-auto no-scrollbar py-1">
          <span className="text-muted shrink-0">Topic:</span>
          <button
            type="button"
            onClick={() => setSelectedTopicId('all')}
            className={`shrink-0 rounded-full px-3 py-1 font-medium transition cursor-pointer ${
              selectedTopicId === 'all'
                ? 'bg-gold/20 text-gold border border-gold/40 font-semibold'
                : 'border border-line bg-panel-2/40 text-muted hover:text-ink'
            }`}
          >
            All Topics
          </button>
          {blind75Topics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTopicId(t.id)}
              className={`shrink-0 rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                selectedTopicId === t.id
                  ? 'bg-gold/20 text-gold border border-gold/40 font-semibold'
                  : 'border border-line bg-panel-2/40 text-muted hover:text-ink'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </section>

      {/* Problem Cards List */}
      {filteredProblems.length === 0 ? (
        <div className="rounded-3xl border border-line bg-panel p-12 text-center">
          <Sparkles className="mx-auto size-8 text-muted/50 mb-3" />
          <p className="text-base font-medium text-ink">No matching problems found</p>
          <p className="mt-1 text-xs text-muted">Try clearing your filters or search query.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setDiffFilter('all')
              setSelectedTopicId('all')
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel-2 px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-gold/40"
          >
            Reset Filters
          </button>
        </div>
      ) : groupByTopic ? (
        // Grouped by Topic View
        <div className="space-y-8">
          {groupedByTopicList.map(({ topic, problems: topicProblems }) => {
            const topicSolved = topicProblems.filter(
              (p) => progressByProblem.get(p.id)?.status === 'solved',
            ).length

            return (
              <section key={topic.id} className="space-y-3">
                {/* Topic Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-gold-dim text-[11px] font-bold text-gold">
                      {topic.order_index}
                    </span>
                    <h2 className="font-serif text-xl font-semibold text-ink">
                      {topic.title}
                    </h2>
                    <span className="text-xs text-muted">
                      ({topicSolved}/{topicProblems.length} solved)
                    </span>
                  </div>

                  <Link
                    to={`/topic/${topic.id}`}
                    className="text-xs font-medium text-gold hover:underline"
                  >
                    Read concept notes →
                  </Link>
                </div>

                {/* Problem Cards in this Topic */}
                <div className="space-y-2.5">
                  {topicProblems.map((problem) => (
                    <div id={`problem-${problem.id}`} key={problem.id} className="transition-all duration-300 rounded-2xl">
                      <ProblemCard
                        problem={problem}
                        progress={progressByProblem.get(problem.id)}
                        userId={user?.id}
                        onUpdate={updateProgress}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        // Flat List View
        <div className="space-y-2.5">
          {filteredProblems.map((problem) => (
            <div id={`problem-${problem.id}`} key={problem.id} className="transition-all duration-300 rounded-2xl">
              <ProblemCard
                problem={problem}
                progress={progressByProblem.get(problem.id)}
                userId={user?.id}
                onUpdate={updateProgress}
              />
            </div>
          ))}
        </div>
      )}

      {/* Why 17 Topics & 99% Coverage Modal */}
      <WhyCurriculumModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
      />
    </div>
  )
}
