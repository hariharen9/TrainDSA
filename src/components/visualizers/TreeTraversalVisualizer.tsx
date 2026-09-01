import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type TraversalMode = 'inorder' | 'preorder' | 'postorder' | 'levelorder'

const PRESETS: PresetOption<TraversalMode>[] = [
  {
    id: 'inorder',
    label: 'In-Order (Left ➔ Root ➔ Right)',
    value: 'inorder',
    description: 'Yields strictly sorted output for BSTs',
  },
  {
    id: 'preorder',
    label: 'Pre-Order (Root ➔ Left ➔ Right)',
    value: 'preorder',
    description: 'Processes parent before children (cloning & serialization)',
  },
  {
    id: 'postorder',
    label: 'Post-Order (Left ➔ Right ➔ Root)',
    value: 'postorder',
    description: 'Bottom-up aggregation (height, diameter, subtree sums)',
  },
  {
    id: 'levelorder',
    label: 'Level-Order BFS (Queue)',
    value: 'levelorder',
    description: 'Explores level by level using a FIFO queue',
  },
]

type TreeNode = {
  id: number
  val: number
  x: number
  y: number
  left?: number
  right?: number
}

const TREE_NODES: TreeNode[] = [
  { id: 1, val: 4, x: 200, y: 40, left: 2, right: 3 },
  { id: 2, val: 2, x: 100, y: 110, left: 4, right: 5 },
  { id: 3, val: 6, x: 300, y: 110, left: 6, right: 7 },
  { id: 4, val: 1, x: 50, y: 180 },
  { id: 5, val: 3, x: 150, y: 180 },
  { id: 6, val: 5, x: 250, y: 180 },
  { id: 7, val: 7, x: 350, y: 180 },
]

type Step = {
  activeNodeId: number | null
  visitedNodeIds: number[]
  stackOrQueue: number[]
  output: number[]
  explanation: string
  actionType: 'check' | 'insert' | 'done'
  codeLine: number
}

function generateTreeSteps(mode: TraversalMode): Step[] {
  const steps: Step[] = []
  const output: number[] = []
  const visited: number[] = []

  if (mode === 'inorder') {
    // In-order DFS trace
    steps.push({
      activeNodeId: 1,
      visitedNodeIds: [],
      stackOrQueue: [4],
      output: [],
      explanation: 'In-order: Traverse left subtree first. Recursing down from Root (4) to Left (2) to Left (1).',
      actionType: 'check',
      codeLine: 2,
    })

    const seq = [4, 2, 5, 1, 6, 3, 7]
    const vals = [1, 2, 3, 4, 5, 6, 7]

    for (let i = 0; i < seq.length; i++) {
      const nid = seq[i]
      const val = vals[i]
      visited.push(nid)
      output.push(val)
      steps.push({
        activeNodeId: nid,
        visitedNodeIds: [...visited],
        stackOrQueue: [val],
        output: [...output],
        explanation: `Visited Node(${val}). Left subtree finished -> Process Root -> Recurse Right. Output: [${output.join(', ')}].`,
        actionType: 'insert',
        codeLine: 4,
      })
    }
  } else if (mode === 'preorder') {
    const seq = [1, 2, 4, 5, 3, 6, 7]
    const vals = [4, 2, 1, 3, 6, 5, 7]
    for (let i = 0; i < seq.length; i++) {
      const nid = seq[i]
      const val = vals[i]
      visited.push(nid)
      output.push(val)
      steps.push({
        activeNodeId: nid,
        visitedNodeIds: [...visited],
        stackOrQueue: [val],
        output: [...output],
        explanation: `Pre-order: Process Root Node(${val}) first, then recurse left and right. Output: [${output.join(', ')}].`,
        actionType: 'insert',
        codeLine: 3,
      })
    }
  } else if (mode === 'postorder') {
    const seq = [4, 5, 2, 6, 7, 3, 1]
    const vals = [1, 3, 2, 5, 7, 6, 4]
    for (let i = 0; i < seq.length; i++) {
      const nid = seq[i]
      const val = vals[i]
      visited.push(nid)
      output.push(val)
      steps.push({
        activeNodeId: nid,
        visitedNodeIds: [...visited],
        stackOrQueue: [val],
        output: [...output],
        explanation: `Post-order: Subtrees processed! Aggregating result at Node(${val}). Output: [${output.join(', ')}].`,
        actionType: 'insert',
        codeLine: 5,
      })
    }
  } else {
    // Level-order BFS
    const seq = [1, 2, 3, 4, 5, 6, 7]
    const vals = [4, 2, 6, 1, 3, 5, 7]
    for (let i = 0; i < seq.length; i++) {
      const nid = seq[i]
      const val = vals[i]
      visited.push(nid)
      output.push(val)
      steps.push({
        activeNodeId: nid,
        visitedNodeIds: [...visited],
        stackOrQueue: vals.slice(i + 1, i + 3),
        output: [...output],
        explanation: `BFS: Dequeued Node(${val}) from front. Enqueuing its children. Output: [${output.join(', ')}].`,
        actionType: 'insert',
        codeLine: 4,
      })
    }
  }

  steps.push({
    activeNodeId: null,
    visitedNodeIds: [...visited],
    stackOrQueue: [],
    output: [...output],
    explanation: `🏁 Traversal Complete! Final order: [${output.join(', ')}].`,
    actionType: 'done',
    codeLine: 6,
  })

  return steps
}

