import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type GridPreset = {
  grid: number[][] // 1 = land, 0 = water
}

const PRESETS: PresetOption<GridPreset>[] = [
  {
    id: 'three-islands',
    label: 'Standard (3 Islands)',
    value: {
      grid: [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
    },
    description: 'Top-left 2x2 island, single island at (2,2), single at (3,3)',
  },
  {
    id: 'two-islands',
    label: 'Two Archipelagoes',
    value: {
      grid: [
        [1, 1, 0, 1],
        [0, 1, 0, 1],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
      ],
    },
    description: 'Distinct L-shaped and vertical islands',
  },
]

type Step = {
  grid: number[][] // 0 = water, 1 = unvisited land, 2 = visited/flooded land
  currentCell: [number, number] | null
  islandCount: number
  explanation: string
  actionType: 'check' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'islands = 0' },
  { lineNum: 2, code: 'for r in range(rows):' },
  { lineNum: 3, code: '    for c in range(cols):' },
  { lineNum: 4, code: '        if grid[r][c] == "1":' },
  { lineNum: 5, code: '            islands += 1' },
  { lineNum: 6, code: '            bfs_flood_fill(r, c)  # mark connected 1s to 0' },
  { lineNum: 7, code: 'return islands' },
]

function generateGridSteps(initialGrid: number[][]): Step[] {
  const steps: Step[] = []
  const rows = initialGrid.length
  const cols = initialGrid[0].length
  const grid = initialGrid.map((r) => [...r])
  let islandCount = 0

  steps.push({
    grid: grid.map((r) => [...r]),
    currentCell: null,
    islandCount: 0,
    explanation: 'Starting scan across all grid cells (r, c) from top-left to bottom-right.',
    actionType: 'check',
    codeLine: 2,
  })

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        islandCount++
        steps.push({
          grid: grid.map((row) => [...row]),
          currentCell: [r, c],
          islandCount,
          explanation: `🏝️ NEW ISLAND FOUND at (${r}, ${c})! Total count = ${islandCount}. Launching BFS flood fill to sink connected land.`,
          actionType: 'insert',
          codeLine: 5,
        })

        // BFS flood fill
        const queue: [number, number][] = [[r, c]]
        grid[r][c] = 2 // mark visited

        while (queue.length > 0) {
          const [cr, cc] = queue.shift()!
          const neighbors: [number, number][] = [
            [cr - 1, cc],
            [cr + 1, cc],
            [cr, cc - 1],
            [cr, cc + 1],
          ]

          for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
              grid[nr][nc] = 2
              queue.push([nr, nc])
              steps.push({
                grid: grid.map((row) => [...row]),
                currentCell: [nr, nc],
                islandCount,
                explanation: `Flooding connected land neighbor (${nr}, ${nc}) into Island #${islandCount}.`,
                actionType: 'check',
                codeLine: 6,
              })
            }
          }
        }
      }
    }
  }

  steps.push({
    grid: grid.map((row) => [...row]),
    currentCell: null,
    islandCount,
    explanation: `🏁 Entire grid scanned! Total independent islands = ${islandCount}.`,
    actionType: 'done',
    codeLine: 7,
  })

  return steps
}

export function GraphGridVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<GridPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const steps = useMemo(() => generateGridSteps(activePreset.value.grid), [activePreset.value])
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
    { label: 'Total Islands', value: currentStep?.islandCount ?? 0, highlight: true },
    { label: 'Active Cell', value: currentStep?.currentCell ? `(${currentStep.currentCell[0]}, ${currentStep.currentCell[1]})` : 'None' },
    { label: 'Grid Dimensions', value: '4 × 4' },
    { label: 'Time Complexity', value: 'O(R × C)', accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Graphs"
        title="Number of Islands: 2D Grid BFS Flood Fill"
        subtitle="Watch breadth-first search explore connected components in a 2D matrix."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<GridPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* 2D Grid Visualizer */}
        <div className="rounded-xl border border-line bg-panel p-6 flex flex-col items-center">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
            {currentStep?.grid.map((row, r) =>
              row.map((cell, c) => {
                const isCurrent =
                  currentStep.currentCell &&
                  currentStep.currentCell[0] === r &&
                  currentStep.currentCell[1] === c

                const isWater = cell === 0
                const isUnvisitedLand = cell === 1
                const isFloodedLand = cell === 2

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex size-14 sm:size-16 flex-col items-center justify-center rounded-2xl font-mono text-sm font-bold border-2 transition-all ${
                      isCurrent
                        ? 'border-gold bg-gold/30 text-gold scale-110 shadow-lg shadow-gold/25'
                        : isFloodedLand
                        ? 'border-easy bg-easy/25 text-easy'
                        : isUnvisitedLand
                        ? 'border-gold/60 bg-panel-2 text-ink font-semibold'
                        : 'border-line/60 bg-canvas/60 text-muted/40'
                    }`}
                  >
                    <span className="text-base">{isWater ? '🌊' : isFloodedLand ? '🏝️' : '⛰️'}</span>
                    <span className="text-[10px] text-muted font-normal">
                      {r},{c}
                    </span>
                  </div>
                )
              }),
            )}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-muted">
            <span className="flex items-center gap-1.5"><span className="text-sm">🌊</span> Water (0)</span>
            <span className="flex items-center gap-1.5"><span className="text-sm">⛰️</span> Unvisited Land (1)</span>
            <span className="flex items-center gap-1.5"><span className="text-sm">🏝️</span> Flooded (Visited)</span>
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'insert' ? 'NEW ISLAND' : undefined}
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
