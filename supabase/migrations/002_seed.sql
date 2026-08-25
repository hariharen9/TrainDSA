-- Curriculum seed: 17 topics and curated problem sets.

insert into public.topics (id, title, order_index, concept_md, gotchas_md, visualizer_id)
values
  ('arrays-hashing', 'Arrays & Hashing', 1, '## Intuition

A hash map is a trade: you spend O(n) memory so that "have I seen this before?" becomes an O(1) lookup instead of an O(n) rescan. That trade is the single biggest lever in this whole topic — almost every "arrays & hashing" problem is really the question "what should I remember about elements I''ve already passed, so I don''t have to look at them again?"

Think of it like taking notes while reading a book once, instead of flipping back to earlier pages every time a new detail matters. The map is your notes. What you write down — the *key* — is the real design decision: sometimes it''s the value itself (membership), sometimes a count (frequency), sometimes a derived signature (sorted letters, for anagrams), sometimes a complement (`target - current`, for pair-sum problems).

## Pattern recognition

You''re in hash-map territory when a brute-force solution would need a **nested loop to compare every pair or re-scan for a match** — two `for` loops, or one loop with a hidden linear search inside it (`.includes()`, `in` on a list, another loop). The tell is the phrase "have I seen this" or "does this exist elsewhere in the array," because both are exactly what a hash map answers in O(1).

Match the shape of the question to the shape of the map:

- **Membership only** ("contains duplicate?") → a hash **set**. You only care yes/no.
- **Membership + position** ("Two Sum" — which *indices*?) → a hash **map** of value → index.
- **Counting** ("valid anagram," "top k frequent") → a hash map of value → frequency.
- **Grouping by a derived key** ("group anagrams") → a hash map of signature → list of originals. The signature is usually the sorted string or a per-letter count tuple.
- **Range queries without rescanning** ("subarray sum equals k") → a *running* hash map of prefix-sum → how many times that prefix has occurred.

## Worked example: Two Sum

Given `nums = [2, 7, 11, 15]` and `target = 9`, return the indices of the two numbers that add up to the target. The brute-force pair scan is O(n²): for every `i`, scan the rest of the array for a partner.

The hash-map reframing: instead of asking "does some other element pair with `nums[i]`?", flip the question to "have I already seen the number that would pair with `nums[i]`?" That number is `target - nums[i]`, the **complement**. If you''ve kept a running map of every value you''ve already visited (value → its index), checking "have I seen the complement" is one O(1) lookup — no inner loop at all.

```python
def two_sum(nums, target):
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []  # no valid pair
```

Trace it: at `i=0`, `num=2`, complement is `7`. The map is still empty, so no match — remember `{2: 0}`. At `i=1`, `num=7`, complement is `2`. The map already has `2 → 0` from the previous step, so we return `[0, 1]` immediately. Notice we never looked back at the array itself — the map *is* our memory of it, and we only ever move forward through `nums` once.

## Complexity

One pass, one lookup and one insert per element, both O(1) expected for a hash map — so the whole algorithm is O(n) time. That''s down from O(n²) for the brute-force nested loop. The cost is O(n) extra space for the map itself, which is the trade this entire topic is built on: memory for speed.

## Common mistakes

The most common one is checking whether `nums[i]` *itself* equals a value you''ve already stored, instead of checking its *complement* — that solves a different problem. A second: inserting into the map *before* checking for the complement, which lets an element pair with itself (wrong unless the problem explicitly allows reusing an index). A third, specific to counting/frequency variants: using a plain `set` when the problem needs multiplicities — a set silently collapses `[1, 1, 2]` down to losing the fact that `1` appeared twice.

## Try it yourself

Step through the trace below — watch the map fill in one entry at a time, and see exactly which lookup turns a miss into a match.', '- Hash collisions do not change big-O in expectation, but adversarial input can degrade naive maps; interviewers still accept HashMap.
- Duplicate keys: `set` loses counts; use a frequency map when multiplicity matters.
- `Product of Array Except Self` forbids division; prefix/suffix products are the intended trick.
- Consecutive sequence: only start a streak from a number whose predecessor is missing, or you pay O(n²).
- Index vs value: Two Sum needs the index, Contains Duplicate only needs membership.', 'two-sum-hashmap'),
  ('two-pointers', 'Two Pointers', 2, 'Two pointers replace nested loops when the search space is ordered or can be ordered. Place indices at opposite ends and move the one that cannot produce a better answer, or walk a fast pointer ahead of a slow one to find a middle, a cycle, or a window of length k.

Converging pointers shine on sorted arrays: Two Sum II, 3Sum, and container-with-most-water all shrink the candidate pair set monotonically. The slow/fast (tortoise and hare) variant detects cycles and finds midpoints without extra storage.

The invariant is the point: after each move, every discarded index is provably worse than what remains. If you cannot state that invariant, you probably need sorting first, or a different pattern (sliding window, hash map).', '- Many two-pointer proofs assume a sorted input. Unsorted arrays usually need a sort or a hash map instead.
- 3Sum: sort, then skip duplicate values at each of the three positions or you emit duplicate triplets.
- Palindrome checks: skip non-alphanumeric characters and compare case-insensitively.
- Container / trapping rain water: moving the taller side never helps; always advance the shorter pointer.
- Off-by-one: decide whether pointers are inclusive and whether they may cross.', null),
  ('sliding-window', 'Sliding Window', 3, '## Intuition

Picture a rubber band stretched over part of an array — that''s the window. It has two ends, `left` and `right`, and it only ever moves forward. `right` reaches out to grab new elements; `left` lets go of old ones when the window stops being valid. Neither pointer ever walks backward.

That one property — *no backward movement* — is the entire reason sliding window is fast. A brute-force "try every subarray" approach checks all `n²` start/end pairs. Sliding window instead asks: as I move `right` forward one step at a time, what''s the least amount of work I need to do at `left` to keep the window valid? Each index is added to the window exactly once (when `right` passes it) and removed at most once (when `left` passes it). Two passes total, not `n` passes — that''s how you get from O(n²) down to O(n).

## Pattern recognition

You''re looking at a sliding-window problem when the question is about a **contiguous** run of elements (not any subset — contiguous matters) and it asks for one of:

- The longest / shortest run satisfying some condition ("longest substring without repeating characters", "minimum window that contains all of...")
- Whether a run of a fixed size k satisfies a condition ("permutation in string", "max sum of any subarray of size k")
- A running aggregate over every window of size k ("sliding window maximum")

The giveaway phrase is usually **"substring"**, **"subarray"**, or **"contiguous"** combined with a size constraint or an optimization ("longest", "shortest", "at most", "exactly").

There are two flavors, and mixing them up is the #1 source of bugs:

- **Fixed-size window** — the window length is given (k). You slide it one step at a time: add the new right element, remove the leaving left element, done. No growing or shrinking logic needed.
- **Variable-size window** — you don''t know the length in advance. You grow `right` until the window becomes *invalid* (or reaches the target), then shrink `left` until it''s valid again, tracking the best window you''ve seen along the way.

## Worked example: Longest Substring Without Repeating Characters

Given `s = "abcabcbb"`, find the length of the longest substring with no repeated characters. This is the canonical variable-size window.

The state we maintain is a set (or map) of characters currently inside the window, plus `left`. We walk `right` across the string. Each time `s[right]` is already in the window, that''s our signal to shrink from the left — but only until the *duplicate* is gone, not the whole window.

```python
def length_of_longest_substring(s: str) -> int:
    window = set()
    left = 0
    best = 0

    for right in range(len(s)):
        # Shrink from the left until s[right] can safely enter
        while s[right] in window:
            window.remove(s[left])
            left += 1

        window.add(s[right])
        best = max(best, right - left + 1)

    return best
```

Trace it on `"abcabcbb"`: the window grows to `{a,b,c}` (length 3) before hitting the second `a` at index 3. The while-loop then removes `s[left]` (which is `a`) and advances `left` to 1 — just enough to drop the duplicate, not a full reset. The window becomes `{b,c,a}`, still length 3. `best` never exceeds 3 for this string, which matches the known answer.

Notice what did *not* happen: we never reset `left` back to `right`, and we never rescanned characters we''d already removed. That''s the O(n) guarantee — `left` only moves forward, and each character is added once and removed at most once across the whole run.

## Complexity

Both pointers move strictly left to right and each visits every index at most once, so the total work across the *whole* run is O(n), even though there''s a nested while-loop. This is the classic "amortized" argument: the while-loop looks like it could make this O(n²), but sum up how many times `left` moves across the *entire* algorithm — it''s bounded by n, because `left` can''t move more times than `right` has moved. Space is O(k) for the window''s character set/map, where k is the alphabet size or window size — O(1) if the character set is bounded (e.g. ASCII).

## Common mistakes

The most common bug is updating the window''s state *after* deciding whether it''s valid, instead of before — you end up validating a window that no longer reflects the count you just checked. A close second: for "longest" problems, people write code that shrinks back to empty and restarts instead of shrinking just enough to become valid again — that silently degrades you back to O(n²). And for fixed-size windows, forgetting to prime the first k elements before you start sliding (i.e. starting the slide loop from index 0 instead of index k) throws off every subsequent comparison.

## Try it yourself

The panel below lets you step through the exact trace above — watch how `left` only jumps forward when it has to, and never resets.', '- Update the window''s state *before* checking validity, or you validate against stale counts.
- Longest vs shortest: longest expands then shrinks-just-enough when invalid; minimum window shrinks while still valid and records the best along the way.
- Permutation in string is a fixed window equal to the pattern length — no growing/shrinking, just slide.
- Sliding window maximum needs a decreasing deque of indices, not a heap, to stay O(n).
- Watch empty strings/arrays and windows larger than the input.', 'sliding-window'),
  ('stack', 'Stack', 4, 'A stack is LIFO: the last unmatched opener, the last pending operator, or the last warmer day you have not resolved. Matching parentheses, RPN evaluation, and nested structures all map onto push/pop with a clear “what is still open?” meaning.

Monotonic stacks keep elements in increasing or decreasing order. When a new value breaks the order, you pop and those popped indices have found their next greater/smaller element. Daily Temperatures and many “next greater” problems are this template.

You can also encode extra state on the stack (value plus current min for Min Stack, or a running span). Think of the stack as deferred work that becomes answerable only when a later element arrives.', '- Always define the empty-stack case: extra closers, leftover openers, or no warmer day.
- Monotonic stacks store indices more often than values so you can compute distances.
- Generate Parentheses is backtracking with a stack-shaped invariant (open >= close, open <= n).
- Car Fleet: sort by position, then a stack of times-to-target; a slower car in front swallows faster ones behind.
- Do not pop before recording the answer for the popped index.', null),
  ('binary-search', 'Binary Search', 5, 'Binary search discards half of a sorted search space each step. The textbook form finds a target in a sorted array. The interview form searches over an *answer range*: capacity, time, or an index where a predicate flips from false to true.

The loop invariant is everything: decide whether `mid` is still feasible, then move `lo` or `hi` so the feasible region never loses the answer. Answer-range search usually looks like `while lo < hi` with `hi = mid` or `lo = mid + 1`.

Rotated arrays still have a sorted half; identify which half is sorted, then decide whether the target lives there. 2D matrix search treats the matrix as a virtual 1D sorted array when rows are ordered.', '- Inclusive vs exclusive bounds: mixing `hi = mid` with `hi = mid - 1` is the classic off-by-one.
- Overflow: use `lo + Math.floor((hi - lo) / 2)`.
- Duplicates in rotated arrays can make both halves look unsorted; you may need to shrink one side by one.
- Time-based store: binary search timestamps per key, not a global timeline.
- Median of two sorted arrays is binary search on partition index, not a merge.', null),
  ('linked-lists', 'Linked Lists', 6, 'Linked lists make pointer rewiring the algorithm. Reverse a list by walking three references (prev, curr, next). Merge two sorted lists by always attaching the smaller head. Detect a cycle with fast/slow pointers; if they meet, a second pointer from the head finds the cycle start.

Dummy nodes simplify insert/delete at the head. Finding the nth-from-end node is two pointers offset by n. Copying a list with random pointers is usually a two- or three-pass map, or an interleave-in-place trick.

Draw the pointers. Most bugs are a lost `next` reference or a loop that never advances because you mutated the node you still need.', '- Null heads and single-node lists: every routine should survive both.
- After reverse, the new head is the old tail; do not return the original head.
- Cycle detection: fast starts at head or head.next consistently with your meet condition.
- Reorder list: split at mid, reverse the second half, then weave.
- Merge K lists: heap of current heads is O(N log k); naive pairwise merge is slower.', null),
  ('trees', 'Trees', 7, 'Binary trees are recursive structures: a node plus left and right subtrees. DFS visits pre-order (node, left, right), in-order (left, node, right — sorted for a BST), or post-order (left, right, node). BFS uses a queue for level-order traversal and is the natural way to talk about depth by level.

BST invariants let you prune: left < node < right (beware of duplicate policies). Lowest common ancestor, validation, and kth-smallest all exploit that order. Construction problems invert a traversal pair: preorder gives the root, inorder splits left/right ranges.

Prefer recursion for clarity, then mention stack depth. Interviewers accept iterative DFS with an explicit stack when n is large.', '- Recursion depth can hit call-stack limits on skewed trees; mention O(n) worst-case height.
- Validate BST: passing only a parent value is wrong; pass a live (min, max) window.
- Same Tree / Subtree: null vs null is true; null vs node is false.
- LCA of BST uses value comparison; LCA of a binary tree needs a post-order bubble-up.
- Construct from preorder/inorder: index the inorder values or you pay O(n²).', null),
  ('tries', 'Tries', 8, 'A trie (prefix tree) stores strings by sharing prefixes. Each edge is a character; a node marked terminal means a complete word. Lookup, insert, and prefix queries are O(length), independent of how many words share the dictionary.

Tries shine when many strings share prefixes: autocomplete, prefix matching, and Word Search II (board DFS constrained by trie edges). Wildcard search (add-and-search-words) branches on `. ` by trying every child.

The representation trade-off is memory: 26-wide arrays are simple; hash-map children are sparse-friendly. Interviewers want a clean node class and a boolean `isWord` (or count) at terminals.', '- Do not mark every node as a word; only terminals.
- Search vs startsWith are different: search requires `isWord`.
- Wildcard DFS must backtrack; do not mutate the current node incorrectly.
- Word Search II: prune dead trie branches (delete words after finding them) to avoid TLE.
- Character set: lowercase a-z is assumed unless the prompt says otherwise.', null),
  ('heap-priority-queue', 'Heap / Priority Queue', 9, 'A heap gives you the current min or max in O(1) and insert/pop in O(log n). Streaming problems that need “the kth largest so far” or “median of a growing list” are two-heap or bounded-heap designs, not full sorts on every update.

K-closest points and last-stone-weight are one-heap problems. Task scheduler uses either a max-heap of remaining counts plus a cooldown queue, or a math formula. Language specifics matter: Python’s heapq is min-heap; Java PriorityQueue is min-heap by default; JS has no built-in heap in interviews—say you would use one, or implement a small binary heap if required.

When k is tiny compared to n, a size-k heap beats sorting.', '- JavaScript interviews: state that you would use a heap; sorting each time is a fallback they may reject for streaming.
- Kth largest in a stream: min-heap of size k, not a max-heap of everything.
- Median stream: max-heap for the lower half, min-heap for the upper half; rebalance sizes.
- Distance comparisons: compare squared distances to avoid floats.
- Task scheduler idle time: heap of counts plus a time wheel/queue for cooldown.', null),
  ('backtracking', 'Backtracking', 10, 'Backtracking explores a search tree: choose, recurse, undo. Subsets, permutations, combinations, and constraint puzzles (N-Queens, Word Search) share the same skeleton. The state is the partial answer plus a cursor (index, used mask, or board cell).

Undo is mandatory. If you mutate an array or board, pop or restore after the recursive call. If you pass a new copy, you pay extra memory; interviewers often prefer in-place plus undo.

Prune early: skip duplicates after sorting (subsets II / combination sum II), abort a path when a partial cost exceeds the target, and mark visited cells on the grid so you do not reuse a letter.', '- Deep copy vs in-place: pushing the same array reference into the result list captures later mutations.
- Combination Sum allows reuse: recurse on the same index; Permutations do not.
- Word Search: mark visited, recurse 4-directionally, unmark.
- Palindrome partitioning: only cut when s[start..i] is a palindrome.
- N-Queens: track columns and both diagonals as O(1) occupancy sets.', null),
  ('graphs', 'Graphs', 11, 'Graphs are nodes plus edges. Interviews almost always want an adjacency list. DFS and BFS explore connected components; Union-Find (DSU) answers “are these in the same component?” and counts components after unions.

Grid problems are implicit graphs: each cell has up to four neighbors. Number of Islands and Max Area of Island are DFS/BFS floods. Course Schedule is cycle detection on a directed graph (Kahn’s algorithm or color DFS). Clone Graph is a hashmap of old-to-new nodes plus DFS/BFS.

Directed vs undirected changes the cycle definition: a back-edge to an ancestor in directed graphs; any already-seen neighbor except the parent in undirected graphs.', '- Directed cycles: a node can be visited and still be legal if it is already finished (black); gray means a back-edge.
- Union-Find needs path compression and union-by-rank for interview-quality complexity.
- Graph Valid Tree: n-1 edges and exactly one component (no cycles).
- Word Ladder: BFS on implicit words; wildcard buckets beat scanning the whole dict each step.
- Clone Graph: do not recurse without the map or you infinite-loop on cycles.', null),
  ('advanced-graphs', 'Advanced Graphs', 12, 'Weighted graphs need shortest-path and MST algorithms. Dijkstra grows the closest unvisited node using a min-heap of (distance, node). It requires non-negative weights. Bellman-Ford relaxes all edges V-1 times and can detect negative cycles. Floyd-Warshall is all-pairs on small n.

K-stop cheapest flights is a constrained shortest path: Dijkstra with stops, or Bellman-Ford limited to K+1 relaxations. Swim in Rising Water is “minimum max-edge” on a grid: binary search plus BFS, or a heap like Dijkstra on height.

MST (Prim/Kruskal) is less common but reconstruct-itinerary is an Eulerian path (Hierholzer) on a directed multigraph of airports.', '- Dijkstra is wrong on negative weights; say so if they sneak in a negative edge.
- Cheapest Flights: vanilla Dijkstra without stop counts can miss a cheaper longer hop sequence under the K cap.
- Always skip stale heap entries when a better distance was already recorded.
- Reconstruct Itinerary: use a min-heap/multiset of destinations; Hierholzer adds nodes on the way back.
- Grid “effort” problems often minimize the max edge, not the sum.', null),
  ('1d-dynamic-programming', '1-D Dynamic Programming', 13, '1-D DP stores the best answer for prefixes of a linear structure. Optimal substructure means the best for i is computed from a few earlier states. Memoization is top-down recursion plus a cache; tabulation fills an array left to right.

Classic recurrences: climbing stairs (`dp[i] = dp[i-1] + dp[i-2]`), house robber (`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`), coin change (unbounded knapsack), LIS (patience sorting or O(n²) DP), word break (prefix boolean). Palindromes expand around centers or use a boolean table.

Name the state in words before coding: “minimum coins to make amount a” is clearer than a vague `dp[i]`.', '- Initialize DP with a sentinel (Infinity) for “impossible,” not zero, on minimization problems.
- House Robber II: circular constraint — run linear robber on [0..n-2] and [1..n-1].
- Coin Change vs Coin Change II: first is min coins; second is number of combinations (order does not matter).
- Decode Ways: leading zeros are invalid; handle ''10'' and ''20'' carefully.
- LIS O(n log n) tails array is expected at senior level; O(n²) is acceptable if you explain it.', null),
  ('2d-dynamic-programming', '2-D Dynamic Programming', 14, '2-D DP uses a table indexed by two dimensions: grid coordinates, or positions in two sequences. Unique Paths counts ways to a cell from above and left. LCS and Edit Distance align two strings: `dp[i][j]` is the best for prefixes s[:i] and t[:j].

Base cases are the whole game. First row/column of a grid often has only one path. Empty prefixes in string DP are zeros or identity costs. Rolling arrays can drop a dimension when you only need the previous row.

Stock-with-cooldown and Target Sum are still 2-state problems even if one index is implicit (day × holding, or index × running sum).', '- Off-by-one in string DP: table is often (m+1) × (n+1) to include empty prefixes.
- Unique Paths obstacles: a blocked cell has zero ways and must not inherit from neighbors incorrectly.
- Coin Change II: iterate coins in the outer loop to count combinations, not permutations.
- Interleaving String: dp[i][j] means first i of s1 and first j of s2 form s3 prefix.
- Edit Distance: insert, delete, replace are three transitions; match copies the diagonal.', null),
  ('greedy', 'Greedy', 15, 'A greedy algorithm commits to a locally optimal choice and never revisits it. It is correct only when a greedy-choice property holds: some globally optimal solution includes that local pick. Kadane’s maximum subarray, jump-game reach, and gas-station circuits are the standard proofs.

Pattern-match: if sorting by an endpoint, then scanning once, yields the answer (intervals, jump game II range expansion), you are in greedy territory. If later decisions depend on a global trade-off that local sorting cannot capture, you likely need DP.

Always be ready to say *why* the greedy step does not block a better solution—exchange argument or “if we did not pick this, we could swap.”', '- Jump Game: track farthest reach; you fail only if i exceeds farthest.
- Jump Game II: expand the current jump’s range; count a jump when the range ends.
- Gas Station: if total gas < total cost, impossible; otherwise the unique start is after the worst deficit.
- Hand of Straights: greedy take from the smallest remaining value; a map of counts is required.
- Maximum Subarray: Kadane resets the running sum when it goes negative (unless the array is all negative—still take the best element).', null),
  ('intervals', 'Intervals', 16, 'Interval problems start by sorting—usually by start, sometimes by end. After that, a linear scan merges overlaps, counts concurrent meetings, or greedily drops the interval that ends latest.

Merge Intervals walks sorted ranges and extends the current end while the next start is ≤ current end. Non-overlapping intervals is the dual: keep the one that finishes first. Meeting Rooms II is a sweep: sort starts and ends separately, or use a min-heap of end times.

Treat boundaries as closed unless the prompt says otherwise. A meeting ending at 9 and another starting at 9 may or may not conflict—read the spec.', '- Inclusive vs exclusive: `[1,2]` and `[2,3]` overlap if closed on both ends.
- Insert Interval: add all before, merge overlapping, then append the rest—do not sort a huge list if input is already ordered.
- Meeting Rooms vs II: first is boolean overlap; second is max concurrency.
- Minimum interval covering queries: sort intervals by start, heap by end, two pointers on queries sorted by point.
- Empty intervals and single-point intervals (`[1,1]`).', null),
  ('bit-manipulation', 'Bit Manipulation', 17, 'Bits let you pack boolean flags and cancel pairs. XOR is the star: `a ^ a = 0`, `a ^ 0 = a`, and XOR is associative, so every duplicated number vanishes in Single Number. Counting bits uses `n & (n-1)` to drop the lowest set bit, or DP: `bits[i] = bits[i >> 1] + (i & 1)`.

Masks represent subsets in O(1) (N-Queens diagonals, TSP-style DP). Arithmetic without `+` uses XOR for sum bits and AND+shift for carry (Sum of Two Integers). Reverse bits is shifts and masks; treat the value as unsigned 32-bit.

Prefer named operations over clever one-liners unless you can explain them in one sentence.', '- Operator precedence: `==` binds tighter than bitwise ops in some languages; parenthesize.
- JavaScript: bitwise operators coerce to 32-bit signed ints; use `>>> 0` for unsigned 32-bit.
- Number of 1 bits: treat input as unsigned.
- Missing Number: XOR all indices and values, or Gauss sum — watch overflow in typed languages.
- Sum of Two Integers: loop until carry is zero; negatives still work in two’s complement.', null)
on conflict (id) do update set
  title = excluded.title,
  order_index = excluded.order_index,
  concept_md = excluded.concept_md,
  gotchas_md = excluded.gotchas_md,
  visualizer_id = excluded.visualizer_id;

insert into public.problems (id, topic_id, title, url, difficulty, order_index)
values
  ('two-sum', 'arrays-hashing', 'Two Sum', 'https://leetcode.com/problems/two-sum/', 'easy', 1),
  ('valid-anagram', 'arrays-hashing', 'Valid Anagram', 'https://leetcode.com/problems/valid-anagram/', 'easy', 2),
  ('contains-duplicate', 'arrays-hashing', 'Contains Duplicate', 'https://leetcode.com/problems/contains-duplicate/', 'easy', 3),
  ('group-anagrams', 'arrays-hashing', 'Group Anagrams', 'https://leetcode.com/problems/group-anagrams/', 'medium', 4),
  ('top-k-frequent-elements', 'arrays-hashing', 'Top K Frequent Elements', 'https://leetcode.com/problems/top-k-frequent-elements/', 'medium', 5),
  ('product-of-array-except-self', 'arrays-hashing', 'Product of Array Except Self', 'https://leetcode.com/problems/product-of-array-except-self/', 'medium', 6),
  ('longest-consecutive-sequence', 'arrays-hashing', 'Longest Consecutive Sequence', 'https://leetcode.com/problems/longest-consecutive-sequence/', 'medium', 7),
  ('valid-palindrome', 'two-pointers', 'Valid Palindrome', 'https://leetcode.com/problems/valid-palindrome/', 'easy', 1),
  ('two-sum-ii', 'two-pointers', 'Two Sum II', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', 'medium', 2),
  ('3sum', 'two-pointers', '3Sum', 'https://leetcode.com/problems/3sum/', 'medium', 3),
  ('container-with-most-water', 'two-pointers', 'Container With Most Water', 'https://leetcode.com/problems/container-with-most-water/', 'medium', 4),
  ('trapping-rain-water', 'two-pointers', 'Trapping Rain Water', 'https://leetcode.com/problems/trapping-rain-water/', 'hard', 5),
  ('best-time-to-buy-and-sell-stock', 'sliding-window', 'Best Time to Buy and Sell Stock', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'easy', 1),
  ('longest-substring-without-repeating-characters', 'sliding-window', 'Longest Substring Without Repeating Characters', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'medium', 2),
  ('longest-repeating-character-replacement', 'sliding-window', 'Longest Repeating Character Replacement', 'https://leetcode.com/problems/longest-repeating-character-replacement/', 'medium', 3),
  ('permutation-in-string', 'sliding-window', 'Permutation in String', 'https://leetcode.com/problems/permutation-in-string/', 'medium', 4),
  ('minimum-window-substring', 'sliding-window', 'Minimum Window Substring', 'https://leetcode.com/problems/minimum-window-substring/', 'hard', 5),
  ('sliding-window-maximum', 'sliding-window', 'Sliding Window Maximum', 'https://leetcode.com/problems/sliding-window-maximum/', 'hard', 6),
  ('valid-parentheses', 'stack', 'Valid Parentheses', 'https://leetcode.com/problems/valid-parentheses/', 'easy', 1),
  ('min-stack', 'stack', 'Min Stack', 'https://leetcode.com/problems/min-stack/', 'medium', 2),
  ('evaluate-reverse-polish-notation', 'stack', 'Evaluate Reverse Polish Notation', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', 'medium', 3),
  ('generate-parentheses', 'stack', 'Generate Parentheses', 'https://leetcode.com/problems/generate-parentheses/', 'medium', 4),
  ('daily-temperatures', 'stack', 'Daily Temperatures', 'https://leetcode.com/problems/daily-temperatures/', 'medium', 5),
  ('car-fleet', 'stack', 'Car Fleet', 'https://leetcode.com/problems/car-fleet/', 'medium', 6),
  ('binary-search', 'binary-search', 'Binary Search', 'https://leetcode.com/problems/binary-search/', 'easy', 1),
  ('search-a-2d-matrix', 'binary-search', 'Search a 2D Matrix', 'https://leetcode.com/problems/search-a-2d-matrix/', 'medium', 2),
  ('search-in-rotated-sorted-array', 'binary-search', 'Search in Rotated Sorted Array', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', 'medium', 3),
  ('find-minimum-in-rotated-sorted-array', 'binary-search', 'Find Minimum in Rotated Sorted Array', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', 'medium', 4),
  ('time-based-key-value-store', 'binary-search', 'Time Based Key-Value Store', 'https://leetcode.com/problems/time-based-key-value-store/', 'medium', 5),
  ('median-of-two-sorted-arrays', 'binary-search', 'Median of Two Sorted Arrays', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', 'hard', 6),
  ('reverse-linked-list', 'linked-lists', 'Reverse Linked List', 'https://leetcode.com/problems/reverse-linked-list/', 'easy', 1),
  ('merge-two-sorted-lists', 'linked-lists', 'Merge Two Sorted Lists', 'https://leetcode.com/problems/merge-two-sorted-lists/', 'easy', 2),
  ('linked-list-cycle', 'linked-lists', 'Linked List Cycle', 'https://leetcode.com/problems/linked-list-cycle/', 'easy', 3),
  ('reorder-list', 'linked-lists', 'Reorder List', 'https://leetcode.com/problems/reorder-list/', 'medium', 4),
  ('remove-nth-node-from-end-of-list', 'linked-lists', 'Remove Nth Node From End of List', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', 'medium', 5),
  ('copy-list-with-random-pointer', 'linked-lists', 'Copy List with Random Pointer', 'https://leetcode.com/problems/copy-list-with-random-pointer/', 'medium', 6),
  ('merge-k-sorted-lists', 'linked-lists', 'Merge K Sorted Lists', 'https://leetcode.com/problems/merge-k-sorted-lists/', 'hard', 7),
  ('invert-binary-tree', 'trees', 'Invert Binary Tree', 'https://leetcode.com/problems/invert-binary-tree/', 'easy', 1),
  ('maximum-depth-of-binary-tree', 'trees', 'Maximum Depth of Binary Tree', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', 'easy', 2),
  ('same-tree', 'trees', 'Same Tree', 'https://leetcode.com/problems/same-tree/', 'easy', 3),
  ('subtree-of-another-tree', 'trees', 'Subtree of Another Tree', 'https://leetcode.com/problems/subtree-of-another-tree/', 'easy', 4),
  ('lowest-common-ancestor-of-a-bst', 'trees', 'Lowest Common Ancestor of a BST', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', 'medium', 5),
  ('binary-tree-level-order-traversal', 'trees', 'Binary Tree Level Order Traversal', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', 'medium', 6),
  ('validate-binary-search-tree', 'trees', 'Validate Binary Search Tree', 'https://leetcode.com/problems/validate-binary-search-tree/', 'medium', 7),
  ('kth-smallest-element-in-a-bst', 'trees', 'Kth Smallest Element in a BST', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', 'medium', 8),
  ('construct-binary-tree-from-preorder-and-inorder', 'trees', 'Construct Binary Tree from Preorder and Inorder', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', 'medium', 9),
  ('implement-trie', 'tries', 'Implement Trie', 'https://leetcode.com/problems/implement-trie-prefix-tree/', 'medium', 1),
  ('design-add-and-search-words-data-structure', 'tries', 'Design Add and Search Words Data Structure', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', 'medium', 2),
  ('word-search-ii', 'tries', 'Word Search II', 'https://leetcode.com/problems/word-search-ii/', 'hard', 3),
  ('kth-largest-element-in-a-stream', 'heap-priority-queue', 'Kth Largest Element in a Stream', 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', 'easy', 1),
  ('last-stone-weight', 'heap-priority-queue', 'Last Stone Weight', 'https://leetcode.com/problems/last-stone-weight/', 'easy', 2),
  ('k-closest-points-to-origin', 'heap-priority-queue', 'K Closest Points to Origin', 'https://leetcode.com/problems/k-closest-points-to-origin/', 'medium', 3),
  ('task-scheduler', 'heap-priority-queue', 'Task Scheduler', 'https://leetcode.com/problems/task-scheduler/', 'medium', 4),
  ('find-median-from-data-stream', 'heap-priority-queue', 'Find Median from Data Stream', 'https://leetcode.com/problems/find-median-from-data-stream/', 'hard', 5),
  ('subsets', 'backtracking', 'Subsets', 'https://leetcode.com/problems/subsets/', 'medium', 1),
  ('combination-sum', 'backtracking', 'Combination Sum', 'https://leetcode.com/problems/combination-sum/', 'medium', 2),
  ('permutations', 'backtracking', 'Permutations', 'https://leetcode.com/problems/permutations/', 'medium', 3),
  ('word-search', 'backtracking', 'Word Search', 'https://leetcode.com/problems/word-search/', 'medium', 4),
  ('palindrome-partitioning', 'backtracking', 'Palindrome Partitioning', 'https://leetcode.com/problems/palindrome-partitioning/', 'medium', 5),
  ('letter-combinations-of-a-phone-number', 'backtracking', 'Letter Combinations of a Phone Number', 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', 'medium', 6),
  ('n-queens', 'backtracking', 'N-Queens', 'https://leetcode.com/problems/n-queens/', 'hard', 7),
  ('number-of-islands', 'graphs', 'Number of Islands', 'https://leetcode.com/problems/number-of-islands/', 'medium', 1),
  ('clone-graph', 'graphs', 'Clone Graph', 'https://leetcode.com/problems/clone-graph/', 'medium', 2),
  ('max-area-of-island', 'graphs', 'Max Area of Island', 'https://leetcode.com/problems/max-area-of-island/', 'medium', 3),
  ('pacific-atlantic-water-flow', 'graphs', 'Pacific Atlantic Water Flow', 'https://leetcode.com/problems/pacific-atlantic-water-flow/', 'medium', 4),
  ('course-schedule', 'graphs', 'Course Schedule', 'https://leetcode.com/problems/course-schedule/', 'medium', 5),
  ('number-of-connected-components-in-an-undirected-graph', 'graphs', 'Number of Connected Components in an Undirected Graph', 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', 'medium', 6),
  ('graph-valid-tree', 'graphs', 'Graph Valid Tree', 'https://leetcode.com/problems/graph-valid-tree/', 'medium', 7),
  ('word-ladder', 'graphs', 'Word Ladder', 'https://leetcode.com/problems/word-ladder/', 'hard', 8),
  ('network-delay-time', 'advanced-graphs', 'Network Delay Time', 'https://leetcode.com/problems/network-delay-time/', 'medium', 1),
  ('cheapest-flights-within-k-stops', 'advanced-graphs', 'Cheapest Flights Within K Stops', 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', 'medium', 2),
  ('swim-in-rising-water', 'advanced-graphs', 'Swim in Rising Water', 'https://leetcode.com/problems/swim-in-rising-water/', 'hard', 3),
  ('reconstruct-itinerary', 'advanced-graphs', 'Reconstruct Itinerary', 'https://leetcode.com/problems/reconstruct-itinerary/', 'hard', 4),
  ('climbing-stairs', '1d-dynamic-programming', 'Climbing Stairs', 'https://leetcode.com/problems/climbing-stairs/', 'easy', 1),
  ('house-robber', '1d-dynamic-programming', 'House Robber', 'https://leetcode.com/problems/house-robber/', 'medium', 2),
  ('house-robber-ii', '1d-dynamic-programming', 'House Robber II', 'https://leetcode.com/problems/house-robber-ii/', 'medium', 3),
  ('longest-palindromic-substring', '1d-dynamic-programming', 'Longest Palindromic Substring', 'https://leetcode.com/problems/longest-palindromic-substring/', 'medium', 4),
  ('palindromic-substrings', '1d-dynamic-programming', 'Palindromic Substrings', 'https://leetcode.com/problems/palindromic-substrings/', 'medium', 5),
  ('decode-ways', '1d-dynamic-programming', 'Decode Ways', 'https://leetcode.com/problems/decode-ways/', 'medium', 6),
  ('coin-change', '1d-dynamic-programming', 'Coin Change', 'https://leetcode.com/problems/coin-change/', 'medium', 7),
  ('longest-increasing-subsequence', '1d-dynamic-programming', 'Longest Increasing Subsequence', 'https://leetcode.com/problems/longest-increasing-subsequence/', 'medium', 8),
  ('word-break', '1d-dynamic-programming', 'Word Break', 'https://leetcode.com/problems/word-break/', 'medium', 9),
  ('unique-paths', '2d-dynamic-programming', 'Unique Paths', 'https://leetcode.com/problems/unique-paths/', 'medium', 1),
  ('longest-common-subsequence', '2d-dynamic-programming', 'Longest Common Subsequence', 'https://leetcode.com/problems/longest-common-subsequence/', 'medium', 2),
  ('best-time-to-buy-and-sell-stock-with-cooldown', '2d-dynamic-programming', 'Best Time to Buy and Sell Stock with Cooldown', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', 'medium', 3),
  ('coin-change-ii', '2d-dynamic-programming', 'Coin Change II', 'https://leetcode.com/problems/coin-change-ii/', 'medium', 4),
  ('target-sum', '2d-dynamic-programming', 'Target Sum', 'https://leetcode.com/problems/target-sum/', 'medium', 5),
  ('interleaving-string', '2d-dynamic-programming', 'Interleaving String', 'https://leetcode.com/problems/interleaving-string/', 'medium', 6),
  ('edit-distance', '2d-dynamic-programming', 'Edit Distance', 'https://leetcode.com/problems/edit-distance/', 'medium', 7),
  ('maximum-subarray', 'greedy', 'Maximum Subarray', 'https://leetcode.com/problems/maximum-subarray/', 'medium', 1),
  ('jump-game', 'greedy', 'Jump Game', 'https://leetcode.com/problems/jump-game/', 'medium', 2),
  ('jump-game-ii', 'greedy', 'Jump Game II', 'https://leetcode.com/problems/jump-game-ii/', 'medium', 3),
  ('gas-station', 'greedy', 'Gas Station', 'https://leetcode.com/problems/gas-station/', 'medium', 4),
  ('hand-of-straights', 'greedy', 'Hand of Straights', 'https://leetcode.com/problems/hand-of-straights/', 'medium', 5),
  ('merge-triplets-to-form-target-triplet', 'greedy', 'Merge Triplets to Form Target Triplet', 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/', 'medium', 6),
  ('insert-interval', 'intervals', 'Insert Interval', 'https://leetcode.com/problems/insert-interval/', 'medium', 1),
  ('merge-intervals', 'intervals', 'Merge Intervals', 'https://leetcode.com/problems/merge-intervals/', 'medium', 2),
  ('non-overlapping-intervals', 'intervals', 'Non-overlapping Intervals', 'https://leetcode.com/problems/non-overlapping-intervals/', 'medium', 3),
  ('meeting-rooms', 'intervals', 'Meeting Rooms', 'https://leetcode.com/problems/meeting-rooms/', 'easy', 4),
  ('meeting-rooms-ii', 'intervals', 'Meeting Rooms II', 'https://leetcode.com/problems/meeting-rooms-ii/', 'medium', 5),
  ('minimum-interval-to-include-each-query', 'intervals', 'Minimum Interval to Include Each Query', 'https://leetcode.com/problems/minimum-interval-to-include-each-query/', 'hard', 6),
  ('single-number', 'bit-manipulation', 'Single Number', 'https://leetcode.com/problems/single-number/', 'easy', 1),
  ('number-of-1-bits', 'bit-manipulation', 'Number of 1 Bits', 'https://leetcode.com/problems/number-of-1-bits/', 'easy', 2),
  ('counting-bits', 'bit-manipulation', 'Counting Bits', 'https://leetcode.com/problems/counting-bits/', 'easy', 3),
  ('reverse-bits', 'bit-manipulation', 'Reverse Bits', 'https://leetcode.com/problems/reverse-bits/', 'easy', 4),
  ('missing-number', 'bit-manipulation', 'Missing Number', 'https://leetcode.com/problems/missing-number/', 'easy', 5),
  ('sum-of-two-integers', 'bit-manipulation', 'Sum of Two Integers', 'https://leetcode.com/problems/sum-of-two-integers/', 'medium', 6)
on conflict (id) do update set
  topic_id = excluded.topic_id,
  title = excluded.title,
  url = excluded.url,
  difficulty = excluded.difficulty,
  order_index = excluded.order_index;
