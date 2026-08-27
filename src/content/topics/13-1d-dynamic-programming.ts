import type { TopicContent } from '../types'

export const oneDDynamicProgrammingTopic: TopicContent = {
  id: '1d-dynamic-programming',
  title: '1-D Dynamic Programming',
  order_index: 13,
  visualizer_id: null,
  summary: 'Break complex optimization problems into overlapping subproblems using the 5-step DP framework and state compression.',
  intuition: `### 1. The Core Mental Model: Remembering the Past

**Dynamic Programming (DP)** is simply **careful recursion with a memory cache**.

Whenever a problem has:
1. **Overlapping Subproblems**: The same calculations are repeated thousands of times across the recursion tree (e.g. \`fib(5)\` needs \`fib(3)\`, and \`fib(4)\` also needs \`fib(3)\`).
2. **Optimal Substructure**: The optimal solution to the large problem can be constructed from optimal solutions to its smaller subproblems.

Instead of recomputing subproblems exponentially (\`O(2^n)\`), DP solves each unique subproblem **exactly once** and stores the result in a table or array (\`O(n)\`).

---

### 2. The 5-Step Interview DP Framework

When solving any DP problem in an interview, explicitly state these 5 steps out loud:

1. **State Definition**: What does \`dp[i]\` mean in plain English? *(e.g. \`dp[i]\` = minimum number of coins to make change for amount \`i\`)*.
2. **Recurrence Relation**: Express \`dp[i]\` mathematically using smaller subproblems *(e.g. \`dp[i] = min(dp[i - coin] + 1)\`)*.
3. **Base Cases**: What is the simplest trivial subproblem? *(e.g. \`dp[0] = 0\`)*.
4. **Order of Computation**: Bottom-up iteration direction *(e.g. loop from \`amount = 1\` to \`target\`)*.
5. **Space Optimization**: If \`dp[i]\` only looks back 1 or 2 steps (like *House Robber*), compress the array into two variables for **\`O(1)\` extra space**!

---

### 3. Comparison: Top-Down Memoization vs. Bottom-Up Tabulation

| Dimension | Top-Down (Memoization) | Bottom-Up (Tabulation) |
| :--- | :--- | :--- |
| **Approach** | Natural recursion + \`@cache\` or \`memo\` dict | Iterative table/array from 0 to N |
| **Ease of Writing** | Intuitive: mirrors brute-force decision tree | Requires determining correct loop order |
| **Call Stack Overhead** | Yes (risk of recursion stack overflow) | **Zero call stack overhead** |
| **Space Optimization** | Difficult (entire tree in memory) | **Trivial to compress to \`O(1)\` space** |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: Fibonacci / Constant Lookback Sequence
- **Giveaway**: *"Climbing stairs (1 or 2 steps)"*, *"House Robber (cannot rob adjacent)"*, *"Decode Ways"*.
- **Strategy**: \`dp[i]\` only depends on \`dp[i-1]\` and \`dp[i-2]\`. Keep two variables \`prev1, prev2\` and update iteratively in \`O(1)\` space.
- **Top Problems**: *Climbing Stairs*, *House Robber*, *House Robber II*, *Decode Ways*.
- **Likely follow-up**: *"What if the houses are in a circle (House Robber II)?"* — house 0 and house $n-1$ cannot both be robbed. Run linear robber twice: \`max(rob(nums[1:]), rob(nums[:-1]))\`.

#### Pattern 2: Knapsack & Coin Change (Unbounded vs. 0/1 Choice)
- **Giveaway**: *"Minimum coins to make amount"*, *"Partition array into two equal sum subsets"*, *"Coin Change II (number of ways)"*.
- **Strategy**: 
  - **Unbounded (infinite coin reuse)**: Loop \`for a in range(coin, target + 1):\` (forward iteration).
  - **0/1 Knapsack (single use per item)**: Loop backwards \`for a in range(target, num - 1, -1):\` to prevent the same number from being reused in the same pass.
- **Top Problems**: *Coin Change*, *Partition Equal Subset Sum*, *Coin Change II*.
- **Likely follow-up**: *"Why does backward iteration prevent reuse in 0/1 knapsack?"* — when computing \`dp[a]\`, \`dp[a - num]\` still holds the value from the *previous* item iteration.

#### Pattern 3: Longest Increasing Subsequence (LIS)
- **Giveaway**: *"Find length of longest strictly increasing subsequence"*.
- **Strategy**: 
  - Standard DP: \`dp[i] = max(dp[j] + 1) for j < i if nums[j] < nums[i]\` in \`O(n²)\`.
  - Optimal (Patience Sorting): Maintain active tails array and binary search with \`bisect_left\` in \`O(n log n)\`.
- **Top Problems**: *Longest Increasing Subsequence*.
- **Likely follow-up**: *"Can you achieve O(n log n) time?"* — use Patience Sorting with \`bisect_left\`.

#### Pattern 4: Substring Segmentation & Palindromic Expansion
- **Giveaway**: *"Word Break"*, *"Longest Palindromic Substring"*, *"Palindromic Substrings"*.
- **Strategy**: \`dp[i]\` is True if there is some \`j < i\` such that \`dp[j] == True\` and \`s[j:i]\` is in dictionary.
- **Top Problems**: *Word Break*, *Longest Palindromic Substring*.
- **Likely follow-up**: *"How to optimize Word Break?"* — only check substrings \`s[i-len:i]\` up to the max word length in the dictionary.`,
  workedExample: {
    title: 'Coin Change (Bottom-Up Tabulation)',
    problem: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\`.
Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

- **DP State**: \`dp[a]\` = minimum coins needed to make amount \`a\`.
- **Base Case**: \`dp[0] = 0\` (0 coins to make amount 0). All other amounts initialized to \`infinity\`.
- **Recurrence**: \`dp[a] = min(dp[a], dp[a - c] + 1)\` for each \`c\` in \`coins\` where \`a - c >= 0\`.`,
    code: {
      language: 'python',
      snippet: `def coin_change(coins: list[int], amount: int) -> int:
    # Initialize DP table with infinity (amount + 1 is a safe upper bound)
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins needed for amount 0

    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], dp[a - c] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1`,
    },
    explanation: `Trace with coins = [1, 2, 5], amount = 11:
- dp[0] = 0
- dp[1] = dp[0] + 1 = 1
- dp[2] = min(dp[1]+1, dp[0]+1) = 1 (using coin 2)
- dp[5] = min(..., dp[0]+1) = 1 (using coin 5)
- dp[10] = dp[5] + 1 = 2 (using two 5s)
- dp[11] = dp[10] + 1 = 3 (5 + 5 + 1)
Result: dp[11] = 3.
Time: O(amount * len(coins)), Space: O(amount).`,
  },
  complexity: {
    time: 'O(N * K)',
    timeDetail: 'N is the target value or sequence length, and K is the number of transitions/choices evaluated at each state.',
    space: 'O(N)',
    spaceDetail: 'Storage for the 1D DP table, which can often be optimized to O(1) when states only depend on constant preceding values.',
  },
  commonMistakes: `1. **Initializing Min-DP Tables with \`0\` Instead of \`inf\`**:
   In minimization problems like *Coin Change*, initializing with \`dp = [0] * (amount + 1)\` results in \`min(0, ...)\` always choosing \`0\`. Initialize with \`float('inf')\` (or \`amount + 1\`).

2. **Base Case Value Mismatch**:
   - For **counting ways** (like *Coin Change II* or *Climbing Stairs*): \`dp[0] = 1\` (there is 1 way to make amount 0: pick nothing).
   - For **minimum cost/coins**: \`dp[0] = 0\` (0 coins cost 0).

3. **Leading Zero Traps in Decode Ways**:
   A single digit \`'0'\` has no valid character mapping and cannot be decoded on its own. If \`s[i] == '0'\`, \`dp[i]\` cannot transition from \`dp[i-1]\`.

4. **Loop Direction in 0/1 Knapsack (Subset Sum)**:
   In *Partition Equal Subset Sum*, looping forward causes the same number to be added to itself multiple times like an infinite supply. You must loop **backwards** from \`target\` down to \`num\`.`,
  gotchas: [
    'House Robber space optimization: maintain `rob1, rob2 = 0, 0` and update `temp = max(n + rob1, rob2)` for O(1) space.',
    'Circular arrays (House Robber II): solve linear problem on `nums[1:]` and `nums[:-1]`, take max.',
    'Coin Change (min coins): initialize table with `inf`, set `dp[0] = 0`.',
    'Coin Change II (total combinations): initialize with `0`, set `dp[0] = 1`.',
    'Longest Increasing Subsequence: O(n log n) is achieved via `bisect_left` on active tails array.',
  ],
  problems: [
    { id: 'climbing-stairs', title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'easy' },
    { id: 'house-robber', title: 'House Robber', slug: 'house-robber', difficulty: 'medium' },
    { id: 'house-robber-ii', title: 'House Robber II', slug: 'house-robber-ii', difficulty: 'medium' },
    { id: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'medium' },
    { id: 'decode-ways', title: 'Decode Ways', slug: 'decode-ways', difficulty: 'medium' },
    { id: 'coin-change', title: 'Coin Change', slug: 'coin-change', difficulty: 'medium' },
    { id: 'maximum-product-subarray', title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', difficulty: 'medium' },
    { id: 'word-break', title: 'Word Break', slug: 'word-break', difficulty: 'medium' },
    { id: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'medium' },
    { id: 'partition-equal-subset-sum', title: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum', difficulty: 'medium' },
  ],
}
