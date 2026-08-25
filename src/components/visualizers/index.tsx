import type { ComponentType } from 'react'
import { SlidingWindowVisualizer } from './SlidingWindowVisualizer'
import { TwoSumHashMapVisualizer } from './TwoSumHashMapVisualizer'

/**
 * Add an entry here whenever a topic gets a hand-built interactive explainer.
 * The topic's `visualizer_id` column (see supabase/migrations/003_visualizer_id.sql)
 * points at a key in this map. Topics without a match here just skip the slot.
 */
const registry: Record<string, ComponentType> = {
  'sliding-window': SlidingWindowVisualizer,
  'two-sum-hashmap': TwoSumHashMapVisualizer,
}

export function VisualizerSlot({ visualizerId }: { visualizerId: string | null }) {
  if (!visualizerId) return null
  const Visualizer = registry[visualizerId]
  if (!Visualizer) return null

  return (
    <section className="rounded-3xl border border-line bg-panel p-5 sm:p-6">
      <Visualizer />
    </section>
  )
}
