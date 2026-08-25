import type { TopicContent } from '../types'

export const binarySearchTopic: TopicContent = {
  id: 'binary-search',
  title: 'Binary Search',
  order_index: 5,
  visualizer_id: null,
  summary: 'Halve monotonic search spaces in logarithmic time, over indices or answer ranges.',
  intuition: `Binary search discards half of a sorted search space each step. The textbook form finds a target in a sorted array. The interview form searches over an *answer range*: capacity, time, or an index where a predicate flips from false to true.

The loop invariant is everything: decide whether \`mid\` is still feasible, then move \`lo\` or \`hi\` so the feasible region never loses the answer. Answer-range search usually looks like \`while lo < hi\` with \`hi = mid\` or \`lo = mid + 1\`.

Rotated arrays still have a sorted half; identify which half is sorted, then decide whether the target lives there. 2D matrix search treats the matrix as a virtual 1D sorted array when rows are ordered.`,
  patternRecognition: `- **Sorted Arrays**: Direct target lookup, first/last occurrence, insertion point.
- **Search on Answer Space**: "Find the minimum capacity to ship in D days", "koko eating bananas", "split array largest sum".
- **Partially Sorted / Rotated**: Peak element, search in rotated sorted array, find minimum in rotated sorted array.`,
  complexity: {
    time: 'O(log n)',
    timeDetail: 'The search range is halved on each comparison step.',
    space: 'O(1)',
    spaceDetail: 'Iterative binary search uses only pointers (lo, hi, mid).',
  },
  gotchas: [
    'Inclusive vs exclusive bounds: mixing `hi = mid` with `hi = mid - 1` is the classic off-by-one.',
    'Overflow: use `lo + Math.floor((hi - lo) / 2)` instead of `(lo + hi) / 2`.',
    'Duplicates in rotated arrays can make both halves look unsorted; you may need to shrink one side by one.',
    'Time-based store: binary search timestamps per key, not a global timeline.',
    'Median of two sorted arrays is binary search on partition index, not a merge.',
  ],
  problems: [
    { id: 'binary-search', title: 'Binary Search', slug: 'binary-search', difficulty: 'easy' },
    { id: 'search-a-2d-matrix', title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'medium' },
    { id: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'medium' },
    { id: 'find-minimum-in-rotated-sorted-array', title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'medium' },
    { id: 'time-based-key-value-store', title: 'Time Based Key-Value Store', slug: 'time-based-key-value-store', difficulty: 'medium' },
    { id: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'hard' },
  ],
}
