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