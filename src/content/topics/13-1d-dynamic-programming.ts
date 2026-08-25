import type { TopicContent } from '../types'

export const oneDDynamicProgrammingTopic: TopicContent = {
  id: '1d-dynamic-programming',
  title: '1-D Dynamic Programming',
  order_index: 13,
  visualizer_id: null,
  summary: 'Optimal substructure and memoized prefix states over linear sequences.',
  intuition: `1-D DP stores the best answer for prefixes of a linear structure. Optimal substructure means the best for i is computed from a few earlier states. Memoization is top-down recursion plus a cache; tabulation fills an array left to right.

Classic recurrences: climbing stairs (\`dp[i] = dp[i-1] + dp[i-2]\`), house robber (\`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`), coin change (unbounded knapsack), LIS (patience sorting or O(n²) DP), word break (prefix boolean). Palindromes expand around centers or use a boolean table.

Name the state in words before coding: "minimum coins to make amount a" is clearer than a vague \`dp[i]\`.`,
  patternRecognition: `- **Choice at index i (Include / Exclude)**: House Robber, Climbing Stairs.
- **Unbounded Knapsack / Combinations**: Coin Change (min coins to reach amount).
- **Subsequence / Partitioning**: Longest Increasing Subsequence, Word Break, Decode Ways.
- **Palindrome Centers**: Longest Palindromic Substring, Palindromic Substrings.`,
  complexity: {
    time: 'O(n) to O(n²)',
    timeDetail: 'State count × transition time per state (e.g. O(n) for House Robber, O(n · amount) for Coin Change).',
    space: 'O(1) to O(n)',
    spaceDetail: 'Can often be optimized to O(1) rolling variables when state only depends on the previous 1 or 2 entries.',
  },
  gotchas: [
    'Initialize DP arrays with sentinel values (`Infinity` or `-1`) for "unreachable" states, not 0, on minimization problems.',
    'House Robber II: circular constraint — run linear robber on `nums[0..n-2]` and `nums[1..n-1]` and take the max.',
    'Coin Change vs Coin Change II: the first is minimum coins; the second is total combinations (order does not matter).',
    'Decode Ways: leading zeros like "06" are invalid; handle "10" and "20" carefully.',
    'LIS O(n log n) with binary search (patience sorting tails array) is expected at senior level; O(n²) is acceptable if explained.',
  ],
  problems: [
    { id: 'climbing-stairs', title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'easy' },
    { id: 'house-robber', title: 'House Robber', slug: 'house-robber', difficulty: 'medium' },
    { id: 'house-robber-ii', title: 'House Robber II', slug: 'house-robber-ii', difficulty: 'medium' },
    { id: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'medium' },
    { id: 'palindromic-substrings', title: 'Palindromic Substrings', slug: 'palindromic-substrings', difficulty: 'medium' },
    { id: 'decode-ways', title: 'Decode Ways', slug: 'decode-ways', difficulty: 'medium' },
    { id: 'coin-change', title: 'Coin Change', slug: 'coin-change', difficulty: 'medium' },
    { id: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'medium' },
    { id: 'word-break', title: 'Word Break', slug: 'word-break', difficulty: 'medium' },
  ],
}
