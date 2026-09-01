import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type TwoDPreset = {
  m: number
  n: number
}

const PRESETS: PresetOption<TwoDPreset>[] = [
  {
    id: 'grid-3x4',
    label: '3 × 4 Grid (10 Unique Paths)',
    value: { m: 3, n: 4 },
    description: 'Calculates number of ways to reach bottom-right from top-left',
  },
  {
    id: 'grid-3x3',
    label: '3 × 3 Grid (6 Unique Paths)',
    value: { m: 3, n: 3 },
    description: 'Symmetric grid paths',
  },
]

type Step = {
  activeRow: number
  activeCol: number
  dp: number[][]
  fromTop: number | null
  fromLeft: number | null
  explanation: string
  actionType: 'check' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'dp = [[1] * n for _ in range(m)]' },
  { lineNum: 2, code: 'for r in range(1, m):' },
  { lineNum: 3, code: '    for c in range(1, n):' },
  { lineNum: 4, code: '        dp[r][c] = dp[r - 1][c] + dp[r][c - 1]' },
  { lineNum: 5, code: 'return dp[m - 1][n - 1]' },
]

function generateTwoDPSteps(m: number, n: number): Step[] {
  const steps: Step[] = []
  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0))

  // Base cases: first row and col are 1
  for (let r = 0; r < m; r++) dp[r][0] = 1
  for (let c = 0; c < n; c++) dp[0][c] = 1

  steps.push({
    activeRow: 0,
    activeCol: 0,
    dp: dp.map((row) => [...row]),
    fromTop: null,
    fromLeft: null,
    explanation: 'Base cases initialized: Top row and Leftmost column are all 1s (only 1 way to move strictly right or strictly down).',
    actionType: 'check',
    codeLine: 1,
  })

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      const top = dp[r - 1][c]
      const left = dp[r][c - 1]
      dp[r][c] = top + left

      steps.push({
        activeRow: r,
        activeCol: c,
        dp: dp.map((row) => [...row]),
        fromTop: top,
        fromLeft: left,
        explanation: `Cell (${r}, ${c}): Paths from Top (${top}) + Paths from Left (${left}) = ${dp[r][c]} unique paths.`,
        actionType: 'insert',
        codeLine: 4,
      })
    }
  }

  steps.push({
    activeRow: m - 1,
    activeCol: n - 1,
    dp: dp.map((row) => [...row]),
    fromTop: null,
    fromLeft: null,
    explanation: `🏁 Finished! Bottom-right target reached: total unique paths = ${dp[m - 1][n - 1]}.`,
    actionType: 'done',
    codeLine: 5,
  })

  return steps
}

export function TwoDDPVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<TwoDPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { m, n } = activePreset.value
  const steps = useMemo(() => generateTwoDPSteps(m, n), [m, n])
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
    { label: 'Active Cell (r, c)', value: `(${currentStep?.activeRow}, ${currentStep?.activeCol})`, highlight: true },
    { label: 'Top Cell Paths', value: currentStep?.fromTop !== null ? `${currentStep?.fromTop}` : '-' },
    { label: 'Left Cell Paths', value: currentStep?.fromLeft !== null ? `${currentStep?.fromLeft}` : '-' },
    { label: 'Total Paths (Target)', value: currentStep?.dp[m - 1][n - 1] ?? 1, accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="2-D Dynamic Programming"
        title="Unique Paths: 2D Matrix Grid Tabulation"
        subtitle="Watch each cell combine subproblem paths from Top and Left in O(M × N) time."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<TwoDPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* 2D Matrix Cells Visualizer */}
        <div className="rounded-xl border border-line bg-panel p-6 flex flex-col items-center">
          <div className="flex flex-col gap-2.5">
            {currentStep?.dp.map((row, r) => (
              <div key={r} className="flex gap-2.5">
                {row.map((val, c) => {
                  const isCurrent =
                    currentStep.activeRow === r && currentStep.activeCol === c
                  const isTopSource =
                    currentStep.activeRow === r + 1 && currentStep.activeCol === c
                  const isLeftSource =
                    currentStep.activeRow === r && currentStep.activeCol === c + 1
                  const isCalculated = val > 0

                  return (
                    <div
                      key={c}
                      className={`flex size-14 sm:size-16 flex-col items-center justify-center rounded-2xl font-mono text-base font-bold border-2 transition-all ${
                        isCurrent
                          ? 'border-gold bg-gold/25 text-gold scale-110 shadow-lg shadow-gold/20'
                          : isTopSource || isLeftSource
                          ? 'border-easy bg-easy/20 text-easy scale-105'
                          : isCalculated
                          ? 'border-line bg-panel-2 text-ink'
                          : 'border-line/40 bg-panel-2/30 text-muted/40'
                      }`}
                    >
                      <span>{val > 0 ? val : '-'}</span>
                      <span className="text-[10px] text-muted font-normal">
                        ({r},{c})
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'insert' ? 'PATH ADDITION' : undefined}
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
