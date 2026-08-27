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