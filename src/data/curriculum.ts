import type { Problem, Topic } from '../lib/types'

export const TOPICS: Topic[] = [
  {
    "id": "arrays-hashing",
    "title": "Arrays & Hashing",
    "order_index": 1,
    "concept_md": "## Intuition\n\nA hash map is a trade: you spend O(n) memory so that \"have I seen this before?\" becomes an O(1) lookup instead of an O(n) rescan. That trade is the single biggest lever in this whole topic — almost every \"arrays & hashing\" problem is really the question \"what should I remember about elements I've already passed, so I don't have to look at them again?\"\n\nThink of it like taking notes while reading a book once, instead of flipping back to earlier pages every time a new detail matters. The map is your notes. What you write down — the *key* — is the real design decision: sometimes it's the value itself (membership), sometimes a count (frequency), sometimes a derived signature (sorted letters, for anagrams), sometimes a complement (`target - current`, for pair-sum problems).\n\n## Pattern recognition\n\nYou're in hash-map territory when a brute-force solution would need a **nested loop to compare every pair or re-scan for a match** — two `for` loops, or one loop with a hidden linear search inside it (`.includes()`, `in` on a list, another loop). The tell is the phrase \"have I seen this\" or \"does this exist elsewhere in the array,\" because both are exactly what a hash map answers in O(1).\n\nMatch the shape of the question to the shape of the map:\n\n- **Membership only** (\"contains duplicate?\") → a hash **set**. You only care yes/no.\n- **Membership + position** (\"Two Sum\" — which *indices*?) → a hash **map** of value → index.\n- **Counting** (\"valid anagram,\" \"top k frequent\") → a hash map of value → frequency.\n- **Grouping by a derived key** (\"group anagrams\") → a hash map of signature → list of originals. The signature is usually the sorted string or a per-letter count tuple.\n- **Range queries without rescanning** (\"subarray sum equals k\") → a *running* hash map of prefix-sum → how many times that prefix has occurred.\n\n## Worked example: Two Sum\n\nGiven `nums = [2, 7, 11, 15]` and `target = 9`, return the indices of the two numbers that add up to the target. The brute-force pair scan is O(n²): for every `i`, scan the rest of the array for a partner.\n\nThe hash-map reframing: instead of asking \"does some other element pair with `nums[i]`?\", flip the question to \"have I already seen the number that would pair with `nums[i]`?\" That number is `target - nums[i]`, the **complement**. If you've kept a running map of every value you've already visited (value → its index), checking \"have I seen the complement\" is one O(1) lookup — no inner loop at all.\n\n```python\ndef two_sum(nums, target):\n    seen = {}  # value -> index\n\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n\n    return []  # no valid pair\n```\n\nTrace it: at `i=0`, `num=2`, complement is `7`. The map is still empty, so no match — remember `{2: 0}`. At `i=1`, `num=7`, complement is `2`. The map already has `2 → 0` from the previous step, so we return `[0, 1]` immediately. Notice we never looked back at the array itself — the map *is* our memory of it, and we only ever move forward through `nums` once.\n\n## Complexity\n\nOne pass, one lookup and one insert per element, both O(1) expected for a hash map — so the whole algorithm is O(n) time. That's down from O(n²) for the brute-force nested loop. The cost is O(n) extra space for the map itself, which is the trade this entire topic is built on: memory for speed.\n\n## Common mistakes\n\nThe most common one is checking whether `nums[i]` *itself* equals a value you've already stored, instead of checking its *complement* — that solves a different problem. A second: inserting into the map *before* checking for the complement, which lets an element pair with itself (wrong unless the problem explicitly allows reusing an index). A third, specific to counting/frequency variants: using a plain `set` when the problem needs multiplicities — a set silently collapses `[1, 1, 2]` down to losing the fact that `1` appeared twice.\n\n## Try it yourself\n\nStep through the trace below — watch the map fill in one entry at a time, and see exactly which lookup turns a miss into a match.",
    "gotchas_md": "- Hash collisions do not change big-O in expectation, but adversarial input can degrade naive maps; interviewers still accept HashMap.\n- Duplicate keys: `set` loses counts; use a frequency map when multiplicity matters.\n- `Product of Array Except Self` forbids division; prefix/suffix products are the intended trick.\n- Consecutive sequence: only start a streak from a number whose predecessor is missing, or you pay O(n²).\n- Index vs value: Two Sum needs the index, Contains Duplicate only needs membership.",
    "visualizer_id": "two-sum-hashmap"
  },
  {
    "id": "two-pointers",
    "title": "Two Pointers",
    "order_index": 2,
    "concept_md": "Two pointers replace nested loops when the search space is ordered or can be ordered. Place indices at opposite ends and move the one that cannot produce a better answer, or walk a fast pointer ahead of a slow one to find a middle, a cycle, or a window of length k.\n\nConverging pointers shine on sorted arrays: Two Sum II, 3Sum, and container-with-most-water all shrink the candidate pair set monotonically. The slow/fast (tortoise and hare) variant detects cycles and finds midpoints without extra storage.\n\nThe invariant is the point: after each move, every discarded index is provably worse than what remains. If you cannot state that invariant, you probably need sorting first, or a different pattern (sliding window, hash map).",
    "gotchas_md": "- Many two-pointer proofs assume a sorted input. Unsorted arrays usually need a sort or a hash map instead.\n- 3Sum: sort, then skip duplicate values at each of the three positions or you emit duplicate triplets.\n- Palindrome checks: skip non-alphanumeric characters and compare case-insensitively.\n- Container / trapping rain water: moving the taller side never helps; always advance the shorter pointer.\n- Off-by-one: decide whether pointers are inclusive and whether they may cross.",
    "visualizer_id": null
  },
  {
    "id": "sliding-window",
    "title": "Sliding Window",
    "order_index": 3,
    "concept_md": "## Intuition\n\nPicture a rubber band stretched over part of an array — that's the window. It has two ends, `left` and `right`, and it only ever moves forward. `right` reaches out to grab new elements; `left` lets go of old ones when the window stops being valid. Neither pointer ever walks backward.\n\nThat one property — *no backward movement* — is the entire reason sliding window is fast. A brute-force \"try every subarray\" approach checks all `n²` start/end pairs. Sliding window instead asks: as I move `right` forward one step at a time, what's the least amount of work I need to do at `left` to keep the window valid? Each index is added to the window exactly once (when `right` passes it) and removed at most once (when `left` passes it). Two passes total, not `n` passes — that's how you get from O(n²) down to O(n).\n\n## Pattern recognition\n\nYou're looking at a sliding-window problem when the question is about a **contiguous** run of elements (not any subset — contiguous matters) and it asks for one of:\n\n- The longest / shortest run satisfying some condition (\"longest substring without repeating characters\", \"minimum window that contains all of...\")\n- Whether a run of a fixed size k satisfies a condition (\"permutation in string\", \"max sum of any subarray of size k\")\n- A running aggregate over every window of size k (\"sliding window maximum\")\n\nThe giveaway phrase is usually **\"substring\"**, **\"subarray\"**, or **\"contiguous\"** combined with a size constraint or an optimization (\"longest\", \"shortest\", \"at most\", \"exactly\").\n\nThere are two flavors, and mixing them up is the #1 source of bugs:\n\n- **Fixed-size window** — the window length is given (k). You slide it one step at a time: add the new right element, remove the leaving left element, done. No growing or shrinking logic needed.\n- **Variable-size window** — you don't know the length in advance. You grow `right` until the window becomes *invalid* (or reaches the target), then shrink `left` until it's valid again, tracking the best window you've seen along the way.\n\n## Worked example: Longest Substring Without Repeating Characters\n\nGiven `s = \"abcabcbb\"`, find the length of the longest substring with no repeated characters. This is the canonical variable-size window.\n\nThe state we maintain is a set (or map) of characters currently inside the window, plus `left`. We walk `right` across the string. Each time `s[right]` is already in the window, that's our signal to shrink from the left — but only until the *duplicate* is gone, not the whole window.\n\n```python\ndef length_of_longest_substring(s: str) -> int:\n    window = set()\n    left = 0\n    best = 0\n\n    for right in range(len(s)):\n        # Shrink from the left until s[right] can safely enter\n        while s[right] in window:\n            window.remove(s[left])\n            left += 1\n\n        window.add(s[right])\n        best = max(best, right - left + 1)\n\n    return best\n```\n\nTrace it on `\"abcabcbb\"`: the window grows to `{a,b,c}` (length 3) before hitting the second `a` at index 3. The while-loop then removes `s[left]` (which is `a`) and advances `left` to 1 — just enough to drop the duplicate, not a full reset. The window becomes `{b,c,a}`, still length 3. `best` never exceeds 3 for this string, which matches the known answer.\n\nNotice what did *not* happen: we never reset `left` back to `right`, and we never rescanned characters we'd already removed. That's the O(n) guarantee — `left` only moves forward, and each character is added once and removed at most once across the whole run.\n\n## Complexity\n\nBoth pointers move strictly left to right and each visits every index at most once, so the total work across the *whole* run is O(n), even though there's a nested while-loop. This is the classic \"amortized\" argument: the while-loop looks like it could make this O(n²), but sum up how many times `left` moves across the *entire* algorithm — it's bounded by n, because `left` can't move more times than `right` has moved. Space is O(k) for the window's character set/map, where k is the alphabet size or window size — O(1) if the character set is bounded (e.g. ASCII).\n\n## Common mistakes\n\nThe most common bug is updating the window's state *after* deciding whether it's valid, instead of before — you end up validating a window that no longer reflects the count you just checked. A close second: for \"longest\" problems, people write code that shrinks back to empty and restarts instead of shrinking just enough to become valid again — that silently degrades you back to O(n²). And for fixed-size windows, forgetting to prime the first k elements before you start sliding (i.e. starting the slide loop from index 0 instead of index k) throws off every subsequent comparison.\n\n## Try it yourself\n\nThe panel below lets you step through the exact trace above — watch how `left` only jumps forward when it has to, and never resets.",
    "gotchas_md": "- Update the window's state *before* checking validity, or you validate against stale counts.\n- Longest vs shortest: longest expands then shrinks-just-enough when invalid; minimum window shrinks while still valid and records the best along the way.\n- Permutation in string is a fixed window equal to the pattern length — no growing/shrinking, just slide.\n- Sliding window maximum needs a decreasing deque of indices, not a heap, to stay O(n).\n- Watch empty strings/arrays and windows larger than the input.",
    "visualizer_id": "sliding-window"
  },
  {
    "id": "stack",
    "title": "Stack",
    "order_index": 4,
    "concept_md": "A stack is LIFO: the last unmatched opener, the last pending operator, or the last warmer day you have not resolved. Matching parentheses, RPN evaluation, and nested structures all map onto push/pop with a clear “what is still open?” meaning.\n\nMonotonic stacks keep elements in increasing or decreasing order. When a new value breaks the order, you pop and those popped indices have found their next greater/smaller element. Daily Temperatures and many “next greater” problems are this template.\n\nYou can also encode extra state on the stack (value plus current min for Min Stack, or a running span). Think of the stack as deferred work that becomes answerable only when a later element arrives.",
    "gotchas_md": "- Always define the empty-stack case: extra closers, leftover openers, or no warmer day.\n- Monotonic stacks store indices more often than values so you can compute distances.\n- Generate Parentheses is backtracking with a stack-shaped invariant (open >= close, open <= n).\n- Car Fleet: sort by position, then a stack of times-to-target; a slower car in front swallows faster ones behind.\n- Do not pop before recording the answer for the popped index.",
    "visualizer_id": null
  },
  {
    "id": "binary-search",
    "title": "Binary Search",
    "order_index": 5,
    "concept_md": "Binary search discards half of a sorted search space each step. The textbook form finds a target in a sorted array. The interview form searches over an *answer range*: capacity, time, or an index where a predicate flips from false to true.\n\nThe loop invariant is everything: decide whether `mid` is still feasible, then move `lo` or `hi` so the feasible region never loses the answer. Answer-range search usually looks like `while lo < hi` with `hi = mid` or `lo = mid + 1`.\n\nRotated arrays still have a sorted half; identify which half is sorted, then decide whether the target lives there. 2D matrix search treats the matrix as a virtual 1D sorted array when rows are ordered.",
    "gotchas_md": "- Inclusive vs exclusive bounds: mixing `hi = mid` with `hi = mid - 1` is the classic off-by-one.\n- Overflow: use `lo + Math.floor((hi - lo) / 2)`.\n- Duplicates in rotated arrays can make both halves look unsorted; you may need to shrink one side by one.\n- Time-based store: binary search timestamps per key, not a global timeline.\n- Median of two sorted arrays is binary search on partition index, not a merge.",
    "visualizer_id": null
  },
  {
    "id": "linked-lists",
    "title": "Linked Lists",
    "order_index": 6,
    "concept_md": "Linked lists make pointer rewiring the algorithm. Reverse a list by walking three references (prev, curr, next). Merge two sorted lists by always attaching the smaller head. Detect a cycle with fast/slow pointers; if they meet, a second pointer from the head finds the cycle start.\n\nDummy nodes simplify insert/delete at the head. Finding the nth-from-end node is two pointers offset by n. Copying a list with random pointers is usually a two- or three-pass map, or an interleave-in-place trick.\n\nDraw the pointers. Most bugs are a lost `next` reference or a loop that never advances because you mutated the node you still need.",
    "gotchas_md": "- Null heads and single-node lists: every routine should survive both.\n- After reverse, the new head is the old tail; do not return the original head.\n- Cycle detection: fast starts at head or head.next consistently with your meet condition.\n- Reorder list: split at mid, reverse the second half, then weave.\n- Merge K lists: heap of current heads is O(N log k); naive pairwise merge is slower.",
    "visualizer_id": null
  },
  {
    "id": "trees",
    "title": "Trees",
    "order_index": 7,
    "concept_md": "Binary trees are recursive structures: a node plus left and right subtrees. DFS visits pre-order (node, left, right), in-order (left, node, right — sorted for a BST), or post-order (left, right, node). BFS uses a queue for level-order traversal and is the natural way to talk about depth by level.\n\nBST invariants let you prune: left < node < right (beware of duplicate policies). Lowest common ancestor, validation, and kth-smallest all exploit that order. Construction problems invert a traversal pair: preorder gives the root, inorder splits left/right ranges.\n\nPrefer recursion for clarity, then mention stack depth. Interviewers accept iterative DFS with an explicit stack when n is large.",
    "gotchas_md": "- Recursion depth can hit call-stack limits on skewed trees; mention O(n) worst-case height.\n- Validate BST: passing only a parent value is wrong; pass a live (min, max) window.\n- Same Tree / Subtree: null vs null is true; null vs node is false.\n- LCA of BST uses value comparison; LCA of a binary tree needs a post-order bubble-up.\n- Construct from preorder/inorder: index the inorder values or you pay O(n²).",
    "visualizer_id": null
  },
  {
    "id": "tries",
    "title": "Tries",
    "order_index": 8,
    "concept_md": "A trie (prefix tree) stores strings by sharing prefixes. Each edge is a character; a node marked terminal means a complete word. Lookup, insert, and prefix queries are O(length), independent of how many words share the dictionary.\n\nTries shine when many strings share prefixes: autocomplete, prefix matching, and Word Search II (board DFS constrained by trie edges). Wildcard search (add-and-search-words) branches on `. ` by trying every child.\n\nThe representation trade-off is memory: 26-wide arrays are simple; hash-map children are sparse-friendly. Interviewers want a clean node class and a boolean `isWord` (or count) at terminals.",
    "gotchas_md": "- Do not mark every node as a word; only terminals.\n- Search vs startsWith are different: search requires `isWord`.\n- Wildcard DFS must backtrack; do not mutate the current node incorrectly.\n- Word Search II: prune dead trie branches (delete words after finding them) to avoid TLE.\n- Character set: lowercase a-z is assumed unless the prompt says otherwise.",
    "visualizer_id": null
  },
  {
    "id": "heap-priority-queue",
    "title": "Heap / Priority Queue",
    "order_index": 9,
    "concept_md": "A heap gives you the current min or max in O(1) and insert/pop in O(log n). Streaming problems that need “the kth largest so far” or “median of a growing list” are two-heap or bounded-heap designs, not full sorts on every update.\n\nK-closest points and last-stone-weight are one-heap problems. Task scheduler uses either a max-heap of remaining counts plus a cooldown queue, or a math formula. Language specifics matter: Python’s heapq is min-heap; Java PriorityQueue is min-heap by default; JS has no built-in heap in interviews—say you would use one, or implement a small binary heap if required.\n\nWhen k is tiny compared to n, a size-k heap beats sorting.",
    "gotchas_md": "- JavaScript interviews: state that you would use a heap; sorting each time is a fallback they may reject for streaming.\n- Kth largest in a stream: min-heap of size k, not a max-heap of everything.\n- Median stream: max-heap for the lower half, min-heap for the upper half; rebalance sizes.\n- Distance comparisons: compare squared distances to avoid floats.\n- Task scheduler idle time: heap of counts plus a time wheel/queue for cooldown.",
    "visualizer_id": null
  },
  {
    "id": "backtracking",
    "title": "Backtracking",
    "order_index": 10,
    "concept_md": "Backtracking explores a search tree: choose, recurse, undo. Subsets, permutations, combinations, and constraint puzzles (N-Queens, Word Search) share the same skeleton. The state is the partial answer plus a cursor (index, used mask, or board cell).\n\nUndo is mandatory. If you mutate an array or board, pop or restore after the recursive call. If you pass a new copy, you pay extra memory; interviewers often prefer in-place plus undo.\n\nPrune early: skip duplicates after sorting (subsets II / combination sum II), abort a path when a partial cost exceeds the target, and mark visited cells on the grid so you do not reuse a letter.",
    "gotchas_md": "- Deep copy vs in-place: pushing the same array reference into the result list captures later mutations.\n- Combination Sum allows reuse: recurse on the same index; Permutations do not.\n- Word Search: mark visited, recurse 4-directionally, unmark.\n- Palindrome partitioning: only cut when s[start..i] is a palindrome.\n- N-Queens: track columns and both diagonals as O(1) occupancy sets.",
    "visualizer_id": null
  },
  {
    "id": "graphs",
    "title": "Graphs",
    "order_index": 11,
    "concept_md": "Graphs are nodes plus edges. Interviews almost always want an adjacency list. DFS and BFS explore connected components; Union-Find (DSU) answers “are these in the same component?” and counts components after unions.\n\nGrid problems are implicit graphs: each cell has up to four neighbors. Number of Islands and Max Area of Island are DFS/BFS floods. Course Schedule is cycle detection on a directed graph (Kahn’s algorithm or color DFS). Clone Graph is a hashmap of old-to-new nodes plus DFS/BFS.\n\nDirected vs undirected changes the cycle definition: a back-edge to an ancestor in directed graphs; any already-seen neighbor except the parent in undirected graphs.",
    "gotchas_md": "- Directed cycles: a node can be visited and still be legal if it is already finished (black); gray means a back-edge.\n- Union-Find needs path compression and union-by-rank for interview-quality complexity.\n- Graph Valid Tree: n-1 edges and exactly one component (no cycles).\n- Word Ladder: BFS on implicit words; wildcard buckets beat scanning the whole dict each step.\n- Clone Graph: do not recurse without the map or you infinite-loop on cycles.",
    "visualizer_id": null
  },
  {
    "id": "advanced-graphs",
    "title": "Advanced Graphs",
    "order_index": 12,
    "concept_md": "Weighted graphs need shortest-path and MST algorithms. Dijkstra grows the closest unvisited node using a min-heap of (distance, node). It requires non-negative weights. Bellman-Ford relaxes all edges V-1 times and can detect negative cycles. Floyd-Warshall is all-pairs on small n.\n\nK-stop cheapest flights is a constrained shortest path: Dijkstra with stops, or Bellman-Ford limited to K+1 relaxations. Swim in Rising Water is “minimum max-edge” on a grid: binary search plus BFS, or a heap like Dijkstra on height.\n\nMST (Prim/Kruskal) is less common but reconstruct-itinerary is an Eulerian path (Hierholzer) on a directed multigraph of airports.",
    "gotchas_md": "- Dijkstra is wrong on negative weights; say so if they sneak in a negative edge.\n- Cheapest Flights: vanilla Dijkstra without stop counts can miss a cheaper longer hop sequence under the K cap.\n- Always skip stale heap entries when a better distance was already recorded.\n- Reconstruct Itinerary: use a min-heap/multiset of destinations; Hierholzer adds nodes on the way back.\n- Grid “effort” problems often minimize the max edge, not the sum.",
    "visualizer_id": null
  },
  {
    "id": "1d-dynamic-programming",
    "title": "1-D Dynamic Programming",
    "order_index": 13,
    "concept_md": "1-D DP stores the best answer for prefixes of a linear structure. Optimal substructure means the best for i is computed from a few earlier states. Memoization is top-down recursion plus a cache; tabulation fills an array left to right.\n\nClassic recurrences: climbing stairs (`dp[i] = dp[i-1] + dp[i-2]`), house robber (`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`), coin change (unbounded knapsack), LIS (patience sorting or O(n²) DP), word break (prefix boolean). Palindromes expand around centers or use a boolean table.\n\nName the state in words before coding: “minimum coins to make amount a” is clearer than a vague `dp[i]`.",
    "gotchas_md": "- Initialize DP with a sentinel (Infinity) for “impossible,” not zero, on minimization problems.\n- House Robber II: circular constraint — run linear robber on [0..n-2] and [1..n-1].\n- Coin Change vs Coin Change II: first is min coins; second is number of combinations (order does not matter).\n- Decode Ways: leading zeros are invalid; handle '10' and '20' carefully.\n- LIS O(n log n) tails array is expected at senior level; O(n²) is acceptable if you explain it.",
    "visualizer_id": null
  },
  {
    "id": "2d-dynamic-programming",
    "title": "2-D Dynamic Programming",
    "order_index": 14,
    "concept_md": "2-D DP uses a table indexed by two dimensions: grid coordinates, or positions in two sequences. Unique Paths counts ways to a cell from above and left. LCS and Edit Distance align two strings: `dp[i][j]` is the best for prefixes s[:i] and t[:j].\n\nBase cases are the whole game. First row/column of a grid often has only one path. Empty prefixes in string DP are zeros or identity costs. Rolling arrays can drop a dimension when you only need the previous row.\n\nStock-with-cooldown and Target Sum are still 2-state problems even if one index is implicit (day × holding, or index × running sum).",
    "gotchas_md": "- Off-by-one in string DP: table is often (m+1) × (n+1) to include empty prefixes.\n- Unique Paths obstacles: a blocked cell has zero ways and must not inherit from neighbors incorrectly.\n- Coin Change II: iterate coins in the outer loop to count combinations, not permutations.\n- Interleaving String: dp[i][j] means first i of s1 and first j of s2 form s3 prefix.\n- Edit Distance: insert, delete, replace are three transitions; match copies the diagonal.",
    "visualizer_id": null
  },
  {
    "id": "greedy",
    "title": "Greedy",
    "order_index": 15,
    "concept_md": "A greedy algorithm commits to a locally optimal choice and never revisits it. It is correct only when a greedy-choice property holds: some globally optimal solution includes that local pick. Kadane’s maximum subarray, jump-game reach, and gas-station circuits are the standard proofs.\n\nPattern-match: if sorting by an endpoint, then scanning once, yields the answer (intervals, jump game II range expansion), you are in greedy territory. If later decisions depend on a global trade-off that local sorting cannot capture, you likely need DP.\n\nAlways be ready to say *why* the greedy step does not block a better solution—exchange argument or “if we did not pick this, we could swap.”",
    "gotchas_md": "- Jump Game: track farthest reach; you fail only if i exceeds farthest.\n- Jump Game II: expand the current jump’s range; count a jump when the range ends.\n- Gas Station: if total gas < total cost, impossible; otherwise the unique start is after the worst deficit.\n- Hand of Straights: greedy take from the smallest remaining value; a map of counts is required.\n- Maximum Subarray: Kadane resets the running sum when it goes negative (unless the array is all negative—still take the best element).",
    "visualizer_id": null
  },
  {
    "id": "intervals",
    "title": "Intervals",
    "order_index": 16,
    "concept_md": "Interval problems start by sorting—usually by start, sometimes by end. After that, a linear scan merges overlaps, counts concurrent meetings, or greedily drops the interval that ends latest.\n\nMerge Intervals walks sorted ranges and extends the current end while the next start is ≤ current end. Non-overlapping intervals is the dual: keep the one that finishes first. Meeting Rooms II is a sweep: sort starts and ends separately, or use a min-heap of end times.\n\nTreat boundaries as closed unless the prompt says otherwise. A meeting ending at 9 and another starting at 9 may or may not conflict—read the spec.",
    "gotchas_md": "- Inclusive vs exclusive: `[1,2]` and `[2,3]` overlap if closed on both ends.\n- Insert Interval: add all before, merge overlapping, then append the rest—do not sort a huge list if input is already ordered.\n- Meeting Rooms vs II: first is boolean overlap; second is max concurrency.\n- Minimum interval covering queries: sort intervals by start, heap by end, two pointers on queries sorted by point.\n- Empty intervals and single-point intervals (`[1,1]`).",
    "visualizer_id": null
  },
  {
    "id": "bit-manipulation",
    "title": "Bit Manipulation",
    "order_index": 17,
    "concept_md": "Bits let you pack boolean flags and cancel pairs. XOR is the star: `a ^ a = 0`, `a ^ 0 = a`, and XOR is associative, so every duplicated number vanishes in Single Number. Counting bits uses `n & (n-1)` to drop the lowest set bit, or DP: `bits[i] = bits[i >> 1] + (i & 1)`.\n\nMasks represent subsets in O(1) (N-Queens diagonals, TSP-style DP). Arithmetic without `+` uses XOR for sum bits and AND+shift for carry (Sum of Two Integers). Reverse bits is shifts and masks; treat the value as unsigned 32-bit.\n\nPrefer named operations over clever one-liners unless you can explain them in one sentence.",
    "gotchas_md": "- Operator precedence: `==` binds tighter than bitwise ops in some languages; parenthesize.\n- JavaScript: bitwise operators coerce to 32-bit signed ints; use `>>> 0` for unsigned 32-bit.\n- Number of 1 bits: treat input as unsigned.\n- Missing Number: XOR all indices and values, or Gauss sum — watch overflow in typed languages.\n- Sum of Two Integers: loop until carry is zero; negatives still work in two’s complement.",
    "visualizer_id": null
  }
]

