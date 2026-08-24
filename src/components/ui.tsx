import type { ReactNode } from 'react'
import Markdown from 'react-markdown'

export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted [&_code]:rounded [&_code]:bg-panel-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-gold [&_li]:ml-4 [&_li]:list-disc [&_p]:text-ink/90 [&_strong]:text-ink">
      <Markdown>{children}</Markdown>
    </div>
  )
}

export function ProgressBar({
  value,
  label,
}: {
  value: number
  label?: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-center justify-between text-xs text-muted">
          {label}
        </div>
      ) : null}
      <div className="h-1.5 overflow-hidden rounded-full bg-line/70">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}
