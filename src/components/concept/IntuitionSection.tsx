import { Lightbulb } from 'lucide-react'
import { MarkdownBody } from '../ui'

export function IntuitionSection({ intuition }: { intuition: string }) {
  return (
    <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-xs">
      {/* Gold top-accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
            <Lightbulb className="size-5 text-gold" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              Mental Model
            </p>
            <h2 className="font-serif text-xl text-ink leading-tight">Intuition</h2>
          </div>
        </div>

        <MarkdownBody>{intuition}</MarkdownBody>
      </div>
    </div>
  )
}
