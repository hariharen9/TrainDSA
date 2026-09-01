import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type IntervalPreset = {
  intervals: [number, number][]
}

const PRESETS: PresetOption<IntervalPreset>[] = [
  {
    id: 'standard',
    label: 'Standard [[1, 3], [2, 6], [8, 10], [15, 18]]',
    value: {
      intervals: [
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ],
    },
    description: '[1,3] and [2,6] merge into [1,6]',
  },
  {
    id: 'cascading',
    label: 'Cascading [[1, 4], [2, 5], [4, 7]]',
    value: {
      intervals: [
        [1, 4],
        [2, 5],
        [4, 7],
      ],
    },
    description: 'All intervals merge into single [1, 7]',
  },
]

type Step = {
  activeIdx: number
  merged: [number, number][]
  currentInterval: [number, number]
  isOverlap: boolean
  explanation: string
  actionType: 'check' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'intervals.sort(key=lambda x: x[0])' },
  { lineNum: 2, code: 'merged = [intervals[0]]' },
  { lineNum: 3, code: 'for start, end in intervals[1:]:' },
  { lineNum: 4, code: '    if start <= merged[-1][1]:  # Overlap!' },
  { lineNum: 5, code: '        merged[-1][1] = max(merged[-1][1], end)' },
  { lineNum: 6, code: '    else: merged.append([start, end])' },
  { lineNum: 7, code: 'return merged' },
]

function generateIntervalSteps(rawIntervals: [number, number][]): Step[] {
  const steps: Step[] = []
  const intervals = [...rawIntervals].sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = [[...intervals[0]]]

  steps.push({
    activeIdx: 0,
    merged: merged.map((i) => [...i]),
    currentInterval: intervals[0],
    isOverlap: false,
    explanation: `Sorted intervals by start time. Initialized merged list with first interval [${intervals[0][0]}, ${intervals[0][1]}].`,
    actionType: 'check',
    codeLine: 2,
  })

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i]
    const lastMerged = merged[merged.length - 1]

    if (start <= lastMerged[1]) {
      const prevEnd = lastMerged[1]
      lastMerged[1] = Math.max(lastMerged[1], end)

      steps.push({
        activeIdx: i,
        merged: merged.map((iv) => [...iv]),
        currentInterval: [start, end],
        isOverlap: true,
        explanation: `⚡ OVERLAP DETECTED: Interval [${start}, ${end}] starts before previous end (${start} <= ${prevEnd}). Merging into [${lastMerged[0]}, ${lastMerged[1]}].`,
        actionType: 'insert',
        codeLine: 5,
      })
    } else {
      merged.push([start, end])
      steps.push({
        activeIdx: i,
        merged: merged.map((iv) => [...iv]),
        currentInterval: [start, end],
        isOverlap: false,
        explanation: `No overlap: Interval [${start}, ${end}] starts after ${lastMerged[1]}. Appended as a new disjoint interval.`,
        actionType: 'check',
        codeLine: 6,
      })
    }
  }

  steps.push({
    activeIdx: intervals.length,
    merged: merged.map((iv) => [...iv]),
    currentInterval: [0, 0],
    isOverlap: false,
    explanation: `🏁 All intervals processed! Final merged output: [${merged.map((iv) => `[${iv[0]}, ${iv[1]}]`).join(', ')}].`,
    actionType: 'done',
    codeLine: 7,
  })

  return steps
}

export function IntervalsVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<IntervalPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const intervals = activePreset.value.intervals
  const steps = useMemo(() => generateIntervalSteps(intervals), [intervals])
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

  const maxVal = Math.max(...intervals.map((i) => i[1]), 18)

  useEffect(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [activePreset])

  useEffect(() => {
    if (!isPlaying) return
    const intervalMs = Math.max(300, 1100 / speed)
    timerRef.current = setInterval(() => {
      setStepIndex((curr) => {
        if (curr >= steps.length - 1) {
          setIsPlaying(false)
          return curr
        }
        return curr + 1
      })
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, steps.length])

  const stats: StatItem[] = [
    { label: 'Current Interval', value: currentStep?.activeIdx < intervals.length ? `[${intervals[currentStep.activeIdx][0]}, ${intervals[currentStep.activeIdx][1]}]` : 'Done', highlight: true },
    { label: 'Merged Count', value: `${currentStep?.merged.length} blocks` },
    { label: 'Sort Time', value: 'O(N log N)', subValue: 'By start' },
    { label: 'Scan Time', value: 'O(N) One-pass', accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Intervals"
        title="Merge Intervals: Timeline Fusion Visualizer"
        subtitle="Watch overlapping time ranges dynamically merge into unified blocks."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<IntervalPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Timeline Visualizer */}
        <div className="rounded-xl border border-line bg-panel p-6 space-y-6">
          {/* Input Intervals Timeline */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2 block">
              Original Sorted Intervals
            </span>
            <div className="space-y-2">
              {intervals.map(([st, en], idx) => {
                const isCurrent = currentStep?.activeIdx === idx
                const leftPercent = (st / maxVal) * 100
                const widthPercent = ((en - st) / maxVal) * 100

                return (
                  <div key={idx} className="relative h-7 w-full rounded-lg bg-panel-2 border border-line/60">
                    <div
                      className={`absolute top-0.5 bottom-0.5 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-gold text-canvas shadow-md shadow-gold/20 scale-105'
                          : 'bg-panel-2 border border-line text-ink'
                      }`}
                      style={{ left: `${leftPercent}%`, width: `${Math.max(8, widthPercent)}%` }}
                    >
                      [{st}, {en}]
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Merged Output Timeline */}
          <div className="pt-2 border-t border-line/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2 block">
              Consolidated Output `merged`
            </span>
            <div className="space-y-2">
              {currentStep?.merged.map(([st, en], idx) => {
                const leftPercent = (st / maxVal) * 100
                const widthPercent = ((en - st) / maxVal) * 100

                return (
                  <div key={idx} className="relative h-8 w-full rounded-lg bg-panel-2 border border-line/60">
                    <div
                      className="absolute top-0.5 bottom-0.5 rounded-md flex items-center justify-center font-mono text-xs font-bold bg-easy text-canvas shadow-xs transition-all"
                      style={{ left: `${leftPercent}%`, width: `${Math.max(8, widthPercent)}%` }}
                    >
                      [{st}, {en}]
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.isOverlap ? 'MERGED' : undefined}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <VisualizerControls
              currentStep={stepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying((p) => !p)}
              onStepForward={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
              onStepBackward={() => setStepIndex((i) => Math.max(0, i - 1))}
              onReset={() => setStepIndex(0)}
              onSeek={setStepIndex}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>
          <div className="lg:col-span-5">
            <VisualizerCodeSnippet
              lines={CODE_LINES}
              activeLine={currentStep?.codeLine ?? 1}
              language="python"
            />
          </div>
        </div>
      </div>
    </VisualizerCard>
  )
}
