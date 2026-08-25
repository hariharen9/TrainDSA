import type { TopicContent } from '../types'

export const intervalsTopic: TopicContent = {
  id: 'intervals',
  title: 'Intervals',
  order_index: 16,
  visualizer_id: null,
  summary: 'Sort by boundary points and sweep linearly to merge overlaps or count concurrency.',
  intuition: `Interval problems start by sorting—usually by start, sometimes by end. After that, a linear scan merges overlaps, counts concurrent meetings, or greedily drops the interval that ends latest.

Merge Intervals walks sorted ranges and extends the current end while the next start is ≤ current end. Non-overlapping intervals is the dual: keep the one that finishes first. Meeting Rooms II is a sweep: sort starts and ends separately, or use a min-heap of end times.

Treat boundaries as closed unless the prompt says otherwise. A meeting ending at 9 and another starting at 9 may or may not conflict—read the spec.`,
  patternRecognition: `- **Merge Overlaps**: Sort by start time, merge if \`current.start <= prev.end\`.
- **Insert Interval**: Add preceding intervals, merge overlapping range, append remaining.
- **Max Concurrency / Meeting Rooms**: Line sweep algorithm (chronological start/end events) or min-heap of end times.
- **Minimum Removals for Non-Overlapping**: Sort by end time, greedily keep intervals ending earliest.`,
  complexity: {
    time: 'O(n log n)',
    timeDetail: 'Sorting the intervals dominates the runtime, followed by an O(n) linear sweep.',
    space: 'O(n)',
    spaceDetail: 'Storage for the merged result array or event timeline heap.',
  },
  gotchas: [
    'Inclusive vs exclusive bounds: `[1, 2]` and `[2, 3]` overlap if endpoints are considered closed; verify boundary specs.',
    'Insert Interval: append non-overlapping prefixes, iteratively expand merged boundaries, then append suffix — do not resort an already-ordered list.',
    'Meeting Rooms vs Meeting Rooms II: the first tests boolean overlap; the second computes maximum concurrent overlaps.',
    'Minimum interval covering queries: sort intervals by start, min-heap by length/end, and sort queries with two pointers.',
    'Edge cases: single-point intervals `[1, 1]` and empty input ranges.',
  ],
  problems: [
    { id: 'insert-interval', title: 'Insert Interval', slug: 'insert-interval', difficulty: 'medium' },
    { id: 'merge-intervals', title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'medium' },
    { id: 'non-overlapping-intervals', title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'medium' },
    { id: 'meeting-rooms', title: 'Meeting Rooms', slug: 'meeting-rooms', difficulty: 'easy' },
    { id: 'meeting-rooms-ii', title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', difficulty: 'medium' },
    { id: 'minimum-interval-to-include-each-query', title: 'Minimum Interval to Include Each Query', slug: 'minimum-interval-to-include-each-query', difficulty: 'hard' },
  ],
}
