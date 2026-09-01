import { Info, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'

type VisualizerExplanationProps = {
  text: string
  actionType?: 'check' | 'match' | 'insert' | 'delete' | 'move' | 'found' | 'backtrack' | 'done' | 'info'
  highlightKey?: string
}

export function VisualizerExplanation({
  text,
  actionType = 'info',
  highlightKey,
}: VisualizerExplanationProps) {
  const getBadgeStyle = () => {
    switch (actionType) {
      case 'found':
      case 'match':
      case 'done':
        return {
          icon: <CheckCircle2 className="size-4 text-easy shrink-0 mt-0.5" />,
          border: 'border-easy/40 bg-easy/10',
          textColor: 'text-easy-light',
        }
      case 'backtrack':
      case 'delete':
        return {
          icon: <AlertTriangle className="size-4 text-hard shrink-0 mt-0.5" />,
          border: 'border-hard/40 bg-hard/10',
          textColor: 'text-hard',
        }
      case 'insert':
      case 'move':
        return {
          icon: <Lightbulb className="size-4 text-gold shrink-0 mt-0.5" />,
          border: 'border-gold/40 bg-gold-dim',
          textColor: 'text-ink',
        }
      case 'check':
      case 'info':
      default:
        return {
          icon: <Info className="size-4 text-muted shrink-0 mt-0.5" />,
          border: 'border-line bg-panel',
          textColor: 'text-ink',
        }
    }
  }

  const { icon, border } = getBadgeStyle()

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3.5 sm:p-4 transition-all ${border}`}>
      {icon}
      <div className="flex-1 text-xs sm:text-sm text-ink leading-relaxed">
        {highlightKey && (
          <span className="mr-2 inline-block rounded bg-panel-2 px-1.5 py-0.5 font-mono text-xs font-semibold text-gold border border-line">
            {highlightKey}
          </span>
        )}
        <span>{text}</span>
      </div>
    </div>
  )
}
