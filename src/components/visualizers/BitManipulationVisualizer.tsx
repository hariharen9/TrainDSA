import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type BitPreset = {
  nums: number[]
}

const PRESETS: PresetOption<BitPreset>[] = [
  {
    id: 'single-4',
    label: 'Single Number [4, 1, 2, 1, 2] (Unique 4)',
    value: { nums: [4, 1, 2, 1, 2] },
    description: '1 and 2 cancel out pairwise via XOR, leaving 4',
  },
  {
    id: 'single-5',
    label: 'Single Number [7, 3, 5, 3, 7] (Unique 5)',
    value: { nums: [7, 3, 5, 3, 7] },
    description: '7 and 3 cancel out pairwise via XOR, leaving 5',
  },
]

type Step = {
  activeIdx: number
  currentNum: number
  prevAcc: number
  newAcc: number
  explanation: string
  actionType: 'check' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'res = 0' },
  { lineNum: 2, code: 'for num in nums:' },
  { lineNum: 3, code: '    res ^= num  # XOR cancels duplicate pairs (x ^ x = 0)' },
  { lineNum: 4, code: 'return res' },
]

function to8Bit(val: number): string {
  return (val >>> 0).toString(2).padStart(8, '0')
}

function generateBitSteps(nums: number[]): Step[] {
  const steps: Step[] = []
  let acc = 0

  steps.push({
    activeIdx: -1,
    currentNum: 0,
    prevAcc: 0,
    newAcc: 0,
    explanation: 'Initialized accumulator register res = 0 (00000000 in binary). Ready to XOR with each element.',
    actionType: 'check',
    codeLine: 1,
  })

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    const prev = acc
    acc = acc ^ num

    steps.push({
      activeIdx: i,
      currentNum: num,
      prevAcc: prev,
      newAcc: acc,
      explanation: `XOR with index ${i} (${num}): (${prev} ^ ${num}) -> res updated from ${prev} (${to8Bit(prev)}) to ${acc} (${to8Bit(acc)}).`,
      actionType: 'insert',
      codeLine: 3,
    })
  }

  steps.push({
    activeIdx: nums.length,
    currentNum: 0,
    prevAcc: acc,
    newAcc: acc,
    explanation: `🏁 Finished! All duplicates cancelled out to 0 because (x ^ x = 0). The unique single number is ${acc}.`,
    actionType: 'done',
    codeLine: 4,
  })

  return steps
}

export function BitManipulationVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<BitPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nums = activePreset.value.nums
  const steps = useMemo(() => generateBitSteps(nums), [nums])
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
    { label: 'Current num', value: currentStep?.activeIdx >= 0 && currentStep.activeIdx < nums.length ? nums[currentStep.activeIdx] : '-', highlight: true },
    { label: 'Accumulator (Dec)', value: currentStep?.newAcc ?? 0 },
    { label: 'Accumulator (Bin)', value: to8Bit(currentStep?.newAcc ?? 0), accent: true },
    { label: 'Space Complexity', value: 'O(1)', subValue: 'Single Register' },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Bit Manipulation"
        title="Single Number: XOR Binary Register Cancellation"
        subtitle="Watch bitwise XOR cancel identical pairs in O(N) time with O(1) extra space."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<BitPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Binary Register Visualization */}
        <div className="rounded-xl border border-line bg-panel p-6 flex flex-col items-center">
          <div className="w-full max-w-md space-y-4 font-mono">
            {/* Previous Register */}
            <div className="flex items-center justify-between border-b border-line/60 pb-2 text-xs text-muted">
              <span>Prev res ({currentStep?.prevAcc}):</span>
              <div className="flex gap-1">
                {to8Bit(currentStep?.prevAcc ?? 0)
                  .split('')
                  .map((b, i) => (
                    <span key={i} className="size-6 flex items-center justify-center rounded bg-panel-2 border border-line">
                      {b}
                    </span>
                  ))}
              </div>
            </div>

            {/* Current Element Register */}
            <div className="flex items-center justify-between border-b border-line/60 pb-2 text-xs text-gold font-bold">
              <span>XOR num ({currentStep?.currentNum ?? 0}):</span>
              <div className="flex gap-1">
                {to8Bit(currentStep?.currentNum ?? 0)
                  .split('')
                  .map((b, i) => (
                    <span key={i} className="size-6 flex items-center justify-center rounded bg-gold/15 border border-gold/40 text-gold">
                      {b}
                    </span>
                  ))}
              </div>
            </div>

            {/* Resulting Register */}
            <div className="flex items-center justify-between pt-1 text-sm font-black text-easy">
              <span>New res ({currentStep?.newAcc}):</span>
              <div className="flex gap-1">
                {to8Bit(currentStep?.newAcc ?? 0)
                  .split('')
                  .map((b, i) => (
                    <span key={i} className="size-6 flex items-center justify-center rounded bg-easy/20 border border-easy/50 text-easy shadow-xs">
                      {b}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'done' ? 'UNIQUE NUMBER IDENTIFIED' : undefined}
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
