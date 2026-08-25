import type { TopicContent } from '../types'

export const greedyTopic: TopicContent = {
  id: 'greedy',
  title: 'Greedy',
  order_index: 15,
  visualizer_id: null,
  summary: 'Commit to locally optimal choices without backtracking when the greedy-choice property holds.',
  intuition: `A greedy algorithm commits to a locally optimal choice and never revisits it. It is correct only when a greedy-choice property holds: some globally optimal solution includes that local pick. Kadane’s maximum subarray, jump-game reach, and gas-station circuits are the standard proofs.

Pattern-match: if sorting by an endpoint, then scanning once, yields the answer (intervals, jump game II range expansion), you are in greedy territory. If later decisions depend on a global trade-off that local sorting cannot capture, you likely need DP.

Always be ready to say *why* the greedy step does not block a better solution—exchange argument or "if we did not pick this, we could swap."`,
  patternRecognition: `- **Farthest Reach / Window Expansion**: Jump Game, Jump Game II.
- **Running Deficit Accumulation**: Gas Station circuit.
- **Maximum Subarray Sum**: Kadane's algorithm (reset running sum when negative).
- **Sorted Item Extraction**: Hand of Straights, Merge Triplets.`,
  complexity: {
    time: 'O(n) or O(n log n)',
    timeDetail: 'Usually a single linear pass after optional O(n log n) sorting.',
    space: 'O(1)',
    spaceDetail: 'Tracks state using pointers and counters without extra table storage.',
  },
  gotchas: [
    'Jump Game: maintain a running `farthest` index; you fail only if current index `i > farthest`.',
    'Jump Game II: expand the current jump’s range; increment jump count when the previous range boundary is reached.',
    'Gas Station: if `total_gas < total_cost`, the circuit is impossible; otherwise the unique valid start index is immediately after the lowest cumulative deficit.',
    'Hand of Straights: greedily take cards from the smallest remaining value; a hash map of frequencies is required.',
    'Maximum Subarray: Kadane resets the running sum when it drops below zero (unless all elements are negative — still return the single largest element).',
  ],
  problems: [
    { id: 'maximum-subarray', title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'medium' },
    { id: 'jump-game', title: 'Jump Game', slug: 'jump-game', difficulty: 'medium' },
    { id: 'jump-game-ii', title: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'medium' },
    { id: 'gas-station', title: 'Gas Station', slug: 'gas-station', difficulty: 'medium' },
    { id: 'hand-of-straights', title: 'Hand of Straights', slug: 'hand-of-straights', difficulty: 'medium' },
    { id: 'merge-triplets-to-form-target-triplet', title: 'Merge Triplets to Form Target Triplet', slug: 'merge-triplets-to-form-target-triplet', difficulty: 'medium' },
  ],
}
