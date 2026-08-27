import type { TopicContent } from '../types'

export const linkedListsTopic: TopicContent = {
  id: 'linked-lists',
  title: 'Linked Lists',
  order_index: 6,
  visualizer_id: null,
  summary: 'Master pointer manipulation, dummy sentinel nodes, in-place reversals, and fast/slow pointer cycle detection.',
  intuition: `### 1. The Core Mental Model: Pointer Rewiring

Unlike arrays where elements sit contiguously in RAM, a **Linked List** consists of individual nodes scattered across memory, connected solely by \`next\` (and optionally \`prev\`) references.

- **No Indexing (\`O(n)\`)**: You cannot jump to \`node[5]\`. You must walk node-by-node from the \`head\`.
- **Instant Splice & Insert (\`O(1)\`)**: Once you have a reference to a node, inserting or deleting adjacent nodes takes **\`O(1)\` time** without shifting any other elements.

The secret to mastering linked list interview problems is treating every problem as a **pointer dance**: always preserve references before mutating them, and use sentinel nodes to avoid messy edge cases.

---

### 2. The Three Essential Pointer Techniques

#### A. The Dummy / Sentinel Node Pattern
Edge cases in linked lists almost always happen at the **head** (e.g. deleting the head, inserting before the head, or creating a new merged list).

By creating a \`dummy = ListNode(0, head)\` and operating through \`dummy.next\`, the head is treated like any middle node. At the end, simply \`return dummy.next\`.

#### B. The 3-Pointer In-Place Reversal Walk
To reverse a linked list in \`O(1)\` extra space, you need three pointers: \`prev\`, \`curr\`, and a temporary \`next_node\`:
1. Save the next node: \`next_node = curr.next\`
2. Reverse the pointer: \`curr.next = prev\`
3. Advance \`prev\` to \`curr\`: \`prev = curr\`
4. Advance \`curr\` to \`next_node\`: \`curr = next_node\`

#### C. Fast & Slow Pointers (Floyd's Tortoise & Hare)
- **Finding the Midpoint**: \`slow\` moves 1 step, \`fast\` moves 2 steps. When \`fast\` reaches the end, \`slow\` is at the exact middle.
- **Cycle Detection**: If a cycle exists, \`fast\` will eventually lap \`slow\` and they will meet inside the loop.
- **Finding Cycle Entrance**: After \`slow\` and \`fast\` meet, reset \`slow\` to \`head\` and advance both 1 step at a time. The point where they collide again is the exact start of the cycle.

---

### 3. Comparison: Arrays vs. Linked Lists

| Property | Array / Dynamic Array | Singly Linked List | Doubly Linked List |
| :--- | :--- | :--- | :--- |
| **Random Access by Index** | \`O(1)\` | \`O(n)\` | \`O(n)\` |
| **Insert / Delete at Head** | \`O(n)\` (shifts all) | \`O(1)\` | \`O(1)\` |
| **Insert / Delete at Known Node** | \`O(n)\` | \`O(1)\` (needs prev) | \`O(1)\` (has prev & next) |
| **Memory Overhead** | Low (values only) | Medium (value + 1 pointer) | High (value + 2 pointers) |
| **Cache Locality** | Excellent | Poor (pointer chasing) | Poor |`,
  patternRecognition: `### The 5 Essential Interview Patterns

#### Pattern 1: In-Place Reversal (3-Pointer Walk)
- **Giveaway**: *"Reverse a linked list"*, *"Reverse nodes in k-group"*, *"Reverse between position M and N"*.
- **Strategy**: Maintain \`prev = None\`, \`curr = head\`. Save \`curr.next\`, redirect pointer to \`prev\`, step both forward.
- **Top Problems**: *Reverse Linked List*, *Reverse Linked List II*, *Reverse Nodes in k-Group*.
- **Likely follow-up**: *"Can you reverse in k-sized chunks in O(1) space?"* — count $k$ nodes ahead first; if fewer than $k$ remain, leave them as-is, else reverse and connect to the next segment.

#### Pattern 2: Fast & Slow Pointers (Cycle & Midpoint)
- **Giveaway**: *"Find if list has a cycle"*, *"Find the middle node"*, *"Check if list is a palindrome"*.
- **Strategy**: \`slow = head\`, \`fast = head\`. In each iteration: \`slow = slow.next\`, \`fast = fast.next.next\`.
- **Top Problems**: *Linked List Cycle*, *Linked List Cycle II*, *Middle of the Linked List*.
- **Likely follow-up**: *"Prove why slow and fast must meet if there is a cycle"* — fast gains 1 node on slow per step ($2 - 1 = 1$), so the gap between them shrinks by 1 until collision in at most $C$ steps (where $C$ is cycle length).

#### Pattern 3: Dummy Head for List Merging & Deletion
- **Giveaway**: *"Merge two sorted lists"*, *"Remove Nth node from end"*, *"Partition list"*, *"Add two numbers"*.
- **Strategy**: Initialize \`dummy = ListNode(0)\`, maintain a \`tail\` pointer, and attach nodes via \`tail.next = chosen_node\`.
- **Top Problems**: *Merge Two Sorted Lists*, *Remove Nth Node From End of List*, *Add Two Numbers*.
- **Likely follow-up**: *"What if the node to delete is the head?"* — dummy node ensures \`dummy.next\` always safely tracks the true head.

#### Pattern 4: Compound Workflow (Split ➔ Reverse ➔ Weave)
- **Giveaway**: *"Reorder list"*, *"Check if linked list is a palindrome"*.
- **Strategy**: Break into 3 sub-problems: (1) find middle with slow/fast, (2) sever and reverse the second half, (3) weave the two halves together alternating pointers.
- **Top Problems**: *Reorder List*, *Palindrome Linked List*.
- **Likely follow-up**: *"Can you do it without extra memory?"* — this 3-step pipeline achieves $O(n)$ time and strictly $O(1)$ space.

#### Pattern 5: K-Way Merge with Min-Heap
- **Giveaway**: *"Merge K sorted linked lists"*.
- **Strategy**: Push the head of each list into a Min-Heap of size $K$ \`(node.val, list_index, node)\`. Pop the smallest, attach to result, and push its \`.next\` into the heap.
- **Top Problems**: *Merge K Sorted Lists*.
- **Likely follow-up**: *"Why is Min-Heap better than pairwise merging?"* — heap is $O(N \log K)$ vs pairwise $O(N \cdot K)$, where $N$ is total nodes.`,
  workedExample: {
    title: 'Reorder List (Split + In-Place Reverse + Weave)',
    problem: `Given the head of a singly linked list \`L0 → L1 → … → Ln-1 → Ln\`, reorder it in-place to:
\`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …\`

- **Brute Force**: Copy all nodes to an array/list and re-link with two pointers → \`O(n)\` time, \`O(n)\` extra memory.
- **Optimal In-Place**: 
  1. Find middle with slow/fast pointers.
  2. Sever the list and reverse the 2nd half in-place.
  3. Merge (weave) the two halves together.
  → \`O(n)\` time, \`O(1)\` extra memory.`,
    code: {
      language: 'python',
      snippet: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorder_list(head: ListNode | None) -> None:
    if not head or not head.next:
        return

    # Step 1: Find middle using slow/fast pointers
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Sever and reverse second half
    second = slow.next
    slow.next = None  # Crucial: sever first half from second half
    prev = None
    curr = second

    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp

    # Step 3: Weave first half (head) and reversed second half (prev)
    first, second = head, prev
    while second:
        temp1, temp2 = first.next, second.next
        first.next = second
        second.next = temp1
        first, second = temp1, temp2`,
    },
    explanation: `Trace on [1 -> 2 -> 3 -> 4 -> 5]:
1. Find Mid: slow stops at node 3.
2. Sever & Reverse:
   - First half: 1 -> 2 -> 3 -> None
   - Second half reversed: 5 -> 4 -> None
3. Weave:
   - Connect 1 -> 5 -> 2
   - Connect 2 -> 4 -> 3
   - Result: 1 -> 5 -> 2 -> 4 -> 3 -> None.
Time: O(n), Space: O(1) in-place.`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Traversal, reversal, and merge passes each visit every node a constant number of times (at most 2n visits total).',
    space: 'O(1)',
    spaceDetail: 'Only a constant number of pointer variables (prev, curr, slow, fast, temp) are maintained.',
  },
  commonMistakes: `1. **Losing the \`next\` Reference Before Pointer Rewrite**:
   Writing \`curr.next = prev\` *before* caching \`next_node = curr.next\` instantly severs your access to the rest of the list, losing all remaining nodes.

2. **Forgetting to Sever the Midpoint Tail**:
   When splitting a list in two (like in Merge Sort or Reorder List), failing to execute \`slow.next = None\` leaves a cycle or an infinite traversal loop in the first half.

3. **Returning the Old Head After Reversal**:
   After reversing a list, \`curr\` becomes \`None\` and the original \`head\` is now the tail. The new head is \`prev\`. Returning \`head\` returns a single tail node pointing to \`None\`.

4. **Off-by-One in Remove Nth Node From End**:
   To delete the $N$-th node from end, your pointer must land on the **$(N+1)$-th node from the end** (the node *before* the target) so you can do \`node.next = node.next.next\`. Use a dummy node to guarantee a valid preceding node even when deleting the head.

5. **Infinite Loop in ListNode Comparisons in Heaps**:
   In Python, if two nodes have identical \`.val\` in \`heapq.heappush(heap, (node.val, node))\`, Python tries to compare \`node < node\` which raises a \`TypeError\`. Always push a tiebreaker: \`(node.val, index, node)\`.`,
  gotchas: [
    'Always handle empty lists (`head is None`) and single-node lists (`head.next is None`) as early guard clauses.',
    'Use dummy heads to eliminate special-case code when deleting or inserting at the head.',
    'Cycle entrance formula: after fast and slow meet, advance slow from head and fast from meet point at 1 step/sec; collision = entrance.',
    'Two pointers offset: advance lead pointer by n steps, then walk lead and lag together until lead hits the end.',
    'Copy List with Random Pointer: can be solved in O(1) extra space by interleaving clone nodes (A -> A\' -> B -> B\') before separating.',
  ],
  problems: [
    { id: 'reverse-linked-list', title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'easy' },
    { id: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'easy' },
    { id: 'linked-list-cycle', title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'easy' },
    { id: 'reorder-list', title: 'Reorder List', slug: 'reorder-list', difficulty: 'medium' },
    { id: 'remove-nth-node-from-end-of-list', title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'medium' },
    { id: 'copy-list-with-random-pointer', title: 'Copy List with Random Pointer', slug: 'copy-list-with-random-pointer', difficulty: 'medium' },
    { id: 'add-two-numbers', title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium' },
    { id: 'merge-k-sorted-lists', title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'hard' },
    { id: 'reverse-nodes-in-k-group', title: 'Reverse Nodes in k-Group', slug: 'reverse-nodes-in-k-group', difficulty: 'hard' },
  ],
}