export const PROBLEMS: Problem[] = [
  {
    "id": "two-sum",
    "topic_id": "arrays-hashing",
    "title": "Two Sum",
    "url": "https://leetcode.com/problems/two-sum/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "valid-anagram",
    "topic_id": "arrays-hashing",
    "title": "Valid Anagram",
    "url": "https://leetcode.com/problems/valid-anagram/",
    "difficulty": "easy",
    "order_index": 2
  },
  {
    "id": "contains-duplicate",
    "topic_id": "arrays-hashing",
    "title": "Contains Duplicate",
    "url": "https://leetcode.com/problems/contains-duplicate/",
    "difficulty": "easy",
    "order_index": 3
  },
  {
    "id": "group-anagrams",
    "topic_id": "arrays-hashing",
    "title": "Group Anagrams",
    "url": "https://leetcode.com/problems/group-anagrams/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "top-k-frequent-elements",
    "topic_id": "arrays-hashing",
    "title": "Top K Frequent Elements",
    "url": "https://leetcode.com/problems/top-k-frequent-elements/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "product-of-array-except-self",
    "topic_id": "arrays-hashing",
    "title": "Product of Array Except Self",
    "url": "https://leetcode.com/problems/product-of-array-except-self/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "longest-consecutive-sequence",
    "topic_id": "arrays-hashing",
    "title": "Longest Consecutive Sequence",
    "url": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "difficulty": "medium",
    "order_index": 7
  },
  {
    "id": "valid-palindrome",
    "topic_id": "two-pointers",
    "title": "Valid Palindrome",
    "url": "https://leetcode.com/problems/valid-palindrome/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "two-sum-ii",
    "topic_id": "two-pointers",
    "title": "Two Sum II",
    "url": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "3sum",
    "topic_id": "two-pointers",
    "title": "3Sum",
    "url": "https://leetcode.com/problems/3sum/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "container-with-most-water",
    "topic_id": "two-pointers",
    "title": "Container With Most Water",
    "url": "https://leetcode.com/problems/container-with-most-water/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "trapping-rain-water",
    "topic_id": "two-pointers",
    "title": "Trapping Rain Water",
    "url": "https://leetcode.com/problems/trapping-rain-water/",
    "difficulty": "hard",
    "order_index": 5
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "topic_id": "sliding-window",
    "title": "Best Time to Buy and Sell Stock",
    "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "topic_id": "sliding-window",
    "title": "Longest Substring Without Repeating Characters",
    "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "longest-repeating-character-replacement",
    "topic_id": "sliding-window",
    "title": "Longest Repeating Character Replacement",
    "url": "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "permutation-in-string",
    "topic_id": "sliding-window",
    "title": "Permutation in String",
    "url": "https://leetcode.com/problems/permutation-in-string/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "minimum-window-substring",
    "topic_id": "sliding-window",
    "title": "Minimum Window Substring",
    "url": "https://leetcode.com/problems/minimum-window-substring/",
    "difficulty": "hard",
    "order_index": 5
  },
  {
    "id": "sliding-window-maximum",
    "topic_id": "sliding-window",
    "title": "Sliding Window Maximum",
    "url": "https://leetcode.com/problems/sliding-window-maximum/",
    "difficulty": "hard",
    "order_index": 6
  },
  {
    "id": "valid-parentheses",
    "topic_id": "stack",
    "title": "Valid Parentheses",
    "url": "https://leetcode.com/problems/valid-parentheses/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "min-stack",
    "topic_id": "stack",
    "title": "Min Stack",
    "url": "https://leetcode.com/problems/min-stack/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "evaluate-reverse-polish-notation",
    "topic_id": "stack",
    "title": "Evaluate Reverse Polish Notation",
    "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "generate-parentheses",
    "topic_id": "stack",
    "title": "Generate Parentheses",
    "url": "https://leetcode.com/problems/generate-parentheses/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "daily-temperatures",
    "topic_id": "stack",
    "title": "Daily Temperatures",
    "url": "https://leetcode.com/problems/daily-temperatures/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "car-fleet",
    "topic_id": "stack",
    "title": "Car Fleet",
    "url": "https://leetcode.com/problems/car-fleet/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "binary-search",
    "topic_id": "binary-search",
    "title": "Binary Search",
    "url": "https://leetcode.com/problems/binary-search/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "search-a-2d-matrix",
    "topic_id": "binary-search",
    "title": "Search a 2D Matrix",
    "url": "https://leetcode.com/problems/search-a-2d-matrix/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "search-in-rotated-sorted-array",
    "topic_id": "binary-search",
    "title": "Search in Rotated Sorted Array",
    "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "find-minimum-in-rotated-sorted-array",
    "topic_id": "binary-search",
    "title": "Find Minimum in Rotated Sorted Array",
    "url": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "time-based-key-value-store",
    "topic_id": "binary-search",
    "title": "Time Based Key-Value Store",
    "url": "https://leetcode.com/problems/time-based-key-value-store/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "median-of-two-sorted-arrays",
    "topic_id": "binary-search",
    "title": "Median of Two Sorted Arrays",
    "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "difficulty": "hard",
    "order_index": 6
  },
  {
    "id": "reverse-linked-list",
    "topic_id": "linked-lists",
    "title": "Reverse Linked List",
    "url": "https://leetcode.com/problems/reverse-linked-list/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "merge-two-sorted-lists",
    "topic_id": "linked-lists",
    "title": "Merge Two Sorted Lists",
    "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "difficulty": "easy",
    "order_index": 2
  },
  {
    "id": "linked-list-cycle",
    "topic_id": "linked-lists",
    "title": "Linked List Cycle",
    "url": "https://leetcode.com/problems/linked-list-cycle/",
    "difficulty": "easy",
    "order_index": 3
  },
  {
    "id": "reorder-list",
    "topic_id": "linked-lists",
    "title": "Reorder List",
    "url": "https://leetcode.com/problems/reorder-list/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "remove-nth-node-from-end-of-list",
    "topic_id": "linked-lists",
    "title": "Remove Nth Node From End of List",
    "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "copy-list-with-random-pointer",
    "topic_id": "linked-lists",
    "title": "Copy List with Random Pointer",
    "url": "https://leetcode.com/problems/copy-list-with-random-pointer/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "merge-k-sorted-lists",
    "topic_id": "linked-lists",
    "title": "Merge K Sorted Lists",
    "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "difficulty": "hard",
    "order_index": 7
  },
  {
    "id": "invert-binary-tree",
    "topic_id": "trees",
    "title": "Invert Binary Tree",
    "url": "https://leetcode.com/problems/invert-binary-tree/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "maximum-depth-of-binary-tree",
    "topic_id": "trees",
    "title": "Maximum Depth of Binary Tree",
    "url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "difficulty": "easy",
    "order_index": 2
  },
  {
    "id": "same-tree",
    "topic_id": "trees",
    "title": "Same Tree",
    "url": "https://leetcode.com/problems/same-tree/",
    "difficulty": "easy",
    "order_index": 3
  },
  {
    "id": "subtree-of-another-tree",
    "topic_id": "trees",
    "title": "Subtree of Another Tree",
    "url": "https://leetcode.com/problems/subtree-of-another-tree/",
    "difficulty": "easy",
    "order_index": 4
  },
  {
    "id": "lowest-common-ancestor-of-a-bst",
    "topic_id": "trees",
    "title": "Lowest Common Ancestor of a BST",
    "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "binary-tree-level-order-traversal",
    "topic_id": "trees",
    "title": "Binary Tree Level Order Traversal",
    "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "validate-binary-search-tree",
    "topic_id": "trees",
    "title": "Validate Binary Search Tree",
    "url": "https://leetcode.com/problems/validate-binary-search-tree/",
    "difficulty": "medium",
    "order_index": 7
  },
  {
    "id": "kth-smallest-element-in-a-bst",
    "topic_id": "trees",
    "title": "Kth Smallest Element in a BST",
    "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "difficulty": "medium",
    "order_index": 8
  },
  {
    "id": "construct-binary-tree-from-preorder-and-inorder",
    "topic_id": "trees",
    "title": "Construct Binary Tree from Preorder and Inorder",
    "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "difficulty": "medium",
    "order_index": 9
  },
  {
    "id": "implement-trie",
    "topic_id": "tries",
    "title": "Implement Trie",
    "url": "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "difficulty": "medium",
    "order_index": 1
  },
  {
    "id": "design-add-and-search-words-data-structure",
    "topic_id": "tries",
    "title": "Design Add and Search Words Data Structure",
    "url": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "word-search-ii",
    "topic_id": "tries",
    "title": "Word Search II",
    "url": "https://leetcode.com/problems/word-search-ii/",
    "difficulty": "hard",
    "order_index": 3
  },
  {
    "id": "kth-largest-element-in-a-stream",
    "topic_id": "heap-priority-queue",
    "title": "Kth Largest Element in a Stream",
    "url": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "last-stone-weight",
    "topic_id": "heap-priority-queue",
    "title": "Last Stone Weight",
    "url": "https://leetcode.com/problems/last-stone-weight/",
    "difficulty": "easy",
    "order_index": 2
  },
  {
    "id": "k-closest-points-to-origin",
    "topic_id": "heap-priority-queue",
    "title": "K Closest Points to Origin",
    "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "task-scheduler",
    "topic_id": "heap-priority-queue",
    "title": "Task Scheduler",
    "url": "https://leetcode.com/problems/task-scheduler/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "find-median-from-data-stream",
    "topic_id": "heap-priority-queue",
    "title": "Find Median from Data Stream",
    "url": "https://leetcode.com/problems/find-median-from-data-stream/",
    "difficulty": "hard",
    "order_index": 5
  },
  {
    "id": "subsets",
    "topic_id": "backtracking",
    "title": "Subsets",
    "url": "https://leetcode.com/problems/subsets/",
    "difficulty": "medium",
    "order_index": 1
  },
  {
    "id": "combination-sum",
    "topic_id": "backtracking",
    "title": "Combination Sum",
    "url": "https://leetcode.com/problems/combination-sum/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "permutations",
    "topic_id": "backtracking",
    "title": "Permutations",
    "url": "https://leetcode.com/problems/permutations/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "word-search",
    "topic_id": "backtracking",
    "title": "Word Search",
    "url": "https://leetcode.com/problems/word-search/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "palindrome-partitioning",
    "topic_id": "backtracking",
    "title": "Palindrome Partitioning",
    "url": "https://leetcode.com/problems/palindrome-partitioning/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "letter-combinations-of-a-phone-number",
    "topic_id": "backtracking",
    "title": "Letter Combinations of a Phone Number",
    "url": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "n-queens",
    "topic_id": "backtracking",
    "title": "N-Queens",
    "url": "https://leetcode.com/problems/n-queens/",
    "difficulty": "hard",
    "order_index": 7
  },
  {
    "id": "number-of-islands",
    "topic_id": "graphs",
    "title": "Number of Islands",
    "url": "https://leetcode.com/problems/number-of-islands/",
    "difficulty": "medium",
    "order_index": 1
  },
  {
    "id": "clone-graph",
    "topic_id": "graphs",
    "title": "Clone Graph",
    "url": "https://leetcode.com/problems/clone-graph/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "max-area-of-island",
    "topic_id": "graphs",
    "title": "Max Area of Island",
    "url": "https://leetcode.com/problems/max-area-of-island/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "pacific-atlantic-water-flow",
    "topic_id": "graphs",
    "title": "Pacific Atlantic Water Flow",
    "url": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "course-schedule",
    "topic_id": "graphs",
    "title": "Course Schedule",
    "url": "https://leetcode.com/problems/course-schedule/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "number-of-connected-components-in-an-undirected-graph",
    "topic_id": "graphs",
    "title": "Number of Connected Components in an Undirected Graph",
    "url": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "graph-valid-tree",
    "topic_id": "graphs",
    "title": "Graph Valid Tree",
    "url": "https://leetcode.com/problems/graph-valid-tree/",
    "difficulty": "medium",
    "order_index": 7
  },
  {
    "id": "word-ladder",
    "topic_id": "graphs",
    "title": "Word Ladder",
    "url": "https://leetcode.com/problems/word-ladder/",
    "difficulty": "hard",
    "order_index": 8
  },
  {
    "id": "network-delay-time",
    "topic_id": "advanced-graphs",
    "title": "Network Delay Time",
    "url": "https://leetcode.com/problems/network-delay-time/",
    "difficulty": "medium",
    "order_index": 1
  },
  {
    "id": "cheapest-flights-within-k-stops",
    "topic_id": "advanced-graphs",
    "title": "Cheapest Flights Within K Stops",
    "url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "swim-in-rising-water",
    "topic_id": "advanced-graphs",
    "title": "Swim in Rising Water",
    "url": "https://leetcode.com/problems/swim-in-rising-water/",
    "difficulty": "hard",
    "order_index": 3
  },
  {
    "id": "reconstruct-itinerary",
    "topic_id": "advanced-graphs",
    "title": "Reconstruct Itinerary",
    "url": "https://leetcode.com/problems/reconstruct-itinerary/",
    "difficulty": "hard",
    "order_index": 4
  },
  {
    "id": "climbing-stairs",
    "topic_id": "1d-dynamic-programming",
    "title": "Climbing Stairs",
    "url": "https://leetcode.com/problems/climbing-stairs/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "house-robber",
    "topic_id": "1d-dynamic-programming",
    "title": "House Robber",
    "url": "https://leetcode.com/problems/house-robber/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "house-robber-ii",
    "topic_id": "1d-dynamic-programming",
    "title": "House Robber II",
    "url": "https://leetcode.com/problems/house-robber-ii/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "longest-palindromic-substring",
    "topic_id": "1d-dynamic-programming",
    "title": "Longest Palindromic Substring",
    "url": "https://leetcode.com/problems/longest-palindromic-substring/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "palindromic-substrings",
    "topic_id": "1d-dynamic-programming",
    "title": "Palindromic Substrings",
    "url": "https://leetcode.com/problems/palindromic-substrings/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "decode-ways",
    "topic_id": "1d-dynamic-programming",
    "title": "Decode Ways",
    "url": "https://leetcode.com/problems/decode-ways/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "coin-change",
    "topic_id": "1d-dynamic-programming",
    "title": "Coin Change",
    "url": "https://leetcode.com/problems/coin-change/",
    "difficulty": "medium",
    "order_index": 7
  },
  {
    "id": "longest-increasing-subsequence",
    "topic_id": "1d-dynamic-programming",
    "title": "Longest Increasing Subsequence",
    "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "difficulty": "medium",
    "order_index": 8
  },
  {
    "id": "word-break",
    "topic_id": "1d-dynamic-programming",
    "title": "Word Break",
    "url": "https://leetcode.com/problems/word-break/",
    "difficulty": "medium",
    "order_index": 9
  },
  {
    "id": "unique-paths",
    "topic_id": "2d-dynamic-programming",
    "title": "Unique Paths",
    "url": "https://leetcode.com/problems/unique-paths/",
    "difficulty": "medium",
    "order_index": 1
  },
  {
    "id": "longest-common-subsequence",
    "topic_id": "2d-dynamic-programming",
    "title": "Longest Common Subsequence",
    "url": "https://leetcode.com/problems/longest-common-subsequence/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "best-time-to-buy-and-sell-stock-with-cooldown",
    "topic_id": "2d-dynamic-programming",
    "title": "Best Time to Buy and Sell Stock with Cooldown",
    "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "coin-change-ii",
    "topic_id": "2d-dynamic-programming",
    "title": "Coin Change II",
    "url": "https://leetcode.com/problems/coin-change-ii/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "target-sum",
    "topic_id": "2d-dynamic-programming",
    "title": "Target Sum",
    "url": "https://leetcode.com/problems/target-sum/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "interleaving-string",
    "topic_id": "2d-dynamic-programming",
    "title": "Interleaving String",
    "url": "https://leetcode.com/problems/interleaving-string/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "edit-distance",
    "topic_id": "2d-dynamic-programming",
    "title": "Edit Distance",
    "url": "https://leetcode.com/problems/edit-distance/",
    "difficulty": "medium",
    "order_index": 7
  },
  {
    "id": "maximum-subarray",
    "topic_id": "greedy",
    "title": "Maximum Subarray",
    "url": "https://leetcode.com/problems/maximum-subarray/",
    "difficulty": "medium",
    "order_index": 1
  },
  {
    "id": "jump-game",
    "topic_id": "greedy",
    "title": "Jump Game",
    "url": "https://leetcode.com/problems/jump-game/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "jump-game-ii",
    "topic_id": "greedy",
    "title": "Jump Game II",
    "url": "https://leetcode.com/problems/jump-game-ii/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "gas-station",
    "topic_id": "greedy",
    "title": "Gas Station",
    "url": "https://leetcode.com/problems/gas-station/",
    "difficulty": "medium",
    "order_index": 4
  },
  {
    "id": "hand-of-straights",
    "topic_id": "greedy",
    "title": "Hand of Straights",
    "url": "https://leetcode.com/problems/hand-of-straights/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "merge-triplets-to-form-target-triplet",
    "topic_id": "greedy",
    "title": "Merge Triplets to Form Target Triplet",
    "url": "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
    "difficulty": "medium",
    "order_index": 6
  },
  {
    "id": "insert-interval",
    "topic_id": "intervals",
    "title": "Insert Interval",
    "url": "https://leetcode.com/problems/insert-interval/",
    "difficulty": "medium",
    "order_index": 1
  },
  {
    "id": "merge-intervals",
    "topic_id": "intervals",
    "title": "Merge Intervals",
    "url": "https://leetcode.com/problems/merge-intervals/",
    "difficulty": "medium",
    "order_index": 2
  },
  {
    "id": "non-overlapping-intervals",
    "topic_id": "intervals",
    "title": "Non-overlapping Intervals",
    "url": "https://leetcode.com/problems/non-overlapping-intervals/",
    "difficulty": "medium",
    "order_index": 3
  },
  {
    "id": "meeting-rooms",
    "topic_id": "intervals",
    "title": "Meeting Rooms",
    "url": "https://leetcode.com/problems/meeting-rooms/",
    "difficulty": "easy",
    "order_index": 4
  },
  {
    "id": "meeting-rooms-ii",
    "topic_id": "intervals",
    "title": "Meeting Rooms II",
    "url": "https://leetcode.com/problems/meeting-rooms-ii/",
    "difficulty": "medium",
    "order_index": 5
  },
  {
    "id": "minimum-interval-to-include-each-query",
    "topic_id": "intervals",
    "title": "Minimum Interval to Include Each Query",
    "url": "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
    "difficulty": "hard",
    "order_index": 6
  },
  {
    "id": "single-number",
    "topic_id": "bit-manipulation",
    "title": "Single Number",
    "url": "https://leetcode.com/problems/single-number/",
    "difficulty": "easy",
    "order_index": 1
  },
  {
    "id": "number-of-1-bits",
    "topic_id": "bit-manipulation",
    "title": "Number of 1 Bits",
    "url": "https://leetcode.com/problems/number-of-1-bits/",
    "difficulty": "easy",
    "order_index": 2
  },
  {
    "id": "counting-bits",
    "topic_id": "bit-manipulation",
    "title": "Counting Bits",
    "url": "https://leetcode.com/problems/counting-bits/",
    "difficulty": "easy",
    "order_index": 3
  },
  {
    "id": "reverse-bits",
    "topic_id": "bit-manipulation",
    "title": "Reverse Bits",
    "url": "https://leetcode.com/problems/reverse-bits/",
    "difficulty": "easy",
    "order_index": 4
  },
  {
    "id": "missing-number",
    "topic_id": "bit-manipulation",
    "title": "Missing Number",
    "url": "https://leetcode.com/problems/missing-number/",
    "difficulty": "easy",
    "order_index": 5
  },
  {
    "id": "sum-of-two-integers",
    "topic_id": "bit-manipulation",
    "title": "Sum of Two Integers",
    "url": "https://leetcode.com/problems/sum-of-two-integers/",
    "difficulty": "medium",
    "order_index": 6
  }
]

export const TOPIC_MAP = new Map<string, Topic>(TOPICS.map((t) => [t.id, t]))
export const PROBLEM_MAP = new Map<string, Problem>(PROBLEMS.map((p) => [p.id, p]))

export const PROBLEMS_BY_TOPIC = new Map<string, Problem[]>()
for (const problem of PROBLEMS) {
  const list = PROBLEMS_BY_TOPIC.get(problem.topic_id) ?? []
  list.push(problem)
  PROBLEMS_BY_TOPIC.set(problem.topic_id, list)
}
