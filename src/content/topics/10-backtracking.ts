import type { TopicContent } from '../types'

export const backtrackingTopic: TopicContent = {
  id: 'backtracking',
  title: 'Backtracking',
  order_index: 10,
  visualizer_id: null,
  summary: 'Systematic state-space tree search with the Choose ➔ Explore ➔ Unchoose template for combinatorial problems.',
  eliExplain: {
    hook: 'Backtracking is a way to find all possible solutions by building them one step at a time. Whenever a choice hits a dead end or completes a valid answer, you take one step backward (undo your last choice) and try the next option.',
    analogy: 'Imagine navigating an escape room maze. At every fork in the road, you leave a breadcrumb, pick the left path, and walk forward. If you hit a dead end, you rewind along your breadcrumbs back to the fork, pick the right path, and keep going until you test all possibilities.',
    keyIdeas: [
      'The 3-step mantra: Choose (add candidate), Explore (recurse deeper), Unchoose (remove candidate/undo state).',
      'Pruning: throw away dead-end branches immediately before recursing to save massive computation time.',
      'Decision Tree: every recursive call represents a level in the tree where you decide which item to include or pick next.',
      'Base Case: when your current candidate reaches the target length or sum, save a copy (e.g. `list(path)`) and return.',
      'Combinations vs Permutations: use an index pointer `start` for combinations (no duplicates/order doesn\'t matter) or a `visited` set for permutations.',
    ],
    oneliner: '"Find all combinations/permutations/subsets" or "N-Queens/Sudoku solver" → always Backtracking (Choose ➔ Recurse ➔ Undo).',
  },
  intuition: `### 1. The Core Mental Model: Decision Trees with State Undo

**Backtracking** is a structured, exhaustive search algorithm that explores all possible solutions by building candidates step-by-step. 

Whenever it discovers that a candidate cannot possibly lead to a valid solution, it **backtracks** (undoes the last decision) and tries the next branch.

Think of it as walking through a maze while trailing a ball of string:
1. **Choose**: Take a step forward down a path.
2. **Explore (Recurse)**: Continue walking deeper down that branch.
3. **Unchoose (Backtrack)**: If you hit a dead end, step backward to the junction and rewind the string before trying the alternate turn.

\`\`\`
                     []
            /        |        \\
          [1]       [2]       [3]
         /   \\       |
     [1,2]  [1,3]  [2,3]
      /
   [1,2,3]
\`\`\`

---

### 2. The Universal 3-Step Backtracking Template

Every backtracking problem in an interview fits this exact template:

\`\`\`python
def backtrack(start_index, current_path):
    # 1. Base Case / Goal: If valid solution found, record it!
    if is_solution(current_path):
        result.append(current_path[:]) # CRITICAL: Copy the list!
        return

    # 2. Iterate through candidate choices
    for i in range(start_index, len(candidates)):
        # Prune invalid paths early
        if not is_valid(candidates[i]):
            continue

        # A. CHOOSE
        current_path.append(candidates[i])

        # B. EXPLORE (Recurse)
        backtrack(i + 1, current_path)  # (or 'i' if reuse allowed)

        # C. UNCHOOSE (Backtrack / Undo State)
        current_path.pop()
\`\`\`

---

### 3. Comparison: DFS vs. Backtracking vs. Dynamic Programming

| Paradigm | Search Space | State Memory | When To Use |
| :--- | :--- | :--- | :--- |
| **Plain DFS** | Explicit graph/tree | Call stack only | Finding connected components, path existence. |
| **Backtracking** | Implicit decision tree | Shared mutable path with explicit undo | Generating **all** combinations, subsets, permutations, or solving constraint puzzles. |
| **Dynamic Programming** | Overlapping subproblems | Memoization table / DP array | Optimization (min/max), counting ways — **does not require enumerating paths**. |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: Subsets & Power Set ($2^N$ Binary Decisions)
- **Giveaway**: *"Return all possible subsets / power set"*, *"Subsets with duplicates"*.
- **Strategy**: At each element, make an inclusion decision. To handle duplicate items, **sort the array first**, and skip adjacent duplicates with: \`if i > start and nums[i] == nums[i - 1]: continue\`.
- **Top Problems**: *Subsets*, *Subsets II*.
- **Likely follow-up**: *"Why sort first?"* — duplicates must be adjacent in memory so identical choices at the same tree depth can be pruned.

#### Pattern 2: Combinations & Target Sums (Pruned Branching)
- **Giveaway**: *"Find combinations that sum to target"*, *"Letter combinations of phone number"*.
- **Strategy**: Pass running \`remain = target - candidate\`. If \`remain == 0\`, record solution; if \`remain < 0\`, prune.
  - **Unlimited Reuse**: Recurse with index \`i\` (*Combination Sum*).
  - **Single Use**: Recurse with index \`i + 1\` (*Combination Sum II*).
- **Top Problems**: *Combination Sum*, *Combination Sum II*, *Letter Combinations of a Phone Number*.
- **Likely follow-up**: *"How to prevent infinite recursion?"* — prune immediately when target goes negative.

#### Pattern 3: Permutations ($N!$ Ordering Search)
- **Giveaway**: *"Return all permutations / distinct orderings"*.
- **Strategy**: In permutations, **order matters**. Instead of looping from \`start_index\`, loop from \`0\` to \`len(nums)\` on every recursion, skipping already-chosen numbers with a \`visited\` set or boolean array.
- **Top Problems**: *Permutations*, *Permutations II*.
- **Likely follow-up**: *"What is the time complexity?"* — $O(N \cdot N!)$, since there are $N!$ leaf permutations and copying each takes $O(N)$.

#### Pattern 4: 2D Grid Constraint Solvers
- **Giveaway**: *"Word Search in board"*, *"N-Queens"*, *"Sudoku Solver"*, *"Palindrome Partitioning"*.
- **Strategy**: Mutate the grid cell in-place (e.g. \`board[r][c] = '#'\`) to mark as visited, recurse 4-directionally, and **restore the original character** (\`board[r][c] = temp\`) before returning.
- **Top Problems**: *Word Search*, *N-Queens*, *Palindrome Partitioning*.
- **Likely follow-up**: *"How to track N-Queens conflicts in O(1)?"* — maintain sets for \`cols\`, \`pos_diags (r + c)\`, and \`neg_diags (r - c)\`.`,
  workedExample: {
    title: 'Combination Sum (Unbounded Choice + Pruning)',
    problem: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations where the chosen numbers sum to \`target\`. The same number may be chosen unlimited times.

- **Approach**: Backtracking decision tree. At each step, subtract chosen candidate from target. Pass index \`i\` (not \`i + 1\`) to allow reusing the current number.`,
    code: {
      language: 'python',
      snippet: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    result = []
    # Sorting allows early termination when candidate exceeds remaining target
    candidates.sort()

    def backtrack(start: int, remain: int, path: list[int]):
        if remain == 0:
            result.append(path[:])  # CRITICAL: shallow copy
            return

        for i in range(start, len(candidates)):
            # Prune: if current candidate exceeds remaining sum, all subsequent ones will too
            if candidates[i] > remain:
                break

            # 1. Choose
            path.append(candidates[i])
            # 2. Explore (pass 'i' to allow reusing candidates[i])
            backtrack(i, remain - candidates[i], path)
            # 3. Unchoose
            path.pop()

    backtrack(0, target, [])
    return result`,
    },
    explanation: `Trace on candidates = [2, 3, 6, 7], target = 7:
1. Choose 2 -> remain 5. Recurse with start=0.
2. Choose 2 -> remain 3. Recurse with start=0.
3. Choose 2 -> remain 1. Next candidate 2 > 1 -> Prunes and pops.
4. Back at remain 3: Choose 3 -> remain 0 -> Found [2, 2, 3]!
5. Backtracks up to root, tries 7 -> remain 0 -> Found [7]!
Result: [[2, 2, 3], [7]]. Time: O(2^(target/min_val)), Space: O(target/min_val) stack depth.`,
  },
  complexity: {
    time: 'O(N * 2^N) or O(N * N!)',
    timeDetail: 'Subsets branch 2^N times. Permutations branch N! times. Each valid leaf takes O(N) work to copy the path into results.',
    space: 'O(N)',
    spaceDetail: 'The maximum recursion call stack depth and path array length is bounded by N (or target/min_val).',
  },
  commonMistakes: `1. **Appending the Reference Instead of a Copy (The Empty List Bug)**:
   Writing \`result.append(path)\` appends a reference to the mutable \`path\` list. As backtracking continues and eventually pops all items back to \`[]\`, every item in \`result\` becomes an empty list! **Always write \`result.append(path[:])\` or \`result.append(list(path))\`**.

2. **Forgetting to Unchoose (\`path.pop()\`)**:
   If you forget \`path.pop()\`, previous choices bleed into subsequent sibling branches, corrupting all future paths.

3. **Skipping Duplicates Without Sorting First**:
   The pruning condition \`if i > start and nums[i] == nums[i-1]: continue\` strictly requires duplicate values to be adjacent. Without sorting \`nums.sort()\` upfront, duplicates scattered across the array will not be caught.

4. **Passing \`i + 1\` vs. \`i\` in Recursive Calls**:
   - For **Subsets / Combinations (Single Use)**: Pass \`i + 1\` to prevent reusing the same element.
   - For **Unbounded Reuse**: Pass \`i\` so the same element can be selected again.
   - For **Permutations**: Pass \`start = 0\` and use a \`visited\` set.`,
  gotchas: [
    'Always make a shallow copy when appending to result: `result.append(path[:])`.',
    'Sort input upfront whenever duplicate removal or early pruning by sum is required.',
    'For N-Queens and Grid solvers: store sets of occupied columns, diagonals (r + c), and anti-diagonals (r - c) for O(1) validity checks.',
    'Palindromic partitioning: precompute or check palindrome validity before descending into the recursive call.',
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
