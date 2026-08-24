import { useMemo, useState } from 'react'
import { Flame, Calendar, Trophy, CheckCircle2 } from 'lucide-react'
import { consecutiveStreak } from '../lib/progress'

type Props = {
  streakDates: string[]
  totalSolved: number
}

export function ActivityHeatmap({ streakDates, totalSolved }: Props) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null)

  const activityMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const d of streakDates) {
      map.set(d, (map.get(d) ?? 0) + 1)
    }
    return map
  }, [streakDates])

  const streak = consecutiveStreak(streakDates)

  // Generate 52 weeks (364 days) ending on today's week
  const calendarData = useMemo(() => {
    const weeks: { dateStr: string; count: number; dayOfWeek: number; month: string }[][] = []
    const today = new Date()
    const currentDayOfWeek = today.getDay() // 0 = Sun, 1 = Mon...

    // End on the Saturday of current week
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + (6 - currentDayOfWeek))

    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 52 * 7 + 1)

    const cursor = new Date(startDate)
    let currentWeek: { dateStr: string; count: number; dayOfWeek: number; month: string }[] = []

    while (cursor <= endDate) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const count = activityMap.get(dateStr) ?? 0
      const month = cursor.toLocaleString('default', { month: 'short' })

      currentWeek.push({
        dateStr,
        count,
        dayOfWeek: cursor.getDay(),
        month,
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      cursor.setDate(cursor.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }, [activityMap])

  // Get month labels positions
  const monthLabels = useMemo(() => {
    const labels: { month: string; index: number }[] = []
    let lastMonth = ''
    calendarData.forEach((week, index) => {
      const firstDayOfMonth = week.find((d) => d.dateStr.endsWith('-01'))
      const currentMonth = week[0]?.month
      if (currentMonth && currentMonth !== lastMonth && index % 4 === 0) {
        labels.push({ month: currentMonth, index })
        lastMonth = currentMonth
      } else if (firstDayOfMonth) {
        labels.push({ month: firstDayOfMonth.month, index })
        lastMonth = firstDayOfMonth.month
      }
    })
    return labels
  }, [calendarData])

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-panel-2/80 hover:ring-1 hover:ring-muted/40'
    if (count === 1) return 'bg-easy/30 hover:ring-1 hover:ring-easy'
    if (count === 2) return 'bg-easy/60 hover:ring-1 hover:ring-easy'
    if (count === 3) return 'bg-easy/85 hover:ring-1 hover:ring-easy'
    return 'bg-easy hover:ring-1 hover:ring-easy shadow-xs shadow-easy/30'
  }

  const activeDaysCount = streakDates.length

  return (
    <section className="rounded-3xl border border-line bg-panel p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Quick Metric Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gold-dim border border-gold/30">
            <Calendar className="size-4.5 text-gold" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">365-Day Activity Heatmap</h2>
            <p className="text-xs text-muted">Consistent daily practice builds long-term interview intuition.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-panel-2 px-3 py-1.5 font-medium">
            <Flame className="size-3.5 text-gold fill-gold/20" />
            <span>{streak} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-panel-2 px-3 py-1.5 font-medium">
            <Trophy className="size-3.5 text-gold" />
            <span>{activeDaysCount} Active Days</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-panel-2 px-3 py-1.5 font-medium">
            <CheckCircle2 className="size-3.5 text-easy" />
            <span>{totalSolved} Solved</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2 pt-1 scrollbar-none">
        <div className="min-w-[680px]">
          {/* Month labels */}
          <div className="flex text-[10px] text-muted font-mono mb-1.5 pl-6 h-4 relative">
            {monthLabels.map((lbl, i) => (
              <span
                key={`${lbl.month}-${i}`}
                className="absolute"
                style={{ left: `calc(${lbl.index * 13}px + 1.5rem)` }}
              >
                {lbl.month}
              </span>
            ))}
          </div>

          {/* Grid columns */}
          <div className="flex gap-1">
            {/* Days of week indicator */}
            <div className="flex flex-col gap-1 text-[9px] font-mono text-muted/60 pr-2 pt-0.5 select-none">
              <span className="h-2.5"></span>
              <span className="h-2.5">Mon</span>
              <span className="h-2.5"></span>
              <span className="h-2.5">Wed</span>
              <span className="h-2.5"></span>
              <span className="h-2.5">Fri</span>
              <span className="h-2.5"></span>
            </div>

            {/* Weeks */}
            {calendarData.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.dateStr}
                    onMouseEnter={() => setHoveredDay({ date: day.dateStr, count: day.count })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`size-2.5 sm:size-3 rounded-xs sm:rounded-sm transition-all duration-150 cursor-pointer ${getColorClass(
                      day.count,
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend & Tooltip status */}
          <div className="flex items-center justify-between text-[11px] text-muted pt-3">
            <div className="font-mono">
              {hoveredDay ? (
                <span className="text-ink font-medium">
                  {hoveredDay.count === 0 ? 'No activity' : `${hoveredDay.count} solve${hoveredDay.count === 1 ? '' : 's'}/attempt`}{' '}
                  on {new Date(hoveredDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              ) : (
                <span>Hover over squares to see daily consistency</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span>Less</span>
              <div className="size-2.5 rounded-xs bg-panel-2" />
              <div className="size-2.5 rounded-xs bg-easy/30" />
              <div className="size-2.5 rounded-xs bg-easy/60" />
              <div className="size-2.5 rounded-xs bg-easy/85" />
              <div className="size-2.5 rounded-xs bg-easy" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
