import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type JumpPreset = {
  nums: number[]
}

const PRESETS: PresetOption<JumpPreset>[] = [
  {
    id: 'reachable',
    label: 'Reachable [2, 3, 1, 1, 4]',
    value: { nums: [2, 3, 1, 1, 4] },
    description: 'Max reach expands past last index',
  },
  {
    id: 'trapped',
    label: 'Zero Trap [3, 2, 1, 0, 4]',
    value: { nums: [3, 2, 1, 0, 4] },
    description: 'Stuck at zero trap with max reach unable to bridge index 3 to 4',
  },
]

type Step = {
  currentIndex: number
  jumpCapacity: number
  maxReach: number
  isStuck: boolean
  isSuccess: boolean
  explanation: string
  actionType: 'check' | 'insert' | 'delete' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'max_reach = 0' },
  { lineNum: 2, code: 'for i, jump in enumerate(nums):' },
  { lineNum: 3, code: '    if i > max_reach: return False  # Cannot reach this index' },
  { lineNum: 4, code: '    max_reach = max(max_reach, i + jump)' },
  { lineNum: 5, code: '    if max_reach >= len(nums) - 1: return True' },
]

function generateJumpSteps(nums: number[]): Step[] {
  const steps: Step[] = []
  let maxReach = 0
  const lastIdx = nums.length - 1

  steps.push({
    currentIndex: 0,
    jumpCapacity: nums[0],
    maxReach: 0,
    isStuck: false,
    isSuccess: false,
    explanation: `Start at index 0. Initial max_reach = 0. Target is index ${lastIdx}.`,
    actionType: 'check',
    codeLine: 1,
  })

  for (let i = 0; i < nums.length; i++) {
    const jump = nums[i]

    if (i > maxReach) {
      steps.push({
        currentIndex: i,
        jumpCapacity: jump,
        maxReach,
        isStuck: true,
        isSuccess: false,
        explanation: `🚫 STUCK: Current index ${i} > max_reach (${maxReach}). It is impossible to reach this position. Return False.`,
        actionType: 'delete',
        codeLine: 3,
      })
      return steps
    }

    const newReach = Math.max(maxReach, i + jump)
    const improved = newReach > maxReach
    maxReach = newReach

    steps.push({
      currentIndex: i,
      jumpCapacity: jump,
      maxReach,
      isStuck: false,
      isSuccess: maxReach >= lastIdx,
      explanation: `At index ${i} (jump power ${jump}): Reachable horizon = max(${maxReach}, ${i} + ${jump}) = ${maxReach}. ${
        maxReach >= lastIdx ? '🎯 Last index is now within reach!' : ''
      }`,
      actionType: improved ? 'insert' : 'check',
      codeLine: 4,
    })

    if (maxReach >= lastIdx) {
      steps.push({
        currentIndex: i,
        jumpCapacity: jump,
        maxReach,
        isStuck: false,
        isSuccess: true,
        explanation: `🎉 SUCCESS: max_reach (${maxReach}) >= target (${lastIdx}). We can reach the end! Return True.`,
        actionType: 'done',
        codeLine: 5,
      })
      return steps
    }
  }

  return steps
}

export function GreedyJumpVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<JumpPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nums = activePreset.value.nums
  const steps = useMemo(() => generateJumpSteps(nums), [nums])
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
    { label: 'Current Position (i)', value: `idx ${currentStep?.currentIndex}`, highlight: true },
    { label: 'Jump Power', value: `+${currentStep?.jumpCapacity}` },
    { label: 'Max Reach Horizon', value: `idx ${currentStep?.maxReach}`, accent: true },
    { label: 'Target Index', value: `idx ${nums.length - 1}` },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Greedy"
        title="Jump Game: Dynamic Max Reach Horizon"
        subtitle="Watch the greedy horizon expand at each index in single O(N) pass."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<JumpPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Jump Game Tiles with Reach Overlay */}
        <div className="rounded-xl border border-line bg-panel p-6">
          <div className="flex flex-wrap items-center justify-center gap-3 py-4">
            {nums.map((jump, idx) => {
              const isCurrent = currentStep?.currentIndex === idx
              const isWithinReach = currentStep && idx <= currentStep.maxReach
              const isTarget = idx === nums.length - 1

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl font-mono text-base font-bold border-2 transition-all ${
                      isCurrent
                        ? 'border-gold bg-gold/25 text-gold scale-110 shadow-lg shadow-gold/20'
                        : isTarget && currentStep?.isSuccess
                        ? 'border-easy bg-easy/25 text-easy'
                        : isWithinReach
                        ? 'border-line bg-panel-2 text-ink'
                        : 'border-line/40 bg-panel-2/30 text-muted/40'
                    }`}
                  >
                    {jump}
                  </div>
                  <span className="text-[10px] font-mono text-muted">idx {idx}</span>
                  <div className="h-3 text-[9px] font-mono font-bold">
                    {isCurrent && <span className="text-gold">i</span>}
                    {isTarget && <span className="text-easy font-bold">goal</span>}
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
          highlightKey={currentStep?.isSuccess ? 'GOAL REACHABLE' : undefined}
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
