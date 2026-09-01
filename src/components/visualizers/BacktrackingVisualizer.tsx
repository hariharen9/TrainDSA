import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type BacktrackingPreset = {
  nums: number[]
}

const PRESETS: PresetOption<BacktrackingPreset>[] = [
  {
    id: 'three-elements',
    label: 'Subsets of [1, 2, 3] (2³ = 8 Subsets)',
    value: { nums: [1, 2, 3] },
    description: 'Generates all 8 subsets via include/exclude decision tree',
  },
  {
    id: 'two-elements',
    label: 'Subsets of [1, 2] (4 Subsets)',
    value: { nums: [1, 2] },
    description: 'Minimal 4-subset tree for quick understanding',
  },
]

type Step = {
  currentPath: number[]
  currentIndex: number
  allSubsets: number[][]
  action: 'choose' | 'backtrack' | 'save' | 'done'
  explanation: string
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'def backtrack(i, path):' },
  { lineNum: 2, code: '    if i == len(nums):' },
  { lineNum: 3, code: '        res.append(path.copy())' },
  { lineNum: 4, code: '        return' },
  { lineNum: 5, code: '    path.append(nums[i])      # 1. Choose' },
  { lineNum: 6, code: '    backtrack(i + 1, path)    # 2. Explore' },
  { lineNum: 7, code: '    path.pop()                # 3. Un-choose' },
  { lineNum: 8, code: '    backtrack(i + 1, path)' },
]

function generateBacktrackingSteps(nums: number[]): Step[] {
  const steps: Step[] = []
  const allSubsets: number[][] = []
  const currentPath: number[] = []

  function dfs(i: number) {
    if (i === nums.length) {
      allSubsets.push([...currentPath])
      steps.push({
        currentPath: [...currentPath],
        currentIndex: i,
        allSubsets: allSubsets.map((s) => [...s]),
        action: 'save',
        explanation: `🎯 Leaf node reached (i == ${nums.length})! Recorded subset [${currentPath.join(', ')}] to result list. Total found: ${allSubsets.length}.`,
        codeLine: 3,
      })
      return
    }

    // Choice 1: Include nums[i]
    currentPath.push(nums[i])
    steps.push({
      currentPath: [...currentPath],
      currentIndex: i,
      allSubsets: allSubsets.map((s) => [...s]),
      action: 'choose',
      explanation: `CHOOSE: Included nums[${i}] (${nums[i]}). Current path: [${currentPath.join(', ')}]. Recursing to i = ${i + 1}.`,
      codeLine: 5,
    })

    dfs(i + 1)

    // Choice 2: Backtrack (pop)
    const popped = currentPath.pop()
    steps.push({
      currentPath: [...currentPath],
      currentIndex: i,
      allSubsets: allSubsets.map((s) => [...s]),
      action: 'backtrack',
      explanation: `🔙 BACKTRACK: Removed ${popped} from path to explore branch EXCLUDING nums[${i}] (${nums[i]}). Path restored to [${currentPath.join(', ')}].`,
      codeLine: 7,
    })

    dfs(i + 1)
  }

  dfs(0)

  steps.push({
    currentPath: [],
    currentIndex: nums.length,
    allSubsets: allSubsets.map((s) => [...s]),
    action: 'done',
    explanation: `🏁 Backtracking Complete! Generated all ${allSubsets.length} subsets.`,
    codeLine: 4,
  })

  return steps
}

export function BacktrackingVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<BacktrackingPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nums = activePreset.value.nums
  const steps = useMemo(() => generateBacktrackingSteps(nums), [nums])
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
    { label: 'Current Path', value: `[${currentStep?.currentPath.join(', ')}]`, highlight: true },
    { label: 'Decision Index', value: currentStep?.currentIndex < nums.length ? `i = ${currentStep.currentIndex}` : 'Leaf' },
    { label: 'Subsets Found', value: `${currentStep?.allSubsets.length}/${Math.pow(2, nums.length)}`, accent: true },
    { label: 'Time Complexity', value: 'O(2^N)', subValue: 'Exponential' },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Backtracking"
        title="Subsets: Choose ➔ Explore ➔ Un-choose Decision Tree"
        subtitle="Watch the call-stack explore include/exclude branches and systematically revert state."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<BacktrackingPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Live Path & Collected Subsets Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Active Path Box */}
          <div className="rounded-xl border border-line bg-panel p-5 lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
              Active Call-Stack Path
            </span>
            <div className="flex min-h-[56px] items-center gap-2 rounded-xl border border-gold/40 bg-gold-dim px-4 py-2 font-mono text-lg font-bold text-gold">
              {currentStep?.currentPath.length === 0 ? (
                <span className="text-muted/60 text-sm font-normal">[ ] (Empty Subset)</span>
              ) : (
                currentStep?.currentPath.map((item, idx) => (
                  <span key={idx} className="rounded bg-gold/20 px-2 py-0.5 border border-gold/40">
                    {item}
                  </span>
                ))
              )}
            </div>
            <span className="mt-2 text-[10px] text-muted">
              State reverts via <code>path.pop()</code> before right recursion.
            </span>
          </div>

          {/* Subsets Result Box */}
          <div className="rounded-xl border border-line bg-panel p-5 lg:col-span-7">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2 block">
              Collected Subsets `res` ({currentStep?.allSubsets.length} collected)
            </span>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              {currentStep?.allSubsets.map((subset, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-easy/50 bg-easy/10 px-2.5 py-1 font-mono text-xs font-semibold text-easy"
                >
                  [{subset.join(', ')}]
                </div>
              ))}
            </div>
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={
            currentStep?.action === 'save'
              ? 'match'
              : currentStep?.action === 'backtrack'
              ? 'backtrack'
              : 'info'
          }
          highlightKey={currentStep?.action === 'save' ? 'SUBSET SAVED' : undefined}
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
