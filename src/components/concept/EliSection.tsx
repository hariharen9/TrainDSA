import { BookOpen, Lightbulb, Zap } from 'lucide-react'
import type { TopicContent } from '../../content/types'

type EliExplain = NonNullable<TopicContent['eliExplain']>

export function EliSection({ eli }: { eli: EliExplain }) {
  return (
    <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-xs">
      {/* Teal/cyan top-accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-easy to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-easy/10 border border-easy/20">
            <BookOpen className="size-5 text-easy" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              Start Here
            </p>
            <h2 className="font-serif text-xl text-ink leading-tight">Plain English First</h2>
          </div>
        </div>

        <div className="space-y-5">
          {/* Hook */}
          <p className="text-base text-ink leading-relaxed font-medium">{eli.hook}</p>

          {/* Analogy callout */}
          <div className="flex gap-3 rounded-2xl border border-easy/25 bg-easy/5 px-4 py-4">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-easy" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-easy mb-1">
                Think of it like this
              </p>
              <p className="text-sm text-ink leading-relaxed">{eli.analogy}</p>
            </div>
          </div>

          {/* Key ideas */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              What you need to know
            </p>
            <ul className="space-y-2">
              {eli.keyIdeas.map((idea, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-easy/15 text-[10px] font-bold text-easy">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* One-liner shortcut */}
          <div className="flex items-center gap-2 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3">
            <Zap className="size-3.5 shrink-0 text-gold" />
            <p className="text-xs font-medium text-ink">
              <span className="text-gold font-semibold">Interview shortcut: </span>
              {eli.oneliner}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
