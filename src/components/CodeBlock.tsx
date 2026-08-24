import { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import { Check, Copy } from 'lucide-react'

type CodeBlockProps = {
  code: string
  language?: 'python' | 'cpp' | 'java' | 'typescript' | 'javascript'
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
  const [highlighted, setHighlighted] = useState('')

  useEffect(() => {
    const lang = language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'typescript' ? 'typescript' : 'python'
    const grammar = Prism.languages[lang] || Prism.languages.python
    try {
      const html = Prism.highlight(code.trim(), grammar, lang)
      setHighlighted(html)
    } catch {
      setHighlighted(code)
    }
  }, [code, language])

  const handleCopy = () => {
    void navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const langLabel = {
    python: 'Python 3',
    cpp: 'C++',
    java: 'Java',
    typescript: 'TypeScript',
    javascript: 'JavaScript',
  }[language]

  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-canvas shadow-xs ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-line bg-panel-2/80 px-4 py-2 text-xs">
          <span className="font-semibold text-ink font-sans">{title}</span>
          <div className="flex items-center gap-2">
            <span className="rounded bg-panel px-2 py-0.5 font-mono text-[10px] text-gold font-medium border border-line/60">
              {langLabel}
            </span>
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
      )}

      <div className="relative p-4 overflow-x-auto bg-[#0a0f16]">
        {!title && showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg border border-line bg-panel px-2.5 py-1 text-[11px] font-medium text-muted hover:text-gold transition cursor-pointer shadow-xs"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="size-3 text-easy" />
                <span className="text-easy">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}

        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-[#e8eef7]">
          <code
            dangerouslySetInnerHTML={{ __html: highlighted || code }}
            className={`language-${language}`}
          />
        </pre>
      </div>
    </div>
  )
}
