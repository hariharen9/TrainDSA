import type { TopicContent } from '../types'

export const greedyTopic: TopicContent = {
  id: 'greedy',
  title: 'Greedy',
  order_index: 15,
  visualizer_id: null,
  summary: 'Make locally optimal choices without backtracking, backed by mathematical invariant proofs like Kadane and Jump Game horizons.',
  eliExplain: {
    hook: 'A Greedy algorithm makes the single best, most profitable choice at every step right now, without looking back or second-guessing itself. If making the locally best choice always leads to the overall best answer, Greedy works in super fast O(n) or O(n log n) time.',
    analogy: 'Think of making change with coins (quarters, dimes, nickels, pennies). To give 67 cents using the fewest coins, you don\'t test every combination — you greedily take the biggest possible coin that fits: 25¢, then another 25¢, then 10¢, then 5¢, then two 1¢ coins. At every step, picking the biggest immediate coin gives the optimal result.',
    keyIdeas: [
      'No backtracking or memoization: Once a greedy choice is made, it\'s locked in forever.',
      'Kadane\'s Algorithm (Max Subarray): If your current running sum drops below 0, it\'s dragging you down — reset it greedily to 0 and start fresh.',
      'Jump Game: Keep track of the furthest index (horizon) you can possibly reach from your current position.',
      'Sorting is often Step 1: Sorting items by finish time, start time, or value/weight ratio puts the best choice directly in front of you.',
      'When Greedy fails: If picking the best immediate choice traps you into a bad future (like non-standard coin denominations), you must switch to Dynamic Programming.',
    ],
    oneliner: 'If you never need to reconsider a choice and always pick the biggest/furthest/soonest option → Greedy (Kadane, Jump Game, Scheduling).',
  },
  intuition: `### 1. The Core Mental Model: The Best Immediate Step

A **Greedy Algorithm** builds a solution step-by-step, always choosing the option that looks **best in the immediate moment** (locally optimal), without ever backtracking or reconsidering past choices.

Greedy algorithms are among the fastest in computer science (\`O(n)\` or \`O(n log n)\`), but they are only valid when:
1. **Greedy Choice Property**: A globally optimal solution can be reached by making a series of locally optimal choices.
2. **Optimal Substructure**: The optimal solution to the problem contains optimal solutions to its subproblems.

---

### 2. When Does Greedy Work vs. When Does It Fail?

- **When Greedy Works**: *Jump Game*, *Kadane's Maximum Subarray*, *Gas Station*, *Minimum Spanning Trees*. In these problems, making a sub-optimal local choice can never magically pay off later.
- **When Greedy Fails (Requires DP)**: *Coin Change with Arbitrary Coins* (e.g. coins \`[1, 3, 4]\` for target 6: greedy picks \`4 + 1 + 1 = 3 coins\`, but optimal DP is \`3 + 3 = 2 coins\`) and *0/1 Knapsack*.

---

### 3. Comparison: Greedy vs. Dynamic Programming vs. Backtracking

| Dimension | Greedy | Dynamic Programming | Backtracking |
| :--- | :--- | :--- | :--- |
| **Decision Process** | Commits permanently to 1 local choice | Explores all choices, memoizing subproblems | Explores all choices, with state undo |
| **Backtracking / Undo** | Never | Never (evaluates all state transitions) | Yes (explicit state rollback) |
| **Time Complexity** | \`O(N)\` or \`O(N log N)\` | Polynomial (\`O(N × K)\` or \`O(N²)\`) | Exponential (\`O(2^N)\` or \`O(N!)\`) |
| **Correctness Requirement** | Requires mathematical invariant proof | Requires optimal substructure | Guaranteed complete search |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: Running Maximum & Resets (Kadane's Algorithm)
- **Giveaway**: *"Maximum subarray sum"*, *"Maximum product subarray (track min and max)"*.
- **Strategy**: Maintain \`curr_sum\`. If \`curr_sum < 0\`, it is actively harming any future subarray — **reset it to 0** (or start fresh from \`num\`).
- **Top Problems**: *Maximum Subarray*, *Maximum Product Subarray*.
- **Likely follow-up**: *"What if all numbers are negative?"* — initialize \`max_sum = nums[0]\` and update \`curr_sum = max(num, curr_sum + num)\` to naturally handle all-negative arrays.

#### Pattern 2: Reachability Horizon & Bounded Jumps
- **Giveaway**: *"Can you reach the last index"*, *"Minimum jumps to reach end"*.
- **Strategy**: 
  - **Jump Game I**: Maintain \`max_reach\`. If \`i > max_reach\`, return False; update \`max_reach = max(max_reach, i + nums[i])\`.
  - **Jump Game II**: Maintain current jump window \`[left, right]\`. When \`i\` reaches \`right\`, increment jumps and advance window to \`max_reach\`.
- **Top Problems**: *Jump Game*, *Jump Game II*.
- **Likely follow-up**: *"Why is Jump Game II O(N) instead of O(N²) DP?"* — treating reachable intervals as BFS layers finds the minimum jumps in a single linear pass.

#### Pattern 3: Circular Fuel Deficit & Accumulator (Gas Station)
- **Giveaway**: *"Can you complete a circular tour of gas stations"*.
- **Strategy**: If \`sum(gas) < sum(cost)\`, impossible (\`-1\`). Otherwise, iterate through stations: maintain \`tank\`. If \`tank < 0\`, reset \`start = i + 1\` and \`tank = 0\`.
- **Top Problems**: *Gas Station*.
- **Likely follow-up**: *"Why can we skip all intermediate starting stations when tank drops below 0?"* — if starting at \`start\` failed at \`i\`, any station between them began with a subset of that surplus and would fail even earlier.

#### Pattern 4: Last-Occurrence Greedy Slicing (Partition Labels)
- **Giveaway**: *"Partition string into as many parts as possible so each letter appears in at most one part"*.
- **Strategy**: Record the \`last_index\` of every character. Walk the string and maintain \`end = max(end, last_index[char])\`. When \`i == end\`, record partition and start the next!
- **Top Problems**: *Partition Labels*, *Hand of Straights*.
- **Likely follow-up**: *"What is the time complexity?"* — $O(N)$ linear two-pass with $O(1)$ alphabet space (26 letters).`,
  workedExample: {
    title: 'Jump Game (Backward Goal Tracking & Forward Horizon)',
    problem: `You are given an integer array \`nums\`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.
Return \`True\` if you can reach the last index, or \`False\` otherwise.

- **Greedy Strategy**: Start with \`goal = len(nums) - 1\`. Iterate backwards from the end to the beginning. If index \`i + nums[i] >= goal\`, then index \`i\` can reach the goal, so shift the goal backward: \`goal = i\`.
- If \`goal == 0\` at the end, the start can reach the destination!`,
    code: {
      language: 'python',
      snippet: `def can_jump(nums: list[int]) -> bool:
    goal = len(nums) - 1

    # Walk backwards from the second-to-last element down to index 0
    for i in range(len(nums) - 2, -1, -1):
        if i + nums[i] >= goal:
            goal = i  # Shift the destination to current index

    return goal == 0`,
    },
    explanation: `Trace with nums = [2, 3, 1, 1, 4]:
- Initial goal = 4.
- i = 3: 3 + nums[3] = 3 + 1 = 4 >= 4 -> goal = 3.
- i = 2: 2 + nums[2] = 2 + 1 = 3 >= 3 -> goal = 2.
- i = 1: 1 + nums[1] = 1 + 3 = 4 >= 2 -> goal = 1.
- i = 0: 0 + nums[0] = 0 + 2 = 2 >= 1 -> goal = 0.
Loop finishes with goal == 0 -> Returns True!
Time: O(N), Space: O(1).`,
  },
  complexity: {
    time: 'O(N)',
    timeDetail: 'Greedy algorithms process elements in a single linear pass (or O(N log N) if an initial sorting step is required).',
    space: 'O(1)',
    spaceDetail: 'Only requires a few tracking pointer variables (such as max_reach, goal, curr_sum, or tank).',
  },
  commonMistakes: `1. **Applying Greedy to General Knapsack / Coin Change**:
   Assuming greedy works without proving the greedy choice property. If coin denominations are arbitrary (like \`[1, 3, 4]\`), greedy will pick sub-optimal coins. Always check if a counterexample exists!

2. **The All-Negative Array Bug in Kadane's Algorithm**:
   Initializing \`max_sum = 0\` in Kadane's algorithm causes an input like \`[-3, -2, -5]\` to incorrectly return \`0\` instead of \`-2\`. Always initialize \`max_sum = nums[0]\`.

3. **Loop Boundary in Jump Game II**:
   In *Jump Game II*, iterating \`i\` all the way to \`len(nums) - 1\` will trigger an unneeded jump when you are already at the destination. Loop only up to \`len(nums) - 2\`.

4. **Forgetting Global Gas Validation in Gas Station**:
   If \`sum(gas) < sum(cost)\`, no starting position can ever complete the circuit. Forgetting this initial check causes false positive starting index outputs.`,
  gotchas: [
    'Kadane\'s algorithm: `curr_sum = max(n, curr_sum + n)` naturally handles negative arrays without edge-case branches.',
    'Jump Game: greedy backward goal shift is O(N) time and O(1) memory.',
    'Gas Station: if `sum(gas) >= sum(cost)`, a valid starting index is mathematically guaranteed to exist.',
    'Partition Labels: 2-pass greedy with `last_index = {c: i for i, c in enumerate(s)}`.',
  ],
  problems: [
    { id: 'maximum-subarray', title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'medium' },
    { id: 'jump-game', title: 'Jump Game', slug: 'jump-game', difficulty: 'medium' },
    { id: 'jump-game-ii', title: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'medium' },
    { id: 'gas-station', title: 'Gas Station', slug: 'gas-station', difficulty: 'medium' },
    { id: 'partition-labels', title: 'Partition Labels', slug: 'partition-labels', difficulty: 'medium' },
  ],
}
