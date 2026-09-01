import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type GraphPreset = {
  name: string
}

const PRESETS: PresetOption<GraphPreset>[] = [
  {
    id: 'standard-5',
    label: 'Standard 4-Node Graph (Source A)',
    value: { name: 'standard' },
    description: 'Calculates shortest paths from A to all reachable nodes',
  },
]

type Step = {
  currentNode: string | null
  relaxedNode: string | null
  distances: Record<string, number>
  settled: string[]
  heap: { node: string; dist: number }[]
  explanation: string
  actionType: 'check' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'min_heap = [(0, src)]' },
  { lineNum: 2, code: 'while min_heap:' },
  { lineNum: 3, code: '    d, u = heappop(min_heap)' },
  { lineNum: 4, code: '    if d > dist[u]: continue' },
  { lineNum: 5, code: '    for v, weight in adj[u]:' },
  { lineNum: 6, code: '        if d + weight < dist[v]:' },
  { lineNum: 7, code: '            dist[v] = d + weight' },
  { lineNum: 8, code: '            heappush(min_heap, (dist[v], v))' },
]

function generateDijkstraSteps(): Step[] {
  const steps: Step[] = [
    {
      currentNode: null,
      relaxedNode: null,
      distances: { A: 0, B: Infinity, C: Infinity, D: Infinity },
      settled: [],
      heap: [{ node: 'A', dist: 0 }],
      explanation: 'Initialize source A with dist = 0, all other nodes with dist = ∞. Pushed (0, A) onto Min-Heap.',
      actionType: 'check',
      codeLine: 1,
    },
    {
      currentNode: 'A',
      relaxedNode: null,
      distances: { A: 0, B: Infinity, C: Infinity, D: Infinity },
      settled: ['A'],
      heap: [],
      explanation: 'POP MIN: Dequeued (0, A). Node A is now settled with optimal distance 0.',
      actionType: 'check',
      codeLine: 3,
    },
    {
      currentNode: 'A',
      relaxedNode: 'B',
      distances: { A: 0, B: 4, C: Infinity, D: Infinity },
      settled: ['A'],
      heap: [{ node: 'B', dist: 4 }],
      explanation: 'RELAX: Edge A ➔ B (weight 4). dist[B] improved from ∞ to 4. Pushed (4, B) onto heap.',
      actionType: 'insert',
      codeLine: 7,
    },
    {
      currentNode: 'A',
      relaxedNode: 'C',
      distances: { A: 0, B: 4, C: 2, D: Infinity },
      settled: ['A'],
      heap: [
        { node: 'C', dist: 2 },
        { node: 'B', dist: 4 },
      ],
      explanation: 'RELAX: Edge A ➔ C (weight 2). dist[C] improved from ∞ to 2. Pushed (2, C) onto heap.',
      actionType: 'insert',
      codeLine: 7,
    },
    {
      currentNode: 'C',
      relaxedNode: null,
      distances: { A: 0, B: 4, C: 2, D: Infinity },
      settled: ['A', 'C'],
      heap: [{ node: 'B', dist: 4 }],
      explanation: 'POP MIN: Dequeued (2, C) because 2 is the smallest tentative distance in heap. Node C settled.',
      actionType: 'check',
      codeLine: 3,
    },
    {
      currentNode: 'C',
      relaxedNode: 'B',
      distances: { A: 0, B: 3, C: 2, D: Infinity },
      settled: ['A', 'C'],
      heap: [
        { node: 'B', dist: 3 },
        { node: 'B', dist: 4 },
      ],
      explanation: 'RELAX via C: Edge C ➔ B (weight 1). Total path A➔C➔B = 2 + 1 = 3 (< 4). dist[B] updated to 3!',
      actionType: 'insert',
      codeLine: 7,
    },
    {
      currentNode: 'C',
      relaxedNode: 'D',
      distances: { A: 0, B: 3, C: 2, D: 7 },
      settled: ['A', 'C'],
      heap: [
        { node: 'B', dist: 3 },
        { node: 'B', dist: 4 },
        { node: 'D', dist: 7 },
      ],
      explanation: 'RELAX via C: Edge C ➔ D (weight 5). Path A➔C➔D = 2 + 5 = 7. dist[D] updated to 7.',
      actionType: 'insert',
      codeLine: 7,
    },
    {
      currentNode: 'B',
      relaxedNode: 'D',
      distances: { A: 0, B: 3, C: 2, D: 5 },
      settled: ['A', 'C', 'B'],
      heap: [
        { node: 'D', dist: 5 },
        { node: 'D', dist: 7 },
      ],
      explanation: 'RELAX via B: Edge B ➔ D (weight 2). Path A➔C➔B➔D = 3 + 2 = 5 (< 7). dist[D] updated to 5!',
      actionType: 'insert',
      codeLine: 7,
    },
    {
      currentNode: 'D',
      relaxedNode: null,
      distances: { A: 0, B: 3, C: 2, D: 5 },
      settled: ['A', 'C', 'B', 'D'],
      heap: [],
      explanation: '🏁 Dijkstra Finished! All reachable nodes settled with absolute shortest distances: A:0, B:3, C:2, D:5.',
      actionType: 'done',
      codeLine: 2,
    },
  ]

  return steps
}

export function DijkstraVisualizer() {
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const steps = useMemo(() => generateDijkstraSteps(), [])
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    if (!isPlaying) return
    const intervalMs = Math.max(300, 1200 / speed)
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
    { label: 'Settled Nodes', value: `${currentStep?.settled.length}/4`, highlight: true },
    { label: 'Current Expanding', value: currentStep?.currentNode ?? '-' },
    { label: 'Relaxed Node', value: currentStep?.relaxedNode ?? '-', accent: true },
    { label: 'Heap Queue Size', value: `${currentStep?.heap.length} entries` },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Advanced Graphs"
        title="Dijkstra Shortest Path & Priority Queue Relaxation"
        subtitle="Watch the greedy min-heap pop the lowest tentative distance and relax adjacent edges."
        presets={PRESETS}
        activePresetId="standard-5"
      />

      <div className="mt-5 space-y-5">
        {/* Graph Nodes SVG and Distances Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Distance Table */}
          <div className="rounded-xl border border-line bg-panel p-5 lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-3 block">
              Shortest Distance Array `dist`
            </span>
            <div className="grid grid-cols-2 gap-2.5 font-mono">
              {Object.entries(currentStep?.distances ?? {}).map(([node, dist]) => {
                const isSettled = currentStep.settled.includes(node)
                const isRelaxed = currentStep.relaxedNode === node

                return (
                  <div
                    key={node}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                      isRelaxed
                        ? 'border-gold bg-gold/20 text-gold scale-105 font-bold shadow-xs'
                        : isSettled
                        ? 'border-easy/60 bg-easy/10 text-easy font-semibold'
                        : 'border-line bg-panel-2 text-ink'
                    }`}
                  >
                    <span>Node {node}:</span>
                    <span className="text-base font-bold">
                      {dist === Infinity ? '∞' : dist}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Min Heap State */}
          <div className="rounded-xl border border-line bg-panel p-5 lg:col-span-7">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-3 block">
              Priority Queue Min-Heap (dist, node)
            </span>
            {currentStep?.heap.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-line text-xs text-muted">
                Min-heap is empty (all reachable nodes settled)
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentStep?.heap.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-line bg-panel-2 px-3 py-1.5 font-mono text-xs text-ink"
                  >
                    <span className="text-gold font-bold">d = {item.dist}</span>
                    <span className="text-muted">➔</span>
                    <span className="font-semibold">Node {item.node}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'insert' ? 'EDGE RELAXED' : undefined}
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
