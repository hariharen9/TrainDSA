import type { TopicContent } from '../types'

export const binarySearchTopic: TopicContent = {
  id: 'binary-search',
  title: 'Binary Search',
  order_index: 5,
  visualizer_id: null,
  summary: 'Halve monotonic search spaces in logarithmic time, over indices or answer ranges.',
  eliExplain: {
    hook: 'Binary Search lets you find a value in a sorted list in O(log n) time by always looking at the middle element and throwing away the half that can\'t contain the answer. Every step cuts the remaining work in half.',
    analogy: 'Think of a dictionary. You don\'t start at page 1 to find "zebra". You open to the middle, see "monkey", and since "zebra" comes after, you throw away the first half. Then you open the middle of the remaining half, and so on. In 30 steps you can search a billion pages.',
    keyIdeas: [
      'Only works on a sorted (or monotonic) search space — this is the required precondition.',
      'Three variables: left, right, mid = (left + right) // 2. Move left or right based on comparison.',
      'If arr[mid] == target → found. If arr[mid] < target → search right half (left = mid + 1). If arr[mid] > target → search left half (right = mid - 1).',
      'Off-by-one errors are the #1 bug — be precise about whether your bounds are inclusive (<=) or exclusive (<).',
      'Advanced use: binary search on the answer itself — ask "can I do it with X?" and binary search on X.',
    ],
    oneliner: '"Search in sorted array" or "find the minimum valid X" = binary search. Look at the middle, eliminate half.',
  },
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
    { id: 'time-based-key-value-store', title: 'Time Based Key-Value Store', slug: 'time-based-key-value-store', difficulty: 'medium' },
    { id: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'hard' },
  ],
}