import type { ComponentType } from 'react'
import { TwoSumHashMapVisualizer } from './TwoSumHashMapVisualizer'
import { TwoPointersVisualizer } from './TwoPointersVisualizer'
import { SlidingWindowVisualizer } from './SlidingWindowVisualizer'
import { MonotonicStackVisualizer } from './MonotonicStackVisualizer'
import { BinarySearchVisualizer } from './BinarySearchVisualizer'
import { LinkedListVisualizer } from './LinkedListVisualizer'
import { TreeTraversalVisualizer } from './TreeTraversalVisualizer'
import { TrieVisualizer } from './TrieVisualizer'
import { HeapVisualizer } from './HeapVisualizer'
import { BacktrackingVisualizer } from './BacktrackingVisualizer'
import { GraphGridVisualizer } from './GraphGridVisualizer'
import { DijkstraVisualizer } from './DijkstraVisualizer'
import { OneDDPVisualizer } from './OneDDPVisualizer'
import { TwoDDPVisualizer } from './TwoDDPVisualizer'
import { GreedyJumpVisualizer } from './GreedyJumpVisualizer'
import { IntervalsVisualizer } from './IntervalsVisualizer'
import { BitManipulationVisualizer } from './BitManipulationVisualizer'

/**
 * Registry connecting topic visualizer_id to its interactive React component.
 * All 17 topics in the curriculum have a dedicated step-by-step visualizer.
 */
const registry: Record<string, ComponentType> = {
  'two-sum-hashmap': TwoSumHashMapVisualizer,
  'arrays-hashing': TwoSumHashMapVisualizer,
  'two-pointers': TwoPointersVisualizer,
  'sliding-window': SlidingWindowVisualizer,
  'stack': MonotonicStackVisualizer,
  'binary-search': BinarySearchVisualizer,
  'linked-lists': LinkedListVisualizer,
  'trees': TreeTraversalVisualizer,
  'tries': TrieVisualizer,
  'heap-priority-queue': HeapVisualizer,
  'backtracking': BacktrackingVisualizer,
  'graphs': GraphGridVisualizer,
  'advanced-graphs': DijkstraVisualizer,
  '1d-dynamic-programming': OneDDPVisualizer,
  '2d-dynamic-programming': TwoDDPVisualizer,
  'greedy': GreedyJumpVisualizer,
  'intervals': IntervalsVisualizer,
  'bit-manipulation': BitManipulationVisualizer,
}

export function VisualizerSlot({ visualizerId }: { visualizerId: string | null }) {
  if (!visualizerId) return null
  const Visualizer = registry[visualizerId]
  if (!Visualizer) return null

  return (
    <section className="rounded-3xl border border-line bg-panel p-4 sm:p-6">
      <Visualizer />
    </section>
  )
}
