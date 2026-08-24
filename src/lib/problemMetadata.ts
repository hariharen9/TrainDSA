export type ProblemMetadata = {
  patterns: string[]
  companies: string[]
}

export const PROBLEM_METADATA: Record<string, ProblemMetadata> = {
  // Arrays & Hashing
  'two-sum': {
    patterns: ['Hash Map', 'One-Pass Complement'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'valid-anagram': {
    patterns: ['Frequency Map', 'Fixed-size Array'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Uber'],
  },
  'contains-duplicate': {
    patterns: ['Hash Set', 'Early Return'],
    companies: ['Amazon', 'Apple', 'Microsoft', 'Google'],
  },
  'group-anagrams': {
    patterns: ['Sorted String Key', 'Frequency Signature Tuple'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },
  'top-k-frequent-elements': {
    patterns: ['Bucket Sort', 'Min-Heap', 'Frequency Map'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple'],
  },
  'product-of-array-except-self': {
    patterns: ['Prefix & Suffix Products', 'O(1) Space Accumulator'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Uber'],
  },
  'longest-consecutive-sequence': {
    patterns: ['Hash Set', 'Streak Root Check (num - 1)'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Bloomberg'],
  },

  // Two Pointers
  'valid-palindrome': {
    patterns: ['Converging Pointers', 'Alphanumeric Filter'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google', 'Apple'],
  },
  'two-sum-ii': {
    patterns: ['Sorted Array', 'Converging Pointers'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
  },
  '3sum': {
    patterns: ['Sort + Two Pointers', 'Duplicate Skipping'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'container-with-most-water': {
    patterns: ['Greedy Two Pointers', 'Advance Shorter Edge'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple'],
  },
  'trapping-rain-water': {
    patterns: ['Two Pointers Monotonic Max', 'Prefix/Suffix Array', 'Monotonic Stack'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Bloomberg', 'Uber'],
  },

  // Sliding Window
  'best-time-to-buy-and-sell-stock': {
    patterns: ['Running Minimum', 'Greedy Single Pass'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'longest-substring-without-repeating-characters': {
    patterns: ['Variable Sliding Window', 'Last Seen Index Map'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'longest-repeating-character-replacement': {
    patterns: ['Sliding Window', 'Max Frequency Invariant'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
  },
  'permutation-in-string': {
    patterns: ['Fixed-Size Sliding Window', 'Character Count Matches'],
    companies: ['Microsoft', 'Meta', 'Amazon', 'Google'],
  },
  'minimum-window-substring': {
    patterns: ['Variable Sliding Window', 'Required Match Count'],
    companies: ['Meta', 'Google', 'Amazon', 'Microsoft', 'Apple', 'Uber'],
  },
  'sliding-window-maximum': {
    patterns: ['Monotonic Deque (Decreasing)', 'Sliding Window'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Uber'],
  },

  // Stack
  'valid-parentheses': {
    patterns: ['Matching Stack', 'Hash Map Lookup'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg', 'Apple'],
  },
  'min-stack': {
    patterns: ['Two Stacks', 'Pair Stack (val, min)'],
    companies: ['Amazon', 'Meta', 'Microsoft', 'Bloomberg', 'Google'],
  },
  'evaluate-reverse-polish-notation': {
    patterns: ['Stack Operand Evaluation', 'Integer Truncation'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
  },
  'generate-parentheses': {
    patterns: ['Backtracking', 'Stack State', 'Counting Invariant'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple'],
  },
  'daily-temperatures': {
    patterns: ['Monotonic Stack (Decreasing Index)', 'Next Greater Element'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
  'car-fleet': {
    patterns: ['Sort by Position', 'Monotonic Stack of Arrival Times'],
    companies: ['Google', 'Amazon', 'Meta'],
  },

  // Binary Search
  'binary-search': {
    patterns: ['Binary Search Standard', 'Loop Invariant'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
  },
  'search-a-2d-matrix': {
    patterns: ['Virtual 1D Flattening', 'Matrix Binary Search'],
    companies: ['Amazon', 'Meta', 'Microsoft', 'Google'],
  },
  'search-in-rotated-sorted-array': {
    patterns: ['Modified Binary Search', 'Sorted Half Identification'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'find-minimum-in-rotated-sorted-array': {
    patterns: ['Binary Search Boundary', 'Inflection Point'],
    companies: ['Amazon', 'Meta', 'Microsoft', 'Google'],
  },
  'time-based-key-value-store': {
    patterns: ['Hash Map of Sorted Arrays', 'Binary Search (bisect_right)'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
  },
  'median-of-two-sorted-arrays': {
    patterns: ['Binary Search on Partition', 'Divide & Conquer'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Bloomberg'],
  },

  // Linked Lists
  'reverse-linked-list': {
    patterns: ['Three Pointers (prev, curr, next)', 'In-place Pointer Reversal'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'merge-two-sorted-lists': {
    patterns: ['Dummy Head', 'Two Pointers Traversal'],
    companies: ['Amazon', 'Meta', 'Microsoft', 'Google', 'Apple'],
  },
  'linked-list-cycle': {
    patterns: ['Floyd Tortoise & Hare (Fast/Slow)', 'Cycle Detection'],
    companies: ['Amazon', 'Meta', 'Microsoft', 'Google', 'Bloomberg'],
  },
  'reorder-list': {
    patterns: ['Find Midpoint (Fast/Slow)', 'Reverse Second Half', 'Merge Alternating'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
  'remove-nth-node-from-end-of-list': {
    patterns: ['Two Pointers Offset by N', 'Dummy Head'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'copy-list-with-random-pointer': {
    patterns: ['Hash Map Clone', 'Interleaving Nodes In-place'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google', 'Bloomberg'],
  },
  'merge-k-sorted-lists': {
    patterns: ['Min-Heap of Node Heads', 'Divide & Conquer Merge'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Uber'],
  },

  // Trees
  'invert-binary-tree': {
    patterns: ['Tree DFS Post-order', 'Subtree Swap'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
  },
  'maximum-depth-of-binary-tree': {
    patterns: ['Tree DFS Recursion', 'BFS Level Order'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple'],
  },
  'same-tree': {
    patterns: ['Recursive DFS Symmetry', 'Base Case Null Checks'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
  },
  'subtree-of-another-tree': {
    patterns: ['DFS Traversal + Same Tree Helper', 'Merkle Tree Hashing'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'lowest-common-ancestor-of-a-bst': {
    patterns: ['BST Value Comparison', 'Path Branching Invariant'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },
  'binary-tree-level-order-traversal': {
    patterns: ['Queue BFS', 'Level Size Chunking'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg', 'Apple'],
  },
  'validate-binary-search-tree': {
    patterns: ['DFS with (min, max) Window', 'In-Order Traversal Monotonicity'],
    companies: ['Meta', 'Amazon', 'Bloomberg', 'Microsoft', 'Google'],
  },
  'kth-smallest-element-in-a-bst': {
    patterns: ['In-Order DFS Traversal (Sorted)', 'Iterative Stack'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'construct-binary-tree-from-preorder-and-inorder': {
    patterns: ['Divide & Conquer', 'Hash Map Indexing of Inorder'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Bloomberg'],
  },

  // Tries
  'implement-trie': {
    patterns: ['Prefix Tree', 'TrieNode Children Map/Array'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'],
  },
  'design-add-and-search-words-data-structure': {
    patterns: ['Trie + Wildcard DFS Backtracking'],
    companies: ['Meta', 'Amazon', 'Google'],
  },
  'word-search-ii': {
    patterns: ['2D Board DFS + Trie Pruning', 'Backtracking'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'],
  },

  // Heap / Priority Queue
  'kth-largest-element-in-a-stream': {
    patterns: ['Min-Heap of Size K', 'Streaming Extrema'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'last-stone-weight': {
    patterns: ['Max-Heap Simulation'],
    companies: ['Amazon', 'Google'],
  },
  'k-closest-points-to-origin': {
    patterns: ['Max-Heap of Size K', 'QuickSelect', 'Euclidean Metric'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple'],
  },
  'task-scheduler': {
    patterns: ['Max-Heap with Cooldown Queue', 'Greedy Math Formula'],
    companies: ['Meta', 'Google', 'Amazon', 'Microsoft'],
  },
  'find-median-from-data-stream': {
    patterns: ['Two Heaps (Max-Heap Low, Min-Heap High)', 'Balanced Stream'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Bloomberg'],
  },

  // Backtracking
  'subsets': {
    patterns: ['Include / Exclude Recursion', 'Bitmask Generation'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },
  'combination-sum': {
    patterns: ['Backtracking with Element Reuse', 'Pruning by Target'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Airbnb'],
  },
  'permutations': {
    patterns: ['Backtracking with Visited Set / Swap'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
  'word-search': {
    patterns: ['Grid 2D Backtracking (DFS + Unmark)'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google', 'Bloomberg'],
  },
  'palindrome-partitioning': {
    patterns: ['Backtracking with Palindrome Substring Check'],
    companies: ['Meta', 'Google', 'Amazon', 'Microsoft'],
  },
  'letter-combinations-of-a-phone-number': {
    patterns: ['Backtracking Combination Tree', 'Digit Mapping'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Uber'],
  },
  'n-queens': {
    patterns: ['Backtracking with Column & Diagonal Sets', 'Bitmask State'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },

  // Graphs
  'number-of-islands': {
    patterns: ['Grid BFS / DFS Flood Fill', 'Union-Find Disjoint Sets'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg', 'Apple', 'Uber'],
  },
  'clone-graph': {
    patterns: ['Graph DFS / BFS Traversal', 'Node Mapping Hash Table'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
  'max-area-of-island': {
    patterns: ['Grid DFS Flood Count', 'Matrix Traversal'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
  'pacific-atlantic-water-flow': {
    patterns: ['Multi-source Reverse BFS/DFS from Oceans', 'Intersection Set'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
  },
  'course-schedule': {
    patterns: ['Topological Sort (Kahn’s Algorithm)', 'Directed Cycle DFS (3 Colors)'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Uber'],
  },
  'number-of-connected-components-in-an-undirected-graph': {
    patterns: ['Union-Find with Rank & Path Compression', 'DFS Traversal'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
  },
  'graph-valid-tree': {
    patterns: ['Union-Find Cycle Check', 'Connected Tree Invariant (Edges = N - 1)'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft'],
  },
  'word-ladder': {
    patterns: ['Shortest Path BFS on Implicit Graph', 'Wildcard Bucket Patterns'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
  },

  // Advanced Graphs
  'network-delay-time': {
    patterns: ['Dijkstra Shortest Path (Min-Heap)'],
    companies: ['Google', 'Amazon', 'Microsoft'],
  },
  'cheapest-flights-within-k-stops': {
    patterns: ['Bellman-Ford Relaxations', 'Dijkstra with Step Count'],
    companies: ['Google', 'Meta', 'Amazon', 'Airbnb'],
  },
  'swim-in-rising-water': {
    patterns: ['Dijkstra on Maximum Edge', 'Binary Search + BFS Check'],
    companies: ['Google', 'Meta', 'Amazon'],
  },
  'reconstruct-itinerary': {
    patterns: ['Eulerian Path (Hierholzer’s Algorithm)', 'Min-Heap Destinations'],
    companies: ['Google', 'Amazon', 'Uber'],
  },

  // 1-D Dynamic Programming
  'climbing-stairs': {
    patterns: ['Fibonacci Recurrence', 'O(1) Rolling Space DP'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple'],
  },
  'house-robber': {
    patterns: ['Linear DP (Include / Skip)', 'Rolling State Variables'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
  'house-robber-ii': {
    patterns: ['Circular Constraint DP', 'Dual Linear DP Passes'],
    companies: ['Meta', 'Amazon', 'Google'],
  },
  'longest-palindromic-substring': {
    patterns: ['Expand Around Centers', '2D Boolean DP Table', 'Manacher'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'palindromic-substrings': {
    patterns: ['Expand Around Centers', 'Counting Invariant'],
    companies: ['Meta', 'Amazon', 'Google'],
  },
  'decode-ways': {
    patterns: ['1-D DP (1-digit vs 2-digit)', 'Handling Leading Zeroes'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
  },
  'coin-change': {
    patterns: ['Unbounded Knapsack DP', 'Minimization Sentinel (Infinity)'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'longest-increasing-subsequence': {
    patterns: ['Binary Search Tails Array O(N log N)', '1-D DP O(N²)'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Bloomberg'],
  },
  'word-break': {
    patterns: ['Prefix Boolean DP', 'Trie / Set Matching'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },

  // 2-D Dynamic Programming
  'unique-paths': {
    patterns: ['Grid 2D DP', 'Combinatorics (n+m choose n)'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Bloomberg'],
  },
  'longest-common-subsequence': {
    patterns: ['2-D Alignment DP', 'String Prefix Matrix'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'best-time-to-buy-and-sell-stock-with-cooldown': {
    patterns: ['State Machine DP (Hold, Sold, Rest)'],
    companies: ['Amazon', 'Meta', 'Google'],
  },
  'coin-change-ii': {
    patterns: ['Unbounded Knapsack Combination DP', 'Outer Coin Loop Invariant'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'target-sum': {
    patterns: ['Subset Sum DP Reduction', 'Memoized 2D DFS'],
    companies: ['Meta', 'Google', 'Amazon'],
  },
  'interleaving-string': {
    patterns: ['2-D Matrix Boolean DP', 'String Alignment'],
    companies: ['Google', 'Amazon', 'Meta'],
  },
  'edit-distance': {
    patterns: ['Levenshtein 2-D DP', 'Insert / Delete / Replace Transitions'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
  },

  // Greedy
  'maximum-subarray': {
    patterns: ['Kadane’s Algorithm', 'Dynamic Prefix Reset'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple', 'Bloomberg'],
  },
  'jump-game': {
    patterns: ['Greedy Farthest Reach'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple'],
  },
  'jump-game-ii': {
    patterns: ['Greedy BFS Range Expansion', 'Jump Counting'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'gas-station': {
    patterns: ['Greedy Deficit Accumulator', 'Circular Sum Check'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'hand-of-straights': {
    patterns: ['Greedy Frequency Counting Map', 'Min-Heap / Sorted Map'],
    companies: ['Google', 'Amazon', 'Meta'],
  },
  'merge-triplets-to-form-target-triplet': {
    patterns: ['Greedy Component Filtering', 'Valid Subset Inclusion'],
    companies: ['Amazon', 'Meta'],
  },

  // Intervals
  'insert-interval': {
    patterns: ['Interval Merging Single Pass', 'Before/Overlapping/After Split'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Bloomberg'],
  },
  'merge-intervals': {
    patterns: ['Sort by Start Time', 'Linear Overlap Merge'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg', 'Apple', 'Uber'],
  },
  'non-overlapping-intervals': {
    patterns: ['Greedy Earliest End Time', 'Interval Scheduling'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
  },
  'meeting-rooms': {
    patterns: ['Sort by Start Time', 'Adjacent Interval Overlap'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'meeting-rooms-ii': {
    patterns: ['Chronological Sweep Line (Starts & Ends)', 'Min-Heap End Times'],
    companies: ['Meta', 'Google', 'Amazon', 'Microsoft', 'Bloomberg', 'Uber'],
  },
  'minimum-interval-to-include-each-query': {
    patterns: ['Sort Queries with Original Index', 'Min-Heap of Active Intervals'],
    companies: ['Google', 'Amazon', 'Meta'],
  },

  // Bit Manipulation
  'single-number': {
    patterns: ['Bitwise XOR Cancellation (x ^ x = 0)'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple'],
  },
  'number-of-1-bits': {
    patterns: ['Brian Kernighan (n & (n - 1))', 'Hamming Weight'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple'],
  },
  'counting-bits': {
    patterns: ['DP Bit Formula (bits[i] = bits[i >> 1] + (i & 1))'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
  'reverse-bits': {
    patterns: ['Bit Shifting & Masking (32-bit Unsigned)'],
    companies: ['Apple', 'Amazon', 'Meta', 'Google', 'Microsoft'],
  },
  'missing-number': {
    patterns: ['XOR Accumulation', 'Gauss Sum Formula n*(n+1)/2'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft', 'Apple'],
  },
  'sum-of-two-integers': {
    patterns: ['Half Adder Bitwise Simulation (XOR Sum & AND Carry)'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
  },
}

export const ALL_COMPANIES = [
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Bloomberg',
  'Uber',
  'Netflix',
] as const

export const ALL_PATTERNS = [
  'Hash Map',
  'Two Pointers',
  'Sliding Window',
  'Monotonic Stack',
  'Binary Search',
  'Floyd Cycle Detection',
  'Tree DFS',
  'Tree BFS',
  'Trie',
  'Min-Heap / Max-Heap',
  'Backtracking',
  'Grid Flood Fill',
  'Topological Sort',
  'Union-Find',
  'Dijkstra',
  '1-D DP',
  '2-D DP',
  'Greedy',
  'Interval Sweep',
  'Bit Manipulation',
] as const
