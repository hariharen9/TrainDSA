import type { TopicContent } from '../types'

export const linkedListsTopic: TopicContent = {
  id: 'linked-lists',
  title: 'Linked Lists',
  order_index: 6,
  visualizer_id: null,
  summary: 'Pointer rewiring, sentinels, and multi-pointer traversal over sequential nodes.',
  intuition: `Linked lists make pointer rewiring the algorithm. Reverse a list by walking three references (prev, curr, next). Merge two sorted lists by always attaching the smaller head. Detect a cycle with fast/slow pointers; if they meet, a second pointer from the head finds the cycle start.

Dummy nodes simplify insert/delete at the head. Finding the nth-from-end node is two pointers offset by n. Copying a list with random pointers is usually a two- or three-pass map, or an interleave-in-place trick.

Draw the pointers. Most bugs are a lost \`next\` reference or a loop that never advances because you mutated the node you still need.`,
  patternRecognition: `- **Reversal**: 3-pointer walk (prev, curr, next).
- **Dummy / Sentinel Heads**: Avoid special casing insertions/deletions at the head of a list.
- **Fast / Slow pointers**: Cycle detection (Floyd's algorithm) and finding middle node in 1 pass.
- **Two pointers with offset**: Finding the nth node from the end.`,
  complexity: {
    time: 'O(n)',
    timeDetail: 'Traversal is linear; insertion/deletion is O(1) once pointer is reached.',
    space: 'O(1)',
    spaceDetail: 'In-place pointer mutation requires no extra memory.',
  },
  gotchas: [
    'Null heads and single-node lists: every routine should survive both without crashing.',
    'After reverse, the new head is the old tail; do not return the original head.',
    'Cycle detection: fast starts at head or head.next consistently with your meet condition.',
    'Reorder list: split at mid, reverse the second half, then weave together.',
    'Merge K lists: heap of current heads is O(N log k); naive pairwise merge is slower.',
  ],
  problems: [
    { id: 'reverse-linked-list', title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'easy' },
    { id: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'easy' },
    { id: 'linked-list-cycle', title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'easy' },
    { id: 'reorder-list', title: 'Reorder List', slug: 'reorder-list', difficulty: 'medium' },
    { id: 'remove-nth-node-from-end-of-list', title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'medium' },
    { id: 'copy-list-with-random-pointer', title: 'Copy List with Random Pointer', slug: 'copy-list-with-random-pointer', difficulty: 'medium' },
    { id: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'hard' },
  ],
}
