import type { TopicContent } from '../types'

export const heapPriorityQueueTopic: TopicContent = {
  id: 'heap-priority-queue',
  title: 'Heap / Priority Queue',
  order_index: 9,
  visualizer_id: null,
  summary: 'Maintain dynamic running extrema in logarithmic time with binary heaps, two-heap medians, and top-K filters.',
  intuition: `### 1. The Core Mental Model: The Constant-Time Extrema

A **Priority Queue** is an abstract data structure that allows items to be inserted dynamically while keeping the **minimum** (or **maximum**) element instantly accessible at index \`0\` in **\`O(1)\` time**.

Under the hood, it is implemented as a **Binary Heap** — a complete binary tree mapped contiguously into a regular array without any pointer nodes:

\`\`\`
Array Index: [  0,   1,   2,   3,   4,   5  ]
Tree Values: [ 10,  20,  15,  30,  40,  25  ]

               10 (index 0)
              /  \\
  (idx 1)   20    15  (idx 2)
           /  \\   /
(idx 3)  30   40 25  (idx 5)
\`\`\`

- **Parent Index**: \`parent = (i - 1) // 2\`
- **Left Child Index**: \`left = 2 * i + 1\`
- **Right Child Index**: \`right = 2 * i + 2\`

---

### 2. The $O(N)$ \`heapify\` Superpower

- Inserting $N$ items one-by-one with \`heappush\` takes \`O(N log N)\`.
- Converting an existing array into a valid heap with \`heapify()\` takes **\`O(N)\` linear time** (via sift-down from the lowest internal nodes). Always prefer \`heapq.heapify(arr)\` over repeated pushes!

---

### 3. Comparison: Heap vs. Sorted Array vs. BST

| Operation | Min-Heap (\`heapq\`) | Sorted Array | Self-Balancing BST |
| :--- | :--- | :--- | :--- |
| **Find Min / Max** | \`O(1)\` | \`O(1)\` | \`O(log N)\` or \`O(1)\` |
| **Extract Min / Max** | \`O(log N)\` | \`O(N)\` (shift) or \`O(1)\` (pop tail) | \`O(log N)\` |
| **Insert Element** | \`O(log N)\` | \`O(N)\` | \`O(log N)\` |
| **Build from Array** | \`O(N)\` | \`O(N log N)\` | \`O(N log N)\` |
| **Space Overhead** | \`O(1)\` (flat array) | \`O(1)\` | \`O(N)\` (pointers per node) |`,
  patternRecognition: `### The 3 Essential Interview Patterns

#### Pattern 1: Top-K Elements (Fixed-Size Min-Heap)
- **Giveaway**: *"Find the Kth largest element"*, *"K closest points to origin"*, *"Top K frequent words"*.
- **Strategy**: To find the **$K$ largest** elements, maintain a **Min-Heap of size $K$**. For each item: push it into the heap; if \`len(heap) > k\`, pop the smallest. The remaining $K$ items are the largest, and \`heap[0]\` is the $K$-th largest!
- **Top Problems**: *Kth Largest Element in an Array*, *K Closest Points to Origin*, *Top K Frequent Elements*.
- **Likely follow-up**: *"Why use a Min-Heap of size K instead of Max-Heap of size N?"* — size-$K$ Min-Heap requires only $O(N \log K)$ time and $O(K)$ space, which is critical when $N = 10^9$ streaming items and $K = 10$.

#### Pattern 2: Two Heaps for Dynamic Running Median
- **Giveaway**: *"Find median from continuous data stream"*, *"Sliding window median"*.
- **Strategy**: Split incoming numbers into two halves:
  - **Max-Heap (\`small\`)**: Stores the smaller half (invert numbers with \`-x\`).
  - **Min-Heap (\`large\`)**: Stores the larger half.
  - Keep sizes balanced: \`len(small)\` is either equal to or 1 greater than \`len(large)\`.
- **Top Problems**: *Find Median from Data Stream*, *Sliding Window Median*.
- **Likely follow-up**: *"What is the query time for the median?"* — strictly $O(1)$! If odd, return top of \`small\`; if even, average the two heap roots.

#### Pattern 3: K-Way Merge & Greedy Event Schedulers
- **Giveaway**: *"Merge K sorted lists"*, *"Task Scheduler with cooldown"*, *"Reorganize string with no adjacent duplicates"*.
- **Strategy**: Push the current best candidate from each source into a heap. Pop the top, execute or append it, and push the next available candidate back into the heap.
- **Top Problems**: *Merge K Sorted Lists*, *Task Scheduler*, *Reorganize String*.
- **Likely follow-up**: *"How to handle task cooldowns?"* — maintain a FIFO waiting queue \`(ready_time, count, task)\` alongside the max-heap.`,
  workedExample: {
    title: 'Find Median from Data Stream (Two Heaps)',
    problem: `Design a data structure that dynamically accepts integers from a data stream and computes the running median in O(1) time.

- **Brute Force**: Insert and sort every time → \`O(N log N)\` insert, \`O(1)\` median.
- **Optimal (Two Heaps)**: Max-Heap for lower 50%, Min-Heap for upper 50% → \`O(log N)\` insert, \`O(1)\` median.`,
    code: {
      language: 'python',
      snippet: `import heapq

class MedianFinder:
    def __init__(self):
        # max-heap for lower half (store negative numbers to simulate max-heap)
        self.small = []
        # min-heap for upper half
        self.large = []

    def addNum(self, num: int) -> None:
        # 1. By default, push to small (max-heap)
        heapq.heappush(self.small, -num)

        # 2. Invariant check: ensure all elements in small <= all elements in large
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)

        # 3. Size balance: small can have at most 1 more element than large
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0`,
    },
    explanation: `Trace with stream [5, 2, 8, 1]:
1. addNum(5): small = [-5], large = []. Median = 5.
2. addNum(2): small = [-5, -2] -> rebalanced -> small = [-2], large = [5]. Median = (2 + 5)/2 = 3.5.
3. addNum(8): small = [-5, -2], large = [8] -> small = [-5, -2], large = [8] -> rebalanced -> small = [-5, -2], large = [8]. Median = 5.
4. addNum(1): small = [-2, -1], large = [5, 8]. Median = (2 + 5)/2 = 3.5.
Time: O(log N) per insert, O(1) for median query. Space: O(N).`,
  },
  complexity: {
    time: 'O(log N)',
    timeDetail: 'Insertions and deletions perform logarithmic sift-up/sift-down operations. Finding minimum or median is O(1).',
    space: 'O(N)',
    spaceDetail: 'Linear memory storage for all elements inside the heap arrays.',
  },
  commonMistakes: `1. **Python \`heapq\` is Min-Heap Only**:
   Python does not have a native max-heap class. To simulate a max-heap, you must negate all inserted numbers (\`-val\`) and negate them back when popping (\`-heapq.heappop(h)\`).

2. **Tuple Comparison Crashes on Duplicate Priorities**:
   Pushing \`(priority, node)\` will crash with \`TypeError: '<' not supported between instances of 'ListNode'\` if two items have identical priorities. Always push a unique index tiebreaker: \`(priority, idx, node)\`.

3. **Using Max-Heap for Kth Largest**:
   For *Kth Largest*, keeping a Max-Heap requires storing all $N$ elements ($O(N)$ space and $O(N \log N)$ total time). Using a **Min-Heap of size K** keeps only $K$ elements in memory ($O(K)$ space, $O(N \log K)$ time).

4. **Modifying Elements in the Heap Array In-Place**:
   Mutating \`heap[0] = new_val\` directly corrupts the binary heap invariant. You must use \`heapq.heapreplace(heap, new_val)\` or \`heapq.heappushpop(heap, new_val)\` to preserve the heap structure in $O(\log N)$ time.`,
  gotchas: [
    'Always use `heapq.heapify(arr)` for O(N) in-place heap construction instead of N separate pushes (O(N log N)).',
    '`heapq.heappushpop(h, item)` is faster than a separate push followed by a pop because it executes in a single sift pass.',
    'For Kth largest, maintain a size-K Min-Heap (root is answer); for Kth smallest, maintain a size-K Max-Heap.',
    'Two Heaps: always check both the value boundary condition (`small[0] <= large[0]`) and the size balance condition (`len(small) == len(large) + 0 or 1`).',
  ],
  problems: [
    { id: 'kth-largest-element-in-a-stream', title: 'Kth Largest Element in a Stream', slug: 'kth-largest-element-in-a-stream', difficulty: 'easy' },
    { id: 'last-stone-weight', title: 'Last Stone Weight', slug: 'last-stone-weight', difficulty: 'easy' },
    { id: 'k-closest-points-to-origin', title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'medium' },
    { id: 'kth-largest-element-in-an-array', title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'medium' },
    { id: 'task-scheduler', title: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'medium' },
    { id: 'design-twitter', title: 'Design Twitter', slug: 'design-twitter', difficulty: 'medium' },
    { id: 'find-median-from-data-stream', title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'hard' },
  ],
}
