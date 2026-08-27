import type { ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'

const markdownClasses = [
  'space-y-3.5 text-sm leading-relaxed text-muted',
  // inline code
  '[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-panel-2 [&_:not(pre)>code]:border [&_:not(pre)>code]:border-line/60 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-xs [&_:not(pre)>code]:text-gold',
  // lists / paragraphs / emphasis
  '[&_ul]:my-2.5 [&_ul]:space-y-1.5 [&_li]:ml-5 [&_li]:list-disc [&_li::marker]:text-gold/70 [&_p]:text-ink/90 [&_strong]:text-ink [&_strong]:font-semibold [&_em]:text-ink/80',
  // section headings inside long-form concept content
  '[&_h2]:mt-7 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-6 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink first:[&_h2]:mt-0 first:[&_h2]:border-t-0 first:[&_h2]:pt-0',
  '[&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gold [&_h3]:tracking-tight',
  '[&_h4]:mt-3.5 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-ink',
  // blockquotes / callouts
  '[&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:bg-gold-dim/40 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r-xl [&_blockquote]:my-3.5 [&_blockquote]:text-ink/90 [&_blockquote_p]:my-1',
  // tables
  '[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-line [&_table]:text-xs',
  '[&_thead]:bg-panel-2',
  '[&_th]:border-b [&_th]:border-r last:[&_th]:border-r-0 [&_th]:border-line [&_th]:px-3.5 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink',
  '[&_td]:border-b [&_td]:border-r last:[&_td]:border-r-0 [&_td]:border-line/70 [&_td]:px-3.5 [&_td]:py-2.5 [&_td]:text-muted',
  '[&_tr:last-child_td]:border-b-0',
  '[&_tr:hover_td]:bg-panel-2/40',
  '[&_hr]:my-5 [&_hr]:border-line',
].join(' ')

export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className={markdownClasses}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children: codeChildren, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const textContent = String(codeChildren).replace(/\n$/, '')
            const isFenced = textContent.includes('\n') || Boolean(match)
            if (isFenced) {
              const lang = match ? match[1] : 'text'
              return (
                <CodeBlock
                  code={textContent}
                  language={lang}
                  className="my-3.5"
                />
              )
            }
            return (
              <code className={className} {...props}>
                {codeChildren}
              </code>
            )
          },
          pre({ children: preChildren }) {
            return <>{preChildren}</>
          },
        }}
      >
        {children}
      </Markdown>
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
    <div className="space-y-1.5 w-full">
      {label ? (
        <div className="flex items-center justify-between gap-3 text-xs text-muted w-full">
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
