import type { TopicContent } from '../types'

export const advancedGraphsTopic: TopicContent = {
  id: 'advanced-graphs',
  title: 'Advanced Graphs',
  order_index: 12,
  visualizer_id: null,
  summary: 'Weighted shortest paths (Dijkstra, Bellman-Ford), MST algorithms, and Eulerian paths.',
  intuition: `Weighted graphs need shortest-path and MST algorithms. Dijkstra grows the closest unvisited node using a min-heap of (distance, node). It requires non-negative weights. Bellman-Ford relaxes all edges V-1 times and can detect negative cycles. Floyd-Warshall is all-pairs on small n.

K-stop cheapest flights is a constrained shortest path: Dijkstra with stops, or Bellman-Ford limited to K+1 relaxations. Swim in Rising Water is "minimum max-edge" on a grid: binary search plus BFS, or a heap like Dijkstra on height.

MST (Prim/Kruskal) is less common but reconstruct-itinerary is an Eulerian path (Hierholzer) on a directed multigraph of airports.`,
  patternRecognition: `- **Non-negative Weighted Shortest Path**: Dijkstra's algorithm with priority queue (Network Delay Time).
- **Constrained / Negative Weights**: Bellman-Ford (Cheapest flights with K stops).
- **Minimax / Bottleneck Path**: Dijkstra-like priority queue or Binary Search + BFS (Swim in Rising Water).
- **Eulerian Circuit / Path**: Hierholzer's algorithm with min-heaps (Reconstruct Itinerary).`,
  complexity: {
    time: 'O(E log V)',
    timeDetail: 'Dijkstra with a binary heap processes each edge and vertex in O(E log V) time.',
    space: 'O(V + E)',
    spaceDetail: 'Graph adjacency list and priority queue storage.',
  },
  gotchas: [
    'Dijkstra is invalid on negative weights; state this immediately if negative edge weights are possible.',
    'Cheapest Flights: standard Dijkstra without tracking stop counts can drop a valid path with fewer hops; track `(cost, node, stops)` in state.',
    'Always skip stale heap entries when a strictly better distance was already recorded.',
    'Reconstruct Itinerary: use a min-heap / sorted multiset of destinations; Hierholzer appends airports in post-order on the way back.',
    'Grid "effort" problems often minimize the maximum edge weight across a path, not the cumulative sum.',
  ],
  problems: [
    { id: 'network-delay-time', title: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'medium' },
    { id: 'cheapest-flights-within-k-stops', title: 'Cheapest Flights Within K Stops', slug: 'cheapest-flights-within-k-stops', difficulty: 'medium' },
    { id: 'swim-in-rising-water', title: 'Swim in Rising Water', slug: 'swim-in-rising-water', difficulty: 'hard' },
    { id: 'reconstruct-itinerary', title: 'Reconstruct Itinerary', slug: 'reconstruct-itinerary', difficulty: 'hard' },
  ],
}
