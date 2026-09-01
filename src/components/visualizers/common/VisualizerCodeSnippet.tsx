type CodeLine = {
  lineNum: number
  code: string
}

type VisualizerCodeSnippetProps = {
  lines: CodeLine[]
  activeLine: number
  language?: string
}

export function VisualizerCodeSnippet({
  lines,
  activeLine,
  language = 'python',
}: VisualizerCodeSnippetProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel font-mono text-xs shadow-inner">
      <div className="flex items-center justify-between border-b border-line/60 bg-panel-2 px-3 py-1.5 text-[10px] text-muted">
        <span>LOGIC / PSEUDOCODE</span>
        <span className="uppercase">{language}</span>
      </div>
      <div className="p-2 space-y-0.5 max-h-48 overflow-y-auto">
        {lines.map((item) => {
          const isActive = item.lineNum === activeLine
          return (
            <div
              key={item.lineNum}
              className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                isActive
                  ? 'bg-gold/15 text-gold font-semibold border-l-2 border-gold pl-1.5'
                  : 'text-muted/80 hover:text-ink'
              }`}
            >
              <span className="w-5 text-right text-[10px] opacity-40 select-none">
                {item.lineNum}
              </span>
              <span className="whitespace-pre truncate">{item.code}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
