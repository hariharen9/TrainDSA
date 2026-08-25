import type { TopicContent } from '../types'

export const treesTopic: TopicContent = {
  id: 'trees',
  title: 'Trees',
  order_index: 7,
  visualizer_id: null,
  summary: 'Hierarchical node traversal, recursive invariants, and BST properties.',
  intuition: `Binary trees are recursive structures: a node plus left and right subtrees. DFS visits pre-order (node, left, right), in-order (left, node, right — sorted for a BST), or post-order (left, right, node). BFS uses a queue for level-order traversal and is the natural way to talk about depth by level.

BST invariants let you prune: left < node < right (beware of duplicate policies). Lowest common ancestor, validation, and kth-smallest all exploit that order. Construction problems invert a traversal pair: preorder gives the root, inorder splits left/right ranges.

Prefer recursion for clarity, then mention stack depth. Interviewers accept iterative DFS with an explicit stack when n is large.`,
  patternRecognition: `- **DFS (Pre / In / Post order)**: Bottom-up subtree calculations (max depth, tree diameter, subtree validation).
- **BFS (Level Order)**: Breadth exploration level-by-level using a queue.
- **BST Invariants**: Binary Search Tree search in O(height), in-order traversal yields sorted order.
- **LCA (Lowest Common Ancestor)**: Path intersection or bubble-up post-order check.`,
  complexity: {
    time: 'O(n)',
    timeDetail: 'Every node is visited once during tree traversals.',
    space: 'O(h)',
    spaceDetail: 'Recursion stack requires memory proportional to height h — O(log n) balanced, O(n) worst-case skewed.',
  },
  gotchas: [
    'Recursion depth can hit call-stack limits on skewed trees; mention O(n) worst-case height.',
    'Validate BST: passing only a parent value is wrong; pass a live (min, max) boundary window down the call stack.',
    'Same Tree / Subtree: null vs null is true; null vs node is false.',
    'LCA of BST uses value comparison; LCA of a binary tree needs a post-order bubble-up.',
    'Construct from preorder/inorder: index the inorder values in a hash map or you pay O(n²).',
  ],
  problems: [
    { id: 'invert-binary-tree', title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'easy' },
    { id: 'maximum-depth-of-binary-tree', title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'easy' },
    { id: 'same-tree', title: 'Same Tree', slug: 'same-tree', difficulty: 'easy' },
    { id: 'subtree-of-another-tree', title: 'Subtree of Another Tree', slug: 'subtree-of-another-tree', difficulty: 'easy' },
    { id: 'lowest-common-ancestor-of-a-bst', title: 'Lowest Common Ancestor of a BST', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'medium' },
    { id: 'binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'medium' },
    { id: 'validate-binary-search-tree', title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'medium' },
    { id: 'kth-smallest-element-in-a-bst', title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'medium' },
    { id: 'construct-binary-tree-from-preorder-and-inorder', title: 'Construct Binary Tree from Preorder and Inorder', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'medium' },
  ],
}
