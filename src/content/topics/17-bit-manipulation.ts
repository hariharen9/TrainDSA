import type { TopicContent } from '../types'

export const bitManipulationTopic: TopicContent = {
  id: 'bit-manipulation',
  title: 'Bit Manipulation',
  order_index: 17,
  visualizer_id: 'bit-manipulation',
  summary: 'Harness binary arithmetic, XOR cancellation, Brian Kernighan\'s bit-clearing trick, and bitmask state compression.',
  eliExplain: {
    hook: 'Bit Manipulation allows you to do lightning-fast math directly on the 0s and 1s inside a computer\'s processor. It lets you store flags, count set bits, or cancel out duplicates in pure O(1) time and space.',
    analogy: 'Think of a row of 32 light switches on a wall. Instead of creating 32 separate boolean variables in memory, a single integer holds all 32 light switch states (0 = off, 1 = on). Bitwise operators let you flip, check, or reset specific switches in a single CPU instruction.',
    keyIdeas: [
      'XOR (`^`) Magic: `x ^ x = 0` and `x ^ 0 = x`. XORing all numbers in an array where every element appears twice except one instantly isolates the unique single number.',
      'Brian Kernighan\'s Trick: `n & (n - 1)` clears the lowest set bit (rightmost 1) of `n`. Repeat this in a loop to count the number of 1-bits in O(set bits) time.',
      'Check Power of Two: If `n > 0 and (n & (n - 1)) == 0`, `n` is a power of 2 (has exactly one 1-bit).',
      'Bitmasking: Set the i-th bit with `n | (1 << i)`, clear it with `n & ~(1 << i)`, and check it with `(n >> i) & 1`.',
      'Bit Shifting: `n << 1` multiplies by 2; `n >> 1` divides by 2 (integer division).',
    ],
    oneliner: 'Duplicate cancellation = XOR (`^`). Count set bits / power of 2 = `n & (n - 1)`.',
  },
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
    { id: 'missing-number', title: 'Missing Number', slug: 'missing-number', difficulty: 'easy' },
    { id: 'sum-of-two-integers', title: 'Sum of Two Integers', slug: 'sum-of-two-integers', difficulty: 'medium' },
  ],
}
