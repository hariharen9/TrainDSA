import type { TopicContent } from '../types'

export const arraysHashingTopic: TopicContent = {
  id: 'arrays-hashing',
  title: 'Arrays & Hashing',
  order_index: 1,
  visualizer_id: 'two-sum-hashmap',
  summary: 'Trade O(n) memory to turn expensive linear scans into instant O(1) lookups.',
  intuition: `A hash map is a trade: you spend O(n) memory so that "have I seen this before?" becomes an O(1) lookup instead of an O(n) rescan. That trade is the single biggest lever in this whole topic — almost every "arrays & hashing" problem is really the question "what should I remember about elements I've already passed, so I don't have to look at them again?"

Think of it like taking notes while reading a book once, instead of flipping back to earlier pages every time a new detail matters. The map is your notes. What you write down — the *key* — is the real design decision: sometimes it's the value itself (membership), sometimes a count (frequency), sometimes a derived signature (sorted letters, for anagrams), sometimes a complement (\`target - current\`, for pair-sum problems).`,
  patternRecognition: `You're in hash-map territory when a brute-force solution would need a **nested loop to compare every pair or re-scan for a match** — two \`for\` loops, or one loop with a hidden linear search inside it (\`.includes()\`, \`in\` on a list, another loop). The tell is the phrase "have I seen this" or "does this exist elsewhere in the array," because both are exactly what a hash map answers in O(1).

Match the shape of the question to the shape of the map:

- **Membership only** ("contains duplicate?") → a hash **set**. You only care yes/no.
- **Membership + position** ("Two Sum" — which *indices*?) → a hash **map** of value → index.
- **Counting** ("valid anagram," "top k frequent") → a hash map of value → frequency.
- **Grouping by a derived key** ("group anagrams") → a hash map of signature → list of originals. The signature is usually the sorted string or a per-letter count tuple.
- **Range queries without rescanning** ("subarray sum equals k") → a *running* hash map of prefix-sum → how many times that prefix has occurred.`,
  workedExample: {
    title: 'Two Sum',
    problem: `Given \`nums = [2, 7, 11, 15]\` and \`target = 9\`, return the indices of the two numbers that add up to the target. The brute-force pair scan is O(n²): for every \`i\`, scan the rest of the array for a partner.

The hash-map reframing: instead of asking "does some other element pair with \`nums[i]\`?", flip the question to "have I already seen the number that would pair with \`nums[i]\`?" That number is \`target - nums[i]\`, the **complement**. If you've kept a running map of every value you've already visited (value → its index), checking "have I seen the complement" is one O(1) lookup — no inner loop at all.`,
    code: {
      language: 'python',
      snippet: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []  # no valid pair`,
    },
    explanation: `Trace it: at \`i=0\`, \`num=2\`, complement is \`7\`. The map is still empty, so no match — remember \`{2: 0}\`. At \`i=1\`, \`num=7\`, complement is \`2\`. The map already has \`2 → 0\` from the previous step, so we return \`[0, 1]\` immediately. Notice we never looked back at the array itself — the map *is* our memory of it, and we only ever move forward through \`nums\` once.`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'One pass, one lookup and one insert per element, both O(1) expected for a hash map.',
    space: 'O(n)',
    spaceDetail: 'Extra space for storing elements and indices in the map.',
  },
  commonMistakes: `The most common one is checking whether \`nums[i]\` *itself* equals a value you've already stored, instead of checking its *complement* — that solves a different problem. A second: inserting into the map *before* checking for the complement, which lets an element pair with itself (wrong unless the problem explicitly allows reusing an index). A third, specific to counting/frequency variants: using a plain \`set\` when the problem needs multiplicities — a set silently collapses \`[1, 1, 2]\` down to losing the fact that \`1\` appeared twice.`,
  gotchas: [
    'Hash collisions do not change big-O in expectation, but adversarial input can degrade naive maps; interviewers still accept HashMap.',
    'Duplicate keys: `set` loses counts; use a frequency map when multiplicity matters.',
    '`Product of Array Except Self` forbids division; prefix/suffix products are the intended trick.',
    'Consecutive sequence: only start a streak from a number whose predecessor is missing, or you pay O(n²).',
    'Index vs value: Two Sum needs the index, Contains Duplicate only needs membership.',
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
