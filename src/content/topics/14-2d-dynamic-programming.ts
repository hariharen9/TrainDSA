import type { TopicContent } from '../types'

export const twoDDynamicProgrammingTopic: TopicContent = {
  id: '2d-dynamic-programming',
  title: '2-D Dynamic Programming',
  order_index: 14,
  visualizer_id: null,
  summary: 'Solve multi-variable subproblems: 2D grid pathfinding, two-string sequence alignments (LCS, Edit Distance), and state machines.',
  intuition: `### 1. The Core Mental Model: Two Independent State Parameters

While 1D DP tracks a single variable (like array index or coin amount), **2-D Dynamic Programming** is required when subproblems depend on **two independent state parameters** \`(i, j)\`:

1. **Grid Coordinates \`(r, c)\`**: Navigating paths in a 2D matrix (*Unique Paths*, *Minimum Path Sum*).
2. **Two String Pointers \`(i, j)\`**: Comparing, aligning, or matching two distinct sequences (*Longest Common Subsequence*, *Edit Distance*, *Interleaving String*).
3. **Item Index & Remaining Capacity \`(i, remain)\`**: Classical 0/1 Knapsack (*Target Sum*).
4. **Day Index & State \`(day, state)\`**: State Machine DP (*Stock Trading with Cooldown / Fees*).

---

### 2. The 1D Space Compression Superpower

In most 2D DP grids, computing cell \`dp[i][j]\` only looks at:
- The cell directly above (\`dp[i - 1][j]\`)
- The cell to the left (\`dp[i][j - 1]\`)
- The diagonal cell (\`dp[i - 1][j - 1]\`)

Because it only depends on the **previous row** and the **current row**, you can compress the entire $M \times N$ matrix into a **single 1D row array of size $N$**, dropping space complexity from **\`O(M × N)\` to \`O(N)\`**!

---

### 3. Comparison: Two-String Matching Recurrences

| Problem | Condition: \`text1[i] == text2[j]\` | Condition: \`text1[i] != text2[j]\` | Base Cases |
| :--- | :--- | :--- | :--- |
| **Longest Common Subsequence (LCS)** | \`1 + dp[i-1][j-1]\` (diagonal match) | \`max(dp[i-1][j], dp[i][j-1])\` | \`dp[0][j] = 0\`, \`dp[i][0] = 0\` |
| **Edit Distance** | \`dp[i-1][j-1]\` (0 cost) | \`1 + min(insert, delete, replace)\` | \`dp[i][0] = i\`, \`dp[0][j] = j\` |
| **Interleaving String** | Valid if coming from top or left matching | \`False\` | \`dp[0][0] = True\` |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: 2D Grid Path Navigation
- **Giveaway**: *"Number of unique paths from top-left to bottom-right"*, *"Minimum path sum in grid"*.
- **Strategy**: Define \`dp[r][c]\` as ways/cost to reach cell \`(r, c)\`. Recurrence: \`dp[r][c] = dp[r-1][c] + dp[r][c-1]\`.
- **Top Problems**: *Unique Paths*, *Minimum Path Sum*.
- **Likely follow-up**: *"Can you do it in O(N) space?"* — maintain a single 1D array \`row\` of size $N$ and update \`row[c] += row[c - 1]\`.

#### Pattern 2: Two-String Alignment (LCS & Edit Distance)
- **Giveaway**: *"Longest common subsequence"*, *"Minimum operations to convert word1 to word2"*, *"Distinct subsequences"*.
- **Strategy**: Create a 2D table of size \`(len(s1) + 1) x (len(s2) + 1)\`. Match on diagonal; mismatch branches across row/column deletions.
- **Top Problems**: *Longest Common Subsequence*, *Edit Distance*, *Distinct Subsequences*, *Interleaving String*.
- **Likely follow-up**: *"Why size (M + 1) x (N + 1)?"* — 1-indexed tables provide a clean row/column of base cases representing empty strings (\`""\`).

#### Pattern 3: Target Sum / Subset Partitioning
- **Giveaway**: *"Assign '+' and '-' to array elements to evaluate to target"*.
- **Strategy**: Mathematical reduction: Let positive subset be $P$ and negative subset be $N$. $P - N = \text{target}$ and $P + N = \text{total} \implies P = (\text{total} + \text{target}) // 2$. Reduces directly to 0/1 Knapsack!
- **Top Problems**: *Target Sum*.
- **Likely follow-up**: *"When is target sum impossible?"* — if \`abs(target) > total\` or \`(total + target) % 2 != 0\`.

#### Pattern 4: State Machine DP (Stock Trading)
- **Giveaway**: *"Best time to buy and sell stock with cooldown / transaction fee"*.
- **Strategy**: Define discrete states for each day: \`held\` (holding stock), \`sold\` (just sold, entering cooldown), \`rest\` (ready to buy).
- **Top Problems**: *Best Time to Buy and Sell Stock with Cooldown*.
- **Likely follow-up**: *"What are the transitions?"* — \`held = max(held, rest - price)\`, \`sold = held + price\`, \`rest = max(rest, prev_sold)\`.`,
  workedExample: {
    title: 'Longest Common Subsequence (2D Table)',
    problem: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence.
A subsequence is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

- **State**: \`dp[i][j]\` = length of LCS between \`text1[:i]\` and \`text2[:j]\`.
- **Recurrence**:
  - If \`text1[i-1] == text2[j-1]\`: \`dp[i][j] = 1 + dp[i-1][j-1]\`
  - Else: \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\``,
    code: {
      language: 'python',
      snippet: `def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    # 2D table of size (m + 1) x (n + 1) initialized to 0
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                # Characters match: extend LCS from diagonal previous state
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                # Characters differ: take best of skipping text1[i-1] or text2[j-1]
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]`,
    },
    explanation: `Trace with text1 = "abcde", text2 = "ace":
        ""   a   c   e
  ""  [  0,  0,  0,  0 ]
  a   [  0,  1,  1,  1 ]  ('a' == 'a' -> 1 + dp[0][0])
  b   [  0,  1,  1,  1 ]
  c   [  0,  1,  2,  2 ]  ('c' == 'c' -> 1 + dp[2][1] = 2)
  d   [  0,  1,  2,  2 ]
  e   [  0,  1,  2,  3 ]  ('e' == 'e' -> 1 + dp[4][2] = 3)
Result: dp[5][3] = 3 ("ace").
Time: O(M * N), Space: O(M * N) (or O(N) compressed).`,
  },
  complexity: {
    time: 'O(M * N)',
    timeDetail: 'M and N are the dimensions of the grid, string lengths, or item/capacity bounds. Each cell takes O(1) transition work.',
    space: 'O(M * N)',
    spaceDetail: 'Standard 2D table storage, which can be optimized to O(min(M, N)) by maintaining only the previous and current rows.',
  },
  commonMistakes: `1. **Off-by-One in 1-Indexed DP Tables**:
   When using an \`(M + 1) x (N + 1)\` table, the character for row \`i\` is \`text1[i - 1]\` (not \`text1[i]\`). Accessing \`text1[i]\` will cause an \`IndexError\` at \`i = M\`.

2. **Incorrect Edit Distance Base Cases**:
   Converting an empty string \`""\` to a string of length \`j\` requires \`j\` insertions. Forgetting to initialize \`dp[0][j] = j\` and \`dp[i][0] = i\` breaks all subsequent edit distance calculations.

3. **Target Sum Reduction Parity Bug**:
   In *Target Sum*, if \`(total + target) % 2 != 0\` or \`total < abs(target)\`, no integer subset can sum to target. Forgetting to return \`0\` early causes invalid integer division errors.

4. **Corrupting the Diagonal During 1D Space Compression**:
   When compressing 2D DP to a single 1D array \`dp[j]\`, overwriting \`dp[j]\` destroys the diagonal top-left value (\`dp[i-1][j-1]\`) needed for the next column. Always store the diagonal in a temporary \`prev_diag\` variable!`,
  gotchas: [
    'Always use 1-indexed DP tables for string matching so `dp[0][...]` and `dp[...][0]` naturally represent empty string base cases.',
    'Unique Paths space optimization: maintain a single 1D array `row = [1] * n` and update `row[c] += row[c - 1]`.',
    'Edit Distance: match costs 0 (`dp[i-1][j-1]`); mismatch costs `1 + min(insert, delete, replace)`.',
    'Target Sum: reduces mathematically to 0/1 Knapsack Subset Sum for target `(total + target) // 2`.',
  ],
  problems: [
    { id: 'unique-paths', title: 'Unique Paths', slug: 'unique-paths', difficulty: 'medium' },
    { id: 'longest-common-subsequence', title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'medium' },
    { id: 'best-time-to-buy-and-sell-stock-with-cooldown', title: 'Best Time to Buy and Sell Stock with Cooldown', slug: 'best-time-to-buy-and-sell-stock-with-cooldown', difficulty: 'medium' },
    { id: 'coin-change-ii', title: 'Coin Change II', slug: 'coin-change-ii', difficulty: 'medium' },
    { id: 'target-sum', title: 'Target Sum', slug: 'target-sum', difficulty: 'medium' },
    { id: 'interleaving-string', title: 'Interleaving String', slug: 'interleaving-string', difficulty: 'medium' },
    { id: 'longest-increasing-path-in-a-matrix', title: 'Longest Increasing Path in a Matrix', slug: 'longest-increasing-path-in-a-matrix', difficulty: 'hard' },
    { id: 'distinct-subsequences', title: 'Distinct Subsequences', slug: 'distinct-subsequences', difficulty: 'hard' },
    { id: 'edit-distance', title: 'Edit Distance', slug: 'edit-distance', difficulty: 'hard' },
    { id: 'burst-balloons', title: 'Burst Balloons', slug: 'burst-balloons', difficulty: 'hard' },
    { id: 'regular-expression-matching', title: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'hard' },
  ],
}
