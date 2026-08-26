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
  ],
}