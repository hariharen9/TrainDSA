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