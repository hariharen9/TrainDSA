import type { ReactNode } from 'react'
import Markdown from 'react-markdown'

const markdownClasses = [
  'space-y-3 text-sm leading-relaxed text-muted',
  // inline code
  '[&_code]:rounded [&_code]:bg-panel-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-gold',
  // lists / paragraphs / emphasis
  '[&_li]:ml-4 [&_li]:list-disc [&_p]:text-ink/90 [&_strong]:text-ink [&_em]:text-ink/80',
  // section headings inside long-form concept content
  '[&_h2]:mt-6 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-5 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-ink first:[&_h2]:mt-0 first:[&_h2]:border-t-0 first:[&_h2]:pt-0',
  '[&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink',
  // fenced code blocks: reset the inline-code pill styling, render as a proper block
  '[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-line [&_pre]:bg-canvas [&_pre]:p-4',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-ink/90',
  '[&_hr]:my-2 [&_hr]:border-line',
].join(' ')

export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className={markdownClasses}>
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
