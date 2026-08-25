import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const lc = (slug) => `https://leetcode.com/problems/${slug}/`

const topics = [
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    order: 1,
    visualizer: 'two-sum-hashmap',
    concept: `## Intuition

A hash map is a trade: you spend O(n) memory so that "have I seen this before?" becomes an O(1) lookup instead of an O(n) rescan. That trade is the single biggest lever in this whole topic — almost every "arrays & hashing" problem is really the question "what should I remember about elements I've already passed, so I don't have to look at them again?"

Think of it like taking notes while reading a book once, instead of flipping back to earlier pages every time a new detail matters. The map is your notes. What you write down — the *key* — is the real design decision: sometimes it's the value itself (membership), sometimes a count (frequency), sometimes a derived signature (sorted letters, for anagrams), sometimes a complement (\`target - current\`, for pair-sum problems).

## Pattern recognition

You're in hash-map territory when a brute-force solution would need a **nested loop to compare every pair or re-scan for a match** — two \`for\` loops, or one loop with a hidden linear search inside it (\`.includes()\`, \`in\` on a list, another loop). The tell is the phrase "have I seen this" or "does this exist elsewhere in the array," because both are exactly what a hash map answers in O(1).

Match the shape of the question to the shape of the map:

- **Membership only** ("contains duplicate?") → a hash **set**. You only care yes/no.
- **Membership + position** ("Two Sum" — which *indices*?) → a hash **map** of value → index.
- **Counting** ("valid anagram," "top k frequent") → a hash map of value → frequency.
- **Grouping by a derived key** ("group anagrams") → a hash map of signature → list of originals. The signature is usually the sorted string or a per-letter count tuple.
- **Range queries without rescanning** ("subarray sum equals k") → a *running* hash map of prefix-sum → how many times that prefix has occurred.

## Worked example: Two Sum

Given \`nums = [2, 7, 11, 15]\` and \`target = 9\`, return the indices of the two numbers that add up to the target. The brute-force pair scan is O(n²): for every \`i\`, scan the rest of the array for a partner.

The hash-map reframing: instead of asking "does some other element pair with \`nums[i]\`?", flip the question to "have I already seen the number that would pair with \`nums[i]\`?" That number is \`target - nums[i]\`, the **complement**. If you've kept a running map of every value you've already visited (value → its index), checking "have I seen the complement" is one O(1) lookup — no inner loop at all.

\`\`\`python
def two_sum(nums, target):
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []  # no valid pair
\`\`\`

Trace it: at \`i=0\`, \`num=2\`, complement is \`7\`. The map is still empty, so no match — remember \`{2: 0}\`. At \`i=1\`, \`num=7\`, complement is \`2\`. The map already has \`2 → 0\` from the previous step, so we return \`[0, 1]\` immediately. Notice we never looked back at the array itself — the map *is* our memory of it, and we only ever move forward through \`nums\` once.

## Complexity

One pass, one lookup and one insert per element, both O(1) expected for a hash map — so the whole algorithm is O(n) time. That's down from O(n²) for the brute-force nested loop. The cost is O(n) extra space for the map itself, which is the trade this entire topic is built on: memory for speed.

## Common mistakes

The most common one is checking whether \`nums[i]\` *itself* equals a value you've already stored, instead of checking its *complement* — that solves a different problem. A second: inserting into the map *before* checking for the complement, which lets an element pair with itself (wrong unless the problem explicitly allows reusing an index). A third, specific to counting/frequency variants: using a plain \`set\` when the problem needs multiplicities — a set silently collapses \`[1, 1, 2]\` down to losing the fact that \`1\` appeared twice.

## Try it yourself

Step through the trace below — watch the map fill in one entry at a time, and see exactly which lookup turns a miss into a match.`,
    gotchas: `- Hash collisions do not change big-O in expectation, but adversarial input can degrade naive maps; interviewers still accept HashMap.
- Duplicate keys: \`set\` loses counts; use a frequency map when multiplicity matters.
- \`Product of Array Except Self\` forbids division; prefix/suffix products are the intended trick.
- Consecutive sequence: only start a streak from a number whose predecessor is missing, or you pay O(n²).
- Index vs value: Two Sum needs the index, Contains Duplicate only needs membership.`,
    problems: [
      ['two-sum', 'Two Sum', 'two-sum', 'easy'],
      ['valid-anagram', 'Valid Anagram', 'valid-anagram', 'easy'],
      ['contains-duplicate', 'Contains Duplicate', 'contains-duplicate', 'easy'],
      ['group-anagrams', 'Group Anagrams', 'group-anagrams', 'medium'],
      ['top-k-frequent-elements', 'Top K Frequent Elements', 'top-k-frequent-elements', 'medium'],
      ['product-of-array-except-self', 'Product of Array Except Self', 'product-of-array-except-self', 'medium'],
      ['longest-consecutive-sequence', 'Longest Consecutive Sequence', 'longest-consecutive-sequence', 'medium'],
    ],
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    order: 2,
    concept: `Two pointers replace nested loops when the search space is ordered or can be ordered. Place indices at opposite ends and move the one that cannot produce a better answer, or walk a fast pointer ahead of a slow one to find a middle, a cycle, or a window of length k.

Converging pointers shine on sorted arrays: Two Sum II, 3Sum, and container-with-most-water all shrink the candidate pair set monotonically. The slow/fast (tortoise and hare) variant detects cycles and finds midpoints without extra storage.

The invariant is the point: after each move, every discarded index is provably worse than what remains. If you cannot state that invariant, you probably need sorting first, or a different pattern (sliding window, hash map).`,
    gotchas: `- Many two-pointer proofs assume a sorted input. Unsorted arrays usually need a sort or a hash map instead.
- 3Sum: sort, then skip duplicate values at each of the three positions or you emit duplicate triplets.
- Palindrome checks: skip non-alphanumeric characters and compare case-insensitively.
- Container / trapping rain water: moving the taller side never helps; always advance the shorter pointer.
- Off-by-one: decide whether pointers are inclusive and whether they may cross.`,
    problems: [
      ['valid-palindrome', 'Valid Palindrome', 'valid-palindrome', 'easy'],
      ['two-sum-ii', 'Two Sum II', 'two-sum-ii-input-array-is-sorted', 'medium'],
      ['3sum', '3Sum', '3sum', 'medium'],
      ['container-with-most-water', 'Container With Most Water', 'container-with-most-water', 'medium'],
      ['trapping-rain-water', 'Trapping Rain Water', 'trapping-rain-water', 'hard'],
    ],
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    order: 3,
    visualizer: 'sliding-window',
    concept: `## Intuition

Picture a rubber band stretched over part of an array — that's the window. It has two ends, \`left\` and \`right\`, and it only ever moves forward. \`right\` reaches out to grab new elements; \`left\` lets go of old ones when the window stops being valid. Neither pointer ever walks backward.

That one property — *no backward movement* — is the entire reason sliding window is fast. A brute-force "try every subarray" approach checks all \`n²\` start/end pairs. Sliding window instead asks: as I move \`right\` forward one step at a time, what's the least amount of work I need to do at \`left\` to keep the window valid? Each index is added to the window exactly once (when \`right\` passes it) and removed at most once (when \`left\` passes it). Two passes total, not \`n\` passes — that's how you get from O(n²) down to O(n).

## Pattern recognition

You're looking at a sliding-window problem when the question is about a **contiguous** run of elements (not any subset — contiguous matters) and it asks for one of:

- The longest / shortest run satisfying some condition ("longest substring without repeating characters", "minimum window that contains all of...")
- Whether a run of a fixed size k satisfies a condition ("permutation in string", "max sum of any subarray of size k")
- A running aggregate over every window of size k ("sliding window maximum")

The giveaway phrase is usually **"substring"**, **"subarray"**, or **"contiguous"** combined with a size constraint or an optimization ("longest", "shortest", "at most", "exactly").

There are two flavors, and mixing them up is the #1 source of bugs:

- **Fixed-size window** — the window length is given (k). You slide it one step at a time: add the new right element, remove the leaving left element, done. No growing or shrinking logic needed.
- **Variable-size window** — you don't know the length in advance. You grow \`right\` until the window becomes *invalid* (or reaches the target), then shrink \`left\` until it's valid again, tracking the best window you've seen along the way.

## Worked example: Longest Substring Without Repeating Characters

Given \`s = "abcabcbb"\`, find the length of the longest substring with no repeated characters. This is the canonical variable-size window.

The state we maintain is a set (or map) of characters currently inside the window, plus \`left\`. We walk \`right\` across the string. Each time \`s[right]\` is already in the window, that's our signal to shrink from the left — but only until the *duplicate* is gone, not the whole window.

\`\`\`python
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
\`\`\`

Trace it on \`"abcabcbb"\`: the window grows to \`{a,b,c}\` (length 3) before hitting the second \`a\` at index 3. The while-loop then removes \`s[left]\` (which is \`a\`) and advances \`left\` to 1 — just enough to drop the duplicate, not a full reset. The window becomes \`{b,c,a}\`, still length 3. \`best\` never exceeds 3 for this string, which matches the known answer.

Notice what did *not* happen: we never reset \`left\` back to \`right\`, and we never rescanned characters we'd already removed. That's the O(n) guarantee — \`left\` only moves forward, and each character is added once and removed at most once across the whole run.

## Complexity

Both pointers move strictly left to right and each visits every index at most once, so the total work across the *whole* run is O(n), even though there's a nested while-loop. This is the classic "amortized" argument: the while-loop looks like it could make this O(n²), but sum up how many times \`left\` moves across the *entire* algorithm — it's bounded by n, because \`left\` can't move more times than \`right\` has moved. Space is O(k) for the window's character set/map, where k is the alphabet size or window size — O(1) if the character set is bounded (e.g. ASCII).

## Common mistakes

The most common bug is updating the window's state *after* deciding whether it's valid, instead of before — you end up validating a window that no longer reflects the count you just checked. A close second: for "longest" problems, people write code that shrinks back to empty and restarts instead of shrinking just enough to become valid again — that silently degrades you back to O(n²). And for fixed-size windows, forgetting to prime the first k elements before you start sliding (i.e. starting the slide loop from index 0 instead of index k) throws off every subsequent comparison.

## Try it yourself

The panel below lets you step through the exact trace above — watch how \`left\` only jumps forward when it has to, and never resets.`,
    gotchas: `- Update the window's state *before* checking validity, or you validate against stale counts.
- Longest vs shortest: longest expands then shrinks-just-enough when invalid; minimum window shrinks while still valid and records the best along the way.
- Permutation in string is a fixed window equal to the pattern length — no growing/shrinking, just slide.
- Sliding window maximum needs a decreasing deque of indices, not a heap, to stay O(n).
- Watch empty strings/arrays and windows larger than the input.`,
    problems: [
      ['best-time-to-buy-and-sell-stock', 'Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'easy'],
      ['longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'medium'],
      ['longest-repeating-character-replacement', 'Longest Repeating Character Replacement', 'longest-repeating-character-replacement', 'medium'],
      ['permutation-in-string', 'Permutation in String', 'permutation-in-string', 'medium'],
      ['minimum-window-substring', 'Minimum Window Substring', 'minimum-window-substring', 'hard'],
      ['sliding-window-maximum', 'Sliding Window Maximum', 'sliding-window-maximum', 'hard'],
    ],
  },
  {
    id: 'stack',
    title: 'Stack',
    order: 4,
    concept: `A stack is LIFO: the last unmatched opener, the last pending operator, or the last warmer day you have not resolved. Matching parentheses, RPN evaluation, and nested structures all map onto push/pop with a clear “what is still open?” meaning.

Monotonic stacks keep elements in increasing or decreasing order. When a new value breaks the order, you pop and those popped indices have found their next greater/smaller element. Daily Temperatures and many “next greater” problems are this template.

You can also encode extra state on the stack (value plus current min for Min Stack, or a running span). Think of the stack as deferred work that becomes answerable only when a later element arrives.`,
    gotchas: `- Always define the empty-stack case: extra closers, leftover openers, or no warmer day.
- Monotonic stacks store indices more often than values so you can compute distances.
- Generate Parentheses is backtracking with a stack-shaped invariant (open >= close, open <= n).
- Car Fleet: sort by position, then a stack of times-to-target; a slower car in front swallows faster ones behind.
- Do not pop before recording the answer for the popped index.`,
    problems: [
      ['valid-parentheses', 'Valid Parentheses', 'valid-parentheses', 'easy'],
      ['min-stack', 'Min Stack', 'min-stack', 'medium'],
      ['evaluate-reverse-polish-notation', 'Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation', 'medium'],
      ['generate-parentheses', 'Generate Parentheses', 'generate-parentheses', 'medium'],
      ['daily-temperatures', 'Daily Temperatures', 'daily-temperatures', 'medium'],
      ['car-fleet', 'Car Fleet', 'car-fleet', 'medium'],
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    order: 5,
    concept: `Binary search discards half of a sorted search space each step. The textbook form finds a target in a sorted array. The interview form searches over an *answer range*: capacity, time, or an index where a predicate flips from false to true.

The loop invariant is everything: decide whether \`mid\` is still feasible, then move \`lo\` or \`hi\` so the feasible region never loses the answer. Answer-range search usually looks like \`while lo < hi\` with \`hi = mid\` or \`lo = mid + 1\`.

Rotated arrays still have a sorted half; identify which half is sorted, then decide whether the target lives there. 2D matrix search treats the matrix as a virtual 1D sorted array when rows are ordered.`,
    gotchas: `- Inclusive vs exclusive bounds: mixing \`hi = mid\` with \`hi = mid - 1\` is the classic off-by-one.
- Overflow: use \`lo + Math.floor((hi - lo) / 2)\`.
- Duplicates in rotated arrays can make both halves look unsorted; you may need to shrink one side by one.
- Time-based store: binary search timestamps per key, not a global timeline.
- Median of two sorted arrays is binary search on partition index, not a merge.`,
    problems: [
      ['binary-search', 'Binary Search', 'binary-search', 'easy'],
      ['search-a-2d-matrix', 'Search a 2D Matrix', 'search-a-2d-matrix', 'medium'],
      ['search-in-rotated-sorted-array', 'Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'medium'],
      ['find-minimum-in-rotated-sorted-array', 'Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'medium'],
      ['time-based-key-value-store', 'Time Based Key-Value Store', 'time-based-key-value-store', 'medium'],
      ['median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'hard'],
    ],
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    order: 6,
    concept: `Linked lists make pointer rewiring the algorithm. Reverse a list by walking three references (prev, curr, next). Merge two sorted lists by always attaching the smaller head. Detect a cycle with fast/slow pointers; if they meet, a second pointer from the head finds the cycle start.

Dummy nodes simplify insert/delete at the head. Finding the nth-from-end node is two pointers offset by n. Copying a list with random pointers is usually a two- or three-pass map, or an interleave-in-place trick.

Draw the pointers. Most bugs are a lost \`next\` reference or a loop that never advances because you mutated the node you still need.`,
    gotchas: `- Null heads and single-node lists: every routine should survive both.
- After reverse, the new head is the old tail; do not return the original head.
- Cycle detection: fast starts at head or head.next consistently with your meet condition.
- Reorder list: split at mid, reverse the second half, then weave.
- Merge K lists: heap of current heads is O(N log k); naive pairwise merge is slower.`,
    problems: [
      ['reverse-linked-list', 'Reverse Linked List', 'reverse-linked-list', 'easy'],
      ['merge-two-sorted-lists', 'Merge Two Sorted Lists', 'merge-two-sorted-lists', 'easy'],
      ['linked-list-cycle', 'Linked List Cycle', 'linked-list-cycle', 'easy'],
      ['reorder-list', 'Reorder List', 'reorder-list', 'medium'],
      ['remove-nth-node-from-end-of-list', 'Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list', 'medium'],
      ['copy-list-with-random-pointer', 'Copy List with Random Pointer', 'copy-list-with-random-pointer', 'medium'],
      ['merge-k-sorted-lists', 'Merge K Sorted Lists', 'merge-k-sorted-lists', 'hard'],
    ],
  },
  {
    id: 'trees',
    title: 'Trees',
    order: 7,
    concept: `Binary trees are recursive structures: a node plus left and right subtrees. DFS visits pre-order (node, left, right), in-order (left, node, right — sorted for a BST), or post-order (left, right, node). BFS uses a queue for level-order traversal and is the natural way to talk about depth by level.

BST invariants let you prune: left < node < right (beware of duplicate policies). Lowest common ancestor, validation, and kth-smallest all exploit that order. Construction problems invert a traversal pair: preorder gives the root, inorder splits left/right ranges.

Prefer recursion for clarity, then mention stack depth. Interviewers accept iterative DFS with an explicit stack when n is large.`,
    gotchas: `- Recursion depth can hit call-stack limits on skewed trees; mention O(n) worst-case height.
- Validate BST: passing only a parent value is wrong; pass a live (min, max) window.
- Same Tree / Subtree: null vs null is true; null vs node is false.
- LCA of BST uses value comparison; LCA of a binary tree needs a post-order bubble-up.
- Construct from preorder/inorder: index the inorder values or you pay O(n²).`,
    problems: [
      ['invert-binary-tree', 'Invert Binary Tree', 'invert-binary-tree', 'easy'],
      ['maximum-depth-of-binary-tree', 'Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'easy'],
      ['same-tree', 'Same Tree', 'same-tree', 'easy'],
      ['subtree-of-another-tree', 'Subtree of Another Tree', 'subtree-of-another-tree', 'easy'],
      ['lowest-common-ancestor-of-a-bst', 'Lowest Common Ancestor of a BST', 'lowest-common-ancestor-of-a-binary-search-tree', 'medium'],
      ['binary-tree-level-order-traversal', 'Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'medium'],
      ['validate-binary-search-tree', 'Validate Binary Search Tree', 'validate-binary-search-tree', 'medium'],
      ['kth-smallest-element-in-a-bst', 'Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst', 'medium'],
      ['construct-binary-tree-from-preorder-and-inorder', 'Construct Binary Tree from Preorder and Inorder', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'medium'],
    ],
  },
  {
    id: 'tries',
    title: 'Tries',
    order: 8,
    concept: `A trie (prefix tree) stores strings by sharing prefixes. Each edge is a character; a node marked terminal means a complete word. Lookup, insert, and prefix queries are O(length), independent of how many words share the dictionary.

Tries shine when many strings share prefixes: autocomplete, prefix matching, and Word Search II (board DFS constrained by trie edges). Wildcard search (add-and-search-words) branches on \`. \` by trying every child.

The representation trade-off is memory: 26-wide arrays are simple; hash-map children are sparse-friendly. Interviewers want a clean node class and a boolean \`isWord\` (or count) at terminals.`,
    gotchas: `- Do not mark every node as a word; only terminals.
- Search vs startsWith are different: search requires \`isWord\`.
- Wildcard DFS must backtrack; do not mutate the current node incorrectly.
- Word Search II: prune dead trie branches (delete words after finding them) to avoid TLE.
- Character set: lowercase a-z is assumed unless the prompt says otherwise.`,
    problems: [
      ['implement-trie', 'Implement Trie', 'implement-trie-prefix-tree', 'medium'],
      ['design-add-and-search-words-data-structure', 'Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure', 'medium'],
      ['word-search-ii', 'Word Search II', 'word-search-ii', 'hard'],
    ],
  },
  {
    id: 'heap-priority-queue',
    title: 'Heap / Priority Queue',
    order: 9,
    concept: `A heap gives you the current min or max in O(1) and insert/pop in O(log n). Streaming problems that need “the kth largest so far” or “median of a growing list” are two-heap or bounded-heap designs, not full sorts on every update.

K-closest points and last-stone-weight are one-heap problems. Task scheduler uses either a max-heap of remaining counts plus a cooldown queue, or a math formula. Language specifics matter: Python’s heapq is min-heap; Java PriorityQueue is min-heap by default; JS has no built-in heap in interviews—say you would use one, or implement a small binary heap if required.

When k is tiny compared to n, a size-k heap beats sorting.`,
    gotchas: `- JavaScript interviews: state that you would use a heap; sorting each time is a fallback they may reject for streaming.
- Kth largest in a stream: min-heap of size k, not a max-heap of everything.
- Median stream: max-heap for the lower half, min-heap for the upper half; rebalance sizes.
- Distance comparisons: compare squared distances to avoid floats.
- Task scheduler idle time: heap of counts plus a time wheel/queue for cooldown.`,
    problems: [
      ['kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream', 'easy'],
      ['last-stone-weight', 'Last Stone Weight', 'last-stone-weight', 'easy'],
      ['k-closest-points-to-origin', 'K Closest Points to Origin', 'k-closest-points-to-origin', 'medium'],
      ['task-scheduler', 'Task Scheduler', 'task-scheduler', 'medium'],
      ['find-median-from-data-stream', 'Find Median from Data Stream', 'find-median-from-data-stream', 'hard'],
    ],
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    order: 10,
    concept: `Backtracking explores a search tree: choose, recurse, undo. Subsets, permutations, combinations, and constraint puzzles (N-Queens, Word Search) share the same skeleton. The state is the partial answer plus a cursor (index, used mask, or board cell).

Undo is mandatory. If you mutate an array or board, pop or restore after the recursive call. If you pass a new copy, you pay extra memory; interviewers often prefer in-place plus undo.

Prune early: skip duplicates after sorting (subsets II / combination sum II), abort a path when a partial cost exceeds the target, and mark visited cells on the grid so you do not reuse a letter.`,
    gotchas: `- Deep copy vs in-place: pushing the same array reference into the result list captures later mutations.
- Combination Sum allows reuse: recurse on the same index; Permutations do not.
- Word Search: mark visited, recurse 4-directionally, unmark.
- Palindrome partitioning: only cut when s[start..i] is a palindrome.
- N-Queens: track columns and both diagonals as O(1) occupancy sets.`,
    problems: [
      ['subsets', 'Subsets', 'subsets', 'medium'],
      ['combination-sum', 'Combination Sum', 'combination-sum', 'medium'],
      ['permutations', 'Permutations', 'permutations', 'medium'],
      ['word-search', 'Word Search', 'word-search', 'medium'],
      ['palindrome-partitioning', 'Palindrome Partitioning', 'palindrome-partitioning', 'medium'],
      ['letter-combinations-of-a-phone-number', 'Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number', 'medium'],
      ['n-queens', 'N-Queens', 'n-queens', 'hard'],
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    order: 11,
    concept: `Graphs are nodes plus edges. Interviews almost always want an adjacency list. DFS and BFS explore connected components; Union-Find (DSU) answers “are these in the same component?” and counts components after unions.

Grid problems are implicit graphs: each cell has up to four neighbors. Number of Islands and Max Area of Island are DFS/BFS floods. Course Schedule is cycle detection on a directed graph (Kahn’s algorithm or color DFS). Clone Graph is a hashmap of old-to-new nodes plus DFS/BFS.

Directed vs undirected changes the cycle definition: a back-edge to an ancestor in directed graphs; any already-seen neighbor except the parent in undirected graphs.`,
    gotchas: `- Directed cycles: a node can be visited and still be legal if it is already finished (black); gray means a back-edge.
- Union-Find needs path compression and union-by-rank for interview-quality complexity.
- Graph Valid Tree: n-1 edges and exactly one component (no cycles).
- Word Ladder: BFS on implicit words; wildcard buckets beat scanning the whole dict each step.
- Clone Graph: do not recurse without the map or you infinite-loop on cycles.`,
    problems: [
      ['number-of-islands', 'Number of Islands', 'number-of-islands', 'medium'],
      ['clone-graph', 'Clone Graph', 'clone-graph', 'medium'],
      ['max-area-of-island', 'Max Area of Island', 'max-area-of-island', 'medium'],
      ['pacific-atlantic-water-flow', 'Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'medium'],
      ['course-schedule', 'Course Schedule', 'course-schedule', 'medium'],
      ['number-of-connected-components-in-an-undirected-graph', 'Number of Connected Components in an Undirected Graph', 'number-of-connected-components-in-an-undirected-graph', 'medium'],
      ['graph-valid-tree', 'Graph Valid Tree', 'graph-valid-tree', 'medium'],
      ['word-ladder', 'Word Ladder', 'word-ladder', 'hard'],
    ],
  },
  {
    id: 'advanced-graphs',
    title: 'Advanced Graphs',
    order: 12,
    concept: `Weighted graphs need shortest-path and MST algorithms. Dijkstra grows the closest unvisited node using a min-heap of (distance, node). It requires non-negative weights. Bellman-Ford relaxes all edges V-1 times and can detect negative cycles. Floyd-Warshall is all-pairs on small n.

K-stop cheapest flights is a constrained shortest path: Dijkstra with stops, or Bellman-Ford limited to K+1 relaxations. Swim in Rising Water is “minimum max-edge” on a grid: binary search plus BFS, or a heap like Dijkstra on height.

MST (Prim/Kruskal) is less common but reconstruct-itinerary is an Eulerian path (Hierholzer) on a directed multigraph of airports.`,
    gotchas: `- Dijkstra is wrong on negative weights; say so if they sneak in a negative edge.
- Cheapest Flights: vanilla Dijkstra without stop counts can miss a cheaper longer hop sequence under the K cap.
- Always skip stale heap entries when a better distance was already recorded.
- Reconstruct Itinerary: use a min-heap/multiset of destinations; Hierholzer adds nodes on the way back.
- Grid “effort” problems often minimize the max edge, not the sum.`,
    problems: [
      ['network-delay-time', 'Network Delay Time', 'network-delay-time', 'medium'],
      ['cheapest-flights-within-k-stops', 'Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'medium'],
      ['swim-in-rising-water', 'Swim in Rising Water', 'swim-in-rising-water', 'hard'],
      ['reconstruct-itinerary', 'Reconstruct Itinerary', 'reconstruct-itinerary', 'hard'],
    ],
  },
  {
    id: '1d-dynamic-programming',
    title: '1-D Dynamic Programming',
    order: 13,
    concept: `1-D DP stores the best answer for prefixes of a linear structure. Optimal substructure means the best for i is computed from a few earlier states. Memoization is top-down recursion plus a cache; tabulation fills an array left to right.

Classic recurrences: climbing stairs (\`dp[i] = dp[i-1] + dp[i-2]\`), house robber (\`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`), coin change (unbounded knapsack), LIS (patience sorting or O(n²) DP), word break (prefix boolean). Palindromes expand around centers or use a boolean table.

Name the state in words before coding: “minimum coins to make amount a” is clearer than a vague \`dp[i]\`.`,
    gotchas: `- Initialize DP with a sentinel (Infinity) for “impossible,” not zero, on minimization problems.
- House Robber II: circular constraint — run linear robber on [0..n-2] and [1..n-1].
- Coin Change vs Coin Change II: first is min coins; second is number of combinations (order does not matter).
- Decode Ways: leading zeros are invalid; handle '10' and '20' carefully.
- LIS O(n log n) tails array is expected at senior level; O(n²) is acceptable if you explain it.`,
    problems: [
      ['climbing-stairs', 'Climbing Stairs', 'climbing-stairs', 'easy'],
      ['house-robber', 'House Robber', 'house-robber', 'medium'],
      ['house-robber-ii', 'House Robber II', 'house-robber-ii', 'medium'],
      ['longest-palindromic-substring', 'Longest Palindromic Substring', 'longest-palindromic-substring', 'medium'],
      ['palindromic-substrings', 'Palindromic Substrings', 'palindromic-substrings', 'medium'],
      ['decode-ways', 'Decode Ways', 'decode-ways', 'medium'],
      ['coin-change', 'Coin Change', 'coin-change', 'medium'],
      ['longest-increasing-subsequence', 'Longest Increasing Subsequence', 'longest-increasing-subsequence', 'medium'],
      ['word-break', 'Word Break', 'word-break', 'medium'],
    ],
  },
  {
    id: '2d-dynamic-programming',
    title: '2-D Dynamic Programming',
    order: 14,
    concept: `2-D DP uses a table indexed by two dimensions: grid coordinates, or positions in two sequences. Unique Paths counts ways to a cell from above and left. LCS and Edit Distance align two strings: \`dp[i][j]\` is the best for prefixes s[:i] and t[:j].

Base cases are the whole game. First row/column of a grid often has only one path. Empty prefixes in string DP are zeros or identity costs. Rolling arrays can drop a dimension when you only need the previous row.

Stock-with-cooldown and Target Sum are still 2-state problems even if one index is implicit (day × holding, or index × running sum).`,
    gotchas: `- Off-by-one in string DP: table is often (m+1) × (n+1) to include empty prefixes.
- Unique Paths obstacles: a blocked cell has zero ways and must not inherit from neighbors incorrectly.
- Coin Change II: iterate coins in the outer loop to count combinations, not permutations.
- Interleaving String: dp[i][j] means first i of s1 and first j of s2 form s3 prefix.
- Edit Distance: insert, delete, replace are three transitions; match copies the diagonal.`,
    problems: [
      ['unique-paths', 'Unique Paths', 'unique-paths', 'medium'],
      ['longest-common-subsequence', 'Longest Common Subsequence', 'longest-common-subsequence', 'medium'],
      ['best-time-to-buy-and-sell-stock-with-cooldown', 'Best Time to Buy and Sell Stock with Cooldown', 'best-time-to-buy-and-sell-stock-with-cooldown', 'medium'],
      ['coin-change-ii', 'Coin Change II', 'coin-change-ii', 'medium'],
      ['target-sum', 'Target Sum', 'target-sum', 'medium'],
      ['interleaving-string', 'Interleaving String', 'interleaving-string', 'medium'],
      ['edit-distance', 'Edit Distance', 'edit-distance', 'medium'],
    ],
  },
  {
    id: 'greedy',
    title: 'Greedy',
    order: 15,
    concept: `A greedy algorithm commits to a locally optimal choice and never revisits it. It is correct only when a greedy-choice property holds: some globally optimal solution includes that local pick. Kadane’s maximum subarray, jump-game reach, and gas-station circuits are the standard proofs.

Pattern-match: if sorting by an endpoint, then scanning once, yields the answer (intervals, jump game II range expansion), you are in greedy territory. If later decisions depend on a global trade-off that local sorting cannot capture, you likely need DP.

Always be ready to say *why* the greedy step does not block a better solution—exchange argument or “if we did not pick this, we could swap.”`,
    gotchas: `- Jump Game: track farthest reach; you fail only if i exceeds farthest.
- Jump Game II: expand the current jump’s range; count a jump when the range ends.
- Gas Station: if total gas < total cost, impossible; otherwise the unique start is after the worst deficit.
- Hand of Straights: greedy take from the smallest remaining value; a map of counts is required.
- Maximum Subarray: Kadane resets the running sum when it goes negative (unless the array is all negative—still take the best element).`,
    problems: [
      ['maximum-subarray', 'Maximum Subarray', 'maximum-subarray', 'medium'],
      ['jump-game', 'Jump Game', 'jump-game', 'medium'],
      ['jump-game-ii', 'Jump Game II', 'jump-game-ii', 'medium'],
      ['gas-station', 'Gas Station', 'gas-station', 'medium'],
      ['hand-of-straights', 'Hand of Straights', 'hand-of-straights', 'medium'],
      ['merge-triplets-to-form-target-triplet', 'Merge Triplets to Form Target Triplet', 'merge-triplets-to-form-target-triplet', 'medium'],
    ],
  },
  {
    id: 'intervals',
    title: 'Intervals',
    order: 16,
    concept: `Interval problems start by sorting—usually by start, sometimes by end. After that, a linear scan merges overlaps, counts concurrent meetings, or greedily drops the interval that ends latest.

Merge Intervals walks sorted ranges and extends the current end while the next start is ≤ current end. Non-overlapping intervals is the dual: keep the one that finishes first. Meeting Rooms II is a sweep: sort starts and ends separately, or use a min-heap of end times.

Treat boundaries as closed unless the prompt says otherwise. A meeting ending at 9 and another starting at 9 may or may not conflict—read the spec.`,
    gotchas: `- Inclusive vs exclusive: \`[1,2]\` and \`[2,3]\` overlap if closed on both ends.
- Insert Interval: add all before, merge overlapping, then append the rest—do not sort a huge list if input is already ordered.
- Meeting Rooms vs II: first is boolean overlap; second is max concurrency.
- Minimum interval covering queries: sort intervals by start, heap by end, two pointers on queries sorted by point.
- Empty intervals and single-point intervals (\`[1,1]\`).`,
    problems: [
      ['insert-interval', 'Insert Interval', 'insert-interval', 'medium'],
      ['merge-intervals', 'Merge Intervals', 'merge-intervals', 'medium'],
      ['non-overlapping-intervals', 'Non-overlapping Intervals', 'non-overlapping-intervals', 'medium'],
      ['meeting-rooms', 'Meeting Rooms', 'meeting-rooms', 'easy'],
      ['meeting-rooms-ii', 'Meeting Rooms II', 'meeting-rooms-ii', 'medium'],
      ['minimum-interval-to-include-each-query', 'Minimum Interval to Include Each Query', 'minimum-interval-to-include-each-query', 'hard'],
    ],
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    order: 17,
    concept: `Bits let you pack boolean flags and cancel pairs. XOR is the star: \`a ^ a = 0\`, \`a ^ 0 = a\`, and XOR is associative, so every duplicated number vanishes in Single Number. Counting bits uses \`n & (n-1)\` to drop the lowest set bit, or DP: \`bits[i] = bits[i >> 1] + (i & 1)\`.

Masks represent subsets in O(1) (N-Queens diagonals, TSP-style DP). Arithmetic without \`+\` uses XOR for sum bits and AND+shift for carry (Sum of Two Integers). Reverse bits is shifts and masks; treat the value as unsigned 32-bit.

Prefer named operations over clever one-liners unless you can explain them in one sentence.`,
    gotchas: `- Operator precedence: \`==\` binds tighter than bitwise ops in some languages; parenthesize.
- JavaScript: bitwise operators coerce to 32-bit signed ints; use \`>>> 0\` for unsigned 32-bit.
- Number of 1 bits: treat input as unsigned.
- Missing Number: XOR all indices and values, or Gauss sum — watch overflow in typed languages.
- Sum of Two Integers: loop until carry is zero; negatives still work in two’s complement.`,
    problems: [
      ['single-number', 'Single Number', 'single-number', 'easy'],
      ['number-of-1-bits', 'Number of 1 Bits', 'number-of-1-bits', 'easy'],
      ['counting-bits', 'Counting Bits', 'counting-bits', 'easy'],
      ['reverse-bits', 'Reverse Bits', 'reverse-bits', 'easy'],
      ['missing-number', 'Missing Number', 'missing-number', 'easy'],
      ['sum-of-two-integers', 'Sum of Two Integers', 'sum-of-two-integers', 'medium'],
    ],
  },
]

function sqlString(s) {
  return s.replace(/'/g, "''")
}

const topicRows = topics
  .map((t) => {
    const visualizer = t.visualizer ? `'${sqlString(t.visualizer)}'` : 'null'
    return `  ('${t.id}', '${sqlString(t.title)}', ${t.order}, '${sqlString(t.concept)}', '${sqlString(t.gotchas)}', ${visualizer})`
  })
  .join(',\n')

const problemRows = topics
  .flatMap((t) =>
    t.problems.map(
      ([id, title, slug, difficulty], i) =>
        `  ('${id}', '${t.id}', '${sqlString(title)}', '${lc(slug)}', '${difficulty}', ${i + 1})`,
    ),
  )
  .join(',\n')

const sql = `-- Curriculum seed: 17 topics and curated problem sets.

insert into public.topics (id, title, order_index, concept_md, gotchas_md, visualizer_id)
values
${topicRows}
on conflict (id) do update set
  title = excluded.title,
  order_index = excluded.order_index,
  concept_md = excluded.concept_md,
  gotchas_md = excluded.gotchas_md,
  visualizer_id = excluded.visualizer_id;

insert into public.problems (id, topic_id, title, url, difficulty, order_index)
values
${problemRows}
on conflict (id) do update set
  topic_id = excluded.topic_id,
  title = excluded.title,
  url = excluded.url,
  difficulty = excluded.difficulty,
  order_index = excluded.order_index;
`

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'supabase', 'migrations', '002_seed.sql')
writeFileSync(out, sql)
console.log(`Wrote ${out}`)
