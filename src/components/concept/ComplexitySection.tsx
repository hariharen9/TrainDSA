import { Clock, Database } from 'lucide-react'
import type { ComplexityInfo } from '../../content/types'

function ComplexityCard({
  label,
  badge,
  detail,
  icon,
  accentClass,
  badgeClass,
}: {
  label: string
  badge: string
  detail?: string
  icon: React.ReactNode
  accentClass: string
  badgeClass: string
}) {
  return (
    <div
      className={`flex-1 rounded-2xl border p-5 flex flex-col gap-3 ${accentClass}`}
    >
      {/* Label row */}
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-muted">
          {label} Complexity
        </span>
      </div>

      {/* Big complexity badge */}
      <div className="flex items-center">
        <span
          className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight ${badgeClass}`}
        >
          {badge}
        </span>
      </div>

      {/* Detail */}
      {detail && (
        <p className="text-xs text-muted leading-relaxed border-t border-line/60 pt-3">
          {detail}
        </p>
      )}
    </div>
  )
}

export function ComplexitySection({ complexity }: { complexity: ComplexityInfo }) {
  return (
    <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-xs">
      <div className="p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-semibold mb-4">
          Big-O Analysis
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <ComplexityCard
            label="Time"
            badge={complexity.time}
            detail={complexity.timeDetail}
            icon={<Clock className="size-4 text-gold" />}
            accentClass="border-gold/30 bg-gold-dim/30"
            badgeClass="text-gold"
          />
          <ComplexityCard
            label="Space"
            badge={complexity.space}
            detail={complexity.spaceDetail}
            icon={<Database className="size-4 text-[#60a5fa]" />}
            accentClass="border-[#60a5fa]/20 bg-[#60a5fa]/5"
            badgeClass="text-[#60a5fa]"
          />
        </div>
      </div>
    </div>
  )
}
