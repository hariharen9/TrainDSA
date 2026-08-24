import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, X, Route, CheckCircle2, Circle, Clock, Building2, Tag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTracker } from '../hooks/useTracker'
import { ALL_COMPANIES, ALL_PATTERNS, PROBLEM_METADATA } from '../lib/problemMetadata'
import { difficultyClass, difficultyLabel } from '../lib/labels'
import type { Topic } from '../lib/types'

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

type SearchResultItem = {
  type: 'problem' | 'topic'
  id: string
  title: string
  subtitle: string
  topicId: string
  difficulty?: 'easy' | 'medium' | 'hard'
  status?: 'unattempted' | 'attempted' | 'solved'
  patterns?: string[]
  companies?: string[]
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { topics, problems, progressByProblem } = useTracker()
  const [query, setQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
    } else {
      setQuery('')
      setSelectedCompany(null)
      setSelectedPattern(null)
    }
  }, [isOpen])

  // Global Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const topicMap = useMemo(() => {
    const map = new Map<string, Topic>()
    for (const t of topics) map.set(t.id, t)
    return map
  }, [topics])

  const results: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list: SearchResultItem[] = []

    // 1. Search topics if no specific company/pattern filter
    if (!selectedCompany && !selectedPattern) {
      for (const t of topics) {
        if (!q || t.title.toLowerCase().includes(q) || t.concept_md.toLowerCase().includes(q)) {
          list.push({
            type: 'topic',
            id: t.id,
            title: `${t.order_index}. ${t.title}`,
            subtitle: `Topic · 17 Linear Stages`,
            topicId: t.id,
          })
        }
      }
    }

    // 2. Search problems
    for (const p of problems) {
      const meta = PROBLEM_METADATA[p.id] || { patterns: [], companies: [] }
      const entry = progressByProblem.get(p.id)
      const status = entry?.status ?? 'unattempted'
      const note = entry?.note?.toLowerCase() ?? ''
      const parentTopic = topicMap.get(p.topic_id)

      const matchesCompany = !selectedCompany || meta.companies.includes(selectedCompany)
      const matchesPattern = !selectedPattern || meta.patterns.some((pat) => pat.toLowerCase().includes(selectedPattern.toLowerCase()))

      if (!matchesCompany || !matchesPattern) continue

      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (parentTopic?.title.toLowerCase().includes(q) ?? false) ||
        meta.patterns.some((pat) => pat.toLowerCase().includes(q)) ||
        meta.companies.some((comp) => comp.toLowerCase().includes(q)) ||
        note.includes(q)

      if (matchesQuery) {
        list.push({
          type: 'problem',
          id: p.id,
          title: p.title,
          subtitle: parentTopic ? `Topic ${parentTopic.order_index}: ${parentTopic.title}` : 'Curated Problem',
          topicId: p.topic_id,
          difficulty: p.difficulty,
          status,
          patterns: meta.patterns,
          companies: meta.companies,
        })
      }
    }

    return list.slice(0, 30)
  }, [query, selectedCompany, selectedPattern, topics, problems, progressByProblem, topicMap])

  const handleSelect = (item: SearchResultItem) => {
    onClose()
    navigate(`/topic/${item.topicId}`)
  }

  // Keyboard arrow selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-canvas/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <Search className="size-5 text-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search problems, topics, FAANG tags, patterns, or notes (e.g. 'Two Sum', 'Google', 'Sliding Window')…"
            className="flex-1 bg-transparent text-sm sm:text-base text-ink outline-none placeholder:text-muted/60"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted hover:text-ink transition cursor-pointer p-1"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line px-2 py-0.5 text-[11px] font-mono text-muted hover:text-ink transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Company & Pattern Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-line/60 bg-panel-2/40 px-4 py-2 text-xs scrollbar-none">
          <span className="text-[10px] uppercase font-semibold text-muted shrink-0 flex items-center gap-1 mr-1">
            <Building2 className="size-3 text-gold" /> Filter:
          </span>

          {ALL_COMPANIES.slice(0, 6).map((comp) => {
            const active = selectedCompany === comp
            return (
              <button
                key={comp}
                type="button"
                onClick={() => {
                  setSelectedCompany(active ? null : comp)
                  setSelectedIndex(0)
                }}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition shrink-0 cursor-pointer ${
                  active
                    ? 'bg-gold text-canvas font-semibold shadow-xs'
                    : 'border border-line bg-panel text-muted hover:text-ink'
                }`}
              >
                {comp}
              </button>
            )
          })}

          <div className="h-4 w-px bg-line shrink-0 mx-1" />

          {ALL_PATTERNS.slice(0, 5).map((pat) => {
            const active = selectedPattern === pat
            return (
              <button
                key={pat}
                type="button"
                onClick={() => {
                  setSelectedPattern(active ? null : pat)
                  setSelectedIndex(0)
                }}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition shrink-0 cursor-pointer ${
                  active
                    ? 'bg-ink text-canvas font-semibold shadow-xs'
                    : 'border border-line bg-panel text-muted hover:text-ink'
                }`}
              >
                <Tag className="size-2.5 inline mr-1" />
                {pat}
              </button>
            )
          })}
        </div>

        {/* Results List */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.map((item, idx) => {
            const isSelected = idx === selectedIndex
            return (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 cursor-pointer transition ${
                  isSelected ? 'bg-gold-dim border border-gold/30' : 'hover:bg-panel-2/60 border border-transparent'
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {item.type === 'topic' ? (
                      <span className="flex size-5 items-center justify-center rounded-md bg-gold/20 text-gold">
                        <Route className="size-3.5" />
                      </span>
                    ) : (
                      <span>
                        {item.status === 'solved' ? (
                          <CheckCircle2 className="size-4 text-easy" />
                        ) : item.status === 'attempted' ? (
                          <Clock className="size-4 text-gold" />
                        ) : (
                          <Circle className="size-4 text-muted" />
                        )}
                      </span>
                    )}

                    {item.difficulty && (
                      <span
                        className={`rounded-full border px-2 py-0.2 text-[10px] font-semibold uppercase tracking-wider ${difficultyClass(
                          item.difficulty,
                        )}`}
                      >
                        {difficultyLabel(item.difficulty)}
                      </span>
                    )}

                    <p className="font-medium text-ink truncate text-sm sm:text-base">{item.title}</p>
                  </div>

                  <p className="text-xs text-muted truncate pl-6">{item.subtitle}</p>

                  {/* Company & Pattern Tags */}
                  {item.patterns && item.patterns.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pl-6 pt-0.5">
                      {item.companies?.slice(0, 3).map((comp) => (
                        <span key={comp} className="rounded bg-panel-2 px-1.5 py-0.2 text-[10px] font-medium text-muted">
                          {comp}
                        </span>
                      ))}
                      {item.patterns.slice(0, 2).map((pat) => (
                        <span key={pat} className="rounded border border-line px-1.5 py-0.2 text-[10px] text-gold font-mono">
                          {pat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <ArrowRight className={`size-4 transition ${isSelected ? 'text-gold translate-x-1' : 'text-muted/40'}`} />
              </div>
            )
          })}

          {results.length === 0 && (
            <div className="py-12 text-center text-sm text-muted">
              No matching problems or topics found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-line/60 bg-panel-2/30 px-4 py-2 text-[11px] text-muted">
          <span>
            Showing {results.length} result{results.length === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <span>
              <kbd className="rounded border border-line bg-panel px-1">↑</kbd>{' '}
              <kbd className="rounded border border-line bg-panel px-1">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded border border-line bg-panel px-1.5">↵</kbd> to select
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
