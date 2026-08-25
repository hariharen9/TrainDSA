import type { TopicContent } from '../types'

export const backtrackingTopic: TopicContent = {
  id: 'backtracking',
  title: 'Backtracking',
  order_index: 10,
  visualizer_id: null,
  summary: 'Systematic depth-first search space exploration: choose, explore, undo.',
  intuition: `Backtracking explores a search tree: choose, recurse, undo. Subsets, permutations, combinations, and constraint puzzles (N-Queens, Word Search) share the same skeleton. The state is the partial answer plus a cursor (index, used mask, or board cell).

Undo is mandatory. If you mutate an array or board, pop or restore after the recursive call. If you pass a new copy, you pay extra memory; interviewers often prefer in-place mutation plus undo.

Prune early: skip duplicates after sorting (subsets II / combination sum II), abort a path when a partial cost exceeds the target, and mark visited cells on the grid so you do not reuse a letter.`,
  patternRecognition: `- **Combinatorial Generation**: Subsets (2ⁿ), Permutations (n!), Combinations (nCr).
- **Constraint Satisfaction**: N-Queens, Sudoku solver, Word Search on grid.
- **Partitioning**: Palindrome partitioning, matchsticks to square.`,
  complexity: {
    time: 'O(2ⁿ) or O(n!)',
    timeDetail: 'Exponential branching factor, heavily dependent on search tree pruning.',
    space: 'O(n)',
    spaceDetail: 'Recursion call stack and path array depth proportional to input size n.',
  },
  gotchas: [
    'Deep copy vs in-place: pushing the same array reference into the result list captures subsequent mutations. Always push a snapshot (e.g. `path[:]` or `[...path]`).',
    'Combination Sum allows reuse: recurse on the same index `i`; Permutations do not (pass `i + 1` or a used set).',
    'Word Search: mark visited in-place, recurse 4-directionally, unmark before returning.',
    'Palindrome partitioning: only recurse/cut when prefix `s[start..i]` is a valid palindrome.',
    'N-Queens: track occupied columns, positive diagonals `(r + c)`, and negative diagonals `(r - c)` in O(1) sets.',
  ],
  problems: [
    { id: 'subsets', title: 'Subsets', slug: 'subsets', difficulty: 'medium' },
    { id: 'combination-sum', title: 'Combination Sum', slug: 'combination-sum', difficulty: 'medium' },
    { id: 'permutations', title: 'Permutations', slug: 'permutations', difficulty: 'medium' },
    { id: 'word-search', title: 'Word Search', slug: 'word-search', difficulty: 'medium' },
    { id: 'palindrome-partitioning', title: 'Palindrome Partitioning', slug: 'palindrome-partitioning', difficulty: 'medium' },
    { id: 'letter-combinations-of-a-phone-number', title: 'Letter Combinations of a Phone Number', slug: 'letter-combinations-of-a-phone-number', difficulty: 'medium' },
    { id: 'n-queens', title: 'N-Queens', slug: 'n-queens', difficulty: 'hard' },
  ],
}
