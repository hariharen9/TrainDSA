import type { TopicContent } from '../types'

export const bitManipulationTopic: TopicContent = {
  id: 'bit-manipulation',
  title: 'Bit Manipulation',
  order_index: 17,
  visualizer_id: null,
  summary: 'Bitwise XOR cancellation, bitmask state encoding, and low-level arithmetic operations.',
  intuition: `Bits let you pack boolean flags and cancel pairs. XOR is the star: \`a ^ a = 0\`, \`a ^ 0 = a\`, and XOR is associative, so every duplicated number vanishes in Single Number. Counting bits uses \`n & (n-1)\` to drop the lowest set bit, or DP: \`bits[i] = bits[i >> 1] + (i & 1)\`.

Masks represent subsets in O(1) (N-Queens diagonals, TSP-style DP). Arithmetic without \`+\` uses XOR for sum bits and AND+shift for carry (Sum of Two Integers). Reverse bits is shifts and masks; treat the value as unsigned 32-bit.

Prefer named operations over clever one-liners unless you can explain them in one sentence.`,
  patternRecognition: `- **Duplicate Cancellation**: Single Number (XOR all elements).
- **Clearing Lowest Set Bit**: \`n & (n - 1)\` (Number of 1 Bits, Power of Two).
- **Bitmask Subsets**: Representing dynamic programming subsets or grid occupancy in an integer mask.
- **Bitwise Addition**: \`sum = a ^ b\`, \`carry = (a & b) << 1\` (Sum of Two Integers).`,
  complexity: {
    time: 'O(1) to O(32)',
    timeDetail: 'Bitwise operations execute in 1 CPU cycle over 32-bit/64-bit integer registers.',
    space: 'O(1)',
    spaceDetail: 'Constant memory with zero heap allocation.',
  },
  gotchas: [
    'Operator precedence: `==` binds tighter than bitwise operators in JS/C++/Java; always parenthesize (e.g. `(n & 1) === 1`).',
    'JavaScript bitwise operators coerce numbers to 32-bit signed ints; use `>>> 0` to treat results as unsigned 32-bit.',
    'Number of 1 bits: treat inputs as unsigned values.',
    'Missing Number: XOR all indices with all values, or use the Gauss arithmetic series formula `n * (n + 1) / 2`.',
    'Sum of Two Integers: loop until the carry bit is zero; negative values still work naturally in two’s complement representation.',
  ],
  problems: [
    { id: 'single-number', title: 'Single Number', slug: 'single-number', difficulty: 'easy' },
    { id: 'number-of-1-bits', title: 'Number of 1 Bits', slug: 'number-of-1-bits', difficulty: 'easy' },
    { id: 'counting-bits', title: 'Counting Bits', slug: 'counting-bits', difficulty: 'easy' },
    { id: 'reverse-bits', title: 'Reverse Bits', slug: 'reverse-bits', difficulty: 'easy' },
    { id: 'missing-number', title: 'Missing Number', slug: 'missing-number', difficulty: 'easy' },
    { id: 'sum-of-two-integers', title: 'Sum of Two Integers', slug: 'sum-of-two-integers', difficulty: 'medium' },
  ],
}
