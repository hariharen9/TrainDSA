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

#### Handling Hash Collisions
When two different keys produce the exact same bucket index (e.g. \`"cat"\` and \`"act"\` both land in Bucket 0):
- **Separate Chaining (Standard)**: Each bucket holds a linked list (or small balanced tree). If a collision occurs, the new item is chained to that bucket's list.
- **Load Factor (\`α = items / buckets\`)**: When the table gets too full (typically \`α > 0.75\`), the hash table automatically doubles its bucket array and rehashes all items, keeping average bucket length \`≈ 1\` and lookups at **\`O(1)\`**.

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
- **Top Problems**: *Contains Duplicate*, *Longest Consecutive Sequence*.

#### Pattern 2: Hash Map for Target Complements (Look Backward, Don't Look Forward)
- **Giveaway**: *"Find two numbers that add up to target"*, *"Pair with difference K"*.
- **Strategy**: Instead of a nested loop scanning forward for a partner, calculate \`complement = target - num\` and check if that complement was already stored in your map.
- **Top Problems**: *Two Sum*, *4Sum II*.

#### Pattern 3: Frequency Map & Bucket Sort (Linear \`O(n)\` Sorting)
- **Giveaway**: *"Find the top K most frequent elements"*, *"Sort characters by frequency"*.
- **Strategy**: Count frequencies with a Hash Map (\`O(n)\`). Instead of an \`O(n log n)\` sort, create an array of buckets where \`index = frequency\` (\`O(n)\` Bucket Sort)!
- **Top Problems**: *Top K Frequent Elements*, *Sort Characters By Frequency*.

#### Pattern 4: Canonical Signature / Derived Key Grouping
- **Giveaway**: *"Group anagrams together"*, *"Group words by pattern"*.
- **Strategy**: Transform each element into a standardized immutable key (e.g. sorted string \`"".join(sorted(s))\` or a 26-count tuple \`tuple(count)\`), and use that signature as the dictionary key mapping to a list of original elements.
- **Top Problems**: *Group Anagrams*.

#### Pattern 5: Prefix Accumulation & Running Products
- **Giveaway**: *"Product of array except self without division"*, *"Continuous subarray sum"*.
- **Strategy**: Precompute prefix sweeps (left-to-right) and suffix sweeps (right-to-left) to compute cumulative window products in \`O(n)\` time and \`O(1)\` extra space.
- **Top Problems**: *Product of Array Except Self*, *Subarray Sum Equals K*.`,
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
3. Return [0, 1] immediately. Time: O(n), Space: O(n).`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Single linear pass through the array with O(1) average hash lookup/insert operations.',
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
   In *Top K Frequent Elements*, sorting the dictionary by frequency takes \`O(n log n)\` time. Using an array of size \`N + 1\` where \`bucket[freq] = [elements]\` solves the problem in pure \`O(n)\` time without a heap or sort.`,
  gotchas: [
    'Hash collisions: When two different keys produce the same bucket index, hash tables handle this via chaining (linked lists) or open addressing without breaking correctness.',
    'Duplicate keys: Hash Sets automatically discard duplicate values; use a frequency Map (or Python collections.Counter) when multiplicity matters.',
    'Array index trick: When elements are integers bounded within [1, n], you can use the input array itself as a hash table by negating values at index `abs(num) - 1`.',
    'Product of Array Except Self forbids division: Solve with prefix and suffix product sweeps in O(n) time and O(1) extra space.',
    'Consecutive sequence: Only start counting a streak from `num` if `num - 1` is not in the set, ensuring each element is visited at most twice for O(n) total time.',
  ],
  problems: [
    { id: 'two-sum', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy' },
    { id: 'valid-anagram', title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'easy' },
    { id: 'contains-duplicate', title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'easy' },
    { id: 'group-anagrams', title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'medium' },
    { id: 'top-k-frequent-elements', title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'medium' },
    { id: 'product-of-array-except-self', title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'medium' },
    { id: 'longest-consecutive-sequence', title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'medium' },
  ],
}
