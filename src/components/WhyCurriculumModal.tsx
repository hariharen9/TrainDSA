import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Target,
  X,
  Zap,
} from 'lucide-react'

type WhyCurriculumModalProps = {
  isOpen: boolean
  onClose: () => void
}

const PATTERN_MAP = [
  {
    ask: 'Lookup / Frequency / Prefix Sums',
    topicNumber: 1,
    topicTitle: 'Arrays & Hashing',
    topicId: '01-arrays-hashing',
    badge: 'Fundamental',
  },
  {
    ask: 'Pairs / Triples / Trapping / Sorting',
    topicNumber: 2,
    topicTitle: 'Two Pointers',
    topicId: '02-two-pointers',
    badge: 'Pointer Space',
  },
  {
    ask: 'Substrings / Subarrays / Min Windows',
    topicNumber: 3,
    topicTitle: 'Sliding Window',
    topicId: '03-sliding-window',
    badge: 'Dynamic / Fixed',
  },
  {
    ask: 'Matching / Monotonic Next-Greater',
    topicNumber: 4,
    topicTitle: 'Stack',
    topicId: '04-stack',
    badge: 'Monotonic',
  },
  {
    ask: 'Sorted Search / Rotated / Answer Ranges',
    topicNumber: 5,
    topicTitle: 'Binary Search',
    topicId: '05-binary-search',
    badge: 'Logarithmic',
  },
  {
    ask: 'Pointers / In-place Mutation / Cycles',
    topicNumber: 6,
    topicTitle: 'Linked Lists',
    topicId: '06-linked-lists',
    badge: 'Fast & Slow',
  },
  {
    ask: 'Hierarchy / Subtree Recursion / Traversals',
    topicNumber: 7,
    topicTitle: 'Trees',
    topicId: '07-trees',
    badge: 'DFS / BFS',
  },
  {
    ask: 'Prefix Queries / Auto-complete / Word Grids',
    topicNumber: 8,
    topicTitle: 'Tries (Prefix Trees)',
    topicId: '08-tries',
    badge: 'Prefix Lookups',
  },
  {
    ask: 'Top-K / Streaming Medians / Scheduling',
    topicNumber: 9,
    topicTitle: 'Heap / Priority Queue',
    topicId: '09-heap-priority-queue',
    badge: 'Min/Max Heap',
  },
  {
    ask: 'Permutations / Combinations / State Pruning',
    topicNumber: 10,
    topicTitle: 'Backtracking',
    topicId: '10-backtracking',
    badge: 'Combinatorial',
  },
  {
    ask: 'Islands / Cycles / Topological Sort',
    topicNumber: 11,
    topicTitle: 'Graphs',
    topicId: '11-graphs',
    badge: 'Kahn & Union',
  },
  {
    ask: 'Shortest Path (Dijkstra) / MST / DSU',
    topicNumber: 12,
    topicTitle: 'Advanced Graphs',
    topicId: '12-advanced-graphs',
    badge: 'Dijkstra / Kruskal',
  },
  {
    ask: 'Decisions / Subsequences / Knapsack',
    topicNumber: 13,
    topicTitle: '1-D Dynamic Programming',
    topicId: '13-1d-dynamic-programming',
    badge: 'Optimal Substructure',
  },
  {
    ask: 'Grid Traversal / LCS / String Alignment',
    topicNumber: 14,
    topicTitle: '2-D Dynamic Programming',
    topicId: '14-2d-dynamic-programming',
    badge: '2D State Space',
  },
  {
    ask: 'Interval Merging / Overlap Removal',
    topicNumber: 15,
    topicTitle: 'Greedy & Intervals',
    topicId: '15-greedy',
    badge: 'Local Optimum',
  },
  {
    ask: 'XOR Tricks / Bitmask States',
    topicNumber: 17,
    topicTitle: 'Bit Manipulation',
    topicId: '17-bit-manipulation',
    badge: 'Bitwise Logic',
  },
]

