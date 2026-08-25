import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import Prism from '../lib/prism'

type CodeBlockProps = {
  code: string
  language?: string
  title?: string
  showCopy?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language = 'python',
  title,
  showCopy = true,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const { highlighted, normLang } = useMemo(() => {
    const raw = (language || 'python').toLowerCase()
    const norm =
      raw === 'cpp' || raw === 'c++'
        ? 'cpp'
        : raw === 'java'
          ? 'java'
          : raw === 'typescript' || raw === 'ts'
            ? 'typescript'
            : raw === 'javascript' || raw === 'js'
              ? 'javascript'
              : 'python'

    const grammar = Prism.languages[norm] || Prism.languages.python
    try {
      return {
        highlighted: Prism.highlight(code.trim(), grammar, norm),
        normLang: norm,
      }
    } catch {
      return {
        highlighted: code.trim(),
        normLang: norm,
      }
    }
  }, [code, language])

  const handleCopy = () => {
    void navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const langLabel: Record<string, string> = {
    python: 'Python 3',
    py: 'Python 3',
    cpp: 'C++',
    'c++': 'C++',
    java: 'Java',
    typescript: 'TypeScript',
    ts: 'TypeScript',
    javascript: 'JavaScript',
    js: 'JavaScript',
  }

  const displayLang = langLabel[language.toLowerCase()] || language.toUpperCase()

  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-canvas shadow-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-line bg-panel-2/80 px-4 py-2 text-xs">
        <span className="font-semibold text-ink font-sans">{title || displayLang}</span>
        <div className="flex items-center gap-2">
          {title && (
            <span className="rounded bg-panel px-2 py-0.5 font-mono text-[10px] text-gold font-medium border border-line/60">
              {displayLang}
            </span>
          )}
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-gold transition cursor-pointer p-1"
              title="Copy code"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-easy" />
                  <span className="text-easy">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="relative p-4 overflow-x-auto bg-[#0a0f16]">
        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-[#e8eef7]">
          <code
            dangerouslySetInnerHTML={{ __html: highlighted || code }}
            className={`language-${normLang}`}
          />
        </pre>
      </div>
    </div>
  )
}
