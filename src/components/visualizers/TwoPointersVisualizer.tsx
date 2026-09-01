import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type TwoPointersPreset = {
  heights: number[]
}

const PRESETS: PresetOption<TwoPointersPreset>[] = [
  {
    id: 'standard',
    label: 'Standard [1, 8, 6, 2, 5, 4, 8, 3, 7]',
    value: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
    description: 'Classic LeetCode 11 example with multiple peaks',
  },
  {
    id: 'simple',
    label: 'Simple [1, 1]',
    value: { heights: [1, 1] },
    description: 'Minimal 2-element case',
  },
  {
    id: 'valley',
    label: 'Deep Valley [4, 3, 2, 1, 4]',
    value: { heights: [4, 3, 2, 1, 4] },
    description: 'Outer pillars form max area despite low middle',
  },
]

type Step = {
  left: number
  right: number
  width: number
  minHeight: number
  currentArea: number
  maxArea: number
  bestLeft: number
  bestRight: number
  moveSide: 'left' | 'right' | 'done'
  explanation: string
  actionType: 'check' | 'move' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'left, right = 0, len(height) - 1' },
  { lineNum: 2, code: 'max_water = 0' },
  { lineNum: 3, code: 'while left < right:' },
  { lineNum: 4, code: '    area = (right - left) * min(height[left], height[right])' },
  { lineNum: 5, code: '    max_water = max(max_water, area)' },
  { lineNum: 6, code: '    if height[left] < height[right]: left += 1' },
  { lineNum: 7, code: '    else: right -= 1' },
]

function generateTwoPointerSteps(heights: number[]): Step[] {
  const steps: Step[] = []
  let left = 0
  let right = heights.length - 1
  let maxArea = 0
  let bestLeft = 0
  let bestRight = heights.length - 1

  while (left < right) {
    const width = right - left
    const hL = heights[left]
    const hR = heights[right]
    const minHeight = Math.min(hL, hR)
    const currentArea = width * minHeight

    if (currentArea > maxArea) {
      maxArea = currentArea
      bestLeft = left
      bestRight = right
    }

    const moveSide = hL < hR ? 'left' : 'right'
    const moveReason =
      hL < hR
        ? `Left pillar (${hL}) < Right pillar (${hR}). Advancing 'left' pointer (L++) to seek a taller pillar.`
        : `Right pillar (${hR}) <= Left pillar (${hL}). Decrementing 'right' pointer (R--) to seek a taller pillar.`

    // Step: evaluate area
    steps.push({
      left,
      right,
      width,
      minHeight,
      currentArea,
      maxArea,
      bestLeft,
      bestRight,
      moveSide,
      explanation: `Evaluating window [${left}..${right}]: Width = ${width}, Limiting Height = min(${hL}, ${hR}) = ${minHeight}. Current Water Area = ${currentArea}. Max so far = ${maxArea}.`,
      actionType: 'check',
      codeLine: 4,
    })

    // Step: explain pointer move
    steps.push({
      left,
      right,
      width,
      minHeight,
      currentArea,
      maxArea,
      bestLeft,
      bestRight,
      moveSide,
      explanation: `Decision: ${moveReason}`,
      actionType: 'move',
      codeLine: hL < hR ? 6 : 7,
    })

    if (hL < hR) {
      left++
    } else {
      right--
    }
  }

  steps.push({
    left,
    right,
    width: 0,
    minHeight: 0,
    currentArea: 0,
    maxArea,
    bestLeft,
    bestRight,
    moveSide: 'done',
    explanation: `🏁 Search Complete! Pointers met at index ${left}. Maximum water trapped = ${maxArea} (between index ${bestLeft} and ${bestRight}).`,
    actionType: 'done',
    codeLine: 3,
  })

  return steps
}

export function TwoPointersVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<TwoPointersPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const heights = activePreset.value.heights
  const steps = useMemo(() => generateTwoPointerSteps(heights), [heights])
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

  const maxHeight = Math.max(...heights, 1)

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
    { label: 'Left Pointer (L)', value: `idx ${currentStep?.left}`, subValue: `h=${heights[currentStep?.left] ?? 0}` },
    { label: 'Right Pointer (R)', value: `idx ${currentStep?.right}`, subValue: `h=${heights[currentStep?.right] ?? 0}` },
    { label: 'Current Area', value: currentStep?.currentArea ?? 0, highlight: true },
    { label: 'Max Water Trapped', value: currentStep?.maxArea ?? 0, accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Two Pointers"
        title="Container With Most Water: Inward Shrink Visualizer"
        subtitle="Understand why greedy inward pointer movements guarantee discovering the global maximum."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<TwoPointersPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Height Bar Chart & Water Container Visualizer */}
        <div className="rounded-xl border border-line bg-panel p-4 sm:p-6">
          <div className="flex h-52 items-end justify-between gap-1.5 sm:gap-3 border-b border-line/80 px-2 pb-2">
            {heights.map((h, idx) => {
              const isL = currentStep?.left === idx
              const isR = currentStep?.right === idx
              const isInside =
                currentStep && idx >= currentStep.left && idx <= currentStep.right
              const isBestPair =
                currentStep && (idx === currentStep.bestLeft || idx === currentStep.bestRight)

              const heightPercent = (h / maxHeight) * 100

              return (
                <div key={idx} className="flex flex-1 flex-col items-center h-full justify-end relative">
                  {/* Water Overlay Bar */}
                  {isInside && currentStep.minHeight > 0 && (
                    <div
                      className="absolute bottom-0 w-full bg-easy/15 border-t border-easy/40 transition-all rounded-t-sm"
                      style={{
                        height: `${(currentStep.minHeight / maxHeight) * 100}%`,
                      }}
                    />
                  )}

                  {/* Vertical Pillar */}
                  <div
                    className={`w-full max-w-[36px] rounded-t-lg transition-all flex flex-col items-center justify-start pt-1 font-mono text-[11px] font-bold z-10 ${
                      isL || isR
                        ? 'bg-gold text-canvas shadow-lg shadow-gold/20 scale-105'
                        : isBestPair
                        ? 'bg-easy text-canvas font-bold'
                        : 'bg-panel-2 border border-line text-ink/80'
                    }`}
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                  >
                    {h}
                  </div>

                  {/* Index and Pointer Markers */}
                  <div className="mt-2 flex flex-col items-center font-mono text-[11px]">
                    <span className="text-muted">{idx}</span>
                    <div className="h-4 flex items-center">
                      {isL && <span className="font-bold text-gold">▲ L</span>}
                      {isR && <span className="font-bold text-gold">▲ R</span>}
                    </div>
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
          highlightKey={currentStep?.actionType === 'done' ? 'GLOBAL MAX' : undefined}
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
