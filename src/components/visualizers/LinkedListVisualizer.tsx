import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type LLPreset = {
  values: number[]
}

const PRESETS: PresetOption<LLPreset>[] = [
  {
    id: 'standard',
    label: 'Standard [1, 2, 3, 4, 5]',
    value: { values: [1, 2, 3, 4, 5] },
    description: 'Classic 5-node singly linked list reversal',
  },
  {
    id: 'short',
    label: 'Short [10, 20, 30]',
    value: { values: [10, 20, 30] },
    description: 'Quick 3-step walkthrough',
  },
  {
    id: 'pair',
    label: 'Two Nodes [7, 9]',
    value: { values: [7, 9] },
    description: 'Minimal reversal pair',
  },
]

type NodeLink = {
  val: number
  reversed: boolean // whether arrow points left instead of right
}

type Step = {
  prevIdx: number | null
  currIdx: number | null
  nextIdx: number | null
  nodes: NodeLink[]
  explanation: string
  actionType: 'check' | 'move' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'prev = None' },
  { lineNum: 2, code: 'curr = head' },
  { lineNum: 3, code: 'while curr:' },
  { lineNum: 4, code: '    next_node = curr.next  # 1. Save reference' },
  { lineNum: 5, code: '    curr.next = prev       # 2. Reverse pointer' },
  { lineNum: 6, code: '    prev = curr            # 3. Advance prev' },
  { lineNum: 7, code: '    curr = next_node       # 4. Advance curr' },
  { lineNum: 8, code: 'return prev' },
]

function generateLinkedListSteps(values: number[]): Step[] {
  const steps: Step[] = []
  const n = values.length
  const nodes: NodeLink[] = values.map((val) => ({ val, reversed: false }))

  let prev: number | null = null
  let curr: number | null = 0

  steps.push({
    prevIdx: prev,
    currIdx: curr,
    nextIdx: null,
    nodes: nodes.map((nd) => ({ ...nd })),
    explanation: `Initial state: prev = None, curr = Node(${values[0]}). Ready to begin 3-pointer walk.`,
    actionType: 'check',
    codeLine: 2,
  })

  while (curr !== null && curr < n) {
    const next: number | null = curr + 1 < n ? curr + 1 : null

    // Step 1: Save next
    steps.push({
      prevIdx: prev,
      currIdx: curr,
      nextIdx: next,
      nodes: nodes.map((nd) => ({ ...nd })),
      explanation: `Step 1 (Save Next): Storing next_node = ${next !== null ? `Node(${values[next]})` : 'None'} so we don't lose the rest of the list.`,
      actionType: 'check',
      codeLine: 4,
    })

    // Step 2: Reverse pointer
    nodes[curr].reversed = true
    steps.push({
      prevIdx: prev,
      currIdx: curr,
      nextIdx: next,
      nodes: nodes.map((nd) => ({ ...nd })),
      explanation: `Step 2 (Rewire): curr.next = prev. Node(${values[curr]}) now points backward to ${prev !== null ? `Node(${values[prev]})` : 'None'}.`,
      actionType: 'insert',
      codeLine: 5,
    })

    // Step 3: Advance prev
    prev = curr
    steps.push({
      prevIdx: prev,
      currIdx: curr,
      nextIdx: next,
      nodes: nodes.map((nd) => ({ ...nd })),
      explanation: `Step 3 (Advance Prev): prev moves forward to Node(${values[prev]}).`,
      actionType: 'move',
      codeLine: 6,
    })

    // Step 4: Advance curr
    curr = next
    steps.push({
      prevIdx: prev,
      currIdx: curr,
      nextIdx: null,
      nodes: nodes.map((nd) => ({ ...nd })),
      explanation: `Step 4 (Advance Curr): curr advances to ${curr !== null ? `Node(${values[curr]})` : 'None'}.`,
      actionType: 'move',
      codeLine: 7,
    })
  }

  steps.push({
    prevIdx: prev,
    currIdx: null,
    nextIdx: null,
    nodes: nodes.map((nd) => ({ ...nd })),
    explanation: `🏁 Reversal Complete! curr is None. prev points to the new head Node(${values[n - 1]}). Return prev.`,
    actionType: 'done',
    codeLine: 8,
  })

  return steps
}

export function LinkedListVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<LLPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const values = activePreset.value.values
  const steps = useMemo(() => generateLinkedListSteps(values), [values])
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
    { label: 'prev pointer', value: currentStep?.prevIdx !== null ? `Node(${values[currentStep.prevIdx]})` : 'None' },
    { label: 'curr pointer', value: currentStep?.currIdx !== null ? `Node(${values[currentStep.currIdx]})` : 'None', highlight: true },
    { label: 'next_node pointer', value: currentStep?.nextIdx !== null ? `Node(${values[currentStep.nextIdx]})` : 'None', accent: true },
    { label: 'Reversed Nodes', value: `${currentStep?.nodes.filter((n) => n.reversed).length}/${values.length}` },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Linked Lists"
        title="In-Place Reversal (3-Pointer Dance)"
        subtitle="Watch prev, curr, and next_node safely flip node pointers without extra memory (O(1) Space)."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<LLPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Linked List Nodes & Directional Pointers */}
        <div className="rounded-xl border border-line bg-panel p-6">
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            {/* Dummy / None node for prev */}
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="flex size-11 items-center justify-center rounded-xl border border-dashed border-line bg-panel-2 font-mono text-xs text-muted">
                None
              </div>
              <span className="text-[10px] text-muted">null</span>
            </div>

            <span className="text-muted font-mono">⮂</span>

            {values.map((val, idx) => {
              const isPrev = currentStep?.prevIdx === idx
              const isCurr = currentStep?.currIdx === idx
              const isNext = currentStep?.nextIdx === idx
              const isReversed = currentStep?.nodes[idx]?.reversed

              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex size-14 items-center justify-center rounded-2xl font-mono text-base font-bold border-2 transition-all ${
                        isCurr
                          ? 'border-gold bg-gold/20 text-gold scale-110 shadow-lg shadow-gold/20'
                          : isPrev
                          ? 'border-easy bg-easy/20 text-easy'
                          : isNext
                          ? 'border-medium/60 bg-medium/10 text-medium'
                          : 'border-line bg-panel-2 text-ink'
                      }`}
                    >
                      {val}
                    </div>

                    <span className="text-[10px] font-mono text-muted">idx {idx}</span>

                    <div className="h-4 flex items-center gap-1 font-mono text-[10px] font-bold">
                      {isPrev && <span className="text-easy">prev</span>}
                      {isCurr && <span className="text-gold">curr</span>}
                      {isNext && <span className="text-medium">next</span>}
                    </div>
                  </div>

                  {/* Arrow indicating pointer direction */}
                  {idx < values.length - 1 && (
                    <div className="flex flex-col items-center px-1">
                      <span
                        className={`text-base font-bold transition-all ${
                          isReversed ? 'text-easy -rotate-180' : 'text-muted'
                        }`}
                      >
                        ➔
                      </span>
                      <span className="text-[9px] text-muted font-mono">
                        {isReversed ? 'prev' : 'next'}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'done' ? 'NEW HEAD' : undefined}
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
