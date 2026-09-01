import { useState, useMemo, useEffect, useRef } from 'react'
import {
  VisualizerCard,
} from './common/VisualizerCard'
import {
  VisualizerHeader,
  type PresetOption,
} from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type TwoSumPreset = {
  nums: number[]
  target: number
}

const PRESETS: PresetOption<TwoSumPreset>[] = [
  {
    id: 'standard',
    label: 'Standard [2, 7, 11, 15] (Target 9)',
    value: { nums: [2, 7, 11, 15], target: 9 },
    description: 'Classic immediate match on second element',
  },
  {
    id: 'later',
    label: 'Deep Match [3, 5, 8, 2, 9, 6] (Target 11)',
    value: { nums: [3, 5, 8, 2, 9, 6], target: 11 },
    description: 'Walks through multiple lookups before hitting pair (2, 9)',
  },
  {
    id: 'duplicate',
    label: 'Identical [3, 2, 3] (Target 6)',
    value: { nums: [3, 2, 3], target: 6 },
    description: 'Handles duplicate numbers correctly',
  },
]

type Step = {
  currentIndex: number
  currentNum: number
  target: number
  complement: number
  found: boolean
  matchIndex?: number
  map: Record<number, number>
  explanation: string
  actionType: 'check' | 'found' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'seen = {}' },
  { lineNum: 2, code: 'for i, num in enumerate(nums):' },
  { lineNum: 3, code: '    complement = target - num' },
  { lineNum: 4, code: '    if complement in seen:' },
  { lineNum: 5, code: '        return [seen[complement], i]' },
  { lineNum: 6, code: '    seen[num] = i' },
]

function generateTwoSumSteps(nums: number[], target: number): Step[] {
  const steps: Step[] = []
  const map: Record<number, number> = {}

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    const complement = target - num

    // Step A: Calculate complement & check hashmap
    steps.push({
      currentIndex: i,
      currentNum: num,
      target,
      complement,
      found: complement in map,
      matchIndex: complement in map ? map[complement] : undefined,
      map: { ...map },
      explanation: `At index ${i} (value ${num}): looking for complement (${target} - ${num} = ${complement}) in hash map.`,
      actionType: 'check',
      codeLine: 4,
    })

    if (complement in map) {
      // Step B: Match found
      steps.push({
        currentIndex: i,
        currentNum: num,
        target,
        complement,
        found: true,
        matchIndex: map[complement],
        map: { ...map },
        explanation: `🎯 MATCH FOUND! Complement ${complement} was stored at index ${map[complement]}. Return indices [${map[complement]}, ${i}].`,
        actionType: 'found',
        codeLine: 5,
      })
      return steps
    }

    // Step C: Insert into map
    map[num] = i
    steps.push({
      currentIndex: i,
      currentNum: num,
      target,
      complement,
      found: false,
      map: { ...map },
      explanation: `Complement ${complement} not found in map. Storing current element ${num} -> index ${i} for future lookups.`,
      actionType: 'insert',
      codeLine: 6,
    })
  }

  return steps
}

export function TwoSumHashMapVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<TwoSumPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const steps = useMemo(
    () => generateTwoSumSteps(activePreset.value.nums, activePreset.value.target),
    [activePreset],
  )

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

  // Reset when preset changes
  useEffect(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [activePreset])

  // Playback timer
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
    { label: 'Current Num', value: currentStep?.currentNum ?? '-', highlight: true },
    { label: 'Target', value: activePreset.value.target },
    { label: 'Complement Needed', value: currentStep?.complement ?? '-', accent: true },
    {
      label: 'Map Size',
      value: `${Object.keys(currentStep?.map ?? {}).length} keys`,
      subValue: 'O(1) lookups',
    },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Arrays & Hashing"
        title="Two Sum: One-Pass Hash Map Visualizer"
        subtitle="Watch how looking backward into an O(1) hash map eliminates nested loops."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<TwoSumPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Array Visualization */}
        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="mb-2.5 flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider">Input Array `nums`</span>
            <span>Target = <strong className="text-gold font-mono">{activePreset.value.target}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center py-3">
            {activePreset.value.nums.map((num, idx) => {
              const isCurrent = currentStep?.currentIndex === idx
              const isMatch = currentStep?.found && (currentStep.matchIndex === idx || currentStep.currentIndex === idx)
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex size-12 sm:size-14 items-center justify-center rounded-xl font-mono text-base sm:text-lg font-bold border-2 transition-all ${
                      isMatch
                        ? 'border-easy bg-easy/20 text-easy scale-105 shadow-md shadow-easy/20'
                        : isCurrent
                        ? 'border-gold bg-gold/20 text-gold scale-105 shadow-md shadow-gold/20'
                        : 'border-line bg-panel-2 text-ink/90'
                    }`}
                  >
                    {num}
                  </div>
                  <span className="text-[11px] font-mono text-muted">i={idx}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Hash Map & Calculation Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Active Formula Box */}
          <div className="flex flex-col justify-center rounded-xl border border-line bg-panel p-4 lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Current Math Invariant
            </p>
            <div className="mt-3 font-mono text-sm sm:text-base space-y-1.5">
              <div className="flex items-center justify-between border-b border-line/60 pb-1 text-muted">
                <span>Target:</span>
                <span className="text-ink font-semibold">{activePreset.value.target}</span>
              </div>
              <div className="flex items-center justify-between border-b border-line/60 pb-1 text-muted">
                <span>Current num[i]:</span>
                <span className="text-gold font-semibold">{currentStep?.currentNum}</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold">
                <span className="text-easy">Needed Complement:</span>
                <span className="text-easy text-lg">{currentStep?.complement}</span>
              </div>
            </div>
          </div>

          {/* Hash Map Entries Box */}
          <div className="rounded-xl border border-line bg-panel p-4 lg:col-span-7">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Hash Map State `seen = {'{'} key: index {'}'}`
              </p>
              <span className="text-[10px] text-muted font-mono">O(1) Lookup Table</span>
            </div>

            {Object.keys(currentStep?.map ?? {}).length === 0 ? (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-line text-xs text-muted">
                Hash map is currently empty (scanning first element)
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 py-1">
                {Object.entries(currentStep?.map ?? {}).map(([key, index]) => {
                  const isQueried = Number(key) === currentStep?.complement
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
                        isQueried
                          ? 'border-easy bg-easy/25 text-easy scale-105 font-bold shadow-xs'
                          : 'border-line bg-panel-2 text-ink'
                      }`}
                    >
                      <span className="text-gold">{key}</span>
                      <span className="text-muted">➔</span>
                      <span className="text-muted">idx {index}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.found ? 'SOLUTION FOUND' : undefined}
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
