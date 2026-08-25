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
  patternRecognition: `- **Matching / Nested pairs**: Valid parentheses, HTML tag matching, flattening nested iterators.
- **Monotonic Next Greater / Smaller**: Daily temperatures, largest rectangle in histogram, online stock span.
- **Evaluation / Parsing**: Reverse Polish Notation (postfix expressions), basic calculator.`,
  complexity: {
    time: 'O(n)',
    timeDetail: 'Each element is pushed once and popped at most once.',
    space: 'O(n)',
    spaceDetail: 'Stack stores up to n elements in the worst case (e.g. all openers or strictly decreasing array).',
  },
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
    { id: 'car-fleet', title: 'Car Fleet', slug: 'car-fleet', difficulty: 'medium' },
  ],
}
