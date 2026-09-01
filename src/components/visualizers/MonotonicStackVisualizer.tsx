import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type StackPreset = {
  temps: number[]
}

const PRESETS: PresetOption<StackPreset>[] = [
  {
    id: 'standard',
    label: 'Standard [73, 74, 75, 71, 69, 72, 76, 73]',
    value: { temps: [73, 74, 75, 71, 69, 72, 76, 73] },
    description: 'Classic Daily Temperatures sequence with nested drops and pops',
  },
  {
    id: 'descending',
    label: 'Strictly Cold [80, 75, 70, 65]',
    value: { temps: [80, 75, 70, 65] },
    description: 'Stack grows monotonically without pops until end',
  },
  {
    id: 'zigzag',
    label: 'Alternating [30, 60, 40, 70]',
    value: { temps: [30, 60, 40, 70] },
    description: 'Frequent pop resolutions on each peak',
  },
]

type StackItem = {
  index: number
  temp: number
}

type Step = {
  currentIndex: number
  currentTemp: number
  stack: StackItem[]
  answers: number[]
  poppedIndex?: number
  poppedTemp?: number
  resolvedDays?: number
  explanation: string
  actionType: 'check' | 'delete' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'res = [0] * len(temperatures)' },
  { lineNum: 2, code: 'stack = []  # pairs: (temp, index)' },
  { lineNum: 3, code: 'for i, t in enumerate(temperatures):' },
  { lineNum: 4, code: '    while stack and t > stack[-1][0]:' },
  { lineNum: 5, code: '        prev_t, prev_i = stack.pop()' },
  { lineNum: 6, code: '        res[prev_i] = i - prev_i' },
  { lineNum: 7, code: '    stack.append((t, i))' },
]

function generateStackSteps(temps: number[]): Step[] {
  const steps: Step[] = []
  const answers = new Array(temps.length).fill(0)
  const stack: StackItem[] = []

  for (let i = 0; i < temps.length; i++) {
    const t = temps[i]

    steps.push({
      currentIndex: i,
      currentTemp: t,
      stack: [...stack],
      answers: [...answers],
      explanation: `Day ${i} (Temperature: ${t}°). Checking if ${t}° is warmer than stack top (${stack.length > 0 ? `${stack[stack.length - 1].temp}° at day ${stack[stack.length - 1].index}` : 'stack empty'}).`,
      actionType: 'check',
      codeLine: 4,
    })

    while (stack.length > 0 && t > stack[stack.length - 1].temp) {
      const popped = stack.pop()!
      const days = i - popped.index
      answers[popped.index] = days

      steps.push({
        currentIndex: i,
        currentTemp: t,
        stack: [...stack],
        answers: [...answers],
        poppedIndex: popped.index,
        poppedTemp: popped.temp,
        resolvedDays: days,
        explanation: `🔥 POP: Day ${i} (${t}°) is warmer than day ${popped.index} (${popped.temp}°)! Waited ${days} day(s). Setting answers[${popped.index}] = ${days}.`,
        actionType: 'delete',
        codeLine: 6,
      })
    }

    stack.push({ index: i, temp: t })

    steps.push({
      currentIndex: i,
      currentTemp: t,
      stack: [...stack],
      answers: [...answers],
      explanation: `PUSH: Pushed day ${i} (${t}°) onto stack to wait for a future warmer day.`,
      actionType: 'insert',
      codeLine: 7,
    })
  }

  steps.push({
    currentIndex: temps.length,
    currentTemp: 0,
    stack: [...stack],
    answers: [...answers],
    explanation: `🏁 Traversal Finished! Unresolved days remaining in stack stay 0 (no warmer day ever arrived).`,
    actionType: 'done',
    codeLine: 1,
  })

  return steps
}

export function MonotonicStackVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<StackPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const temps = activePreset.value.temps
  const steps = useMemo(() => generateStackSteps(temps), [temps])
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

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
    { label: 'Current Day', value: currentStep?.currentIndex < temps.length ? `Day ${currentStep.currentIndex}` : 'Done' },
    { label: 'Today Temp', value: currentStep?.currentIndex < temps.length ? `${currentStep.currentTemp}°` : '-', highlight: true },
    { label: 'Stack Depth', value: `${currentStep?.stack.length} days waiting` },
    { label: 'Resolved Spans', value: `${currentStep?.answers.filter((x) => x > 0).length}/${temps.length}`, accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Stack"
        title="Monotonic Decreasing Stack (Daily Temperatures)"
        subtitle="Visualizing why monotonic ordering guarantees each element is pushed & popped at most once (O(N))."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<StackPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Temperature Bars & Output Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Main Array Display */}
          <div className="rounded-xl border border-line bg-panel p-4 lg:col-span-8">
            <div className="mb-3 flex items-center justify-between text-xs text-muted">
              <span className="font-semibold uppercase tracking-wider">Temperatures & Resolved Days</span>
              <span>Input Size: {temps.length}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 py-2">
              {temps.map((t, idx) => {
                const isCurrent = currentStep?.currentIndex === idx
                const isWaitingInStack = currentStep?.stack.some((s) => s.index === idx)
                const answer = currentStep?.answers[idx] ?? 0

                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`flex flex-col size-13 items-center justify-center rounded-xl font-mono text-xs font-bold border-2 transition-all ${
                        isCurrent
                          ? 'border-gold bg-gold/20 text-gold shadow-md shadow-gold/20 scale-105'
                          : isWaitingInStack
                          ? 'border-medium/60 bg-medium/10 text-medium'
                          : 'border-line bg-panel-2 text-ink/80'
                      }`}
                    >
                      <span className="text-sm font-extrabold">{t}°</span>
                      <span className="text-[10px] text-muted">i={idx}</span>
                    </div>

                    <div className="flex flex-col items-center text-[10px] font-mono">
                      <span className="text-muted">Wait:</span>
                      <span
                        className={`font-bold ${
                          answer > 0 ? 'text-easy' : 'text-muted/60'
                        }`}
                      >
                        {answer > 0 ? `+${answer}d` : '0'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Vertical Stack Visualizer */}
          <div className="flex flex-col rounded-xl border border-line bg-panel p-4 lg:col-span-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Monotonic Stack (LIFO)
              </span>
              <span className="text-[10px] text-gold font-mono">Top ➔</span>
            </div>

            <div className="flex-1 flex flex-col-reverse justify-start gap-1.5 rounded-lg border border-line/60 bg-panel-2 p-2 min-h-[140px]">
              {currentStep?.stack.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted text-center italic">
                  Stack is empty
                </div>
              ) : (
                currentStep?.stack.map((item, stackIdx) => {
                  const isTop = stackIdx === currentStep.stack.length - 1
                  return (
                    <div
                      key={item.index}
                      className={`flex items-center justify-between rounded-lg px-3 py-1.5 font-mono text-xs border transition-all ${
                        isTop
                          ? 'border-gold bg-gold/20 text-gold font-bold shadow-xs'
                          : 'border-line bg-panel text-ink'
                      }`}
                    >
                      <span>Day {item.index} ({item.temp}°)</span>
                      {isTop && <span className="text-[10px] uppercase font-bold text-gold">Top</span>}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'delete' ? 'WARMER DAY POP' : undefined}
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
