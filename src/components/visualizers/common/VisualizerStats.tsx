import type { ReactNode } from 'react'

export type StatItem = {
  label: string
  value: ReactNode
  accent?: boolean
  highlight?: boolean
  subValue?: string
}

export function VisualizerStats({ stats }: { stats: StatItem[] }) {
  if (!stats || stats.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`rounded-xl border p-2.5 sm:p-3 transition-all ${
            stat.highlight
              ? 'border-gold/60 bg-gold/10 shadow-xs'
              : stat.accent
              ? 'border-easy/40 bg-easy/5'
              : 'border-line bg-panel'
          }`}
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted truncate">
            {stat.label}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`font-mono text-sm sm:text-base font-semibold ${
                stat.highlight
                  ? 'text-gold'
                  : stat.accent
                  ? 'text-easy'
                  : 'text-ink'
              }`}
            >
              {stat.value}
            </span>
            {stat.subValue && (
              <span className="text-[10px] text-muted truncate">{stat.subValue}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
