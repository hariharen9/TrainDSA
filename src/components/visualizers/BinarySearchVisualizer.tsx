import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type BSPreset = {
  nums: number[]
  target: number
}

const PRESETS: PresetOption<BSPreset>[] = [
  {
    id: 'found-right',
    label: 'Standard [-1, 0, 3, 5, 9, 12] (Target 9)',
    value: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
    description: 'Target lies in the right partition',
  },
  {
    id: 'found-left',
    label: 'Large Array [2, 5, 8, 12, 16, 23, 38, 56] (Target 5)',
    value: { nums: [2, 5, 8, 12, 16, 23, 38, 56], target: 5 },
    description: 'Target lies in the left partition',
  },
  {
    id: 'missing',
    label: 'Target Not Found [1, 3, 5, 7, 9] (Target 4)',
    value: { nums: [1, 3, 5, 7, 9], target: 4 },
    description: 'Search range collapses with low > high',
  },
]

type Step = {
  low: number
  high: number
  mid: number
  midVal: number
  target: number
  status: 'searching' | 'found' | 'not_found'
  eliminatedRange?: [number, number]
  searchSpaceSize: number
  explanation: string
  actionType: 'check' | 'move' | 'found' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'low, high = 0, len(nums) - 1' },
  { lineNum: 2, code: 'while low <= high:' },
  { lineNum: 3, code: '    mid = (low + high) // 2' },
  { lineNum: 4, code: '    if nums[mid] == target: return mid' },
  { lineNum: 5, code: '    elif nums[mid] < target: low = mid + 1' },
  { lineNum: 6, code: '    else: high = mid - 1' },
  { lineNum: 7, code: 'return -1' },
]

function generateBinarySearchSteps(nums: number[], target: number): Step[] {
  const steps: Step[] = []
  let low = 0
  let high = nums.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const midVal = nums[mid]
    const spaceSize = high - low + 1

    steps.push({
      low,
      high,
      mid,
      midVal,
      target,
      status: 'searching',
      searchSpaceSize: spaceSize,
      explanation: `Active window [${low}..${high}] (size ${spaceSize}). Calculated mid = (${low} + ${high}) // 2 = index ${mid} (value ${midVal}). Comparing with target ${target}.`,
      actionType: 'check',
      codeLine: 4,
    })

    if (midVal === target) {
      steps.push({
        low,
        high,
        mid,
        midVal,
        target,
        status: 'found',
        searchSpaceSize: spaceSize,
        explanation: `🎯 TARGET FOUND! nums[${mid}] == ${target}. Return index ${mid}.`,
        actionType: 'found',
        codeLine: 4,
      })
      return steps
    }

    if (midVal < target) {
      steps.push({
        low,
        high,
        mid,
        midVal,
        target,
        status: 'searching',
        eliminatedRange: [low, mid],
        searchSpaceSize: spaceSize,
        explanation: `nums[${mid}] (${midVal}) < target (${target}). Since array is sorted, all elements from index ${low} to ${mid} are too small. Setting low = mid + 1 (${mid + 1}).`,
        actionType: 'move',
        codeLine: 5,
      })
      low = mid + 1
    } else {
      steps.push({
        low,
        high,
        mid,
        midVal,
        target,
        status: 'searching',
        eliminatedRange: [mid, high],
        searchSpaceSize: spaceSize,
        explanation: `nums[${mid}] (${midVal}) > target (${target}). All elements from index ${mid} to ${high} are too large. Setting high = mid - 1 (${mid - 1}).`,
        actionType: 'move',
        codeLine: 6,
      })
      high = mid - 1
    }
  }

  steps.push({
    low,
    high,
    mid: -1,
    midVal: 0,
    target,
    status: 'not_found',
    searchSpaceSize: 0,
    explanation: `❌ Search Range Collapsed (low > high). Target ${target} does not exist in array. Return -1.`,
    actionType: 'done',
    codeLine: 7,
  })

  return steps
}

export function BinarySearchVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<BSPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { nums, target } = activePreset.value
  const steps = useMemo(() => generateBinarySearchSteps(nums, target), [nums, target])
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
    { label: 'Pointers [Low, High]', value: `[${currentStep?.low}, ${currentStep?.high}]` },
    { label: 'Mid Index & Value', value: currentStep?.mid >= 0 ? `idx ${currentStep.mid} (${currentStep.midVal})` : '-', highlight: true },
    { label: 'Target', value: target },
    { label: 'Active Search Space', value: `${currentStep?.searchSpaceSize} elements`, accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Binary Search"
        title="Binary Search (Divide & Conquer)"
        subtitle="Watch how halving the search space achieves O(log N) runtime."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<BSPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Array Visualization with eliminated masks */}
        <div className="rounded-xl border border-line bg-panel p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider">Sorted Array</span>
            <span>Target: <strong className="text-gold font-mono">{target}</strong></span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4">
            {nums.map((val, idx) => {
              const isMid = currentStep?.mid === idx
              const isLow = currentStep?.low === idx
              const isHigh = currentStep?.high === idx
              const isWithinBounds =
                currentStep && idx >= currentStep.low && idx <= currentStep.high
              const isMatch = currentStep?.status === 'found' && isMid

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`relative flex size-12 sm:size-14 items-center justify-center rounded-xl font-mono text-base font-bold border-2 transition-all ${
                      isMatch
                        ? 'border-easy bg-easy/25 text-easy scale-110 shadow-lg shadow-easy/20'
                        : isMid
                        ? 'border-gold bg-gold/20 text-gold scale-105 shadow-md shadow-gold/20'
                        : isWithinBounds
                        ? 'border-line bg-panel-2 text-ink'
                        : 'border-line/40 bg-panel-2/40 text-muted/40 opacity-40 line-through'
                    }`}
                  >
                    {val}
                  </div>

                  <span className="text-[10px] font-mono text-muted">{idx}</span>

                  <div className="h-4 flex items-center gap-1 font-mono text-[10px] font-bold">
                    {isLow && <span className="text-gold">L</span>}
                    {isMid && <span className="text-easy">M</span>}
                    {isHigh && <span className="text-gold">H</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.status === 'found' ? 'FOUND AT MID' : undefined}
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
