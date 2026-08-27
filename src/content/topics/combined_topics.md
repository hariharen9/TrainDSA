// ============================================================================
// File: 01-arrays-hashing.ts
// ============================================================================

import type { TopicContent } from '../types'

export const arraysHashingTopic: TopicContent = {
  id: 'arrays-hashing',
  title: 'Arrays & Hashing',
  order_index: 1,
  visualizer_id: 'two-sum-hashmap',
  summary: 'The ultimate guide to Arrays, Dynamic Resizing, Hash Functions, Hash Tables, and the 5 essential interview patterns.',
  intuition: `### 1. The Physical Foundation: Static & Dynamic Arrays

An **Array** is a contiguous sequence of elements stored back-to-back in physical RAM.

Because every memory cell has the same size and elements sit adjacent to each other with no gaps, the CPU computes memory addresses in **1 single instruction**:

\`Address(arr[i]) = Base_Address + (i × Element_Size)\`

- **Instant Random Access (\`O(1)\`)**: Accessing \`arr[0]\` is just as fast as accessing \`arr[999999]\`.
- **The Search Flaw (\`O(n)\`)**: If you don't know the index and only know the value (e.g. *"Is 42 in this list?"*), you must inspect every single cell sequentially from index 0 to \`n - 1\`.
- **Insertion & Deletion (\`O(n)\`)**: Inserting or deleting at the front or middle requires shifting every subsequent element over by 1.

#### How Dynamic Arrays Work (Python \`list\`, Java \`ArrayList\`, C++ \`vector\`)
Static arrays have a fixed size. Dynamic arrays automatically resize when full by:
1. Allocating a new array of **double the capacity** (\`2×\`).
2. Copying over all existing elements (\`O(n)\` work).
3. Deallocating the old array.

> **Why is appending Amortized \`O(1)\`?**
>
> Even though doubling takes \`O(n)\` work when resizing, it happens so infrequently that across \`N\` appends, the total copies form a geometric sequence:
>
> \`1 + 2 + 4 + 8 + ... + N/2 + N = 2N operations\`
>
> \`2N operations / N appends = 2 operations per append (Amortized O(1))\`.

---

### 2. The Bridge to Hashing: Turning Values into Indices

What if we could search by **value** just as fast as we access an array by **index**?

That is the entire purpose of **Hashing**. A **Hash Table** is an underlying **Bucket Array** paired with a mathematical **Hash Function**:

\`\`\`
Key ("apple") ──► [ Hash Function ] ──► Hash Code (530) ──► % Capacity (6) ──► Bucket Index [2]
\`\`\`

1. **Hash Function**: Converts any arbitrary key (string, integer, tuple) into a deterministic integer.
2. **Modulo Operator**: Shrinks that integer to fit within the bucket array bounds (\`index = hash_code % array_capacity\`).
3. **Direct Placement**: Reads or writes directly to \`buckets[index]\` in **\`O(1)\` average time**.

#### What Makes a Hash Function "Good"?
A well-distributed hash function spreads keys evenly across buckets so no single bucket gets overloaded. A *bad* hash function (e.g. \`hash(x) = x % 2\` on mostly-even data) causes everything to pile into a handful of buckets, degrading lookups toward \`O(n)\`. This is also why languages like Python randomize their string hash seed per process — it prevents an attacker who knows your hash function from crafting keys that all collide (a "hash-flooding" denial-of-service attack).

#### Handling Hash Collisions
When two different keys produce the exact same bucket index (e.g. \`"cat"\` and \`"act"\` both land in Bucket 0), there are two standard strategies:

- **Separate Chaining (most common)**: Each bucket holds a linked list (or small balanced tree, as Java's \`HashMap\` does once a chain exceeds 8 entries). A collision just appends to that bucket's chain.
- **Open Addressing**: There's no chaining — instead, on a collision the table probes for the *next* free slot according to a rule:
  - **Linear Probing**: try \`index + 1\`, \`index + 2\`, ... (simple, but prone to "clustering").
  - **Quadratic Probing**: try \`index + 1²\`, \`index + 2²\`, ... (spreads out clusters).
  - **Double Hashing**: use a second hash function to compute the step size, avoiding clustering almost entirely.
  Open addressing is more cache-friendly (no pointer-chasing) but degrades faster as the table fills up, and deletion is trickier (you must mark slots as "deleted" rather than truly empty, or later lookups will stop early). This comes up in "design a HashMap from scratch" style questions (LeetCode 705/706).

- **Load Factor (\`α = items / buckets\`)**: When the table gets too full (typically \`α > 0.75\`), the hash table automatically doubles its bucket array and rehashes all items, keeping average bucket length \`≈ 1\` and lookups at **\`O(1)\` average case**.

> **Interview trap:** hash map lookup is \`O(1)\` *average case*, not worst case. If every key collides into the same bucket (bad hash function, or an adversary who knows your hash function), a lookup degrades to \`O(n)\` because you're now scanning a single chain linearly. Interviewers sometimes ask this directly — "when is a hash map NOT O(1)?" — as a way to check you understand hashing isn't magic.

---

### 3. Hash Set vs. Hash Map vs. Direct Addressing Array

| Structure | What It Stores | Core Question It Answers | When To Choose |
| :--- | :--- | :--- | :--- |
| **Hash Set** | Unique Keys only: \`{2, 7, 11}\` | *"Have I seen this value before?"* (\`O(1)\`) | Deduplication, cycle detection, visited tracking. |
| **Hash Map** | Key-Value pairs: \`{2: 0, 7: 1}\` | *"What data/index is paired with this key?"* (\`O(1)\`) | Two Sum index lookup, frequency counting, caches. |
| **Direct Array** | Fixed-size array (e.g. \`[0]*26\`) | Instant lookup for bounded alphabet (\`'a'-'z'\`) | Fixed ASCII sets, valid anagrams, zero-overhead memory. |`,
  patternRecognition: `### The 5 Essential Interview Patterns

#### Pattern 1: Hash Set for Instant Membership (\`O(1)\` "Seen" Tracker)
- **Giveaway**: *"Find if array contains duplicates"*, *"Find the longest consecutive sequence"*.
- **Strategy**: As you iterate, check \`if num in seen:\`. If true, return; else \`seen.add(num)\`.
- **Top Problems**: *Contains Duplicate*, *Contains Duplicate II*, *Longest Consecutive Sequence*.
- **Likely follow-up**: *"Can you do it with O(1) space?"* — usually means sort first (\`O(n log n)\` time, \`O(1)\` space) and trade time for space.

#### Pattern 2: Hash Map for Target Complements (Look Backward, Don't Look Forward)
- **Giveaway**: *"Find two numbers that add up to target"*, *"Pair with difference K"*.
- **Strategy**: Instead of a nested loop scanning forward for a partner, calculate \`complement = target - num\` and check if that complement was already stored in your map.
- **Top Problems**: *Two Sum*, *4Sum II*.
- **Likely follow-up**: *"What if the array is already sorted?"* — switch to the two-pointer pattern (O(1) space, no hash map needed) instead of re-deriving the hash approach.

#### Pattern 3: Frequency Map & Bucket Sort (Linear \`O(n)\` Sorting)
- **Giveaway**: *"Find the top K most frequent elements"*, *"Sort characters by frequency"*.
- **Strategy**: Count frequencies with a Hash Map (\`O(n)\`). Instead of an \`O(n log n)\` sort, create an array of buckets where \`index = frequency\` (\`O(n)\` Bucket Sort)!
- **Top Problems**: *Top K Frequent Elements*, *Sort Characters By Frequency*.
- **Likely follow-up**: *"What if K is close to N?"* — bucket sort still wins; a heap-based \`O(n log k)\` approach only pays off when \`k\` is small.

#### Pattern 4: Canonical Signature / Derived Key Grouping
- **Giveaway**: *"Group anagrams together"*, *"Group words by pattern"*.
- **Strategy**: Transform each element into a standardized immutable key (e.g. sorted string \`"".join(sorted(s))\` or a 26-count tuple \`tuple(count)\`), and use that signature as the dictionary key mapping to a list of original elements.
- **Top Problems**: *Group Anagrams*, *Isomorphic Strings*, *Valid Anagram*.
- **Likely follow-up**: *"Sorting each string is O(k log k) — can you avoid it?"* — use a 26-length count array/tuple as the key instead, dropping to O(k) per string.

#### Pattern 5: Prefix Accumulation & Running Products
- **Giveaway**: *"Product of array except self without division"*, *"Continuous subarray sum"*.
- **Strategy**: Precompute prefix sweeps (left-to-right) and suffix sweeps (right-to-left) to compute cumulative window products in \`O(n)\` time and \`O(1)\` extra space (excluding output array).
- **Top Problems**: *Product of Array Except Self*, *Subarray Sum Equals K*.
- **Likely follow-up**: *"Now allow division"* — simpler but breaks when the array contains a 0, which is exactly why interviewers forbid division in the first place.`,
  workedExample: {
    title: 'Two Sum & Contains Duplicate (Python 3 Implementations)',
    problem: `### Problem 1: Contains Duplicate (Hash Set)
Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.

- **Brute Force**: Compare every pair with nested loops → \`O(n²)\` time, \`O(1)\` space.
- **Sorting**: Sort array and check adjacent elements → \`O(n log n)\` time, \`O(1)\` space.
- **Optimal (Hash Set)**: Add elements to a set while scanning → \`O(n)\` time, \`O(n)\` space.

\`\`\`python
def contains_duplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False
\`\`\`

---

### Problem 2: Two Sum (Hash Map)
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

Instead of scanning all pairs (\`O(n²)\`), we maintain a running map of \`{ value: index }\`. For each number, we compute \`complement = target - num\` and check if we already passed it.`,
    code: {
      language: 'python',
      snippet: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}  # Map: value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []`,
    },
    explanation: `Step-by-step trace on nums = [2, 7, 11, 15], target = 9:
1. i = 0, num = 2. Complement = 9 - 2 = 7. Is 7 in seen? No. Store seen[2] = 0.
2. i = 1, num = 7. Complement = 9 - 7 = 2. Is 2 in seen? YES! Match at index 0.
3. Return [0, 1] immediately. Time: O(n), Space: O(n).

Common interviewer follow-up: "What if nums is sorted and you need O(1) extra space?" — drop the hash map for a two-pointer sweep (left at 0, right at n-1, move inward based on whether the current sum is above or below target).`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Single linear pass through the array with O(1) average hash lookup/insert operations. Worst case degrades to O(n²) if the hash function causes heavy collisions (rare in practice with a good hash function, but worth knowing).',
    space: 'O(n)',
    spaceDetail: 'Extra space for storing up to n elements in the Hash Map or Hash Set.',
  },
  commonMistakes: `1. **Inserting Before Checking (Self-Pairing Bug)**:
   If you execute \`seen[num] = i\` *before* checking \`complement in seen\`, a number can match with itself when \`target = 2 * num\` (e.g. \`target = 6\` with \`nums = [3]\`). Always check first, then insert.

2. **Un-hashable Dictionary Keys in Python**:
   Dictionary keys and set elements in Python **must be immutable** (hashable). Lists and sets cannot be keys. If grouping by frequency, convert the list to a tuple: \`tuple(count)\`.

3. **Missing the \`O(1)\` Predecessor Check in Longest Consecutive Sequence**:
   To find the longest consecutive sequence in \`O(n)\` time using a Hash Set, only start counting a streak from \`x\` if \`x - 1\` is **not** in the set. Checking from every number blindly degrades your solution back to \`O(n²)\`.

4. **Using a Hash Set When Indices are Required**:
   A Hash Set only stores membership (\`true\` / \`false\`). If the question asks to return *indices* (like Two Sum), you must use a Hash Map (\`value → index\`).

5. **Sorting When Bucket Sort Yields \`O(n)\`**:
   In *Top K Frequent Elements*, sorting the dictionary by frequency takes \`O(n log n)\` time. Using an array of size \`N + 1\` where \`bucket[freq] = [elements]\` solves the problem in pure \`O(n)\` time without a heap or sort.

6. **Claiming Hash Map Lookup Is Always \`O(1)\`**:
   It's \`O(1)\` *average case* under a good hash function and reasonable load factor. Say "amortized/average O(1)" out loud in interviews — claiming a hard O(1) guarantee is a common tell that a candidate is reciting rather than understanding.`,
  gotchas: [
    'Hash collisions: When two different keys produce the same bucket index, hash tables handle this via separate chaining (linked lists per bucket) or open addressing (linear/quadratic probing, double hashing) without breaking correctness.',
    'Worst-case degradation: a poorly distributed hash function (or adversarial input) can collapse average O(1) lookups toward O(n) by piling everything into one bucket/chain.',
    'Duplicate keys: Hash Sets automatically discard duplicate values; use a frequency Map (or Python collections.Counter) when multiplicity matters.',
    'Array index trick: When elements are integers bounded within [1, n], you can use the input array itself as a hash table by negating values at index `abs(num) - 1`.',
    'Product of Array Except Self forbids division: Solve with prefix and suffix product sweeps in O(n) time and O(1) extra space.',
    'Consecutive sequence: Only start counting a streak from `num` if `num - 1` is not in the set, ensuring each element is visited at most twice for O(n) total time.',
    'Open addressing vs chaining trade-off: open addressing is more cache-friendly (no pointer chasing) but degrades faster as load factor rises and needs tombstone markers for deletion; chaining tolerates a higher load factor gracefully but pays pointer-chasing cost.',
  ],
  problems: [
    { id: 'two-sum', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy' },
    { id: 'valid-anagram', title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'easy' },
    { id: 'contains-duplicate', title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'easy' },
    { id: 'contains-duplicate-ii', title: 'Contains Duplicate II', slug: 'contains-duplicate-ii', difficulty: 'easy' },
    { id: 'ransom-note', title: 'Ransom Note', slug: 'ransom-note', difficulty: 'easy' },
    { id: 'isomorphic-strings', title: 'Isomorphic Strings', slug: 'isomorphic-strings', difficulty: 'easy' },
    { id: 'valid-sudoku', title: 'Valid Sudoku', slug: 'valid-sudoku', difficulty: 'medium' },
    { id: 'group-anagrams', title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'medium' },
    { id: 'top-k-frequent-elements', title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'medium' },
    { id: 'encode-and-decode-strings', title: 'Encode and Decode Strings', slug: 'encode-and-decode-strings', difficulty: 'medium' },
    { id: 'product-of-array-except-self', title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'medium' },
    { id: 'subarray-sum-equals-k', title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', difficulty: 'medium' },
    { id: 'longest-consecutive-sequence', title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'medium' },
    { id: '4sum-ii', title: '4Sum II', slug: '4sum-ii', difficulty: 'medium' },
    { id: 'sort-characters-by-frequency', title: 'Sort Characters By Frequency', slug: 'sort-characters-by-frequency', difficulty: 'medium' },
  ],
}

// ============================================================================
// File: 02-two-pointers.ts
// ============================================================================

import type { TopicContent } from '../types'

export const twoPointersTopic: TopicContent = {
  id: 'two-pointers',
  title: 'Two Pointers',
  order_index: 2,
  visualizer_id: null,
  summary: 'Replace nested loops by moving bounded indices monotonically across ordered spaces.',
  intuition: `Two pointers replace nested loops when the search space is ordered or can be ordered. Place indices at opposite ends and move the one that cannot produce a better answer, or walk a fast pointer ahead of a slow one to find a middle, a cycle, or a window of length k.

Converging pointers shine on sorted arrays: Two Sum II, 3Sum, and container-with-most-water all shrink the candidate pair set monotonically. The slow/fast (tortoise and hare) variant detects cycles and finds midpoints without extra storage.

The invariant is the point: after each move, every discarded index is provably worse than what remains. If you cannot state that invariant, you probably need sorting first, or a different pattern (sliding window, hash map).

There's a third flavor worth naming separately: **same-direction partitioning**, where both pointers start at 0 and one (a "write" pointer) only advances when the other (a "read" pointer) finds something worth keeping. This is how you do in-place array partitioning — Move Zeroes, Sort Colors, Remove Duplicates from Sorted Array — without a second array.`,
  patternRecognition: `- **Opposite ends converging**: Sorted arrays looking for target pair sums or maximizing area bounded by endpoints. *Likely follow-up: "what if the array isn't sorted?"* — sort first (O(n log n)), which is why this pattern almost always appears alongside "given a **sorted** array" in the prompt.
- **Fast / Slow pointers**: Linked list midpoint, cycle detection (Floyd's algorithm), removing duplicates in-place. *Likely follow-up: "can you find where the cycle starts, not just whether one exists?"* — after the pointers meet, reset one to the head and advance both one step at a time; they meet again at the cycle's start.
- **Same-direction partitioning**: Read/write pointers over one array, in-place. *Likely follow-up: "can you do it in one pass?"* — usually yes; the write pointer trails the read pointer and only jumps forward when a value earns its spot.
- **Two array sweep**: Merging sorted lists or checking subsequences.`,
  workedExample: {
    title: '3Sum (Converging Pointers + Sorting)',
    problem: `Given an integer array \`nums\`, return all unique triplets \`[a, b, c]\` such that \`a + b + c == 0\`. This is Two Sum's converging-pointer pattern nested inside a fixed outer loop — the classic escalation from "pair" to "triplet".

Brute force is O(n³) (three nested loops). Sorting first lets you fix one number and two-pointer-search the rest in O(n), giving O(n²) total — the expected answer in an interview.`,
    code: {
      language: 'python',
      snippet: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []

    for i in range(len(nums)):
        if i > 0 and nums[i] == nums[i - 1]:
            continue  # skip duplicate anchors
        if nums[i] > 0:
            break  # sorted + positive anchor means no triplet can sum to 0

        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1  # skip duplicate left values

    return result`,
    },
    explanation: `Trace on \`nums = [-1, 0, 1, 2, -1, -4]\` → sorted: \`[-4, -1, -1, 0, 1, 2]\`.
1. \`i = 0\` (anchor \`-4\`): left=1, right=5. Sums are all too low or too high across the sweep — no triplet found.
2. \`i = 1\` (anchor \`-1\`): left=2, right=5. \`-1 + -1 + 2 = 0\` → found \`[-1, -1, 2]\`. Continue sweeping: \`-1 + 0 + 1 = 0\` → found \`[-1, 0, 1]\`.
3. \`i = 2\`: \`nums[2] == nums[1]\` (both \`-1\`) → skip to avoid a duplicate anchor.
Result: \`[[-1, -1, 2], [-1, 0, 1]]\`. Time: O(n²), Space: O(1) extra (ignoring the sort and output).`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Pointers start at ends and only move closer, meeting in at most n steps. (3Sum-style problems that nest two pointers inside an outer loop are O(n²) overall.)',
    space: 'O(1)',
    spaceDetail: 'Only a constant number of pointer variables are stored in memory (excluding the output list and any upfront sort).',
  },
  commonMistakes: `1. **Forgetting to sort first**: nearly every converging-pointer proof depends on monotonicity. Skipping the sort (or assuming the input is already sorted when it isn't) silently breaks correctness, not just performance.

2. **Duplicate handling in 3Sum-style problems**: skipping duplicates only at the outer anchor isn't enough — you also need to skip duplicates after recording a match at \`left\`/\`right\`, or you'll emit the same triplet multiple times.

3. **Moving the wrong pointer in Container With Most Water**: the temptation is to move whichever side is "closer to the answer," but the proof only holds if you always move the **shorter** side — moving the taller side can never increase the area, since width only shrinks and height is capped by the shorter wall.

4. **Off-by-one on pointer crossing**: decide up front whether \`left == right\` is a valid state (usually not, for pair-sum problems) and whether pointers are allowed to cross during the same iteration.`,
  gotchas: [
    'Many two-pointer proofs assume a sorted input. Unsorted arrays usually need a sort or a hash map instead.',
    '3Sum: sort, then skip duplicate values at each of the three positions or you emit duplicate triplets.',
    'Palindrome checks: skip non-alphanumeric characters and compare case-insensitively.',
    'Container / trapping rain water: moving the taller side never helps; always advance the shorter pointer.',
    'Off-by-one: decide whether pointers are inclusive and whether they may cross.',
    'Cycle-start detection (Floyd\'s): after the meeting point, reset one pointer to head and step both by 1 — the second meeting point is the cycle entrance, a fact worth memorizing rather than re-deriving live.',
  ],
  problems: [
    { id: 'valid-palindrome', title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'easy' },
    { id: 'two-sum-ii', title: 'Two Sum II', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'medium' },
    { id: 'move-zeroes', title: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'easy' },
    { id: 'remove-duplicates-from-sorted-array', title: 'Remove Duplicates from Sorted Array', slug: 'remove-duplicates-from-sorted-array', difficulty: 'easy' },
    { id: 'sort-colors', title: 'Sort Colors', slug: 'sort-colors', difficulty: 'medium' },
    { id: '3sum', title: '3Sum', slug: '3sum', difficulty: 'medium' },
    { id: 'container-with-most-water', title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'medium' },
    { id: 'trapping-rain-water', title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'hard' },
  ],
}

// ============================================================================
// File: 03-sliding-window.ts
// ============================================================================

import type { TopicContent } from '../types'

export const slidingWindowTopic: TopicContent = {
  id: 'sliding-window',
  title: 'Sliding Window',
  order_index: 3,
  visualizer_id: 'sliding-window',
  summary: 'Maintain a contiguous subarray or substring boundary without resetting indices backward.',
  intuition: `Picture a rubber band stretched over part of an array — that's the window. It has two ends, \`left\` and \`right\`, and it only ever moves forward. \`right\` reaches out to grab new elements; \`left\` lets go of old ones when the window stops being valid. Neither pointer ever walks backward.

That one property — *no backward movement* — is the entire reason sliding window is fast. A brute-force "try every subarray" approach checks all \`n²\` start/end pairs. Sliding window instead asks: as I move \`right\` forward one step at a time, what's the least amount of work I need to do at \`left\` to keep the window valid? Each index is added to the window exactly once (when \`right\` passes it) and removed at most once (when \`left\` passes it). Two passes total, not \`n\` passes — that's how you get from O(n²) down to O(n).`,
  patternRecognition: `You're looking at a sliding-window problem when the question is about a **contiguous** run of elements (not any subset — contiguous matters) and it asks for one of:

- The longest / shortest run satisfying some condition ("longest substring without repeating characters", "minimum window that contains all of...")
- Whether a run of a fixed size k satisfies a condition ("permutation in string", "max sum of any subarray of size k")
- A running aggregate over every window of size k ("sliding window maximum")

The giveaway phrase is usually **"substring"**, **"subarray"**, or **"contiguous"** combined with a size constraint or an optimization ("longest", "shortest", "at most", "exactly").

There are two flavors, and mixing them up is the #1 source of bugs:

- **Fixed-size window** — the window length is given (k). You slide it one step at a time: add the new right element, remove the leaving left element, done. No growing or shrinking logic needed. *Likely follow-up: "what if k can vary at runtime?"* — you're now in variable-size territory.
- **Variable-size window** — you don't know the length in advance. You grow \`right\` until the window becomes *invalid* (or reaches the target), then shrink \`left\` until it's valid again, tracking the best window you've seen along the way. *Likely follow-up: "count the number of valid windows, not just the best one"* — see the \`atMost(K)\` trick below.

**The \`atMost(K)\` trick**: when asked for the count of subarrays with *exactly* K of something (distinct integers, odd numbers, etc.), it's usually easier to write a helper \`atMost(K)\` — count subarrays with **at most** K — and answer \`atMost(K) - atMost(K - 1)\`. Trying to track "exactly K" directly in one window is far more bug-prone than subtracting two "at most" windows.`,
  workedExample: {
    title: 'Longest Substring Without Repeating Characters',
    problem: `Given \`s = "abcabcbb"\`, find the length of the longest substring with no repeated characters. This is the canonical variable-size window.

The state we maintain is a set (or map) of characters currently inside the window, plus \`left\`. We walk \`right\` across the string. Each time \`s[right]\` is already in the window, that's our signal to shrink from the left — but only until the *duplicate* is gone, not the whole window.`,
    code: {
      language: 'python',
      snippet: `def length_of_longest_substring(s: str) -> int:
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

    return best`,
    },
    explanation: `Trace it on \`"abcabcbb"\`: the window grows to \`{a,b,c}\` (length 3) before hitting the second \`a\` at index 3. The while-loop then removes \`s[left]\` (which is \`a\`) and advances \`left\` to 1 — just enough to drop the duplicate, not a full reset. The window becomes \`{b,c,a}\`, still length 3. \`best\` never exceeds 3 for this string, which matches the known answer.

Notice what did *not* happen: we never reset \`left\` back to \`right\`, and we never rescanned characters we'd already removed. That's the O(n) guarantee — \`left\` only moves forward, and each character is added once and removed at most once across the whole run.`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Both pointers move strictly left to right and each visits every index at most once across the entire run.',
    space: 'O(k)',
    spaceDetail: 'Extra space for storing the characters or frequency map of the window of size k.',
  },
  commonMistakes: `The most common bug is updating the window's state *after* deciding whether it's valid, instead of before — you end up validating a window that no longer reflects the count you just checked. A close second: for "longest" problems, people write code that shrinks back to empty and restarts instead of shrinking just enough to become valid again — that silently degrades you back to O(n²). And for fixed-size windows, forgetting to prime the first k elements before you start sliding (i.e. starting the slide loop from index 0 instead of index k) throws off every subsequent comparison.`,
  gotchas: [
    'Update the window\'s state *before* checking validity, or you validate against stale counts.',
    'Longest vs shortest: longest expands then shrinks-just-enough when invalid; minimum window shrinks while still valid and records the best along the way.',
    'Permutation in string is a fixed window equal to the pattern length — no growing/shrinking, just slide.',
    'Sliding window maximum needs a decreasing deque of indices, not a heap, to stay O(n).',
    'Watch empty strings/arrays and windows larger than the input.',
    '"Exactly K" counting problems: don\'t try to track exact-K state directly — compute atMost(K) - atMost(K - 1) instead.',
  ],
  problems: [
    { id: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'easy' },
    { id: 'minimum-size-subarray-sum', title: 'Minimum Size Subarray Sum', slug: 'minimum-size-subarray-sum', difficulty: 'medium' },
    { id: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'medium' },
    { id: 'longest-repeating-character-replacement', title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'medium' },
    { id: 'permutation-in-string', title: 'Permutation in String', slug: 'permutation-in-string', difficulty: 'medium' },
    { id: 'minimum-window-substring', title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'hard' },
    { id: 'sliding-window-maximum', title: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'hard' },
  ],
}

// ============================================================================
// File: 04-stack.ts
// ============================================================================

import type { TopicContent } from '../types'

export const stackTopic: TopicContent = {
  id: 'stack',
  title: 'Stack',
  order_index: 4,
  visualizer_id: null,
  summary: 'LIFO structure for deferred work, matching pairs, and monotonic comparisons.',
  intuition: `A stack is LIFO: the last unmatched opener, the last pending operator, or the last warmer day you have not resolved. Matching parentheses, RPN evaluation, and nested structures all map onto push/pop with a clear "what is still open?" meaning.

Monotonic stacks keep elements in increasing or decreasing order. When a new value breaks the order, you pop and those popped indices have found their next greater/smaller element. Daily Temperatures and many "next greater" problems are this template.

You can also encode extra state on the stack (value plus current min for Min Stack, or a running span). Think of the stack as deferred work that becomes answerable only when a later element arrives.`,
  patternRecognition: `- **Matching / Nested pairs**: Valid parentheses, HTML tag matching, flattening nested iterators. *Likely follow-up: "what if there are multiple bracket types?"* — same push/pop logic, just check the popped opener matches the current closer's type.
- **Monotonic Next Greater / Smaller**: Daily temperatures, largest rectangle in histogram, online stock span. *Likely follow-up: "can you avoid O(n²)?"* — the monotonic stack is precisely the trick that turns the naive "scan forward for each element" into a single O(n) pass, since each index is pushed once and popped once.
- **Evaluation / Parsing**: Reverse Polish Notation (postfix expressions), basic calculator.`,
  workedExample: {
    title: 'Daily Temperatures (Monotonic Decreasing Stack)',
    problem: `Given a list of daily temperatures, return an array where \`answer[i]\` is the number of days you'd have to wait after day \`i\` to get a warmer temperature. If there's no future warmer day, \`answer[i] = 0\`.

Brute force checks every future day for each index — O(n²). A monotonic stack does it in one O(n) pass by deferring the answer for each day until a warmer day actually shows up.`,
    code: {
      language: 'python',
      snippet: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    answer = [0] * len(temperatures)
    stack: list[int] = []  # stores indices, temps at those indices are decreasing

    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index
        stack.append(i)

    return answer`,
    },
    explanation: `Trace on \`[73, 74, 75, 71, 69, 72, 76, 73]\`:
1. \`i=0\` (73): stack empty → push. Stack: \`[0]\`.
2. \`i=1\` (74): \`74 > temperatures[0]=73\` → pop index 0, \`answer[0] = 1 - 0 = 1\`. Push 1. Stack: \`[1]\`.
3. \`i=2\` (75): pop index 1 (\`answer[1] = 1\`). Push 2. Stack: \`[2]\`.
4. \`i=3\` (71): \`71 < 75\` → no pop, just push. Stack: \`[2, 3]\`.
5. \`i=4\` (69): still no pop (69 < 71). Stack: \`[2, 3, 4]\`.
6. \`i=5\` (72): pops index 4 (\`answer[4]=1\`) and index 3 (\`answer[3]=2\`), since 72 beats both 69 and 71. 72 doesn't beat 75, so push. Stack: \`[2, 5]\`.
7. \`i=6\` (76): pops index 5 (\`answer[5]=1\`) and index 2 (\`answer[2]=4\`). Push. Stack: \`[6]\`.
8. \`i=7\` (73): \`73 < 76\` → no pop, push. Stack: \`[6, 7]\`.
Remaining stack indices (6, 7) never find a warmer day, so their \`answer\` stays 0. Final: \`[1, 1, 4, 2, 1, 1, 0, 0]\`. Every index is pushed once and popped at most once → O(n) total, not O(n²).`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Each element is pushed once and popped at most once.',
    space: 'O(n)',
    spaceDetail: 'Stack stores up to n elements in the worst case (e.g. all openers or strictly decreasing array).',
  },
  commonMistakes: `1. **Storing values instead of indices in monotonic stacks**: if the question wants a *distance* or *count* (like Daily Temperatures), you need the index to compute \`i - prev_index\`. Storing raw values loses that information.

2. **Popping before recording the answer**: for the popped element, compute and store its answer using the *current* index before discarding it — reversing the order loses the very information the pop was supposed to reveal.

3. **Assuming the stack empties by the end**: leftover items on the stack when you finish iterating are exactly the ones with *no* valid answer (no warmer day, no matching closer). Don't treat a non-empty stack at the end as a bug — for Valid Parentheses it *is* one (unmatched openers), but for Daily Temperatures it's expected and those indices just keep their default 0.

4. **Confusing "next greater" direction**: decide up front whether you're scanning left-to-right (deferred/monotonic-stack style, as above) or right-to-left (direct lookup style, where the stack holds *already-resolved* next-greater candidates as you go backward). Both work, but mixing the two mid-solution causes off-by-one bugs.`,
  gotchas: [
    'Always define the empty-stack case: extra closers, leftover openers, or no warmer day.',
    'Monotonic stacks store indices more often than values so you can compute distances.',
    'Generate Parentheses is backtracking with a stack-shaped invariant (open >= close, open <= n).',
    'Car Fleet: sort by position, then a stack of times-to-target; a slower car in front swallows faster ones behind.',
    'Do not pop before recording the answer for the popped index.',
  ],
  problems: [
    { id: 'valid-parentheses', title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'easy' },
    { id: 'min-stack', title: 'Min Stack', slug: 'min-stack', difficulty: 'medium' },
    { id: 'evaluate-reverse-polish-notation', title: 'Evaluate Reverse Polish Notation', slug: 'evaluate-reverse-polish-notation', difficulty: 'medium' },
    { id: 'generate-parentheses', title: 'Generate Parentheses', slug: 'generate-parentheses', difficulty: 'medium' },
    { id: 'daily-temperatures', title: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'medium' },
    { id: 'online-stock-span', title: 'Online Stock Span', slug: 'online-stock-span', difficulty: 'medium' },
    { id: 'car-fleet', title: 'Car Fleet', slug: 'car-fleet', difficulty: 'medium' },
    { id: 'largest-rectangle-in-histogram', title: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'hard' },
  ],
}

// ============================================================================
// File: 05-binary-search.ts
// ============================================================================

import type { TopicContent } from '../types'

export const binarySearchTopic: TopicContent = {
  id: 'binary-search',
  title: 'Binary Search',
  order_index: 5,
  visualizer_id: null,
  summary: 'Halve monotonic search spaces in logarithmic time, over indices or answer ranges.',
  intuition: `Binary search discards half of a sorted search space each step. The textbook form finds a target in a sorted array. The interview form searches over an *answer range*: capacity, time, or an index where a predicate flips from false to true.

The loop invariant is everything: decide whether \`mid\` is still feasible, then move \`lo\` or \`hi\` so the feasible region never loses the answer. Answer-range search usually looks like \`while lo < hi\` with \`hi = mid\` or \`lo = mid + 1\`.

Rotated arrays still have a sorted half; identify which half is sorted, then decide whether the target lives there. 2D matrix search treats the matrix as a virtual 1D sorted array when rows are ordered.

The mental model that unifies all of this: binary search doesn't require a sorted *array* — it requires a monotonic *predicate*. If you can write a function \`feasible(x) -> bool\` that is \`false\` for a while and then \`true\` forever after (or vice versa), you can binary search on \`x\` even if no array is involved at all.`,
  patternRecognition: `- **Sorted Arrays**: Direct target lookup, first/last occurrence, insertion point.
- **Search on Answer Space**: "Find the minimum capacity to ship in D days", "koko eating bananas", "split array largest sum". *Likely follow-up: "prove the predicate is monotonic"* — interviewers often want you to say out loud why "can I finish in D days at capacity X" stays true for all capacities greater than X, since that monotonicity is what justifies binary search at all.
- **Partially Sorted / Rotated**: Peak element, search in rotated sorted array, find minimum in rotated sorted array. *Likely follow-up: "what if there are duplicates?"* — with duplicates, \`nums[mid] == nums[lo] == nums[hi]\` can make both halves look unsorted, forcing a fallback to shrinking one bound by 1 (worst case O(n)).`,
  workedExample: {
    title: 'Koko Eating Bananas (Binary Search on the Answer Space)',
    problem: `Koko has \`piles\` of bananas and \`h\` hours to eat them all. She picks a speed \`k\` (bananas/hour) and eats from one pile per hour; if a pile has fewer than \`k\` left, she finishes it and stops that hour. Find the minimum integer \`k\` such that she can finish within \`h\` hours.

There's no array to search *in* — the search space is the possible values of \`k\`, from 1 to \`max(piles)\`. The predicate \`feasible(k)\` = "can Koko finish within h hours at speed k?" is monotonic: if she can finish at speed k, she can also finish at any speed greater than k. That monotonicity is exactly what makes binary search valid here.`,
    code: {
      language: 'python',
      snippet: `import math

def min_eating_speed(piles: list[int], h: int) -> int:
    def hours_needed(k: int) -> int:
        return sum(math.ceil(pile / k) for pile in piles)

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if hours_needed(mid) <= h:
            hi = mid       # mid is feasible; try to go slower
        else:
            lo = mid + 1   # mid too slow; must go faster

    return lo`,
    },
    explanation: `Trace on \`piles = [3, 6, 7, 11], h = 8\`. Search space for k: \`[1, 11]\`.
1. \`lo=1, hi=11\`, \`mid=6\`. \`hours_needed(6) = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6) = 1+1+2+2 = 6 <= 8\` → feasible, so \`hi = 6\`.
2. \`lo=1, hi=6\`, \`mid=3\`. \`hours_needed(3) = 1+2+3+4 = 10 > 8\` → infeasible, so \`lo = 4\`.
3. \`lo=4, hi=6\`, \`mid=5\`. \`hours_needed(5) = 1+2+2+3 = 8 <= 8\` → feasible, so \`hi = 5\`.
4. \`lo=4, hi=5\`, \`mid=4\`. \`hours_needed(4) = 1+2+2+3 = 8 <= 8\` → feasible, so \`hi = 4\`.
5. \`lo == hi == 4\` → loop ends. Answer: \`k = 4\`.
Notice the pattern: \`hi = mid\` (never \`mid - 1\`) because \`mid\` itself might be the answer and we must not discard it. This is the standard template for "find the minimum value where a predicate becomes true."`,
  },
  complexity: {
    time: 'O(log n)',
    timeDetail: 'The search range is halved on each comparison step. For answer-space search, replace n with the size of the answer range, and account for the cost of evaluating the predicate at each step (e.g. Koko Eating Bananas is O(n log m), where m is the max pile size, since each predicate check scans all piles).',
    space: 'O(1)',
    spaceDetail: 'Iterative binary search uses only pointers (lo, hi, mid).',
  },
  commonMistakes: `1. **Infinite loops from the wrong bound update**: using \`while lo < hi\` with \`hi = mid\` requires \`mid = lo + (hi - lo) // 2\` (floor division, biased low). If you instead need \`lo = mid\` to shrink toward the answer, you must bias \`mid\` toward the ceiling (\`mid = lo + (hi - lo + 1) // 2\`) or the loop can get stuck with \`lo\` never advancing.

2. **Mixing inclusive and exclusive bound conventions mid-solution**: pick one convention (\`[lo, hi]\` inclusive with \`while lo <= hi\`, or \`[lo, hi)\` with \`while lo < hi\`) and stay consistent. Combining \`hi = mid\` from one convention with \`hi = mid - 1\` from the other is the single most common binary search bug.

3. **Not proving monotonicity before coding**: for answer-space problems, jumping straight to code without first stating "if capacity X works, does X+1 also work?" often leads to binary searching over a predicate that isn't actually monotonic — which silently produces a wrong (not just slow) answer.

4. **Integer overflow / bad midpoint math**: even though less of an issue in Python, always default to \`lo + (hi - lo) // 2\` over \`(lo + hi) // 2\` out of habit — interviewers in Java/C++ contexts will notice the difference.`,
  gotchas: [
    'Inclusive vs exclusive bounds: mixing `hi = mid` with `hi = mid - 1` is the classic off-by-one.',
    'Overflow: use `lo + Math.floor((hi - lo) / 2)` instead of `(lo + hi) / 2`.',
    'Duplicates in rotated arrays can make both halves look unsorted; you may need to shrink one side by one.',
    'Time-based store: binary search timestamps per key, not a global timeline.',
    'Median of two sorted arrays is binary search on partition index, not a merge.',
    'For "minimize the max/find smallest feasible value" problems, use `hi = mid`; for "maximize the min/find largest feasible value" problems, use `lo = mid` with a ceiling-biased midpoint — mixing these up causes infinite loops.',
  ],
  problems: [
    { id: 'binary-search', title: 'Binary Search', slug: 'binary-search', difficulty: 'easy' },
    { id: 'search-a-2d-matrix', title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'medium' },
    { id: 'koko-eating-bananas', title: 'Koko Eating Bananas', slug: 'koko-eating-bananas', difficulty: 'medium' },
    { id: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'medium' },
    { id: 'find-minimum-in-rotated-sorted-array', title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'medium' },
    { id: 'find-peak-element', title: 'Find Peak Element', slug: 'find-peak-element', difficulty: 'medium' },
    { id: 'capacity-to-ship-packages-within-d-days', title: 'Capacity To Ship Packages Within D Days', slug: 'capacity-to-ship-packages-within-d-days', difficulty: 'medium' },
    { id: 'time-based-key-value-store', title: 'Time Based Key-Value Store', slug: 'time-based-key-value-store', difficulty: 'medium' },
    { id: 'split-array-largest-sum', title: 'Split Array Largest Sum', slug: 'split-array-largest-sum', difficulty: 'hard' },
    { id: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'hard' },
  ],
}

// ============================================================================
// File: 06-linked-lists.ts
// ============================================================================

import type { TopicContent } from '../types'

export const linkedListsTopic: TopicContent = {
  id: 'linked-lists',
  title: 'Linked Lists',
  order_index: 6,
  visualizer_id: null,
  summary: 'Master pointer manipulation, dummy sentinel nodes, in-place reversals, and fast/slow pointer cycle detection.',
  intuition: `### 1. The Core Mental Model: Pointer Rewiring

Unlike arrays where elements sit contiguously in RAM, a **Linked List** consists of individual nodes scattered across memory, connected solely by \`next\` (and optionally \`prev\`) references.

- **No Indexing (\`O(n)\`)**: You cannot jump to \`node[5]\`. You must walk node-by-node from the \`head\`.
- **Instant Splice & Insert (\`O(1)\`)**: Once you have a reference to a node, inserting or deleting adjacent nodes takes **\`O(1)\` time** without shifting any other elements.

The secret to mastering linked list interview problems is treating every problem as a **pointer dance**: always preserve references before mutating them, and use sentinel nodes to avoid messy edge cases.

---

### 2. The Three Essential Pointer Techniques

#### A. The Dummy / Sentinel Node Pattern
Edge cases in linked lists almost always happen at the **head** (e.g. deleting the head, inserting before the head, or creating a new merged list).

By creating a \`dummy = ListNode(0, head)\` and operating through \`dummy.next\`, the head is treated like any middle node. At the end, simply \`return dummy.next\`.

#### B. The 3-Pointer In-Place Reversal Walk
To reverse a linked list in \`O(1)\` extra space, you need three pointers: \`prev\`, \`curr\`, and a temporary \`next_node\`:
1. Save the next node: \`next_node = curr.next\`
2. Reverse the pointer: \`curr.next = prev\`
3. Advance \`prev\` to \`curr\`: \`prev = curr\`
4. Advance \`curr\` to \`next_node\`: \`curr = next_node\`

#### C. Fast & Slow Pointers (Floyd's Tortoise & Hare)
- **Finding the Midpoint**: \`slow\` moves 1 step, \`fast\` moves 2 steps. When \`fast\` reaches the end, \`slow\` is at the exact middle.
- **Cycle Detection**: If a cycle exists, \`fast\` will eventually lap \`slow\` and they will meet inside the loop.
- **Finding Cycle Entrance**: After \`slow\` and \`fast\` meet, reset \`slow\` to \`head\` and advance both 1 step at a time. The point where they collide again is the exact start of the cycle.

---

### 3. Comparison: Arrays vs. Linked Lists

| Property | Array / Dynamic Array | Singly Linked List | Doubly Linked List |
| :--- | :--- | :--- | :--- |
| **Random Access by Index** | \`O(1)\` | \`O(n)\` | \`O(n)\` |
| **Insert / Delete at Head** | \`O(n)\` (shifts all) | \`O(1)\` | \`O(1)\` |
| **Insert / Delete at Known Node** | \`O(n)\` | \`O(1)\` (needs prev) | \`O(1)\` (has prev & next) |
| **Memory Overhead** | Low (values only) | Medium (value + 1 pointer) | High (value + 2 pointers) |
| **Cache Locality** | Excellent | Poor (pointer chasing) | Poor |`,
  patternRecognition: `### The 5 Essential Interview Patterns

#### Pattern 1: In-Place Reversal (3-Pointer Walk)
- **Giveaway**: *"Reverse a linked list"*, *"Reverse nodes in k-group"*, *"Reverse between position M and N"*.
- **Strategy**: Maintain \`prev = None\`, \`curr = head\`. Save \`curr.next\`, redirect pointer to \`prev\`, step both forward.
- **Top Problems**: *Reverse Linked List*, *Reverse Linked List II*, *Reverse Nodes in k-Group*.
- **Likely follow-up**: *"Can you reverse in k-sized chunks in O(1) space?"* — count $k$ nodes ahead first; if fewer than $k$ remain, leave them as-is, else reverse and connect to the next segment.

#### Pattern 2: Fast & Slow Pointers (Cycle & Midpoint)
- **Giveaway**: *"Find if list has a cycle"*, *"Find the middle node"*, *"Check if list is a palindrome"*.
- **Strategy**: \`slow = head\`, \`fast = head\`. In each iteration: \`slow = slow.next\`, \`fast = fast.next.next\`.
- **Top Problems**: *Linked List Cycle*, *Linked List Cycle II*, *Middle of the Linked List*.
- **Likely follow-up**: *"Prove why slow and fast must meet if there is a cycle"* — fast gains 1 node on slow per step ($2 - 1 = 1$), so the gap between them shrinks by 1 until collision in at most $C$ steps (where $C$ is cycle length).

#### Pattern 3: Dummy Head for List Merging & Deletion
- **Giveaway**: *"Merge two sorted lists"*, *"Remove Nth node from end"*, *"Partition list"*, *"Add two numbers"*.
- **Strategy**: Initialize \`dummy = ListNode(0)\`, maintain a \`tail\` pointer, and attach nodes via \`tail.next = chosen_node\`.
- **Top Problems**: *Merge Two Sorted Lists*, *Remove Nth Node From End of List*, *Add Two Numbers*.
- **Likely follow-up**: *"What if the node to delete is the head?"* — dummy node ensures \`dummy.next\` always safely tracks the true head.

#### Pattern 4: Compound Workflow (Split ➔ Reverse ➔ Weave)
- **Giveaway**: *"Reorder list"*, *"Check if linked list is a palindrome"*.
- **Strategy**: Break into 3 sub-problems: (1) find middle with slow/fast, (2) sever and reverse the second half, (3) weave the two halves together alternating pointers.
- **Top Problems**: *Reorder List*, *Palindrome Linked List*.
- **Likely follow-up**: *"Can you do it without extra memory?"* — this 3-step pipeline achieves $O(n)$ time and strictly $O(1)$ space.

#### Pattern 5: K-Way Merge with Min-Heap
- **Giveaway**: *"Merge K sorted linked lists"*.
- **Strategy**: Push the head of each list into a Min-Heap of size $K$ \`(node.val, list_index, node)\`. Pop the smallest, attach to result, and push its \`.next\` into the heap.
- **Top Problems**: *Merge K Sorted Lists*.
- **Likely follow-up**: *"Why is Min-Heap better than pairwise merging?"* — heap is $O(N \log K)$ vs pairwise $O(N \cdot K)$, where $N$ is total nodes.`,
  workedExample: {
    title: 'Reorder List (Split + In-Place Reverse + Weave)',
    problem: `Given the head of a singly linked list \`L0 → L1 → … → Ln-1 → Ln\`, reorder it in-place to:
\`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …\`

- **Brute Force**: Copy all nodes to an array/list and re-link with two pointers → \`O(n)\` time, \`O(n)\` extra memory.
- **Optimal In-Place**: 
  1. Find middle with slow/fast pointers.
  2. Sever the list and reverse the 2nd half in-place.
  3. Merge (weave) the two halves together.
  → \`O(n)\` time, \`O(1)\` extra memory.`,
    code: {
      language: 'python',
      snippet: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorder_list(head: ListNode | None) -> None:
    if not head or not head.next:
        return

    # Step 1: Find middle using slow/fast pointers
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Sever and reverse second half
    second = slow.next
    slow.next = None  # Crucial: sever first half from second half
    prev = None
    curr = second

    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp

    # Step 3: Weave first half (head) and reversed second half (prev)
    first, second = head, prev
    while second:
        temp1, temp2 = first.next, second.next
        first.next = second
        second.next = temp1
        first, second = temp1, temp2`,
    },
    explanation: `Trace on [1 -> 2 -> 3 -> 4 -> 5]:
1. Find Mid: slow stops at node 3.
2. Sever & Reverse:
   - First half: 1 -> 2 -> 3 -> None
   - Second half reversed: 5 -> 4 -> None
3. Weave:
   - Connect 1 -> 5 -> 2
   - Connect 2 -> 4 -> 3
   - Result: 1 -> 5 -> 2 -> 4 -> 3 -> None.
Time: O(n), Space: O(1) in-place.`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Traversal, reversal, and merge passes each visit every node a constant number of times (at most 2n visits total).',
    space: 'O(1)',
    spaceDetail: 'Only a constant number of pointer variables (prev, curr, slow, fast, temp) are maintained.',
  },
  commonMistakes: `1. **Losing the \`next\` Reference Before Pointer Rewrite**:
   Writing \`curr.next = prev\` *before* caching \`next_node = curr.next\` instantly severs your access to the rest of the list, losing all remaining nodes.

2. **Forgetting to Sever the Midpoint Tail**:
   When splitting a list in two (like in Merge Sort or Reorder List), failing to execute \`slow.next = None\` leaves a cycle or an infinite traversal loop in the first half.

3. **Returning the Old Head After Reversal**:
   After reversing a list, \`curr\` becomes \`None\` and the original \`head\` is now the tail. The new head is \`prev\`. Returning \`head\` returns a single tail node pointing to \`None\`.

4. **Off-by-One in Remove Nth Node From End**:
   To delete the $N$-th node from end, your pointer must land on the **$(N+1)$-th node from the end** (the node *before* the target) so you can do \`node.next = node.next.next\`. Use a dummy node to guarantee a valid preceding node even when deleting the head.

5. **Infinite Loop in ListNode Comparisons in Heaps**:
   In Python, if two nodes have identical \`.val\` in \`heapq.heappush(heap, (node.val, node))\`, Python tries to compare \`node < node\` which raises a \`TypeError\`. Always push a tiebreaker: \`(node.val, index, node)\`.`,
  gotchas: [
    'Always handle empty lists (`head is None`) and single-node lists (`head.next is None`) as early guard clauses.',
    'Use dummy heads to eliminate special-case code when deleting or inserting at the head.',
    'Cycle entrance formula: after fast and slow meet, advance slow from head and fast from meet point at 1 step/sec; collision = entrance.',
    'Two pointers offset: advance lead pointer by n steps, then walk lead and lag together until lead hits the end.',
    'Copy List with Random Pointer: can be solved in O(1) extra space by interleaving clone nodes (A -> A\' -> B -> B\') before separating.',
  ],
  problems: [
    { id: 'reverse-linked-list', title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'easy' },
    { id: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'easy' },
    { id: 'linked-list-cycle', title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'easy' },
    { id: 'middle-of-the-linked-list', title: 'Middle of the Linked List', slug: 'middle-of-the-linked-list', difficulty: 'easy' },
    { id: 'palindrome-linked-list', title: 'Palindrome Linked List', slug: 'palindrome-linked-list', difficulty: 'easy' },
    { id: 'linked-list-cycle-ii', title: 'Linked List Cycle II', slug: 'linked-list-cycle-ii', difficulty: 'medium' },
    { id: 'reverse-linked-list-ii', title: 'Reverse Linked List II', slug: 'reverse-linked-list-ii', difficulty: 'medium' },
    { id: 'reorder-list', title: 'Reorder List', slug: 'reorder-list', difficulty: 'medium' },
    { id: 'remove-nth-node-from-end-of-list', title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'medium' },
    { id: 'copy-list-with-random-pointer', title: 'Copy List with Random Pointer', slug: 'copy-list-with-random-pointer', difficulty: 'medium' },
    { id: 'add-two-numbers', title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium' },
    { id: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'hard' },
    { id: 'reverse-nodes-in-k-group', title: 'Reverse Nodes in k-Group', slug: 'reverse-nodes-in-k-group', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 07-trees.ts
// ============================================================================

import type { TopicContent } from '../types'

export const treesTopic: TopicContent = {
  id: 'trees',
  title: 'Trees',
  order_index: 7,
  visualizer_id: null,
  summary: 'Master hierarchical recursion, DFS traversals (Pre/In/Post), BFS level-order queues, and BST boundary invariants.',
  intuition: `### 1. The Core Mental Model: Subtree Recursion

A **Binary Tree** is a recursive data structure: every node is the root of its own left and right subtrees. 

Almost every tree problem is solved by asking:
> *"If I assume my left and right children have already solved the problem for their subtrees, how do I combine their answers at the current node?"*

---

### 2. The Four Traversal Archetypes

1. **Pre-Order (Node ➔ Left ➔ Right)**: Process parent before children. Used for cloning, serialization, and top-down path accumulation.
2. **In-Order (Left ➔ Node ➔ Right)**: Traverses a **Binary Search Tree (BST) in strictly sorted ascending order**.
3. **Post-Order (Left ➔ Right ➔ Node)**: Process children first, then compute parent. **The foundation of bottom-up aggregation** (height, diameter, subtree sums, and Maximum Path Sum).
4. **Level-Order (BFS with Queue)**: Explores node-by-node, level-by-level. The natural way to measure shortest distance from root, right/left side views, and zigzag orders.

---

### 3. Comparison: DFS vs. BFS in Trees

| Dimension | Depth-First Search (DFS) | Breadth-First Search (BFS) |
| :--- | :--- | :--- |
| **Data Structure** | Call Stack (Recursion) or explicit \`stack\` | FIFO \`collections.deque\` queue |
| **Memory Consumption** | \`O(h)\` where $h$ is tree height | \`O(w)\` where $w$ is max level width |
| **Best For** | Subtree aggregation, path sums, validation | Level-by-level views, shallowest leaf, shortest path |
| **Worst-Case Space** | Skewed tree (linked list): \`O(n)\` | Perfect binary tree: \`O(n/2) = O(n)\` |`,
  patternRecognition: `### The 5 Essential Interview Patterns

#### Pattern 1: Bottom-Up Post-Order DFS (Subtree Aggregation)
- **Giveaway**: *"Find the diameter of a tree"*, *"Maximum path sum"*, *"Check if tree is height-balanced"*.
- **Strategy**: Helper function returns the depth/gain of the subtree to its parent, while updating a global/nonlocal maximum variable across the current node.
- **Top Problems**: *Maximum Depth of Binary Tree*, *Diameter of Binary Tree*, *Binary Tree Maximum Path Sum*.
- **Likely follow-up**: *"What if node values can be negative?"* — prune negative subtree gains with \`max(0, left_gain)\` so negative branches are simply ignored.

#### Pattern 2: Level-Order BFS with Queue
- **Giveaway**: *"Level order traversal"*, *"Right side view"*, *"Zigzag traversal"*, *"Minimum depth"*.
- **Strategy**: Maintain a queue. In each iteration, snapshot \`level_size = len(queue)\` and loop \`level_size\` times to process the entire current level in one batch.
- **Top Problems**: *Binary Tree Level Order Traversal*, *Binary Tree Right Side View*, *Binary Tree Zigzag Level Order Traversal*.
- **Likely follow-up**: *"How to save memory if only the rightmost node is needed?"* — take \`queue[-1]\` before draining the level.

#### Pattern 3: BST Boundary Validation (Live Invariant Window)
- **Giveaway**: *"Validate binary search tree"*, *"Kth smallest in BST"*, *"Convert sorted array to BST"*.
- **Strategy**: Pass valid range \`(low, high)\` down the call stack. For left child, range becomes \`(low, node.val)\`; for right child, \`(node.val, high)\`.
- **Top Problems**: *Validate Binary Search Tree*, *Kth Smallest Element in a BST*.
- **Likely follow-up**: *"Why does checking \`node.left.val < node.val < node.right.val\` locally fail?"* — a node deep in the left subtree could be larger than the root ancestor; bounds must be inherited globally.

#### Pattern 4: Lowest Common Ancestor (LCA)
- **Giveaway**: *"Lowest common ancestor of two nodes"*.
- **Strategy**:
  - **In a BST**: If both nodes are smaller than root, go left; if both greater, go right; if they split (or root matches one), root is the LCA!
  - **In a General Binary Tree**: Post-order DFS. If left and right subtrees both return non-null, root is LCA.
- **Top Problems**: *Lowest Common Ancestor of a BST*, *Lowest Common Ancestor of a Binary Tree*.
- **Likely follow-up**: *"What if one or both nodes are not guaranteed to exist in the tree?"* — count matches explicitly before returning.

#### Pattern 5: Tree Reconstruction from Traversal Pairs
- **Giveaway**: *"Construct binary tree from preorder and inorder traversal"*.
- **Strategy**: Preorder's first element is always the \`root\`. Look up that root in an Inorder hash map to split elements into left and right subtree sizes, then recurse.
- **Top Problems**: *Construct Binary Tree from Preorder and Inorder Traversal*.
- **Likely follow-up**: *"Can you do it in O(n) time?"* — pre-index Inorder indices in a hash map to look up root positions in $O(1)$ instead of scanning.`,
  workedExample: {
    title: 'Validate Binary Search Tree (Global Boundary Invariant)',
    problem: `Given the root of a binary tree, determine if it is a valid Binary Search Tree (BST).
A valid BST requires that **all** nodes in a left subtree are strictly less than the node, and **all** nodes in a right subtree are strictly greater than the node.

- **Naive / Buggy**: \`left.val < node.val < right.val\` only checks immediate children, failing when a left subtree contains a large value (e.g. \`[5, 4, 6, null, null, 3, 7]\` where 3 is in 6's left subtree, violating root 5).
- **Optimal (Global Invariant)**: Pass down a valid range \`(low, high)\` initialized to \`(-inf, +inf)\`.`,
    code: {
      language: 'python',
      snippet: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode | None) -> bool:
    def validate(node: TreeNode | None, low: float, high: float) -> bool:
        if not node:
            return True

        # Current node value must strictly lie between low and high
        if not (low < node.val < high):
            return False

        # Left subtree must be strictly < node.val; right subtree must be strictly > node.val
        return (validate(node.left, low, node.val) and 
                validate(node.right, node.val, high))

    return validate(root, float('-inf'), float('inf'))`,
    },
    explanation: `Trace on [5, 1, 4, null, null, 3, 6]:
1. Root 5: validate(5, -inf, +inf) -> Valid.
2. Left child 1: validate(1, -inf, 5) -> Valid.
3. Right child 4: validate(4, 5, +inf) -> FAILS! 4 is not > 5.
Returns False immediately.
Time: O(n) — visits every node once.
Space: O(h) — call stack proportional to height.`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Every node is visited at most once or twice across all standard tree traversals.',
    space: 'O(h)',
    spaceDetail: 'Recursion stack requires memory proportional to tree height h: O(log n) for a balanced tree, O(n) for a completely skewed linked-list tree.',
  },
  commonMistakes: `1. **Local vs. Global Invariant in BSTs**:
   Only checking \`node.left.val < node.val < node.right.val\` allows invalid trees where a descendant violates an ancestor constraint. You must pass down \`(low, high)\` boundaries.

2. **Allowing Duplicate Values in Strict BSTs**:
   LeetCode standard BSTs require strict inequality (\`low < node.val < high\`). Writing \`<=\` allows duplicates and fails test cases.

3. **Dynamic Queue Mutation in BFS**:
   Iterating \`for _ in range(len(queue))\` is correct in Python because \`len(queue)\` evaluates once at loop start. In languages like JS or C++, calling \`queue.length\` inside the loop condition causes an infinite loop as you push children. Always snapshot the level size!

4. **Slicing Arrays in Tree Reconstruction ($O(n^2)$ Trap)**:
   In *Construct from Preorder and Inorder*, doing \`inorder[:mid]\` and \`inorder[mid+1:]\` copies arrays at every recursion level ($O(n^2)$ time). Instead, build a hash map \`{val: index}\` upfront and pass boundary index pointers \`(in_start, in_end)\` for $O(n)$ total time.

5. **Not Ignoring Negative Subtree Gains in Max Path Sum**:
   In *Binary Tree Maximum Path Sum*, if a subtree returns a negative sum, adding it to your path reduces total sum. You must wrap child gains in \`max(0, gain)\`.`,
  gotchas: [
    'Base cases: always handle `if not root:` cleanly as the first line of your recursive helper.',
    'In-order traversal of a valid BST is strictly monotonically increasing with no duplicates.',
    'LCA in BST is O(h) with no recursion overhead: if both p and q are smaller than root, go left; if both greater, go right; else root is the split point.',
    'Diameter of binary tree: the longest path does not need to pass through the root node.',
    'Serialize / Deserialize: use preorder with null markers (e.g. "X") for clean O(n) reconstruction.',
  ],
  problems: [
    { id: 'invert-binary-tree', title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'easy' },
    { id: 'maximum-depth-of-binary-tree', title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'easy' },
    { id: 'diameter-of-binary-tree', title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'easy' },
    { id: 'balanced-binary-tree', title: 'Balanced Binary Tree', slug: 'balanced-binary-tree', difficulty: 'easy' },
    { id: 'same-tree', title: 'Same Tree', slug: 'same-tree', difficulty: 'easy' },
    { id: 'subtree-of-another-tree', title: 'Subtree of Another Tree', slug: 'subtree-of-another-tree', difficulty: 'easy' },
    { id: 'lowest-common-ancestor-of-a-bst', title: 'Lowest Common Ancestor of a BST', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'medium' },
    { id: 'lowest-common-ancestor-of-a-binary-tree', title: 'Lowest Common Ancestor of a Binary Tree', slug: 'lowest-common-ancestor-of-a-binary-tree', difficulty: 'medium' },
    { id: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'medium' },
    { id: 'binary-tree-zigzag-level-order-traversal', title: 'Binary Tree Zigzag Level Order Traversal', slug: 'binary-tree-zigzag-level-order-traversal', difficulty: 'medium' },
    { id: 'binary-tree-right-side-view', title: 'Binary Tree Right Side View', slug: 'binary-tree-right-side-view', difficulty: 'medium' },
    { id: 'validate-binary-search-tree', title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'medium' },
    { id: 'kth-smallest-element-in-a-bst', title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'medium' },
    { id: 'construct-binary-tree-from-preorder-and-inorder', title: 'Construct Binary Tree from Preorder and Inorder', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'medium' },
    { id: 'binary-tree-maximum-path-sum', title: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-maximum-path-sum', difficulty: 'hard' },
    { id: 'serialize-and-deserialize-binary-tree', title: 'Serialize and Deserialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 08-tries.ts
// ============================================================================

import type { TopicContent } from '../types'

export const triesTopic: TopicContent = {
  id: 'tries',
  title: 'Tries (Prefix Trees)',
  order_index: 8,
  visualizer_id: null,
  summary: 'Tree-based string index for instant O(L) prefix matching, auto-complete, and multi-word grid search pruning.',
  intuition: `### 1. The Core Mental Model: Character-by-Character Paths

A **Trie** (derived from re**trie**val, pronounced "try") is a multi-way search tree designed for strings.

Instead of storing entire words in separate buckets like a Hash Set, words that share common beginnings **share the exact same path of nodes**:

\`\`\`
          (root)
          /    \\
        'a'    'b'
        /        \\
      'p'        'a'
      /            \\
    'p' (is_end)   't' (is_end)
    /
  'l'
  /
'e' (is_end)
\`\`\`

- Path for \`"app"\`: \`root ➔ 'a' ➔ 'p' ➔ 'p'\` (marked \`is_end = True\`)
- Path for \`"apple"\`: continues down to \`'l' ➔ 'e'\` (marked \`is_end = True\`)

---

### 2. Why Use a Trie Over a Hash Set?

A Hash Set can check *"Does the exact word 'apple' exist?"* in \`O(L)\` time. However:
1. **Prefix Queries**: A Hash Set cannot answer *"Does any word begin with 'app'?"* without scanning all words. A Trie answers prefix queries in **\`O(L)\` time**, where $L$ is prefix length, completely independent of how many millions of words exist in the dictionary.
2. **Multi-Word Search Pruning**: When searching for words in a 2D Boggle grid (*Word Search II*), a Trie lets you abandon dead paths the instant a prefix has no matching child, avoiding exponential backtracking work.

---

### 3. Comparison: Hash Set vs. Trie

| Dimension | Hash Set (\`set[str]\`) | Trie (\`TrieNode\`) |
| :--- | :--- | :--- |
| **Exact Word Lookup** | \`O(L)\` average | \`O(L)\` guaranteed |
| **Prefix Matching (\`startsWith\`)** | \`O(N × L)\` (must scan all) | \`O(L)\` instant traversal |
| **Autocomplete / Common Prefix** | Slow & memory intensive | Natural tree traversal |
| **Memory Usage** | \`O(N × L)\` | \`O(alphabet × N × L)\` (shared prefixes reduce practical size) |`,
  patternRecognition: `### The 3 Essential Interview Patterns

#### Pattern 1: Standard Prefix Storage & Autocomplete
- **Giveaway**: *"Implement prefix tree"*, *"Check if any word starts with prefix"*, *"Autocomplete suggestions"*.
- **Strategy**: Define \`TrieNode\` with \`children = {}\` (or \`[None] * 26\`) and boolean \`is_end = False\`. Walk node-by-node.
- **Top Problems**: *Implement Trie (Prefix Tree)*, *Design Add and Search Words Data Structure*.
- **Likely follow-up**: *"How do you handle '.' wildcards (matches any character)?"* — when encountering \`'.'\`, branch across all active \`node.children.values()\` with DFS.

#### Pattern 2: Backtracking Grid Search with Trie Pruning (Word Search II)
- **Giveaway**: *"Find all words from dictionary present in a 2D board of letters"*.
- **Strategy**: Insert all dictionary words into a Trie. Run DFS from every grid cell. If current character is not in \`node.children\`, **prune the branch immediately**.
- **Top Problems**: *Word Search II*.
- **Likely follow-up**: *"How to avoid duplicate found words?"* — store \`node.word = word\` directly on the leaf node, and set \`node.word = None\` after recording it.

#### Pattern 3: Bitwise Binary Trie for Maximum XOR
- **Giveaway**: *"Find maximum XOR of any two numbers in an array"*.
- **Strategy**: Insert binary representations of numbers (32 bits) into a binary Trie (where children are only \`0\` and \`1\`). For each number, greedily choose the opposite bit (\`1 ^ bit\`) at each level to maximize XOR.
- **Top Problems**: *Maximum XOR of Two Numbers in an Array*.
- **Likely follow-up**: *"What is the time complexity?"* — strictly $O(32 \cdot N) = O(N)$ linear time.`,
  workedExample: {
    title: 'Implement Trie (Prefix Tree)',
    problem: `Design a data structure that supports adding words and searching for full words and prefixes in O(L) time.

Operations to implement:
- \`insert(word: str) -> None\`: Inserts word into the trie.
- \`search(word: str) -> bool\`: Returns True if word is in trie, False otherwise.
- \`startsWith(prefix: str) -> bool\`: Returns True if there is any word with the given prefix.`,
    code: {
      language: 'python',
      snippet: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end_of_word: bool = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end_of_word = True

    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.is_end_of_word

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return True`,
    },
    explanation: `Trace:
1. insert("apple"): Creates path root -> 'a' -> 'p' -> 'p' -> 'l' -> 'e', marks 'e' node with is_end_of_word = True.
2. search("app"): Traverses to 'p' node. 'p' node exists, but is_end_of_word is False. Returns False!
3. startsWith("app"): Traverses to 'p' node. 'p' node exists. Returns True!
4. insert("app"): Marks 'p' node with is_end_of_word = True.
5. search("app"): Now returns True!
Time Complexity: O(L) for all operations. Space: O(L) per inserted word.`,
  },
  complexity: {
    time: 'O(L)',
    timeDetail: 'L is the length of the string. Insert, Search, and StartsWith each examine exactly L characters.',
    space: 'O(N * L)',
    spaceDetail: 'In the worst case (no shared prefixes), memory scales with the total number of characters across all words.',
  },
  commonMistakes: `1. **Confusing \`search\` with \`startsWith\`**:
   A prefix is only a full word if \`curr.is_end_of_word == True\`. Returning \`True\` simply because traversal did not fall off the tree makes \`search("app")\` erroneously return \`True\` when only \`"apple"\` was inserted.

2. **Allocating New Nodes During \`search\`**:
   Accidentally using \`defaultdict\` for \`children\` in Python causes read operations to mutate the Trie by creating empty nodes for nonexistent characters. Use a plain \`dict\` with \`if char not in curr.children:\`.

3. **String Concatenation Overhead in Word Search II**:
   In *Word Search II*, building strings with \`path + board[r][c]\` creates $O(L^2)$ copying overhead. Instead, store the full \`word\` string directly inside the leaf TrieNode so you can record it in $O(1)$.

4. **Duplicate Results in Grid Tries**:
   In Word Search II, multiple grid paths can spell the same dictionary word. Once you find a word, append it to results and set \`node.word = None\` so subsequent paths ignore it.`,
  gotchas: [
    'Trie operations are O(L) where L is word length, completely independent of how many words N are stored.',
    'Word Search II: always prune Trie nodes and reset cell characters (backtrack) to restore grid state.',
    'Bitwise Trie: allows O(32 * N) = O(N) maximum XOR pair searches by greedily taking opposite bit branches.',
    'Memory optimization: use `dict` in Python for sparse child branches, or `[None] * 26` in C++/Java for cache locality.',
  ],
  problems: [
    { id: 'implement-trie-prefix-tree', title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', difficulty: 'medium' },
    { id: 'design-add-and-search-words-data-structure', title: 'Design Add and Search Words Data Structure', slug: 'design-add-and-search-words-data-structure', difficulty: 'medium' },
    { id: 'maximum-xor-of-two-numbers-in-an-array', title: 'Maximum XOR of Two Numbers in an Array', slug: 'maximum-xor-of-two-numbers-in-an-array', difficulty: 'medium' },
    { id: 'word-search-ii', title: 'Word Search II', slug: 'word-search-ii', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 09-heap-priority-queue.ts
// ============================================================================

import type { TopicContent } from '../types'

export const heapPriorityQueueTopic: TopicContent = {
  id: 'heap-priority-queue',
  title: 'Heap / Priority Queue',
  order_index: 9,
  visualizer_id: null,
  summary: 'Maintain dynamic running extrema in logarithmic time with binary heaps, two-heap medians, and top-K filters.',
  intuition: `### 1. The Core Mental Model: The Constant-Time Extrema

A **Priority Queue** is an abstract data structure that allows items to be inserted dynamically while keeping the **minimum** (or **maximum**) element instantly accessible at index \`0\` in **\`O(1)\` time**.

Under the hood, it is implemented as a **Binary Heap** — a complete binary tree mapped contiguously into a regular array without any pointer nodes:

\`\`\`
Array Index: [  0,   1,   2,   3,   4,   5  ]
Tree Values: [ 10,  20,  15,  30,  40,  25  ]

               10 (index 0)
              /  \\
  (idx 1)   20    15  (idx 2)
           /  \\   /
(idx 3)  30   40 25  (idx 5)
\`\`\`

- **Parent Index**: \`parent = (i - 1) // 2\`
- **Left Child Index**: \`left = 2 * i + 1\`
- **Right Child Index**: \`right = 2 * i + 2\`

---

### 2. The $O(N)$ \`heapify\` Superpower

- Inserting $N$ items one-by-one with \`heappush\` takes \`O(N log N)\`.
- Converting an existing array into a valid heap with \`heapify()\` takes **\`O(N)\` linear time** (via sift-down from the lowest internal nodes). Always prefer \`heapq.heapify(arr)\` over repeated pushes!

---

### 3. Comparison: Heap vs. Sorted Array vs. BST

| Operation | Min-Heap (\`heapq\`) | Sorted Array | Self-Balancing BST |
| :--- | :--- | :--- | :--- |
| **Find Min / Max** | \`O(1)\` | \`O(1)\` | \`O(log N)\` or \`O(1)\` |
| **Extract Min / Max** | \`O(log N)\` | \`O(N)\` (shift) or \`O(1)\` (pop tail) | \`O(log N)\` |
| **Insert Element** | \`O(log N)\` | \`O(N)\` | \`O(log N)\` |
| **Build from Array** | \`O(N)\` | \`O(N log N)\` | \`O(N log N)\` |
| **Space Overhead** | \`O(1)\` (flat array) | \`O(1)\` | \`O(N)\` (pointers per node) |`,
  patternRecognition: `### The 3 Essential Interview Patterns

#### Pattern 1: Top-K Elements (Fixed-Size Min-Heap)
- **Giveaway**: *"Find the Kth largest element"*, *"K closest points to origin"*, *"Top K frequent words"*.
- **Strategy**: To find the **$K$ largest** elements, maintain a **Min-Heap of size $K$**. For each item: push it into the heap; if \`len(heap) > k\`, pop the smallest. The remaining $K$ items are the largest, and \`heap[0]\` is the $K$-th largest!
- **Top Problems**: *Kth Largest Element in an Array*, *K Closest Points to Origin*, *Top K Frequent Elements*.
- **Likely follow-up**: *"Why use a Min-Heap of size K instead of Max-Heap of size N?"* — size-$K$ Min-Heap requires only $O(N \log K)$ time and $O(K)$ space, which is critical when $N = 10^9$ streaming items and $K = 10$.

#### Pattern 2: Two Heaps for Dynamic Running Median
- **Giveaway**: *"Find median from continuous data stream"*, *"Sliding window median"*.
- **Strategy**: Split incoming numbers into two halves:
  - **Max-Heap (\`small\`)**: Stores the smaller half (invert numbers with \`-x\`).
  - **Min-Heap (\`large\`)**: Stores the larger half.
  - Keep sizes balanced: \`len(small)\` is either equal to or 1 greater than \`len(large)\`.
- **Top Problems**: *Find Median from Data Stream*, *Sliding Window Median*.
- **Likely follow-up**: *"What is the query time for the median?"* — strictly $O(1)$! If odd, return top of \`small\`; if even, average the two heap roots.

#### Pattern 3: K-Way Merge & Greedy Event Schedulers
- **Giveaway**: *"Merge K sorted lists"*, *"Task Scheduler with cooldown"*, *"Reorganize string with no adjacent duplicates"*.
- **Strategy**: Push the current best candidate from each source into a heap. Pop the top, execute or append it, and push the next available candidate back into the heap.
- **Top Problems**: *Merge K Sorted Lists*, *Task Scheduler*, *Reorganize String*.
- **Likely follow-up**: *"How to handle task cooldowns?"* — maintain a FIFO waiting queue \`(ready_time, count, task)\` alongside the max-heap.`,
  workedExample: {
    title: 'Find Median from Data Stream (Two Heaps)',
    problem: `Design a data structure that dynamically accepts integers from a data stream and computes the running median in O(1) time.

- **Brute Force**: Insert and sort every time → \`O(N log N)\` insert, \`O(1)\` median.
- **Optimal (Two Heaps)**: Max-Heap for lower 50%, Min-Heap for upper 50% → \`O(log N)\` insert, \`O(1)\` median.`,
    code: {
      language: 'python',
      snippet: `import heapq

class MedianFinder:
    def __init__(self):
        # max-heap for lower half (store negative numbers to simulate max-heap)
        self.small = []
        # min-heap for upper half
        self.large = []

    def addNum(self, num: int) -> None:
        # 1. By default, push to small (max-heap)
        heapq.heappush(self.small, -num)

        # 2. Invariant check: ensure all elements in small <= all elements in large
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)

        # 3. Size balance: small can have at most 1 more element than large
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0`,
    },
    explanation: `Trace with stream [5, 2, 8, 1]:
1. addNum(5): small = [-5], large = []. Median = 5.
2. addNum(2): small = [-5, -2] -> rebalanced -> small = [-2], large = [5]. Median = (2 + 5)/2 = 3.5.
3. addNum(8): small = [-5, -2], large = [8] -> small = [-5, -2], large = [8] -> rebalanced -> small = [-5, -2], large = [8]. Median = 5.
4. addNum(1): small = [-2, -1], large = [5, 8]. Median = (2 + 5)/2 = 3.5.
Time: O(log N) per insert, O(1) for median query. Space: O(N).`,
  },
  complexity: {
    time: 'O(log N)',
    timeDetail: 'Insertions and deletions perform logarithmic sift-up/sift-down operations. Finding minimum or median is O(1).',
    space: 'O(N)',
    spaceDetail: 'Linear memory storage for all elements inside the heap arrays.',
  },
  commonMistakes: `1. **Python \`heapq\` is Min-Heap Only**:
   Python does not have a native max-heap class. To simulate a max-heap, you must negate all inserted numbers (\`-val\`) and negate them back when popping (\`-heapq.heappop(h)\`).

2. **Tuple Comparison Crashes on Duplicate Priorities**:
   Pushing \`(priority, node)\` will crash with \`TypeError: '<' not supported between instances of 'ListNode'\` if two items have identical priorities. Always push a unique index tiebreaker: \`(priority, idx, node)\`.

3. **Using Max-Heap for Kth Largest**:
   For *Kth Largest*, keeping a Max-Heap requires storing all $N$ elements ($O(N)$ space and $O(N \log N)$ total time). Using a **Min-Heap of size K** keeps only $K$ elements in memory ($O(K)$ space, $O(N \log K)$ time).

4. **Modifying Elements in the Heap Array In-Place**:
   Mutating \`heap[0] = new_val\` directly corrupts the binary heap invariant. You must use \`heapq.heapreplace(heap, new_val)\` or \`heapq.heappushpop(heap, new_val)\` to preserve the heap structure in $O(\log N)$ time.`,
  gotchas: [
    'Always use `heapq.heapify(arr)` for O(N) in-place heap construction instead of N separate pushes (O(N log N)).',
    '`heapq.heappushpop(h, item)` is faster than a separate push followed by a pop because it executes in a single sift pass.',
    'For Kth largest, maintain a size-K Min-Heap (root is answer); for Kth smallest, maintain a size-K Max-Heap.',
    'Two Heaps: always check both the value boundary condition (`small[0] <= large[0]`) and the size balance condition (`len(small) == len(large) + 0 or 1`).',
  ],
  problems: [
    { id: 'kth-largest-element-in-a-stream', title: 'Kth Largest Element in a Stream', slug: 'kth-largest-element-in-a-stream', difficulty: 'easy' },
    { id: 'last-stone-weight', title: 'Last Stone Weight', slug: 'last-stone-weight', difficulty: 'easy' },
    { id: 'k-closest-points-to-origin', title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'medium' },
    { id: 'kth-largest-element-in-an-array', title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'medium' },
    { id: 'top-k-frequent-elements', title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'medium' },
    { id: 'task-scheduler', title: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'medium' },
    { id: 'reorganize-string', title: 'Reorganize String', slug: 'reorganize-string', difficulty: 'medium' },
    { id: 'design-twitter', title: 'Design Twitter', slug: 'design-twitter', difficulty: 'medium' },
    { id: 'find-median-from-data-stream', title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'hard' },
    { id: 'sliding-window-median', title: 'Sliding Window Median', slug: 'sliding-window-median', difficulty: 'hard' },
    { id: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 10-backtracking.ts
// ============================================================================

import type { TopicContent } from '../types'

export const backtrackingTopic: TopicContent = {
  id: 'backtracking',
  title: 'Backtracking',
  order_index: 10,
  visualizer_id: null,
  summary: 'Systematic state-space tree search with the Choose ➔ Explore ➔ Unchoose template for combinatorial problems.',
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
    { id: 'combination-sum-ii', title: 'Combination Sum II', slug: 'combination-sum-ii', difficulty: 'medium' },
    { id: 'permutations', title: 'Permutations', slug: 'permutations', difficulty: 'medium' },
    { id: 'permutations-ii', title: 'Permutations II', slug: 'permutations-ii', difficulty: 'medium' },
    { id: 'subsets-ii', title: 'Subsets II', slug: 'subsets-ii', difficulty: 'medium' },
    { id: 'word-search', title: 'Word Search', slug: 'word-search', difficulty: 'medium' },
    { id: 'palindrome-partitioning', title: 'Palindrome Partitioning', slug: 'palindrome-partitioning', difficulty: 'medium' },
    { id: 'letter-combinations-of-a-phone-number', title: 'Letter Combinations of a Phone Number', slug: 'letter-combinations-of-a-phone-number', difficulty: 'medium' },
    { id: 'n-queens', title: 'N-Queens', slug: 'n-queens', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 11-graphs.ts
// ============================================================================

import type { TopicContent } from '../types'

export const graphsTopic: TopicContent = {
  id: 'graphs',
  title: 'Graphs',
  order_index: 11,
  visualizer_id: null,
  summary: 'Master Adjacency Lists, 2D Grid Flood Fills, BFS Shortest Paths, and Kahn\'s Topological Sorting.',
  intuition: `### 1. The Core Mental Model: Vertices & Edges

A **Graph** $G = (V, E)$ represents a network of entities (Vertices) connected by relationships (Edges). 

In coding interviews, graphs appear in two primary formats:
1. **Explicit Graphs**: Given as edge lists (e.g. \`[[0, 1], [1, 2]]\`). Always convert these into an **Adjacency List** (\`collections.defaultdict(list)\`) for \`O(V + E)\` traversal.
2. **Implicit 2D Grids**: A matrix where every cell \`(r, c)\` is a vertex, and valid adjacent cells \`(r±1, c±1)\` are edges.

---

### 2. BFS vs. DFS: When to Use Which?

- **Breadth-First Search (BFS)**: Explores outward in concentric rings using a queue. **Guarantees the shortest path in unweighted graphs** (fewest edges or minutes elapsed).
- **Depth-First Search (DFS)**: Dives deeply along a single path using recursion or a stack. Best for **connected component counting**, **flood fills**, **exhaustive path finding**, and **cycle detection**.

---

### 3. Topological Sort (Dependency Resolution)

A **Directed Acyclic Graph (DAG)** represents tasks with prerequisites. A **Topological Sort** arranges vertices in a linear order such that for every directed edge $u \to v$, task $u$ comes before $v$.

**Kahn's Algorithm (BFS In-Degree)**:
1. Count the \`in_degree\` (incoming prerequisites) for every node.
2. Push all nodes with \`in_degree == 0\` into a queue.
3. Pop a node, append to ordering, and decrement the \`in_degree\` of all its neighbors.
4. If a neighbor's \`in_degree\` reaches \`0\`, push it into the queue.
5. If total processed nodes $< V$, **a cycle exists** (e.g. circular course requirements).`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: 2D Grid Flood Fill & Island Counting
- **Giveaway**: *"Number of islands"*, *"Max area of island"*, *"Pacific Atlantic water flow"*, *"Surrounded regions"*.
- **Strategy**: Iterate through every cell. When unvisited land is found, trigger DFS/BFS to visit and sink/mark all 4-directionally connected land cells.
- **Top Problems**: *Number of Islands*, *Max Area of Island*, *Pacific Atlantic Water Flow*.
- **Likely follow-up**: *"Can you do it without extra memory?"* — mutate visited land cells directly into water (\`grid[r][c] = '0'\`) to achieve $O(1)$ extra space beyond recursion stack.

#### Pattern 2: Multi-Source BFS for Shortest Time / Distance
- **Giveaway**: *"Rotting oranges"*, *"Walls and Gates"*, *"Word Ladder"*, *"Shortest path in binary matrix"*.
- **Strategy**: Initialize queue with **all initial sources simultaneously** (e.g. all rotten oranges at minute 0). Expand 1 level per step so the wavefront propagates uniformly.
- **Top Problems**: *Rotting Oranges*, *Walls and Gates*, *Word Ladder*.
- **Likely follow-up**: *"Why does regular DFS fail for shortest path?"* — DFS visits deep paths first, requiring checking all paths to find the minimum; BFS finds the minimum on its first arrival.

#### Pattern 3: Topological Sort on Dependency DAGs
- **Giveaway**: *"Course Schedule"*, *"Alien Dictionary"*, *"Minimum height trees"*, *"Sequence reconstruction"*.
- **Strategy**: Build adjacency list + \`in_degree\` map. Run Kahn's algorithm with a queue. If output length matches $V$, schedule is valid; otherwise cycle detected.
- **Top Problems**: *Course Schedule*, *Course Schedule II*, *Alien Dictionary*.
- **Likely follow-up**: *"What if there are multiple valid topological orders?"* — any valid topological order is acceptable unless asked for lexicographical order (use a Min-Heap instead of a queue).

#### Pattern 4: Clone Graph / Graph Transformation
- **Giveaway**: *"Clone an undirected graph with cycles"*.
- **Strategy**: Use DFS or BFS paired with a hash map \`{old_node: new_node}\` to clone vertices and prevent infinite cycles.
- **Top Problems**: *Clone Graph*.
- **Likely follow-up**: *"How to handle deep copies of cyclic references?"* — check map before cloning; if node already in map, return existing clone.`,
  workedExample: {
    title: 'Course Schedule (Kahn\'s BFS Topological Sort)',
    problem: `There are a total of \`numCourses\` courses to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a, b]\` indicates that you must take course \`b\` first if you want to take course \`a\` (edge $b \to a$).
Return \`True\` if you can finish all courses, or \`False\` if there is a cycle.`,
    code: {
      language: 'python',
      snippet: `from collections import defaultdict, deque

def can_finish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = defaultdict(list)
    in_degree = [0] * numCourses

    # Build adjacency list: b -> a (must take b before a)
    for crs, prereq in prerequisites:
        adj[prereq].append(crs)
        in_degree[crs] += 1

    # Queue all courses that have 0 prerequisites
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    completed_count = 0

    while queue:
        node = queue.popleft()
        completed_count += 1

        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we completed all courses, no cycle exists
    return completed_count == numCourses`,
    },
    explanation: `Trace on numCourses = 4, prerequisites = [[1,0], [2,0], [3,1], [3,2]]:
1. In-degrees: [0:0, 1:1, 2:1, 3:2]. Adj: {0: [1, 2], 1: [3], 2: [3]}.
2. Queue starts with [0].
3. Pop 0 -> completed=1. Decrement in-degree of 1 and 2 to 0 -> queue = [1, 2].
4. Pop 1 -> completed=2. Decrement in-degree of 3 (becomes 1).
5. Pop 2 -> completed=3. Decrement in-degree of 3 (becomes 0) -> queue = [3].
6. Pop 3 -> completed=4.
completed_count (4) == numCourses (4) -> Returns True!
Time: O(V + E), Space: O(V + E).`,
  },
  complexity: {
    time: 'O(V + E)',
    timeDetail: 'V is the number of vertices and E is the number of edges. Every vertex and edge is processed at most once.',
    space: 'O(V + E)',
    spaceDetail: 'Storage for the adjacency list, in-degree arrays, visited sets, and BFS queues.',
  },
  commonMistakes: `1. **Marking Visited on Pop Instead of Push in BFS**:
   In BFS, if you mark a node as visited when *popping* it from the queue rather than when *pushing* it, neighboring nodes will push the same vertex dozens of times. This causes exponential queue bloat and Memory Limit Exceeded (MLE). **Always mark visited immediately upon pushing!**

2. **Reversing the Prerequisite Edge Direction**:
   In Course Schedule, \`[a, b]\` means $b$ is the prerequisite for $a$ ($b \to a$). Drawing the edge as $a \to b$ inverts the in-degrees and breaks the topological order.

3. **Missing Disconnected Components in Graphs**:
   Assuming a single DFS/BFS from node 0 visits the entire graph fails when the graph has multiple disconnected components or islands. You must loop through all vertices \`for i in range(numCourses):\` to launch searches on unvisited nodes.

4. **Grid Out-of-Bounds Checks in Wrong Order**:
   Writing \`if grid[r][c] == '1' and 0 <= r < rows:\` crashes with an \`IndexError\`. Always place coordinate bounds checks *before* accessing matrix indices.`,
  gotchas: [
    'BFS is the only algorithm that guarantees the shortest path in unweighted graphs.',
    'Always mark grid cells visited immediately upon enqueueing in BFS.',
    'Grid direction template: `DIRS = [(0, 1), (0, -1), (1, 0), (-1, 0)]`.',
    'Kahn\'s algorithm detects directed cycles if `processed_count < num_vertices`.',
    'Undirected cycle detection requires passing a `parent` node to avoid mistaking the inbound edge for a cycle.',
  ],
  problems: [
    { id: 'number-of-islands', title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'medium' },
    { id: 'max-area-of-island', title: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'medium' },
    { id: 'clone-graph', title: 'Clone Graph', slug: 'clone-graph', difficulty: 'medium' },
    { id: 'walls-and-gates', title: 'Walls and Gates', slug: 'walls-and-gates', difficulty: 'medium' },
    { id: 'rotting-oranges', title: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'medium' },
    { id: 'pacific-atlantic-water-flow', title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'medium' },
    { id: 'surrounded-regions', title: 'Surrounded Regions', slug: 'surrounded-regions', difficulty: 'medium' },
    { id: 'course-schedule', title: 'Course Schedule', slug: 'course-schedule', difficulty: 'medium' },
    { id: 'course-schedule-ii', title: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'medium' },
    { id: 'graph-valid-tree', title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'medium' },
    { id: 'number-of-connected-components-in-an-undirected-graph', title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'medium' },
    { id: 'word-ladder', title: 'Word Ladder', slug: 'word-ladder', difficulty: 'hard' },
    { id: 'alien-dictionary', title: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 12-advanced-graphs.ts
// ============================================================================

import type { TopicContent } from '../types'

export const advancedGraphsTopic: TopicContent = {
  id: 'advanced-graphs',
  title: 'Advanced Graphs',
  order_index: 12,
  visualizer_id: null,
  summary: 'Dijkstra shortest paths on weighted graphs, Union-Find (DSU) cycle detection, and Minimum Spanning Trees.',
  intuition: `### 1. The Core Mental Model: Weighted Graphs & Connectivity

When edges have **weights / costs**, plain BFS cannot find the shortest path because the path with the fewest edges might have a much higher total weight.

To solve weighted graph problems, master these three foundational tools:
1. **Dijkstra's Algorithm**: Finds the shortest path from a source to all vertices on graphs with **non-negative weights** using a **Min-Heap** in \`O((V + E) log V)\` time.
2. **Disjoint Set Union (DSU / Union-Find)**: Manages dynamic connectivity and detects cycles in undirected graphs in **near-\`O(1)\` amortized time** per query.
3. **Minimum Spanning Tree (MST)**: Connects all $V$ vertices using $V - 1$ edges with minimum total weight (via **Prim's** or **Kruskal's** algorithm).

---

### 2. Disjoint Set Union (DSU) In Plain English

DSU maintains a set of elements partitioned into non-overlapping groups. Each group has a designated "leader" or "representative".

- **\`find(x)\`**: Finds the root representative of the set containing \`x\`. With **Path Compression**, all visited nodes are re-linked directly to the root, making future lookups \`O(1)\`.
- **\`union(x, y)\`**: Combines the sets containing \`x\` and \`y\`. With **Union by Rank/Size**, the smaller tree is attached under the root of the larger tree to keep heights flat.
- **Cycle Detection**: If \`find(x) == find(y)\`, nodes \`x\` and \`y\` are *already in the same connected component*. Adding an edge between them **creates a cycle**!

---

### 3. Comparison: Shortest Path & Connectivity Algorithms

| Algorithm | Problem Solved | Weights Allowed | Time Complexity |
| :--- | :--- | :--- | :--- |
| **BFS** | Shortest path (unweighted) | Unweighted (all cost 1) | \`O(V + E)\` |
| **Dijkstra** | Single-source shortest path | Non-negative ($\ge 0$) only | \`O((V + E) log V)\` |
| **Bellman-Ford** | Single-source shortest path | Negative weights allowed | \`O(V × E)\` |
| **Union-Find (DSU)** | Dynamic connectivity / Cycle check | Undirected graphs | \`O(α(V)) ≈ O(1)\` |
| **Kruskal's MST** | Minimum Spanning Tree | Any weights | \`O(E log E)\` |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: Non-Negative Weighted Shortest Path (Dijkstra)
- **Giveaway**: *"Find minimum time / cost to travel between nodes on weighted network"*, *"Path with maximum probability"*.
- **Strategy**: Maintain \`min_heap\` of \`(cost_so_far, node)\` and a \`dist = {node: float('inf')}\` map. Pop minimum cost, skip if \`cost > dist[node]\`, relax neighbors by pushing \`(cost + weight, neighbor)\`.
- **Top Problems**: *Network Delay Time*, *Swim in Rising Water*, *Path with Maximum Probability*.
- **Likely follow-up**: *"Why can't Dijkstra handle negative weights?"* — Dijkstra greedily locks in a node's distance the moment it is popped from the heap. A negative edge encountered later could invalidate this, which requires Bellman-Ford.

#### Pattern 2: DSU Cycle Detection & Redundant Edge Removal
- **Giveaway**: *"Find redundant connection in tree"*, *"Graph valid tree"*, *"Number of connected components"*.
- **Strategy**: Initialize DSU for $N$ nodes. Iterate through edges: if \`union(u, v)\` returns \`False\` (meaning \`find(u) == find(v)\`), you found the cycle / redundant edge!
- **Top Problems**: *Redundant Connection*, *Graph Valid Tree*, *Number of Connected Components in an Undirected Graph*.
- **Likely follow-up**: *"What is the time complexity of DSU?"* — $O(\alpha(V))$ per operation, where $\alpha$ is the inverse Ackermann function ($\alpha(N) < 5$ for all realistic $N$).

#### Pattern 3: Minimum Spanning Tree (Kruskal's vs. Prim's)
- **Giveaway**: *"Min cost to connect all points"*, *"Connect cities with minimum cost"*.
- **Strategy**:
  - **Kruskal**: Compute all edge distances, sort edges ascending, use DSU to add edges that do not form cycles until $V - 1$ edges are picked.
  - **Prim**: Start at node 0, maintain Min-Heap of edges leaving current visited set.
- **Top Problems**: *Min Cost to Connect All Points*.
- **Likely follow-up**: *"Which MST algorithm is better for dense graphs?"* — Prim's with adjacency matrix/heap ($O(V^2)$) is better on dense graphs where $E \approx V^2$; Kruskal is preferred on edge lists.

#### Pattern 4: State-Expanded Dijkstra / Bounded Hops
- **Giveaway**: *"Cheapest flights within K stops"*.
- **Strategy**: Expand the state tracked in the queue to \`(cost, node, stops_used)\`, or use Bellman-Ford run for $K + 1$ relaxations.
- **Top Problems**: *Cheapest Flights Within K Stops*.
- **Likely follow-up**: *"Why does plain Dijkstra fail with K stops?"* — a cheaper path might use too many stops, so we cannot discard paths with higher cost but fewer stops.`,
  workedExample: {
    title: 'Network Delay Time (Dijkstra\'s Algorithm)',
    problem: `You are given a network of \`n\` nodes labeled \`1\` to \`n\` and a list of travel times \`times[i] = (u, v, w)\` where \`w\` is the travel time from \`u\` to \`v\`.
We send a signal from node \`k\`. Return the **minimum time** required for all \`n\` nodes to receive the signal. If it is impossible, return \`-1\`.`,
    code: {
      language: 'python',
      snippet: `from collections import defaultdict
import heapq

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    adj = defaultdict(list)
    for u, v, w in times:
        adj[u].append((v, w))

    # Min-Heap of (distance_from_source, node)
    min_heap = [(0, k)]
    visited = {}

    while min_heap:
        d, u = heapq.heappop(min_heap)

        if u in visited:
            continue
        visited[u] = d

        for v, weight in adj[u]:
            if v not in visited:
                heapq.heappush(min_heap, (d + weight, v))

    # If all n nodes received the signal, return the max arrival time
    return max(visited.values()) if len(visited) == n else -1`,
    },
    explanation: `Trace on times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2:
1. Heap starts with [(0, 2)].
2. Pop (0, 2): visited[2] = 0. Push neighbors (1, 1) and (1, 3).
3. Pop (1, 1): visited[1] = 1.
4. Pop (1, 3): visited[3] = 1. Push neighbor (2, 4).
5. Pop (2, 4): visited[4] = 2.
Visited = {2: 0, 1: 1, 3: 1, 4: 2}. len(visited) == 4. Max time = 2.
Time: O(E log V), Space: O(V + E).`,
  },
  complexity: {
    time: 'O((V + E) log V)',
    timeDetail: 'Every vertex is pushed to and popped from the Min-Heap at most once, and all edges are relaxed in logarithmic time.',
    space: 'O(V + E)',
    spaceDetail: 'Storage for the adjacency list graph, visited distances dictionary, and priority queue.',
  },
  commonMistakes: `1. **Forgetting to Skip Stale Heap Entries in Dijkstra**:
   Because elements are added to the heap whenever a shorter path is found, older, longer paths remain in the heap. If you forget \`if u in visited: continue\` (or \`if d > dist[u]: continue\`), you will re-evaluate vertices multiple times and degrade performance.

2. **Omitting Path Compression in DSU**:
   Writing \`def find(x): return x if parent[x] == x else find(parent[x])\` without reassigning \`parent[x] = find(parent[x])\` degrades tree lookup from $\approx O(1)$ to $O(V)$, causing Time Limit Exceeded on skewed inputs.

3. **Running Dijkstra on Negative Weights**:
   Dijkstra assumes distances to popped nodes are permanent. A negative weight can shorten a previously finalized distance, producing incorrect results or infinite loops.

4. **1-Indexed vs. 0-Indexed Vertex Offsets**:
   Many graph problems label nodes from $1$ to $N$ rather than $0$ to $N-1$. Failing to size DSU arrays as \`N + 1\` causes \`IndexError\`.`,
  gotchas: [
    'Dijkstra uses Min-Heap of (distance, node) to greedily expand the closest unvisited node.',
    'DSU template: find with path compression (`parent[x] = find(parent[x])`) + union by rank.',
    'Redundant Connection: the first edge where `find(u) == find(v)` is the cycle-causing edge.',
    'Min Cost to Connect All Points: complete graph with N(N-1)/2 Manhattan distances is solved with Prim or Kruskal.',
  ],
  problems: [
    { id: 'network-delay-time', title: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'medium' },
    { id: 'path-with-maximum-probability', title: 'Path with Maximum Probability', slug: 'path-with-maximum-probability', difficulty: 'medium' },
    { id: 'min-cost-to-connect-all-points', title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', difficulty: 'medium' },
    { id: 'redundant-connection', title: 'Redundant Connection', slug: 'redundant-connection', difficulty: 'medium' },
    { id: 'graph-valid-tree', title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'medium' },
    { id: 'number-of-connected-components-in-an-undirected-graph', title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'medium' },
    { id: 'cheapest-flights-within-k-stops', title: 'Cheapest Flights Within K Stops', slug: 'cheapest-flights-within-k-stops', difficulty: 'medium' },
    { id: 'swim-in-rising-water', title: 'Swim in Rising Water', slug: 'swim-in-rising-water', difficulty: 'hard' },
    { id: 'alien-dictionary', title: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'hard' },
    { id: 'reconstruct-itinerary', title: 'Reconstruct Itinerary', slug: 'reconstruct-itinerary', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 13-1d-dynamic-programming.ts
// ============================================================================

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
    { id: 'min-cost-climbing-stairs', title: 'Min Cost Climbing Stairs', slug: 'min-cost-climbing-stairs', difficulty: 'easy' },
    { id: 'house-robber', title: 'House Robber', slug: 'house-robber', difficulty: 'medium' },
    { id: 'house-robber-ii', title: 'House Robber II', slug: 'house-robber-ii', difficulty: 'medium' },
    { id: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'medium' },
    { id: 'palindromic-substrings', title: 'Palindromic Substrings', slug: 'palindromic-substrings', difficulty: 'medium' },
    { id: 'decode-ways', title: 'Decode Ways', slug: 'decode-ways', difficulty: 'medium' },
    { id: 'coin-change', title: 'Coin Change', slug: 'coin-change', difficulty: 'medium' },
    { id: 'coin-change-ii', title: 'Coin Change II', slug: 'coin-change-ii', difficulty: 'medium' },
    { id: 'maximum-product-subarray', title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', difficulty: 'medium' },
    { id: 'word-break', title: 'Word Break', slug: 'word-break', difficulty: 'medium' },
    { id: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'medium' },
    { id: 'partition-equal-subset-sum', title: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum', difficulty: 'medium' },
  ],
}


// ============================================================================
// File: 14-2d-dynamic-programming.ts
// ============================================================================

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
    { id: 'minimum-path-sum', title: 'Minimum Path Sum', slug: 'minimum-path-sum', difficulty: 'medium' },
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


// ============================================================================
// File: 15-greedy.ts
// ============================================================================

import type { TopicContent } from '../types'

export const greedyTopic: TopicContent = {
  id: 'greedy',
  title: 'Greedy',
  order_index: 15,
  visualizer_id: null,
  summary: 'Make locally optimal choices without backtracking, backed by mathematical invariant proofs like Kadane and Jump Game horizons.',
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
    { id: 'maximum-product-subarray', title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', difficulty: 'medium' },
    { id: 'jump-game', title: 'Jump Game', slug: 'jump-game', difficulty: 'medium' },
    { id: 'jump-game-ii', title: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'medium' },
    { id: 'gas-station', title: 'Gas Station', slug: 'gas-station', difficulty: 'medium' },
    { id: 'hand-of-straights', title: 'Hand of Straights', slug: 'hand-of-straights', difficulty: 'medium' },
    { id: 'merge-triplets-to-form-target-triplet', title: 'Merge Triplets to Form Target Triplet', slug: 'merge-triplets-to-form-target-triplet', difficulty: 'medium' },
    { id: 'partition-labels', title: 'Partition Labels', slug: 'partition-labels', difficulty: 'medium' },
    { id: 'valid-parenthesis-string', title: 'Valid Parenthesis String', slug: 'valid-parenthesis-string', difficulty: 'medium' },
  ],
}


// ============================================================================
// File: 16-intervals.ts
// ============================================================================

import type { TopicContent } from '../types'

export const intervalsTopic: TopicContent = {
  id: 'intervals',
  title: 'Intervals',
  order_index: 16,
  visualizer_id: null,
  summary: 'Master 1D coordinate ranges, interval merging, earliest-deadline scheduling, and concurrent room tracking with Min-Heaps.',
  intuition: `### 1. The Core Mental Model: 1D Timeline Overlaps

An **Interval** is a continuous range \`[start, end]\` representing a span of time, a meeting, or a geometric segment.

The golden rule for solving 99% of interval problems:
> **Always sort the intervals first.**

Once intervals are sorted along the timeline:
- You only ever need to compare the **current interval** with the **immediately preceding interval**.
- Two sorted intervals A and B (where \`A.start <= B.start\`) **overlap if and only if**:
  \`B.start <= A.end\`

When they overlap, their merged interval becomes:
\`\`\`
[ A.start, max(A.end, B.end) ]
\`\`\`

---

### 2. Comparison: Sorting by Start vs. Sorting by End vs. Line Sweep

| Strategy | When To Use | Key Invariant |
| :--- | :--- | :--- |
| **Sort by \`start\`** | Merging overlapping intervals (*Merge Intervals*, *Insert Interval*) | New intervals only extend or start a fresh cluster. |
| **Sort by \`end\`** | Minimizing removals / Maximizing non-overlapping meetings (*Erase Overlap Intervals*) | Greedily pick the meeting that **finishes earliest** to leave maximum room for future events. |
| **Min-Heap of \`end\` Times** | Tracking concurrent rooms / resources (*Meeting Rooms II*) | The root of the Min-Heap tells you the earliest a room becomes free. |
| **Chronological Line Sweep** | Counting simultaneous peaks across discrete start/end events | $+1$ on event start, $-1$ on event end, sorted along timeline. |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: Linear Overlap Merging
- **Giveaway**: *"Merge all overlapping intervals"*, *"Insert new interval into sorted non-overlapping list"*.
- **Strategy**: Sort by \`start\`. Initialize \`merged = [intervals[0]]\`. For each interval: if \`curr.start <= merged[-1].end\`, merge by updating \`merged[-1].end = max(merged[-1].end, curr.end)\`; else append \`curr\`.
- **Top Problems**: *Merge Intervals*, *Insert Interval*.
- **Likely follow-up**: *"How to do Insert Interval in O(N) without re-sorting?"* — 3 sequential passes: (1) add all intervals ending before \`newInterval\`, (2) merge all overlapping intervals, (3) add all intervals starting after \`newInterval\`.

#### Pattern 2: Earliest Deadline First (Erase Overlap Intervals)
- **Giveaway**: *"Find minimum number of intervals to remove to make the rest non-overlapping"*.
- **Strategy**: Sort by **\`end\` time**. Keep the interval that ends earliest. If the next interval starts before the current one ends, it must be removed.
- **Top Problems**: *Non-overlapping Intervals*.
- **Likely follow-up**: *"Why sort by end time instead of start time?"* — finishing earlier leaves the maximum possible remaining timeline open for subsequent intervals.

#### Pattern 3: Concurrent Resource Tracking (Meeting Rooms II)
- **Giveaway**: *"Minimum number of conference rooms required"*.
- **Strategy**: Sort meetings by \`start\`. Maintain a **Min-Heap of end times**. For each meeting: if \`meeting.start >= heap[0]\` (a room has freed up), \`heappop(heap)\`. Push current \`meeting.end\`. The maximum size of the heap is the answer!
- **Top Problems**: *Meeting Rooms*, *Meeting Rooms II*.
- **Likely follow-up**: *"What is the Line Sweep alternative?"* — separate starts and ends into two sorted arrays; walk two pointers, incrementing rooms on start and decrementing on end.

#### Pattern 4: Sorted Query Sweep with Min-Heap
- **Giveaway**: *"Minimum interval to include each query"*.
- **Strategy**: Sort queries while preserving original indices. Process intervals in order of start time, pushing \`(size, end)\` to a Min-Heap. Discard expired intervals where \`end < query\` from the heap.
- **Top Problems**: *Minimum Interval to Include Each Query*.
- **Likely follow-up**: *"Why does this beat binary search per query?"* — sorting queries allows each interval to enter and exit the heap at most once ($O((N + Q) \log N)$).`,
  workedExample: {
    title: 'Meeting Rooms II (Min-Heap Active Room Allocation)',
    problem: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start, end]\`, return the **minimum number of conference rooms** required.

- **Strategy**: Sort meetings by start time. Use a Min-Heap to store the end times of active meetings.
- For each meeting, check if the earliest-ending meeting has finished (\`start >= min_heap[0]\`). If so, reuse that room (pop it). Then push the current meeting's end time.
- The heap size at the end represents the number of rooms needed.`,
    code: {
      language: 'python',
      snippet: `import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0

    # 1. Sort meetings by start time
    intervals.sort(key=lambda x: x[0])

    # 2. Min-Heap of active meeting end times
    rooms = []  # stores end times

    for start, end in intervals:
        # If the earliest ending meeting finished before or when current meeting starts, reuse room
        if rooms and start >= rooms[0]:
            heapq.heappop(rooms)

        # Allocate room for current meeting
        heapq.heappush(rooms, end)

    return len(rooms)`,
    },
    explanation: `Trace with intervals = [[0, 30], [5, 10], [15, 20]]:
1. Sort by start: [[0, 30], [5, 10], [15, 20]].
2. [0, 30]: Heap = [30]. Rooms = 1.
3. [5, 10]: start 5 < min_end 30 -> cannot reuse. Push 10. Heap = [10, 30]. Rooms = 2.
4. [15, 20]: start 15 >= min_end 10 -> REUSE ROOM! Pop 10, push 20. Heap = [20, 30].
Final rooms = len(rooms) = 2.
Time: O(N log N), Space: O(N).`,
  },
  complexity: {
    time: 'O(N log N)',
    timeDetail: 'Sorting the N intervals dominates the runtime. The subsequent heap and sweep operations run in linear or O(N log N) time.',
    space: 'O(N)',
    spaceDetail: 'Storage for the sorted intervals, output lists, or priority queue of active end times.',
  },
  commonMistakes: `1. **Mutating Intervals Without Sorting First**:
   Assuming input intervals are given in chronological order. Always call \`intervals.sort(key=lambda x: x[0])\` first.

2. **Strict Inequality on Adjacent Endpoints**:
   If a meeting ends at 10 and another starts at 10 (\`[5, 10]\` and \`[10, 20]\`), they **do not conflict** in room scheduling (\`start >= rooms[0]\` is valid). For merging intervals, \`curr.start <= prev.end\` means they merge into \`[5, 20]\`. Do not mix up \`<=\` and \`<\`!

3. **Sorting by the Wrong Dimension in Erase Overlap**:
   In *Non-Overlapping Intervals*, sorting by \`start\` time can lead to picking a very long meeting that overlaps multiple short ones. You must sort by **\`end\` time** to greedily maximize remaining time.

4. **Forgetting to Push the Last Merged Interval**:
   When accumulating merged intervals in a separate variable instead of a running array \`merged\`, forgetting to append the final open interval after loop termination loses the last segment.`,
  gotchas: [
    'Merge Intervals: sort by start, check `curr[0] <= prev[1]`, merge with `prev[1] = max(prev[1], curr[1])`.',
    'Erase Overlap Intervals: sort by end time to greedily free up timeline earliest.',
    'Meeting Rooms II: Min-Heap of end times tracks concurrent rooms in O(N log N) time.',
    'Insert Interval: solve in O(N) by splitting into left (before), overlapping (merge), and right (after).',
  ],
  problems: [
    { id: 'meeting-rooms', title: 'Meeting Rooms', slug: 'meeting-rooms', difficulty: 'easy' },
    { id: 'insert-interval', title: 'Insert Interval', slug: 'insert-interval', difficulty: 'medium' },
    { id: 'merge-intervals', title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'medium' },
    { id: 'non-overlapping-intervals', title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'medium' },
    { id: 'meeting-rooms-ii', title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', difficulty: 'medium' },
    { id: 'minimum-interval-to-include-each-query', title: 'Minimum Interval to Include Each Query', slug: 'minimum-interval-to-include-each-query', difficulty: 'hard' },
  ],
}


// ============================================================================
// File: 17-bit-manipulation.ts
// ============================================================================

import type { TopicContent } from '../types'

export const bitManipulationTopic: TopicContent = {
  id: 'bit-manipulation',
  title: 'Bit Manipulation',
  order_index: 17,
  visualizer_id: null,
  summary: 'Harness binary arithmetic, XOR cancellation, Brian Kernighan\'s bit-clearing trick, and bitmask state compression.',
  intuition: `### 1. The Core Mental Model: Operating on Raw Bits

**Bit Manipulation** performs calculations directly on the individual binary 0s and 1s of integers.

The 6 fundamental bitwise operations:
- **AND (\`&\`)**: \`1 & 1 = 1\`, all other pairs \`0\`. (Used for **clearing** and **masking** bits).
- **OR (\`|\`)**: \`0 | 0 = 0\`, all other pairs \`1\`. (Used for **setting** bits).
- **XOR (\`^\`)**: \`1\` only if bits are **different**. (Used for **parity** and **self-cancellation**).
- **NOT (\`~\`)**: Inverts every bit (\`~x = -(x + 1)\`).
- **Left Shift (\`<< k\`)**: Multiplies by $2^k$ by shifting bits left and appending \`0\`s.
- **Right Shift (\`>> k\`)**: Divides by $2^k$ (integer division) by shifting bits right.

---

### 2. The 5 Essential Bit Tricks to Memorize

1. **XOR Self-Cancellation**:
   \`x ^ x = 0\` and \`x ^ 0 = x\`
   XORing an array of pairs cancels out all duplicate numbers, isolating the single unique element in \`O(n)\` time and \`O(1)\` space.
2. **Brian Kernighan's Bit-Drop**:
   \`n & (n - 1)\`
   Clears the **lowest set bit** (the rightmost \`1\`). Running this in a loop counts the number of 1-bits in iterations equal to the number of set bits (not 32 iterations).
3. **Isolate Lowest Set Bit**:
   \`n & (-n)\`
   Isolates the rightmost \`1\` bit as a clean power of 2 (due to Two's Complement negation).
4. **Test, Set, Clear, and Toggle k-th Bit**:
   - **Test**: \`(n >> k) & 1\` (or \`n & (1 << k)\`)
   - **Set**: \`n | (1 << k)\`
   - **Clear**: \`n & ~(1 << k)\`
   - **Toggle**: \`n ^ (1 << k)\`
5. **Power of 2 Check**:
   \`n > 0 and (n & (n - 1)) == 0\`

---

### 3. Comparison: Bitwise Operators Reference

| Operation | Syntax | Example (\`a = 5 (0101)\`, \`b = 3 (0011)\`) | Common Use Case |
| :--- | :--- | :--- | :--- |
| **AND** | \`a & b\` | \`0101 & 0011 = 0001 (1)\` | Check parity (\`n & 1\`), bit masks |
| **OR** | \`a \| b\` | \`0101 \| 0011 = 0111 (7)\` | Insert flag into bitmask set |
| **XOR** | \`a ^ b\` | \`0101 ^ 0011 = 0110 (6)\` | Find unique element, toggle bits |
| **NOT** | \`~a\` | \`~0101 = ...1010 (-6)\` | Invert masks |
| **Left Shift** | \`a << 1\` | \`0101 << 1 = 1010 (10)\` | Multiply by 2, build bitmask \`1 << k\` |
| **Right Shift** | \`a >> 1\` | \`0101 >> 1 = 0010 (2)\` | Divide by 2, scan bit positions |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: XOR Cancellation & Parity
- **Giveaway**: *"Every element appears twice except one"*, *"Find the missing number in range 0 to n"*.
- **Strategy**: XOR all array elements together. Duplicate pairs cancel to 0, leaving the lone answer.
- **Top Problems**: *Single Number*, *Missing Number*.
- **Likely follow-up**: *"What if two distinct numbers appear once (Single Number III)?"* — XOR all to get \`A ^ B\`. Use \`diff & (-diff)\` to find any bit where A and B differ, then divide the array into two groups based on that bit to isolate A and B.

#### Pattern 2: Bit Counting & Dynamic Programming
- **Giveaway**: *"Count number of 1-bits (Hamming weight)"*, *"Counting bits for all numbers from 0 to n"*.
- **Strategy**: 
  - **Single Number**: Use Brian Kernighan's \`n &= (n - 1)\` in a while-loop.
  - **Range 0 to N**: Use DP recurrence: \`dp[i] = dp[i >> 1] + (i & 1)\` (right-shifting drops last bit; add 1 if dropped bit was odd).
- **Top Problems**: *Number of 1 Bits*, *Counting Bits*.
- **Likely follow-up**: *"Why is dp[i >> 1] + (i & 1) O(n)?"* — solves all counts up to $N$ in a single linear pass with no loops per number.

#### Pattern 3: Bitmask as Compact Set Representation
- **Giveaway**: *"Subsets of size N (N <= 20)"*, *"DP with bitmask"*, *"Maximum product of word lengths"*.
- **Strategy**: Represent a subset of up to 32 elements as an integer \`mask\`. If item \`i\` is present, the \`i\`-th bit is \`1\` (\`mask |= (1 << i)\`). Check intersection with \`mask1 & mask2 == 0\`.
- **Top Problems**: *Subsets*, *Maximum Product of Word Lengths*.
- **Likely follow-up**: *"How to iterate through all 2^N subsets?"* — loop integer \`mask\` from \`0\` to \`(1 << N) - 1\`.

#### Pattern 4: Bitwise Full Adder Simulation
- **Giveaway**: *"Calculate sum of two integers without using '+' or '-'"*.
- **Strategy**: \`sum_without_carry = a ^ b\`, \`carry = (a & b) << 1\`. Loop until \`carry == 0\`.
- **Top Problems**: *Sum of Two Integers*, *Reverse Bits*.
- **Likely follow-up**: *"How to handle 32-bit signed negative numbers in Python?"* — Python uses arbitrary-precision integers, so apply a \`0xFFFFFFFF\` mask to restrict arithmetic to 32 bits.`,
  workedExample: {
    title: 'Single Number & Counting Bits (XOR and DP Formula)',
    problem: `Problem 1: Given a non-empty array of integers \`nums\`, every element appears twice except for one. Find that single one in O(n) time and O(1) extra space.
Problem 2: Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\`, \`ans[i]\` is the number of 1's in the binary representation of \`i\`.`,
    code: {
      language: 'python',
      snippet: `def single_number(nums: list[int]) -> int:
    res = 0
    for num in nums:
        res ^= num  # Duplicates cancel out: x ^ x = 0, 0 ^ unique = unique
    return res

def count_bits(n: int) -> list[int]:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        # dp[i >> 1] is the bit count of i // 2
        # (i & 1) adds 1 if the lowest bit is 1 (odd number)
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,
    },
    explanation: `Trace for count_bits(5):
- dp[0] = 0 (0000)
- dp[1] = dp[0] + 1 = 1 (0001)
- dp[2] = dp[1] + 0 = 1 (0010)
- dp[3] = dp[1] + 1 = 2 (0011)
- dp[4] = dp[2] + 0 = 1 (0100)
- dp[5] = dp[2] + 1 = 2 (0101)
Result: [0, 1, 1, 2, 1, 2].
Time: O(N) linear time, Space: O(N) for output array.`,
  },
  complexity: {
    time: 'O(1) to O(N)',
    timeDetail: 'Bitwise operations execute in 1 CPU cycle. Traversing an array takes O(N) time with strictly O(1) bit math per element.',
    space: 'O(1)',
    spaceDetail: 'Bit manipulation modifies integer variables in-place without auxiliary data structures.',
  },
  commonMistakes: `1. **The Python / C++ Operator Precedence Trap**:
   Bitwise operators (\`&\`, \`|\`, \`^\`) have **lower operator precedence** than comparison operators (\`==\`, \`!=\`, \`<\`, \`>\`). Writing \`if n & 1 == 0:\` is evaluated by the compiler as \`if n & (1 == 0):\` which becomes \`n & False = 0\`! **Always wrap bit operations in parentheses: \`if (n & 1) == 0:\`**.

2. **Python Infinite Loop on Negative Numbers in Full Adder**:
   In Python, integers do not overflow at 32 bits. When simulating \`sum_of_two_integers\`, negative carries expand infinitely. You must mask with \`0xFFFFFFFF\` and convert back to signed integer with \`~(a ^ 0xFFFFFFFF)\` if \`a > 0x7FFFFFFF\`.

3. **Incomplete Power of Two Check**:
   Writing \`n & (n - 1) == 0\` returns \`True\` when \`n = 0\` (since \`0 & -1 == 0\`) even though 0 is not a power of 2. Always include the positive check: \`n > 0 and (n & (n - 1)) == 0\`.`,
  gotchas: [
    'Always use parentheses around bitwise expressions: `(n >> i) & 1 == 1`.',
    'Brian Kernighan: `n &= (n - 1)` removes the lowest set bit in O(1) time.',
    'Isolate lowest set bit: `n & (-n)` yields the rightmost set bit.',
    'XOR swap trick: `a ^= b; b ^= a; a ^= b` swaps two numbers without a temporary variable.',
  ],
  problems: [
    { id: 'single-number', title: 'Single Number', slug: 'single-number', difficulty: 'easy' },
    { id: 'number-of-1-bits', title: 'Number of 1 Bits', slug: 'number-of-1-bits', difficulty: 'easy' },
    { id: 'counting-bits', title: 'Counting Bits', slug: 'counting-bits', difficulty: 'easy' },
    { id: 'reverse-bits', title: 'Reverse Bits', slug: 'reverse-bits', difficulty: 'easy' },
    { id: 'missing-number', title: 'Missing Number', slug: 'missing-number', difficulty: 'easy' },
    { id: 'sum-of-two-integers', title: 'Sum of Two Integers', slug: 'sum-of-two-integers', difficulty: 'medium' },
    { id: 'subsets', title: 'Subsets', slug: 'subsets', difficulty: 'medium' },
    { id: 'maximum-product-of-word-lengths', title: 'Maximum Product of Word Lengths', slug: 'maximum-product-of-word-lengths', difficulty: 'medium' },
    { id: 'reverse-integer', title: 'Reverse Integer', slug: 'reverse-integer', difficulty: 'medium' },
  ],
}
