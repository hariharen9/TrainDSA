import type { TopicContent } from '../types'

export const treesTopic: TopicContent = {
  id: 'trees',
  title: 'Trees',
  order_index: 7,
  visualizer_id: null,
  summary: 'Master hierarchical recursion, DFS traversals (Pre/In/Post), BFS level-order queues, and BST boundary invariants.',
  intuition: `### 1. The Core Mental Model: Subtree Recursion

A **Binary Tree** is a recursive data structure: every node is the root of its own left and right subtrees. 

Almost every tree problem is solved by asking:
> *"If I assume my left and right children have already solved the problem for their subtrees, how do I combine their answers at the current node?"*

---

### 2. The Four Traversal Archetypes

1. **Pre-Order (Node ➔ Left ➔ Right)**: Process parent before children. Used for cloning, serialization, and top-down path accumulation.
2. **In-Order (Left ➔ Node ➔ Right)**: Traverses a **Binary Search Tree (BST) in strictly sorted ascending order**.
3. **Post-Order (Left ➔ Right ➔ Node)**: Process children first, then compute parent. **The foundation of bottom-up aggregation** (height, diameter, subtree sums, and Maximum Path Sum).
4. **Level-Order (BFS with Queue)**: Explores node-by-node, level-by-level. The natural way to measure shortest distance from root, right/left side views, and zigzag orders.

---

### 3. Comparison: DFS vs. BFS in Trees

| Dimension | Depth-First Search (DFS) | Breadth-First Search (BFS) |
| :--- | :--- | :--- |
| **Data Structure** | Call Stack (Recursion) or explicit \`stack\` | FIFO \`collections.deque\` queue |
| **Memory Consumption** | \`O(h)\` where $h$ is tree height | \`O(w)\` where $w$ is max level width |
| **Best For** | Subtree aggregation, path sums, validation | Level-by-level views, shallowest leaf, shortest path |
| **Worst-Case Space** | Skewed tree (linked list): \`O(n)\` | Perfect binary tree: \`O(n/2) = O(n)\` |`,
  patternRecognition: `### The 5 Essential Interview Patterns

#### Pattern 1: Bottom-Up Post-Order DFS (Subtree Aggregation)
- **Giveaway**: *"Find the diameter of a tree"*, *"Maximum path sum"*, *"Check if tree is height-balanced"*.
- **Strategy**: Helper function returns the depth/gain of the subtree to its parent, while updating a global/nonlocal maximum variable across the current node.
- **Top Problems**: *Maximum Depth of Binary Tree*, *Diameter of Binary Tree*, *Binary Tree Maximum Path Sum*.
- **Likely follow-up**: *"What if node values can be negative?"* — prune negative subtree gains with \`max(0, left_gain)\` so negative branches are simply ignored.

#### Pattern 2: Level-Order BFS with Queue
- **Giveaway**: *"Level order traversal"*, *"Right side view"*, *"Zigzag traversal"*, *"Minimum depth"*.
- **Strategy**: Maintain a queue. In each iteration, snapshot \`level_size = len(queue)\` and loop \`level_size\` times to process the entire current level in one batch.
- **Top Problems**: *Binary Tree Level Order Traversal*, *Binary Tree Right Side View*, *Binary Tree Zigzag Level Order Traversal*.
- **Likely follow-up**: *"How to save memory if only the rightmost node is needed?"* — take \`queue[-1]\` before draining the level.

#### Pattern 3: BST Boundary Validation (Live Invariant Window)
- **Giveaway**: *"Validate binary search tree"*, *"Kth smallest in BST"*, *"Convert sorted array to BST"*.
- **Strategy**: Pass valid range \`(low, high)\` down the call stack. For left child, range becomes \`(low, node.val)\`; for right child, \`(node.val, high)\`.
- **Top Problems**: *Validate Binary Search Tree*, *Kth Smallest Element in a BST*.
- **Likely follow-up**: *"Why does checking \`node.left.val < node.val < node.right.val\` locally fail?"* — a node deep in the left subtree could be larger than the root ancestor; bounds must be inherited globally.

#### Pattern 4: Lowest Common Ancestor (LCA)
- **Giveaway**: *"Lowest common ancestor of two nodes"*.
- **Strategy**:
  - **In a BST**: If both nodes are smaller than root, go left; if both greater, go right; if they split (or root matches one), root is the LCA!
  - **In a General Binary Tree**: Post-order DFS. If left and right subtrees both return non-null, root is LCA.
- **Top Problems**: *Lowest Common Ancestor of a BST*, *Lowest Common Ancestor of a Binary Tree*.
- **Likely follow-up**: *"What if one or both nodes are not guaranteed to exist in the tree?"* — count matches explicitly before returning.

#### Pattern 5: Tree Reconstruction from Traversal Pairs
- **Giveaway**: *"Construct binary tree from preorder and inorder traversal"*.
- **Strategy**: Preorder's first element is always the \`root\`. Look up that root in an Inorder hash map to split elements into left and right subtree sizes, then recurse.
- **Top Problems**: *Construct Binary Tree from Preorder and Inorder Traversal*.
- **Likely follow-up**: *"Can you do it in O(n) time?"* — pre-index Inorder indices in a hash map to look up root positions in $O(1)$ instead of scanning.`,
  workedExample: {
    title: 'Validate Binary Search Tree (Global Boundary Invariant)',
    problem: `Given the root of a binary tree, determine if it is a valid Binary Search Tree (BST).
A valid BST requires that **all** nodes in a left subtree are strictly less than the node, and **all** nodes in a right subtree are strictly greater than the node.

- **Naive / Buggy**: \`left.val < node.val < right.val\` only checks immediate children, failing when a left subtree contains a large value (e.g. \`[5, 4, 6, null, null, 3, 7]\` where 3 is in 6's left subtree, violating root 5).
- **Optimal (Global Invariant)**: Pass down a valid range \`(low, high)\` initialized to \`(-inf, +inf)\`.`,
    code: {
      language: 'python',
      snippet: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode | None) -> bool:
    def validate(node: TreeNode | None, low: float, high: float) -> bool:
        if not node:
            return True

        # Current node value must strictly lie between low and high
        if not (low < node.val < high):
            return False

        # Left subtree must be strictly < node.val; right subtree must be strictly > node.val
        return (validate(node.left, low, node.val) and 
                validate(node.right, node.val, high))

    return validate(root, float('-inf'), float('inf'))`,
    },
    explanation: `Trace on [5, 1, 4, null, null, 3, 6]:
1. Root 5: validate(5, -inf, +inf) -> Valid.
2. Left child 1: validate(1, -inf, 5) -> Valid.
3. Right child 4: validate(4, 5, +inf) -> FAILS! 4 is not > 5.
Returns False immediately.
Time: O(n) — visits every node once.
Space: O(h) — call stack proportional to height.`,
  },
  complexity: {
    time: 'O(n)',
    timeDetail: 'Every node is visited at most once or twice across all standard tree traversals.',
    space: 'O(h)',
    spaceDetail: 'Recursion stack requires memory proportional to tree height h: O(log n) for a balanced tree, O(n) for a completely skewed linked-list tree.',
  },
  commonMistakes: `1. **Local vs. Global Invariant in BSTs**:
   Only checking \`node.left.val < node.val < node.right.val\` allows invalid trees where a descendant violates an ancestor constraint. You must pass down \`(low, high)\` boundaries.

2. **Allowing Duplicate Values in Strict BSTs**:
   LeetCode standard BSTs require strict inequality (\`low < node.val < high\`). Writing \`<=\` allows duplicates and fails test cases.

3. **Dynamic Queue Mutation in BFS**:
   Iterating \`for _ in range(len(queue))\` is correct in Python because \`len(queue)\` evaluates once at loop start. In languages like JS or C++, calling \`queue.length\` inside the loop condition causes an infinite loop as you push children. Always snapshot the level size!

4. **Slicing Arrays in Tree Reconstruction ($O(n^2)$ Trap)**:
   In *Construct from Preorder and Inorder*, doing \`inorder[:mid]\` and \`inorder[mid+1:]\` copies arrays at every recursion level ($O(n^2)$ time). Instead, build a hash map \`{val: index}\` upfront and pass boundary index pointers \`(in_start, in_end)\` for $O(n)$ total time.

5. **Not Ignoring Negative Subtree Gains in Max Path Sum**:
   In *Binary Tree Maximum Path Sum*, if a subtree returns a negative sum, adding it to your path reduces total sum. You must wrap child gains in \`max(0, gain)\`.`,
  gotchas: [
    'Base cases: always handle `if not root:` cleanly as the first line of your recursive helper.',
    'In-order traversal of a valid BST is strictly monotonically increasing with no duplicates.',
    'LCA in BST is O(h) with no recursion overhead: if both p and q are smaller than root, go left; if both greater, go right; else root is the split point.',
    'Diameter of binary tree: the longest path does not need to pass through the root node.',
    'Serialize / Deserialize: use preorder with null markers (e.g. "X") for clean O(n) reconstruction.',
  ],
  problems: [
    { id: 'invert-binary-tree', title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'easy' },
    { id: 'maximum-depth-of-binary-tree', title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'easy' },
    { id: 'diameter-of-binary-tree', title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'easy' },
    { id: 'balanced-binary-tree', title: 'Balanced Binary Tree', slug: 'balanced-binary-tree', difficulty: 'easy' },
    { id: 'same-tree', title: 'Same Tree', slug: 'same-tree', difficulty: 'easy' },
    { id: 'subtree-of-another-tree', title: 'Subtree of Another Tree', slug: 'subtree-of-another-tree', difficulty: 'easy' },
    { id: 'lowest-common-ancestor-of-a-bst', title: 'Lowest Common Ancestor of a BST', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'medium' },
    { id: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'medium' },
    { id: 'binary-tree-right-side-view', title: 'Binary Tree Right Side View', slug: 'binary-tree-right-side-view', difficulty: 'medium' },
    { id: 'validate-binary-search-tree', title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'medium' },
    { id: 'kth-smallest-element-in-a-bst', title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'medium' },
    { id: 'construct-binary-tree-from-preorder-and-inorder', title: 'Construct Binary Tree from Preorder and Inorder', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'medium' },
    { id: 'binary-tree-maximum-path-sum', title: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-maximum-path-sum', difficulty: 'hard' },
    { id: 'serialize-and-deserialize-binary-tree', title: 'Serialize and Deserialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', difficulty: 'hard' },
  ],
}
