import type { TopicContent } from '../types'

export const heapPriorityQueueTopic: TopicContent = {
  id: 'heap-priority-queue',
  title: 'Heap / Priority Queue',
  order_index: 9,
  visualizer_id: null,
  summary: 'O(1) access to extremes (min/max) and O(log n) dynamic updates for top-k streaming.',
  intuition: `A heap gives you the current min or max in O(1) and insert/pop in O(log n). Streaming problems that need "the kth largest so far" or "median of a growing list" are two-heap or bounded-heap designs, not full sorts on every update.

K-closest points and last-stone-weight are one-heap problems. Task scheduler uses either a max-heap of remaining counts plus a cooldown queue, or a math formula. Language specifics matter: Python's heapq is min-heap; Java PriorityQueue is min-heap by default; JS has no built-in heap in standard runtime—state clearly that you use a heap abstraction.

When k is tiny compared to n, a size-k heap (O(n log k)) beats full sorting (O(n log n)).`,
  patternRecognition: `- **Top K Elements**: Kth largest element, k closest points to origin, top k frequent items.
- **Two Heaps Pattern**: Median from data stream (max-heap for smaller half, min-heap for larger half).
- **Greedy Scheduling**: Task scheduler, meeting rooms, CPU scheduling.`,
  complexity: {
    time: 'O(log k)',
    timeDetail: 'Push and pop operations take O(log k) where k is the heap size.',
    space: 'O(k)',
    spaceDetail: 'A bounded heap stores only the top k elements in memory.',
  },
  gotchas: [
    'JavaScript interviews: state that you would use a heap; sorting each time is a fallback that fails for streaming data.',
    'Kth largest in a stream: maintain a min-heap of size k, not a max-heap of everything.',
    'Median stream: max-heap for the lower half, min-heap for the upper half; rebalance sizes so sizes differ by at most 1.',
    'Distance comparisons: compare squared Euclidean distances (`x² + y²`) to avoid floating-point errors.',
    'Task scheduler idle time: heap of counts plus a time wheel/queue for cooldowns.',
  ],
  problems: [
    { id: 'kth-largest-element-in-a-stream', title: 'Kth Largest Element in a Stream', slug: 'kth-largest-element-in-a-stream', difficulty: 'easy' },
    { id: 'last-stone-weight', title: 'Last Stone Weight', slug: 'last-stone-weight', difficulty: 'easy' },
    { id: 'k-closest-points-to-origin', title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'medium' },
    { id: 'task-scheduler', title: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'medium' },
    { id: 'find-median-from-data-stream', title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'hard' },
  ],
}
