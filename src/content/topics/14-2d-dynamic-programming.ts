import type { TopicContent } from '../types'

export const twoDDynamicProgrammingTopic: TopicContent = {
  id: '2d-dynamic-programming',
  title: '2-D Dynamic Programming',
  order_index: 14,
  visualizer_id: null,
  summary: 'Grid coordinates, two-string sequence alignments, and multi-dimensional state spaces.',
  intuition: `2-D DP uses a table indexed by two dimensions: grid coordinates, or positions in two sequences. Unique Paths counts ways to a cell from above and left. LCS and Edit Distance align two strings: \`dp[i][j]\` is the best for prefixes s[:i] and t[:j].

Base cases are the whole game. First row/column of a grid often has only one path. Empty prefixes in string DP are zeros or identity costs. Rolling arrays can drop a dimension when you only need the previous row.

Stock-with-cooldown and Target Sum are still 2-state problems even if one index is implicit (day × holding, or index × running sum).`,
  patternRecognition: `- **2D Grid Paths**: Unique paths, minimum path sum, dungeon game.
- **Two Sequence Alignment**: Longest common subsequence (LCS), edit distance, interleaving string.
- **0/1 Knapsack & Target Sum**: Subset sum, coin change combinations (outer loop on coins).
- **State Machine DP**: Best time to buy and sell stock with cooldown / transaction fees.`,
  complexity: {
    time: 'O(m × n)',
    timeDetail: 'Filling an m × n table with O(1) state transitions per cell.',
    space: 'O(m × n) or O(min(m, n))',
    spaceDetail: 'Can be compressed to a 1D rolling array when transitions only rely on the current and previous row.',
  },
  gotchas: [
    'Off-by-one in string DP: allocate `(m + 1) × (n + 1)` tables to naturally accommodate empty string base cases.',
    'Unique Paths obstacles: a blocked cell has 0 ways and must never inherit paths from adjacent neighbors.',
    'Coin Change II: iterate coins in the *outer loop* to count unique combinations, not permutations.',
    'Interleaving String: `dp[i][j]` means the first i characters of s1 and first j characters of s2 form the prefix of s3.',
    'Edit Distance: insertion, deletion, and substitution are three distinct transitions; character match copies diagonal cost without incrementing.',
  ],
  problems: [
    { id: 'unique-paths', title: 'Unique Paths', slug: 'unique-paths', difficulty: 'medium' },
    { id: 'longest-common-subsequence', title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'medium' },
    { id: 'best-time-to-buy-and-sell-stock-with-cooldown', title: 'Best Time to Buy and Sell Stock with Cooldown', slug: 'best-time-to-buy-and-sell-stock-with-cooldown', difficulty: 'medium' },
    { id: 'coin-change-ii', title: 'Coin Change II', slug: 'coin-change-ii', difficulty: 'medium' },
    { id: 'target-sum', title: 'Target Sum', slug: 'target-sum', difficulty: 'medium' },
    { id: 'interleaving-string', title: 'Interleaving String', slug: 'interleaving-string', difficulty: 'medium' },
    { id: 'edit-distance', title: 'Edit Distance', slug: 'edit-distance', difficulty: 'medium' },
  ],
}