const CODE_LINES = [
  { lineNum: 1, code: 'def traverse(node):' },
  { lineNum: 2, code: '    if not node: return' },
  { lineNum: 3, code: '    # pre-order: visit(node)' },
  { lineNum: 4, code: '    traverse(node.left)' },
  { lineNum: 5, code: '    # in-order: visit(node)' },
  { lineNum: 6, code: '    traverse(node.right)' },
  { lineNum: 7, code: '    # post-order: visit(node)' },
]

export function TreeTraversalVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<TraversalMode>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const steps = useMemo(() => generateTreeSteps(activePreset.value), [activePreset.value])
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
    { label: 'Active Node', value: currentStep?.activeNodeId ? `Node(${TREE_NODES.find((n) => n.id === currentStep.activeNodeId)?.val})` : 'None', highlight: true },
    { label: 'Visited Count', value: `${currentStep?.visitedNodeIds.length}/${TREE_NODES.length}` },
    { label: 'Traversal Mode', value: activePreset.label.split(' ')[0] },
    { label: 'Output Sequence', value: `[${currentStep?.output.join(', ')}]`, accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Trees"
        title="Binary Tree Traversal (DFS & BFS)"
        subtitle="Compare Pre-Order, In-Order, Post-Order DFS and Level-Order BFS on a Binary Search Tree."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<TraversalMode>)}
      />

      <div className="mt-5 space-y-5">
        {/* Tree SVG Graph */}
        <div className="rounded-xl border border-line bg-panel p-4 flex flex-col items-center">
          <svg viewBox="0 0 400 230" className="w-full max-w-lg overflow-visible">
            {/* Edges */}
            <line x1="200" y1="40" x2="100" y2="110" stroke="var(--line)" strokeWidth="2.5" />
            <line x1="200" y1="40" x2="300" y2="110" stroke="var(--line)" strokeWidth="2.5" />
            <line x1="100" y1="110" x2="50" y2="180" stroke="var(--line)" strokeWidth="2.5" />
            <line x1="100" y1="110" x2="150" y2="180" stroke="var(--line)" strokeWidth="2.5" />
            <line x1="300" y1="110" x2="250" y2="180" stroke="var(--line)" strokeWidth="2.5" />
            <line x1="300" y1="110" x2="350" y2="180" stroke="var(--line)" strokeWidth="2.5" />

            {/* Nodes */}
            {TREE_NODES.map((node) => {
              const isActive = currentStep?.activeNodeId === node.id
              const isVisited = currentStep?.visitedNodeIds.includes(node.id)

              return (
                <g key={node.id} className="transition-all">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    className={`transition-all ${
                      isActive
                        ? 'fill-gold stroke-canvas stroke-2 scale-110 drop-shadow-md'
                        : isVisited
                        ? 'fill-easy/30 stroke-easy stroke-2'
                        : 'fill-panel-2 stroke-line stroke-2'
                    }`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className={`font-mono text-sm font-bold select-none ${
                      isActive ? 'fill-canvas font-black' : isVisited ? 'fill-easy' : 'fill-ink'
                    }`}
                  >
                    {node.val}
                  </text>
                </g>
              )
            })}
          </svg>
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
