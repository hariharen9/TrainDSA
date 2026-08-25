import type { TopicContent } from '../types'

export const twoPointersTopic: TopicContent = {
  id: 'two-pointers',
  title: 'Two Pointers',
  order_index: 2,
  visualizer_id: null,
  summary: 'Replace nested loops by moving bounded indices monotonically across ordered spaces.',
  intuition: `Two pointers replace nested loops when the search space is ordered or can be ordered. Place indices at opposite ends and move the one that cannot produce a better answer, or walk a fast pointer ahead of a slow one to find a middle, a cycle, or a window of length k.

Converging pointers shine on sorted arrays: Two Sum II, 3Sum, and container-with-most-water all shrink the candidate pair set monotonically. The slow/fast (tortoise and hare) variant detects cycles and finds midpoints without extra storage.

The invariant is the point: after each move, every discarded index is provably worse than what remains. If you cannot state that invariant, you probably need sorting first, or a different pattern (sliding window, hash map).`,
  patternRecognition: `- **Opposite ends converging**: Sorted arrays looking for target pair sums or maximizing area bounded by endpoints.
- **Fast / Slow pointers**: Linked list midpoint, cycle detection (Floyd's algorithm), removing duplicates in-place.
- **Two array sweep**: Merging sorted lists or checking subsequences.`,
  complexity: {
    time: 'O(n)',
    timeDetail: 'Pointers start at ends and only move closer, meeting in at most n steps.',
    space: 'O(1)',
    spaceDetail: 'Only a constant number of pointer variables are stored in memory.',
  },
  gotchas: [
    'Many two-pointer proofs assume a sorted input. Unsorted arrays usually need a sort or a hash map instead.',
    '3Sum: sort, then skip duplicate values at each of the three positions or you emit duplicate triplets.',
    'Palindrome checks: skip non-alphanumeric characters and compare case-insensitively.',
    'Container / trapping rain water: moving the taller side never helps; always advance the shorter pointer.',
    'Off-by-one: decide whether pointers are inclusive and whether they may cross.',
  ],
  problems: [
    { id: 'valid-palindrome', title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'easy' },
    { id: 'two-sum-ii', title: 'Two Sum II', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'medium' },
    { id: '3sum', title: '3Sum', slug: '3sum', difficulty: 'medium' },
    { id: 'container-with-most-water', title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'medium' },
    { id: 'trapping-rain-water', title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'hard' },
  ],
}
