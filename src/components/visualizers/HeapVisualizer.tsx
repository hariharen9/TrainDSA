import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type HeapPreset = {
  initialHeap: number[]
  operation: 'push' | 'pop'
  val?: number
}

const PRESETS: PresetOption<HeapPreset>[] = [
  {
    id: 'push-1',
    label: 'heappush(1) into [3, 5, 8, 10]',
    value: { initialHeap: [3, 5, 8, 10], operation: 'push', val: 1 },
    description: 'Bubble-up: 1 is placed at end and bubbles all the way to root',
  },
  {
    id: 'pop-min',
    label: 'heappop() from [2, 4, 3, 7, 5, 6]',
    value: { initialHeap: [2, 4, 3, 7, 5, 6], operation: 'pop' },
    description: 'Bubble-down: root removed, last element placed at root and sifts down',
  },
]

type Step = {
  array: number[]
  activeIdx: number | null
  swapIdx: number | null
  explanation: string
  actionType: 'check' | 'move' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'def bubble_up(i):' },
  { lineNum: 2, code: '    parent = (i - 1) // 2' },
  { lineNum: 3, code: '    if i > 0 and heap[i] < heap[parent]:' },
  { lineNum: 4, code: '        heap[i], heap[parent] = heap[parent], heap[i]' },
  { lineNum: 5, code: '        bubble_up(parent)' },
]

function generateHeapSteps(preset: HeapPreset): Step[] {
  const steps: Step[] = []
  const arr = [...preset.initialHeap]

  if (preset.operation === 'push') {
    const val = preset.val ?? 1
    steps.push({
      array: [...arr],
      activeIdx: null,
      swapIdx: null,
      explanation: `Preparing to push element ${val} into min-heap.`,
      actionType: 'check',
      codeLine: 1,
    })

    arr.push(val)
    let curr = arr.length - 1

    steps.push({
      array: [...arr],
      activeIdx: curr,
      swapIdx: null,
      explanation: `Appended ${val} to end of array at index ${curr}. Ready to bubble-up.`,
      actionType: 'insert',
      codeLine: 2,
    })

    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2)
      steps.push({
        array: [...arr],
        activeIdx: curr,
        swapIdx: parent,
        explanation: `Comparing child heap[${curr}] (${arr[curr]}) with parent heap[${parent}] (${arr[parent]}).`,
        actionType: 'check',
        codeLine: 3,
      })

      if (arr[curr] < arr[parent]) {
        const temp = arr[curr]
        arr[curr] = arr[parent]
        arr[parent] = temp

        steps.push({
          array: [...arr],
          activeIdx: parent,
          swapIdx: curr,
          explanation: `🔄 SWAP: ${temp} < ${arr[curr]}. Swapped heap[${curr}] with heap[${parent}].`,
          actionType: 'move',
          codeLine: 4,
        })
        curr = parent
      } else {
        break
      }
    }
  } else {
    // Pop min
    const minVal = arr[0]
    steps.push({
      array: [...arr],
      activeIdx: 0,
      swapIdx: null,
      explanation: `Extracting min root element ${minVal}.`,
      actionType: 'check',
      codeLine: 1,
    })

    const last = arr.pop()!
    if (arr.length > 0) {
      arr[0] = last
      steps.push({
        array: [...arr],
        activeIdx: 0,
        swapIdx: null,
        explanation: `Moved last element ${last} to root. Sifting down to restore min-heap property.`,
        actionType: 'insert',
        codeLine: 2,
      })

      // Sift down step
      if (arr[0] > arr[1] || (arr[2] !== undefined && arr[0] > arr[2])) {
        const swapWith = arr[2] !== undefined && arr[2] < arr[1] ? 2 : 1
        const temp = arr[0]
        arr[0] = arr[swapWith]
        arr[swapWith] = temp

        steps.push({
          array: [...arr],
          activeIdx: swapWith,
          swapIdx: 0,
          explanation: `🔄 SIFT DOWN: Swapped root ${temp} with smaller child ${arr[0]} at index ${swapWith}.`,
          actionType: 'move',
          codeLine: 4,
        })
      }
    }
  }

  steps.push({
    array: [...arr],
    activeIdx: null,
    swapIdx: null,
    explanation: `🏁 Min-Heap Invariant restored: every parent <= children. Array: [${arr.join(', ')}].`,
    actionType: 'done',
    codeLine: 5,
  })

  return steps
}

export function HeapVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<HeapPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const steps = useMemo(() => generateHeapSteps(activePreset.value), [activePreset.value])
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
    { label: 'Min Root (heap[0])', value: currentStep?.array[0] ?? '-', highlight: true },
    { label: 'Heap Size', value: `${currentStep?.array.length} items` },
    { label: 'Active Index', value: currentStep?.activeIdx !== null ? `idx ${currentStep.activeIdx}` : '-' },
    { label: 'Complexity', value: 'O(log N)', accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Heap / Priority Queue"
        title="Min-Heap Array & Complete Binary Tree"
        subtitle="Watch bubble-up and bubble-down restore parent <= children invariant in O(log N) steps."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<HeapPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Array representation */}
        <div className="rounded-xl border border-line bg-panel p-5">
          <div className="mb-2.5 flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider">Underlying Array Storage</span>
            <span className="font-mono">Parent: (i-1)//2 | Left: 2i+1 | Right: 2i+2</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 py-2">
            {currentStep?.array.map((val, idx) => {
              const isActive = currentStep.activeIdx === idx
              const isSwap = currentStep.swapIdx === idx

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl font-mono text-base font-bold border-2 transition-all ${
                      isActive
                        ? 'border-gold bg-gold/20 text-gold scale-105 shadow-md shadow-gold/20'
                        : isSwap
                        ? 'border-easy bg-easy/20 text-easy'
                        : 'border-line bg-panel-2 text-ink'
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] font-mono text-muted">idx {idx}</span>
                </div>
              )
            })}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
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