export function WhyCurriculumModal({ isOpen, onClose }: WhyCurriculumModalProps) {
  const [filterQuery, setFilterQuery] = useState('')

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredPatterns = PATTERN_MAP.filter(
    (p) =>
      p.ask.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.topicTitle.toLowerCase().includes(filterQuery.toLowerCase()),
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 md:p-10 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-auto max-h-[90vh] overflow-hidden flex flex-col rounded-3xl border border-gold/30 bg-panel shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line bg-gradient-to-r from-gold-dim/40 via-panel to-panel p-6 sm:p-7">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Compass className="size-4 text-gold" />
              <span>Interview Readiness Thesis</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
              Why 17 Topics & 119 Problems Cover ~99% of DSA Rounds
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-2xl">
              Understanding why interviewers ask what they ask and why mastering this pattern core is 10x more effective than grinding 500+ random problems.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition hover:bg-panel-2 hover:text-ink cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-7">
          {/* The 45-Minute Reality Card */}
          <div className="rounded-2xl border border-line bg-panel-2/50 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Clock className="size-4 text-gold" />
              <span>The 45-Minute Interview Reality</span>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Coding interviews are strictly time-boxed to <strong>45 minutes</strong> (5 min introductions, 5 min your questions, leaving only <strong>~30–35 minutes</strong> of actual problem solving and whiteboarding).
            </p>

            {/* Time distribution bar */}
            <div className="space-y-2">
              <div className="flex h-3 w-full overflow-hidden rounded-full border border-line bg-panel">
                <div className="w-[12%] bg-muted/40" title="5m Intros" />
                <div className="w-[76%] bg-gold" title="30-35m Coding & Validation" />
                <div className="w-[12%] bg-easy/50" title="5m Q&A" />
              </div>
              <div className="flex justify-between text-[11px] text-muted font-mono">
                <span>05m: Intros</span>
                <span className="text-gold font-semibold">30–35m: Pattern Recognition & Coding</span>
                <span>05m: Q&A</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <div className="flex items-start gap-2.5 rounded-xl border border-line/70 bg-panel p-3 text-xs text-muted">
                <CheckCircle2 className="size-4 shrink-0 text-gold mt-0.5" />
                <span>
                  <strong className="text-ink font-medium">No 100-line esoteric structures:</strong> Interviewers cannot test obscure PhD algorithms (like Fenwick trees or suffix automata) because they take too long to write.
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-line/70 bg-panel p-3 text-xs text-muted">
                <CheckCircle2 className="size-4 shrink-0 text-easy mt-0.5" />
                <span>
                  <strong className="text-ink font-medium">100% Pattern-Engineered:</strong> Every legitimate interview question is built on one of these 17 core archetypes or a simple 2-step composition.
                </span>
              </div>
            </div>
          </div>

          {/* Pattern Mapping Table Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink flex items-center gap-2">
                  <Target className="size-4 text-gold" />
                  <span>Interview Question Archetype → Pattern Mapping</span>
                </h3>
                <p className="text-xs text-muted">
                  Click any row to jump straight into that topic’s concept notes and problem ladder.
                </p>
              </div>

              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter pattern or topic…"
                className="rounded-xl border border-line bg-panel-2 px-3 py-1.5 text-xs text-ink placeholder:text-muted/60 focus:border-gold/40 focus:outline-none w-full sm:w-56"
              />
            </div>

            {/* Pattern Table */}
            <div className="overflow-hidden rounded-2xl border border-line bg-panel">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-panel-2/80 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    <tr>
                      <th className="py-3 px-4">What Interviewers Ask</th>
                      <th className="py-3 px-4">How It Maps to Curriculum</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {filteredPatterns.map((row) => (
                      <tr
                        key={row.topicId}
                        className="transition hover:bg-panel-2/60 group"
                      >
                        <td className="py-3 px-4 font-medium text-ink">
                          <span className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-gold shrink-0" />
                            {row.ask}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gold text-[11px] font-bold">
                              Topic {row.topicNumber}:
                            </span>
                            <span className="font-semibold text-ink">
                              {row.topicTitle}
                            </span>
                            <span className="rounded bg-panel-2 border border-line px-1.5 py-0.2 text-[10px] text-muted hidden md:inline">
                              {row.badge}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/topic/${row.topicId}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-gold hover:underline font-medium text-[11px] transition"
                          >
                            <span>Open</span>
                            <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="rounded-2xl border border-gold/30 bg-gold-dim/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Zap className="size-5 text-gold shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-ink">Ready to jump into problem solving?</p>
                <p className="text-muted">
                  Use our curated <strong>Blind 75</strong> fast-track mode or follow the guided 17-topic roadmap.
                </p>
              </div>
            </div>

            <Link
              to="/blind75"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-semibold text-canvas transition hover:opacity-90 shrink-0 cursor-pointer shadow-xs"
            >
              <Zap className="size-3.5 fill-canvas" />
              <span>Launch Blind 75</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
