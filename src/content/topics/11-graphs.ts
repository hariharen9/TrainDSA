import type { TopicContent } from '../types'

export const graphsTopic: TopicContent = {
  id: 'graphs',
  title: 'Graphs',
  order_index: 11,
  visualizer_id: null,
  summary: 'Node connectivity, traversal (DFS/BFS), topological sorting, and Disjoint Set Union (DSU).',
  intuition: `Graphs are nodes plus edges. Interviews almost always want an adjacency list. DFS and BFS explore connected components; Union-Find (DSU) answers "are these in the same component?" and counts components after unions.

Grid problems are implicit graphs: each cell has up to four neighbors. Number of Islands and Max Area of Island are DFS/BFS floods. Course Schedule is cycle detection on a directed graph (Kahn’s algorithm or color DFS). Clone Graph is a hashmap of old-to-new nodes plus DFS/BFS.

Directed vs undirected changes the cycle definition: a back-edge to an ancestor in directed graphs; any already-seen neighbor except the parent in undirected graphs.`,
  patternRecognition: `- **Grid Traversal / Flood Fill**: Number of islands, max area of island, Pacific Atlantic water flow.
- **Cycle Detection & Topological Sort**: Course schedule, Kahn's algorithm (indegree queue).
- **Connected Components / Dynamic Connectivity**: Number of connected components, Graph Valid Tree, Union-Find.
- **Shortest Path on Unweighted Graph**: BFS (Word Ladder).`,
  complexity: {
    time: 'O(V + E)',
    timeDetail: 'Standard BFS/DFS visits all vertices V and explores each edge E once.',
    space: 'O(V + E)',
    spaceDetail: 'Adjacency list storage plus visited set/queue memory.',
  },
  gotchas: [
    'Directed cycles: a node can be visited and still be legal if it is already finished (black); in-flight gray state indicates a true cycle back-edge.',
    'Union-Find needs path compression and union-by-rank for near O(1) amortized inverse Ackermann α(N) complexity.',
    'Graph Valid Tree: exactly n - 1 edges and exactly one connected component with no cycles.',
    'Word Ladder: BFS on implicit words; wildcard intermediate buckets beat scanning the whole dictionary each step.',
    'Clone Graph: do not recurse on neighbors without checking the visited map, or you will infinite-loop on cycles.',
  ],
  problems: [
    { id: 'number-of-islands', title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'medium' },
    { id: 'clone-graph', title: 'Clone Graph', slug: 'clone-graph', difficulty: 'medium' },
    { id: 'max-area-of-island', title: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'medium' },
    { id: 'pacific-atlantic-water-flow', title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'medium' },
    { id: 'course-schedule', title: 'Course Schedule', slug: 'course-schedule', difficulty: 'medium' },
    { id: 'number-of-connected-components-in-an-undirected-graph', title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'medium' },
    { id: 'graph-valid-tree', title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'medium' },
    { id: 'word-ladder', title: 'Word Ladder', slug: 'word-ladder', difficulty: 'hard' },
  ],
}
